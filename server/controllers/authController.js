const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { generateToken } = require('../middleware/authMiddleware');
const generateWalletId = require('../utils/generateWalletId');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      mobile, 
      password, 
      dateOfBirth, 
      country, 
      preferredCurrency 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email is already registered' 
          : 'Mobile number is already registered'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      mobile,
      password, // Will be hashed by pre-save hook
      dateOfBirth,
      country,
      preferredCurrency: preferredCurrency || 'INR',
      role: 'USER'
    });

    // Create wallet for user
    const walletId = generateWalletId();
    await Wallet.create({
      userId: user._id,
      walletId,
      balances: {
        INR: 0,
        USD: 0,
        EUR: 0,
        GBP: 0,
        AED: 0
      }
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to WalletX!',
      message: `Welcome ${fullName}! Your wallet has been created successfully. Start managing your finances securely.`,
      type: 'SYSTEM'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login to continue.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Get wallet
    const wallet = await Wallet.findOne({ userId: user._id });

    // Generate token
    const token = generateToken(user._id);

    // Create login notification
    await Notification.create({
      userId: user._id,
      title: 'New Login',
      message: `Login successful at ${new Date().toLocaleString()}`,
      type: 'LOGIN'
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          country: user.country,
          preferredCurrency: user.preferredCurrency,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        wallet: {
          walletId: wallet.walletId,
          balance: wallet.balances[user.preferredCurrency]
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findOne({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        user,
        wallet: {
          walletId: wallet.walletId,
          balances: wallet.balances,
          totalMoneyAdded: wallet.totalMoneyAdded,
          totalMoneySent: wallet.totalMoneySent,
          totalMoneyReceived: wallet.totalMoneyReceived
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
