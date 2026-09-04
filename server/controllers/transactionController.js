const Transaction = require('../models/Transaction');
const User = require('../models/User');

/**
 * @route   GET /api/transactions
 * @desc    Get user's transaction history
 * @access  Private
 */
const getTransactions = async (req, res) => {
  try {
    const {
      type,
      status,
      currency,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {
      $or: [
        { userId: req.user.id },
        { senderId: req.user.id },
        { receiverId: req.user.id }
      ]
    };

    // Filter by type
    if (type) {
      query.type = type.toUpperCase();
    }

    // Filter by status
    if (status) {
      query.status = status.toUpperCase();
    }

    // Filter by currency
    if (currency) {
      query.currency = currency.toUpperCase();
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search in description or transaction ID
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get transactions
    const transactions = await Transaction.find(query)
      .populate('senderId', 'fullName email')
      .populate('receiverId', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction details
 * @access  Private
 */
const getTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({ transactionId: id })
      .populate('userId', 'fullName email mobile')
      .populate('senderId', 'fullName email mobile')
      .populate('receiverId', 'fullName email mobile');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is involved in this transaction
    const userId = req.user.id.toString();
    const isInvolved = 
      transaction.userId?.toString() === userId ||
      transaction.senderId?.toString() === userId ||
      transaction.receiverId?.toString() === userId;

    if (!isInvolved) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction details'
    });
  }
};

/**
 * @route   GET /api/transactions/stats/summary
 * @desc    Get transaction statistics
 * @access  Private
 */
const getTransactionStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get transactions
    const transactions = await Transaction.find({
      userId: req.user.id,
      createdAt: { $gte: startDate }
    });

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      totalIncome: 0,
      totalExpense: 0,
      totalSent: 0,
      totalReceived: 0,
      totalBillPayments: 0,
      byType: {},
      byStatus: {},
      byCurrency: {}
    };

    transactions.forEach(transaction => {
      // By type
      stats.byType[transaction.type] = (stats.byType[transaction.type] || 0) + 1;

      // By status
      stats.byStatus[transaction.status] = (stats.byStatus[transaction.status] || 0) + 1;

      // By currency
      stats.byCurrency[transaction.currency] = 
        (stats.byCurrency[transaction.currency] || 0) + transaction.amount;

      // Income and expense
      if (transaction.type === 'ADD_MONEY' || transaction.type === 'RECEIVE') {
        stats.totalIncome += transaction.amount;
      }

      if (transaction.type === 'SEND' || transaction.type === 'BILL_PAYMENT' || 
          transaction.type === 'WITHDRAW') {
        stats.totalExpense += transaction.amount;
      }

      if (transaction.type === 'SEND') {
        stats.totalSent += transaction.amount;
      }

      if (transaction.type === 'RECEIVE') {
        stats.totalReceived += transaction.amount;
      }

      if (transaction.type === 'BILL_PAYMENT') {
        stats.totalBillPayments += transaction.amount;
      }
    });

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate: new Date(),
        stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionDetails,
  getTransactionStats
};
