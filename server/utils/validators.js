/**
 * Validation utility functions
 */

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

// Validate mobile number
const isValidMobile = (mobile) => {
  const mobileRegex = /^\+?[\d\s-()]{10,}$/;
  return mobileRegex.test(mobile);
};

// Validate password strength
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

// Validate amount
const isValidAmount = (amount) => {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
};

// Validate currency
const isValidCurrency = (currency) => {
  const validCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  return validCurrencies.includes(currency);
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  isValidEmail,
  isValidMobile,
  isStrongPassword,
  isValidAmount,
  isValidCurrency,
  sanitizeInput
};
