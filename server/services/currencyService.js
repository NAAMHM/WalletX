const Currency = require('../models/Currency');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const generateTransactionId = require('../utils/generateTransactionId');

/**
 * Demo exchange rates (relative to INR)
 */
const demoRates = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 105,
  AED: 22.6
};

/**
 * Convert currency
 */
const convertCurrency = async (userId, fromCurrency, toCurrency, amount) => {
  try {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (fromCurrency === toCurrency) {
      throw new Error('Cannot convert to same currency');
    }

    const wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check balance
    if (wallet.balances[fromCurrency] < amount) {
      throw new Error('Insufficient balance');
    }

    // Calculate conversion
    const inrValue = amount * demoRates[fromCurrency];
    const convertedAmount = inrValue / demoRates[toCurrency];
    const roundedAmount = Math.round(convertedAmount * 100) / 100;

    // Get balances before
    const fromBalanceBefore = wallet.balances[fromCurrency];
    const toBalanceBefore = wallet.balances[toCurrency];

    // Update balances
    wallet.balances[fromCurrency] -= amount;
    wallet.balances[toCurrency] += roundedAmount;
    await wallet.save();

    // Create transaction
    const transactionId = generateTransactionId();
    const transaction = await Transaction.create({
      transactionId,
      userId,
      type: 'CURRENCY_CONVERSION',
      amount,
      currency: fromCurrency,
      category: 'conversion',
      description: `Converted ${amount} ${fromCurrency} to ${roundedAmount} ${toCurrency}`,
      status: 'SUCCESS',
      balanceBefore: fromBalanceBefore,
      balanceAfter: wallet.balances[fromCurrency],
      metadata: {
        fromCurrency,
        toCurrency,
        fromAmount: amount,
        toAmount: roundedAmount,
        rate: demoRates[toCurrency] / demoRates[fromCurrency]
      }
    });

    // Create notification
    await Notification.create({
      userId,
      title: 'Currency Converted',
      message: `Successfully converted ${amount} ${fromCurrency} to ${roundedAmount} ${toCurrency}`,
      type: 'SYSTEM',
      metadata: {
        transactionId,
        fromCurrency,
        toCurrency,
        fromAmount: amount,
        toAmount: roundedAmount
      }
    });

    return {
      success: true,
      transaction,
      fromCurrency,
      toCurrency,
      fromAmount: amount,
      toAmount: roundedAmount,
      newBalances: wallet.balances
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  convertCurrency,
  demoRates
};
