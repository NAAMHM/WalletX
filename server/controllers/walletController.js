const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { 
  addMoney, 
  withdrawMoney, 
  getWalletByUserId,
  getWalletByWalletId 
} = require('../services/walletService');

/**
 * @route   GET /api/wallet
 * @desc    Get user's wallet details
 * @access  Private
 */
const getWallet = async (req, res) => {
  try {
    const wallet = await getWalletByUserId(req.user.id);
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        walletId: wallet.walletId,
        balances: wallet.balances,
        preferredCurrency: user.preferredCurrency,
        totalMoneyAdded: wallet.totalMoneyAdded,
        totalMoneySent: wallet.totalMoneySent,
        totalMoneyReceived: wallet.totalMoneyReceived,
        isActive: wallet.isActive,
        createdAt: wallet.createdAt
      }
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch wallet details'
    });
  }
};

/**
 * @route   POST /api/wallet/add-money
 * @desc    Add money to wallet
 * @access  Private
 */
const addMoneyToWallet = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Validate input
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

    // Add money
    const result = await addMoney(
      req.user.id, 
      amount, 
      currency,
      `Added ${amount} ${currency} to wallet`
    );

    res.json({
      success: true,
      message: 'Money added successfully',
      data: {
        transactionId: result.transaction.transactionId,
        amount,
        currency,
        newBalance: result.newBalance,
        balances: result.wallet.balances
      }
    });
  } catch (error) {
    console.error('Add money error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add money'
    });
  }
};

/**
 * @route   POST /api/wallet/withdraw
 * @desc    Withdraw money from wallet
 * @access  Private
 */
const withdrawFromWallet = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Validate input
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

    // Withdraw money
    const result = await withdrawMoney(
      req.user.id, 
      amount, 
      currency,
      `Withdrew ${amount} ${currency} from wallet`
    );

    res.json({
      success: true,
      message: 'Money withdrawn successfully',
      data: {
        transactionId: result.transaction.transactionId,
        amount,
        currency,
        newBalance: result.newBalance,
        balances: result.wallet.balances
      }
    });
  } catch (error) {
    console.error('Withdraw money error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to withdraw money'
    });
  }
};

/**
 * @route   GET /api/wallet/balance/:currency
 * @desc    Get balance in specific currency
 * @access  Private
 */
const getBalance = async (req, res) => {
  try {
    const { currency } = req.params;
    
    const wallet = await getWalletByUserId(req.user.id);
    
    if (!wallet.balances[currency] && wallet.balances[currency] !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency'
      });
    }

    res.json({
      success: true,
      data: {
        currency,
        balance: wallet.balances[currency]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balance'
    });
  }
};

/**
 * @route   GET /api/wallet/search/:identifier
 * @desc    Search wallet by wallet ID, email, or mobile
 * @access  Private
 */
const searchWallet = async (req, res) => {
  try {
    const { identifier } = req.params;

    let wallet = null;
    let user = null;

    // Try to find by wallet ID first
    wallet = await Wallet.findOne({ walletId: identifier.toUpperCase() });
    
    if (wallet) {
      user = await User.findById(wallet.userId).select('-password');
    } else {
      // Try to find by email or mobile
      user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { mobile: identifier }
        ]
      }).select('-password');

      if (user) {
        wallet = await Wallet.findOne({ userId: user._id });
      }
    }

    if (!wallet || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'This user account is blocked'
      });
    }

    res.json({
      success: true,
      data: {
        walletId: wallet.walletId,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        userId: user._id
      }
    });
  } catch (error) {
    console.error('Search wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search wallet'
    });
  }
};

module.exports = {
  getWallet,
  addMoneyToWallet,
  withdrawFromWallet,
  getBalance,
  searchWallet
};
