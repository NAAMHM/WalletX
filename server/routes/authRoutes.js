const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { 
  validateRegistration, 
  validateLogin 
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
