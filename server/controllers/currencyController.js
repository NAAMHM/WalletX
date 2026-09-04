const { convertCurrency, demoRates } = require('../services/currencyService');

/**
 * @route   GET /api/currency
 * @desc    Get supported currencies and demo rates
 * @access  Private
 */
const getCurrencies = async (req, res) => {
  try {
    const currencies = [
      {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
        country: 'India',
        demoRate: demoRates.INR
      },
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        country: 'United States',
        demoRate: demoRates.USD
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        country: 'European Union',
        demoRate: demoRates.EUR
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        country: 'United Kingdom',
        demoRate: demoRates.GBP
      },
      {
        code: 'AED',
        name: 'UAE Dirham',
        symbol: 'د.إ',
        country: 'United Arab Emirates',
        demoRate: demoRates.AED
      }
    ];

    res.json({
      success: true,
      message: 'These are demo exchange rates for educational purposes',
      data: {
        baseCurrency: 'INR',
        currencies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch currencies'
    });
  }
};

/**
 * @route   POST /api/currency/convert
 * @desc    Convert currency
 * @access  Private
 */
const convertCurrencyController = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        message: 'From currency, to currency, and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const result = await convertCurrency(
      req.user.id,
      fromCurrency,
      toCurrency,
      amount
    );

    res.json({
      success: true,
      message: 'Currency converted successfully',
      data: {
        transactionId: result.transaction.transactionId,
        fromCurrency: result.fromCurrency,
        toCurrency: result.toCurrency,
        fromAmount: result.fromAmount,
        toAmount: result.toAmount,
        newBalances: result.newBalances
      }
    });
  } catch (error) {
    console.error('Convert currency error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Currency conversion failed'
    });
  }
};

/**
 * @route   POST /api/currency/calculate
 * @desc    Calculate conversion without executing
 * @access  Private
 */
const calculateConversion = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        message: 'From currency, to currency, and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Calculate
    const inrValue = amount * demoRates[fromCurrency];
    const convertedAmount = inrValue / demoRates[toCurrency];
    const roundedAmount = Math.round(convertedAmount * 100) / 100;
    const rate = demoRates[toCurrency] / demoRates[fromCurrency];

    res.json({
      success: true,
      data: {
        fromCurrency,
        toCurrency,
        fromAmount: amount,
        toAmount: roundedAmount,
        rate,
        note: 'This is a demo exchange rate'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Calculation failed'
    });
  }
};

module.exports = {
  getCurrencies,
  convertCurrencyController,
  calculateConversion
};
