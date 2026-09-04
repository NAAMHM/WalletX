const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const BillPayment = require('../models/BillPayment');

/**
 * @route   GET /api/admin/statistics
 * @desc    Get system statistics
 * @access  Private/Admin
 */
const getStatistics = async (req, res) => {
  try {
    // Count users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isBlocked: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const adminUsers = await User.countDocuments({ role: 'ADMIN' });

    // Count wallets
    const totalWallets = await Wallet.countDocuments();
    const activeWallets = await Wallet.countDocuments({ isActive: true });

    // Count transactions
    const totalTransactions = await Transaction.countDocuments();
    const successfulTransactions = await Transaction.countDocuments({ status: 'SUCCESS' });
    const failedTransactions = await Transaction.countDocuments({ status: 'FAILED' });
    const pendingTransactions = await Transaction.countDocuments({ status: 'PENDING' });

    // Transaction types
    const transactionsByType = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate total volume
    let totalVolume = 0;
    const allWallets = await Wallet.find();
    allWallets.forEach(wallet => {
      Object.values(wallet.balances).forEach(balance => {
        totalVolume += balance;
      });
    });

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'fullName email')
      .populate('senderId', 'fullName email')
      .populate('receiverId', 'fullName email');

    // Bill payments
    const totalBillPayments = await BillPayment.countDocuments();
    const billPaymentsByCategory = await BillPayment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers,
          admins: adminUsers
        },
        wallets: {
          total: totalWallets,
          active: activeWallets
        },
        transactions: {
          total: totalTransactions,
          successful: successfulTransactions,
          failed: failedTransactions,
          pending: pendingTransactions,
          byType: transactionsByType
        },
        billPayments: {
          total: totalBillPayments,
          byCategory: billPaymentsByCategory
        },
        volume: {
          totalInSystem: Math.round(totalVolume * 100) / 100
        },
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    const { search, role, isBlocked, page = 1, limit = 20 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role.toUpperCase();
    }

    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get wallet for each user
    const usersWithWallets = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          wallet: wallet ? {
            walletId: wallet.walletId,
            totalBalance: Object.values(wallet.balances).reduce((a, b) => a + b, 0)
          } : null
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithWallets,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user details
 * @access  Private/Admin
 */
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const wallet = await Wallet.findOne({ userId: id });
    const transactionCount = await Transaction.countDocuments({
      $or: [
        { userId: id },
        { senderId: id },
        { receiverId: id }
      ]
    });

    res.json({
      success: true,
      data: {
        user,
        wallet,
        transactionCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
};

/**
 * @route   PUT /api/admin/users/:id/block
 * @desc    Block user
 * @access  Private/Admin
 */
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Cannot block admin users'
      });
    }

    user.isBlocked = true;
    await user.save();

    res.json({
      success: true,
      message: 'User blocked successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to block user'
    });
  }
};

/**
 * @route   PUT /api/admin/users/:id/unblock
 * @desc    Unblock user
 * @access  Private/Admin
 */
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = false;
    await user.save();

    res.json({
      success: true,
      message: 'User unblocked successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unblock user'
    });
  }
};

/**
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions
 * @access  Private/Admin
 */
const getAllTransactions = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;

    let query = {};

    if (type) {
      query.type = type.toUpperCase();
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .populate('userId', 'fullName email')
      .populate('senderId', 'fullName email')
      .populate('receiverId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

module.exports = {
  getStatistics,
  getUsers,
  getUserDetails,
  blockUser,
  unblockUser,
  getAllTransactions
};
