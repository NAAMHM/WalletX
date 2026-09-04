const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { sendMoney } = require('../services/transactionService');

/**
 * @route   POST /api/qr/generate
 * @desc    Generate QR code data for receiving payments
 * @access  Private
 */
const generateQRCode = async (req, res) => {
  try {
    const { amount, currency, note } = req.body;

    // Get user and wallet
    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Generate QR data (contains safe information only)
    const qrData = {
      walletId: wallet.walletId,
      userId: user._id.toString(),
      receiverName: user.fullName,
      amount: amount || null,
      currency: currency || user.preferredCurrency,
      note: note || '',
      timestamp: Date.now(),
      type: 'WALLETX_PAYMENT'
    };

    // Convert to base64 string for QR generation on frontend
    const qrString = Buffer.from(JSON.stringify(qrData)).toString('base64');

    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qrData: qrString,
        qrInfo: {
          walletId: wallet.walletId,
          receiverName: user.fullName,
          amount: amount || 'Any amount',
          currency: currency || user.preferredCurrency
        }
      }
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    });
  }
};

/**
 * @route   POST /api/qr/scan
 * @desc    Decode scanned QR code
 * @access  Private
 */
const scanQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    // Decode QR data
    let decodedData;
    try {
      const jsonString = Buffer.from(qrData, 'base64').toString('utf-8');
      decodedData = JSON.parse(jsonString);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    // Validate QR data
    if (!decodedData.walletId || !decodedData.userId || decodedData.type !== 'WALLETX_PAYMENT') {
      return res.status(400).json({
        success: false,
        message: 'Invalid WalletX QR code'
      });
    }

    // Check if QR is not too old (24 hours)
    const qrAge = Date.now() - decodedData.timestamp;
    if (qrAge > 24 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: 'QR code has expired. Please request a new one.'
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(decodedData.userId);
    const receiverWallet = await Wallet.findOne({ walletId: decodedData.walletId });

    if (!receiver || !receiverWallet) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    if (receiver.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Receiver account is blocked'
      });
    }

    // Check if trying to pay self
    if (receiver._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot pay yourself'
      });
    }

    res.json({
      success: true,
      message: 'QR code scanned successfully',
      data: {
        receiverName: receiver.fullName,
        walletId: receiverWallet.walletId,
        amount: decodedData.amount,
        currency: decodedData.currency,
        note: decodedData.note,
        receiverIdentifier: receiver.email
      }
    });
  } catch (error) {
    console.error('Scan QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to scan QR code'
    });
  }
};

/**
 * @route   POST /api/qr/pay
 * @desc    Make payment via QR code
 * @access  Private
 */
const payViaQR = async (req, res) => {
  try {
    const { qrData, amount, currency, note } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount greater than 0'
      });
    }

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: 'Currency is required'
      });
    }

    // Decode QR data
    let decodedData;
    try {
      const jsonString = Buffer.from(qrData, 'base64').toString('utf-8');
      decodedData = JSON.parse(jsonString);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    // Validate QR data
    if (!decodedData.walletId || !decodedData.userId || decodedData.type !== 'WALLETX_PAYMENT') {
      return res.status(400).json({
        success: false,
        message: 'Invalid WalletX QR code'
      });
    }

    // Check if QR is not too old (24 hours)
    const qrAge = Date.now() - decodedData.timestamp;
    if (qrAge > 24 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: 'QR code has expired. Please request a new one.'
      });
    }

    // If QR has fixed amount, validate it matches
    if (decodedData.amount && parseFloat(decodedData.amount) !== parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: `This QR code requires payment of ${decodedData.amount} ${decodedData.currency}`
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(decodedData.userId);
    const receiverWallet = await Wallet.findOne({ walletId: decodedData.walletId });

    if (!receiver || !receiverWallet) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    if (receiver.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Receiver account is blocked'
      });
    }

    // Check if trying to pay self
    if (receiver._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot pay yourself'
      });
    }

    // Send money
    const result = await sendMoney(
      req.user.id,
      receiver.email,
      amount,
      currency,
      note || decodedData.note || 'QR Payment'
    );

    res.json({
      success: true,
      message: 'Payment successful',
      data: {
        transactionId: result.transactionId,
        amount,
        currency,
        receiver: {
          name: receiver.fullName,
          walletId: receiverWallet.walletId
        },
        senderNewBalance: result.sender.newBalance
      }
    });
  } catch (error) {
    console.error('QR payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment failed'
    });
  }
};

module.exports = {
  generateQRCode,
  scanQRCode,
  payViaQR
};
