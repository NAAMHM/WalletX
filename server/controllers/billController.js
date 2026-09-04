const BillPayment = require('../models/BillPayment');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const User = require('../models/User');
const generateTransactionId = require('../utils/generateTransactionId');

/**
 * @route   GET /api/bills/providers
 * @desc    Get list of bill providers by category
 * @access  Private
 */
const getBillProviders = async (req, res) => {
  try {
    const { category } = req.query;

    // Demo providers for each category
    const providers = {
      ELECTRICITY: [
        { id: 'elec_1', name: 'State Power Corporation', code: 'SPC' },
        { id: 'elec_2', name: 'City Electric Company', code: 'CEC' },
        { id: 'elec_3', name: 'Metro Power Supply', code: 'MPS' }
      ],
      WATER: [
        { id: 'water_1', name: 'Municipal Water Board', code: 'MWB' },
        { id: 'water_2', name: 'City Water Supply', code: 'CWS' }
      ],
      MOBILE_RECHARGE: [
        { id: 'mobile_1', name: 'Airtel', code: 'AIRTEL' },
        { id: 'mobile_2', name: 'Vodafone', code: 'VODAFONE' },
        { id: 'mobile_3', name: 'Jio', code: 'JIO' },
        { id: 'mobile_4', name: 'BSNL', code: 'BSNL' }
      ],
      INTERNET: [
        { id: 'net_1', name: 'Airtel Broadband', code: 'AIRTEL_BB' },
        { id: 'net_2', name: 'Jio Fiber', code: 'JIO_FIBER' },
        { id: 'net_3', name: 'ACT Fibernet', code: 'ACT' }
      ],
      GAS: [
        { id: 'gas_1', name: 'Indane Gas', code: 'INDANE' },
        { id: 'gas_2', name: 'Bharat Gas', code: 'BHARAT' },
        { id: 'gas_3', name: 'HP Gas', code: 'HP' }
      ],
      DTH: [
        { id: 'dth_1', name: 'Tata Sky', code: 'TATASKY' },
        { id: 'dth_2', name: 'Airtel Digital TV', code: 'AIRTEL_DTH' },
        { id: 'dth_3', name: 'Dish TV', code: 'DISH' }
      ],
      INSURANCE: [
        { id: 'ins_1', name: 'LIC Insurance', code: 'LIC' },
        { id: 'ins_2', name: 'HDFC Life', code: 'HDFC_LIFE' },
        { id: 'ins_3', name: 'ICICI Prudential', code: 'ICICI_PRU' }
      ],
      CREDIT_CARD: [
        { id: 'cc_1', name: 'HDFC Bank', code: 'HDFC' },
        { id: 'cc_2', name: 'ICICI Bank', code: 'ICICI' },
        { id: 'cc_3', name: 'SBI Card', code: 'SBI' },
        { id: 'cc_4', name: 'Axis Bank', code: 'AXIS' }
      ]
    };

    if (category) {
      const categoryUpper = category.toUpperCase();
      if (!providers[categoryUpper]) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bill category'
        });
      }

      return res.json({
        success: true,
        data: {
          category: categoryUpper,
          providers: providers[categoryUpper]
        }
      });
    }

    // Return all providers
    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers'
    });
  }
};

/**
 * @route   POST /api/bills/pay
 * @desc    Pay a bill
 * @access  Private
 */
const payBill = async (req, res) => {
  try {
    const { 
      provider, 
      category, 
      accountNumber, 
      amount, 
      currency,
      billDetails 
    } = req.body;

    // Validate input
    if (!provider || !category || !accountNumber || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Valid categories
    const validCategories = [
      'ELECTRICITY',
      'WATER',
      'MOBILE_RECHARGE',
      'INTERNET',
      'GAS',
      'DTH',
      'INSURANCE',
      'CREDIT_CARD'
    ];

    if (!validCategories.includes(category.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bill category'
      });
    }

    // Get user and wallet
    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check balance
    if (wallet.balances[currency] < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Get balance before transaction
    const balanceBefore = wallet.balances[currency];

    // Deduct amount from wallet
    wallet.balances[currency] -= amount;
    await wallet.save();

    // Get balance after transaction
    const balanceAfter = wallet.balances[currency];

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Create transaction
    const transaction = await Transaction.create({
      transactionId,
      userId: req.user.id,
      type: 'BILL_PAYMENT',
      amount,
      currency,
      category: category.toLowerCase(),
      description: `${category.replace('_', ' ')} bill payment to ${provider}`,
      status: 'SUCCESS',
      balanceBefore,
      balanceAfter,
      metadata: {
        provider,
        accountNumber,
        billDetails: billDetails || {}
      }
    });

    // Generate payment ID
    const paymentId = `BILL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create bill payment record
    const billPayment = await BillPayment.create({
      paymentId,
      userId: req.user.id,
      provider,
      category: category.toUpperCase(),
      accountNumber,
      amount,
      currency,
      status: 'SUCCESS',
      transactionId,
      billDetails: billDetails || {}
    });

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Bill Payment Successful',
      message: `Your ${category.replace('_', ' ')} bill of ${amount} ${currency} has been paid successfully.`,
      type: 'BILL_PAYMENT',
      metadata: {
        paymentId: billPayment.paymentId,
        transactionId,
        provider,
        amount,
        currency,
        category
      }
    });

    res.json({
      success: true,
      message: 'Bill paid successfully',
      data: {
        paymentId: billPayment.paymentId,
        transactionId,
        provider,
        category,
        accountNumber,
        amount,
        currency,
        status: 'SUCCESS',
        newBalance: balanceAfter,
        paidAt: billPayment.createdAt
      }
    });
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Bill payment failed'
    });
  }
};

/**
 * @route   GET /api/bills/history
 * @desc    Get bill payment history
 * @access  Private
 */
const getBillHistory = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    let query = { userId: req.user.id };

    if (category) {
      query.category = category.toUpperCase();
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bills = await BillPayment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BillPayment.countDocuments(query);

    res.json({
      success: true,
      data: {
        bills,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get bill history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill history'
    });
  }
};

/**
 * @route   GET /api/bills/:paymentId
 * @desc    Get bill payment details
 * @access  Private
 */
const getBillDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const bill = await BillPayment.findOne({ paymentId });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill payment not found'
      });
    }

    // Check if user owns this bill payment
    if (bill.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this bill payment'
      });
    }

    // Get transaction details
    const transaction = await Transaction.findOne({ transactionId: bill.transactionId });

    res.json({
      success: true,
      data: {
        bill,
        transaction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill details'
    });
  }
};

module.exports = {
  getBillProviders,
  payBill,
  getBillHistory,
  getBillDetails
};
