const { 
  isValidEmail, 
  isValidMobile, 
  isStrongPassword, 
  isValidAmount,
  isValidCurrency 
} = require('../utils/validators');

/**
 * Validate registration data
 */
const validateRegistration = (req, res, next) => {
  const { fullName, email, mobile, password, confirmPassword, dateOfBirth, country } = req.body;

  // Check required fields
  if (!fullName || !email || !mobile || !password || !confirmPassword || !dateOfBirth || !country) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate mobile
  if (!isValidMobile(mobile)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid mobile number'
    });
  }

  // Validate password strength
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    });
  }

  // Check password match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  next();
};

/**
 * Validate login data
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  next();
};

/**
 * Validate amount
 */
const validateAmount = (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({
      success: false,
      message: 'Amount is required'
    });
  }

  if (!isValidAmount(amount)) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a valid positive number'
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateAmount
};
