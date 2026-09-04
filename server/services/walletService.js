const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const generateTransactionId = require('../utils/generateTransactionId');

/**
 * Add money to wallet
 */
const addMoney = async (userId, amount, currency, description = 'Money added to wallet') => {
  try {
    // Find wallet
    const wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Get balance before transaction
    const balanceBefore = wallet.balances[currency];

    // Update wallet balance
    wallet.balances[currency] += amount;
    wallet.totalMoneyAdded += amount;
    await wallet.save();

    // Get balance after transaction
    const balanceAfter = wallet.balances[currency];

    // Create transaction record
    const transactionId = generateTransactionId();
    const transaction = await Transaction.create({
      transactionId,
      userId,
      type: 'ADD_MONEY',
      amount,
      currency,
      category: 'wallet',
      description,
      status: 'SUCCESS',
      balanceBefore,
      balanceAfter,
      metadata: {
        addedAt: new Date()
      }
    });

    // Create notification
    await Notification.create({
      userId,
      title: 'Money Added',
      message: `${amount} ${currency} has been added to your wallet successfully.`,
      type: 'SYSTEM',
      metadata: {
        transactionId: transaction.transactionId,
        amount,
        currency
      }
    });

    return {
      success: true,
      transaction,
      wallet,
      newBalance: balanceAfter
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Withdraw money from wallet
 */
const withdrawMoney = async (userId, amount, currency, description = 'Money withdrawn from wallet') => {
  try {
    // Find wallet
    const wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Check balance
    if (wallet.balances[currency] < amount) {
      throw new Error('Insufficient balance');
    }

    // Get balance before transaction
    const balanceBefore = wallet.balances[currency];

    // Update wallet balance
    wallet.balances[currency] -= amount;
    await wallet.save();

    // Get balance after transaction
    const balanceAfter = wallet.balances[currency];

    // Create transaction record
    const transactionId = generateTransactionId();
    const transaction = await Transaction.create({
      transactionId,
      userId,
      type: 'WITHDRAW',
      amount,
      currency,
      category: 'wallet',
      description,
      status: 'SUCCESS',
      balanceBefore,
      balanceAfter,
      metadata: {
        withdrawnAt: new Date()
      }
    });

    // Create notification
    await Notification.create({
      userId,
      title: 'Money Withdrawn',
      message: `${amount} ${currency} has been withdrawn from your wallet.`,
      type: 'SYSTEM',
      metadata: {
        transactionId: transaction.transactionId,
        amount,
        currency
      }
    });

    return {
      success: true,
      transaction,
      wallet,
      newBalance: balanceAfter
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get wallet by user ID
 */
const getWalletByUserId = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ userId }).populate('userId', 'fullName email');
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet;
  } catch (error) {
    throw error;
  }
};

/**
 * Get wallet by wallet ID
 */
const getWalletByWalletId = async (walletId) => {
  try {
    const wallet = await Wallet.findOne({ walletId }).populate('userId', 'fullName email mobile');
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addMoney,
  withdrawMoney,
  getWalletByUserId,
  getWalletByWalletId
};
