const { sendMoney } = require('../services/transactionService');
const MoneyRequest = require('../models/MoneyRequest');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const generateTransactionId = require('../utils/generateTransactionId');

/**
 * @route   POST /api/transfers/send
 * @desc    Send money to another user
 * @access  Private
 */
const sendMoneyController = async (req, res) => {
  try {
    const { receiverIdentifier, amount, currency, note } = req.body;

    // Validate input
    if (!receiverIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Receiver identifier (email, mobile, or wallet ID) is required'
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

    // Send money
    const result = await sendMoney(
      req.user.id,
      receiverIdentifier,
      amount,
      currency,
      note
    );

    res.json({
      success: true,
      message: 'Money sent successfully',
      data: {
        transactionId: result.transactionId,
        amount,
        currency,
        receiver: result.receiver,
        senderNewBalance: result.sender.newBalance
      }
    });
  } catch (error) {
    console.error('Send money error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send money'
    });
  }
};

/**
 * @route   POST /api/transfers/request
 * @desc    Request money from another user
 * @access  Private
 */
const requestMoney = async (req, res) => {
  try {
    const { receiverIdentifier, amount, currency, note } = req.body;

    // Validate input
    if (!receiverIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Receiver identifier (email, mobile, or wallet ID) is required'
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

    // Find sender (requester)
    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find receiver by email, mobile, or wallet ID
    let receiver = null;
    let receiverWallet = null;

    // Try to find by wallet ID first
    receiverWallet = await Wallet.findOne({ 
      walletId: receiverIdentifier.toUpperCase() 
    });

    if (receiverWallet) {
      receiver = await User.findById(receiverWallet.userId);
    } else {
      // Try to find by email or mobile
      receiver = await User.findOne({
        $or: [
          { email: receiverIdentifier.toLowerCase() },
          { mobile: receiverIdentifier }
        ]
      });
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-request
    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request money from yourself'
      });
    }

    // Generate request ID
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create money request
    const moneyRequest = await MoneyRequest.create({
      requestId,
      senderId: sender._id,
      receiverId: receiver._id,
      amount,
      currency,
      note: note || '',
      status: 'PENDING'
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiver._id,
      title: 'Money Request',
      message: `${sender.fullName} is requesting ${amount} ${currency}`,
      type: 'REQUEST',
      metadata: {
        requestId: moneyRequest.requestId,
        amount,
        currency,
        senderName: sender.fullName
      }
    });

    res.json({
      success: true,
      message: 'Money request sent successfully',
      data: {
        requestId: moneyRequest.requestId,
        amount,
        currency,
        receiver: {
          name: receiver.fullName
        },
        status: moneyRequest.status
      }
    });
  } catch (error) {
    console.error('Request money error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to request money'
    });
  }
};

/**
 * @route   GET /api/transfers/requests
 * @desc    Get all money requests (sent and received)
 * @access  Private
 */
const getMoneyRequests = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = {};

    if (type === 'sent') {
      query.senderId = req.user.id;
    } else if (type === 'received') {
      query.receiverId = req.user.id;
    } else {
      // Get both sent and received
      query.$or = [
        { senderId: req.user.id },
        { receiverId: req.user.id }
      ];
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    const requests = await MoneyRequest.find(query)
      .populate('senderId', 'fullName email mobile')
      .populate('receiverId', 'fullName email mobile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch money requests'
    });
  }
};

/**
 * @route   GET /api/transfers/requests/:id
 * @desc    Get money request details
 * @access  Private
 */
const getMoneyRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MoneyRequest.findOne({ requestId: id })
      .populate('senderId', 'fullName email mobile')
      .populate('receiverId', 'fullName email mobile');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Money request not found'
      });
    }

    // Check if user is involved in this request
    const userId = req.user.id.toString();
    if (request.senderId._id.toString() !== userId && 
        request.receiverId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request details'
    });
  }
};

/**
 * @route   PUT /api/transfers/requests/:id/accept
 * @desc    Accept money request
 * @access  Private
 */
const acceptMoneyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MoneyRequest.findOne({ requestId: id });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Money request not found'
      });
    }

    // Check if user is the receiver
    if (request.receiverId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can accept this request'
      });
    }

    // Check if already processed
    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`
      });
    }

    // Get sender details
    const sender = await User.findById(request.senderId);

    // Send money from receiver to sender
    const result = await sendMoney(
      req.user.id,
      sender.email,
      request.amount,
      request.currency,
      `Payment for request ${request.requestId}`
    );

    // Update request status
    request.status = 'COMPLETED';
    request.transactionId = result.transactionId;
    request.respondedAt = new Date();
    request.completedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Money request accepted and payment completed',
      data: {
        requestId: request.requestId,
        transactionId: result.transactionId,
        amount: request.amount,
        currency: request.currency
      }
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept money request'
    });
  }
};

/**
 * @route   PUT /api/transfers/requests/:id/reject
 * @desc    Reject money request
 * @access  Private
 */
const rejectMoneyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MoneyRequest.findOne({ requestId: id });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Money request not found'
      });
    }

    // Check if user is the receiver
    if (request.receiverId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can reject this request'
      });
    }

    // Check if already processed
    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`
      });
    }

    // Update request status
    request.status = 'REJECTED';
    request.respondedAt = new Date();
    await request.save();

    // Notify sender
    const receiver = await User.findById(req.user.id);
    await Notification.create({
      userId: request.senderId,
      title: 'Request Rejected',
      message: `${receiver.fullName} rejected your money request for ${request.amount} ${request.currency}`,
      type: 'REQUEST',
      metadata: {
        requestId: request.requestId,
        amount: request.amount,
        currency: request.currency
      }
    });

    res.json({
      success: true,
      message: 'Money request rejected',
      data: {
        requestId: request.requestId,
        status: request.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject money request'
    });
  }
};

/**
 * @route   PUT /api/transfers/requests/:id/cancel
 * @desc    Cancel money request
 * @access  Private
 */
const cancelMoneyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MoneyRequest.findOne({ requestId: id });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Money request not found'
      });
    }

    // Check if user is the sender
    if (request.senderId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can cancel this request'
      });
    }

    // Check if already processed
    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`
      });
    }

    // Update request status
    request.status = 'CANCELLED';
    request.respondedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Money request cancelled',
      data: {
        requestId: request.requestId,
        status: request.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel money request'
    });
  }
};

module.exports = {
  sendMoneyController,
  requestMoney,
  getMoneyRequests,
  getMoneyRequestDetails,
  acceptMoneyRequest,
  rejectMoneyRequest,
  cancelMoneyRequest
};
