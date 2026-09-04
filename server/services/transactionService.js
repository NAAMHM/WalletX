const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');
const generateTransactionId = require('../utils/generateTransactionId');

/**
 * Send money between users with atomic transaction
 */
const sendMoney = async (senderId, receiverIdentifier, amount, currency, note = '') => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Find sender
    const sender = await User.findById(senderId).session(session);
    if (!sender) {
      throw new Error('Sender not found');
    }

    if (sender.isBlocked) {
      throw new Error('Your account is blocked');
    }

    // Find receiver by email, mobile, or wallet ID
    let receiver = null;
    let receiverWallet = null;

    // Try to find by wallet ID first
    receiverWallet = await Wallet.findOne({ 
      walletId: receiverIdentifier.toUpperCase() 
    }).session(session);

    if (receiverWallet) {
      receiver = await User.findById(receiverWallet.userId).session(session);
    } else {
      // Try to find by email or mobile
      receiver = await User.findOne({
        $or: [
          { email: receiverIdentifier.toLowerCase() },
          { mobile: receiverIdentifier }
        ]
      }).session(session);

      if (receiver) {
        receiverWallet = await Wallet.findOne({ 
          userId: receiver._id 
        }).session(session);
      }
    }

    if (!receiver || !receiverWallet) {
      throw new Error('Receiver not found');
    }

    if (receiver.isBlocked) {
      throw new Error('Receiver account is blocked');
    }

    // Prevent self-transfer
    if (sender._id.toString() === receiver._id.toString()) {
      throw new Error('Cannot transfer money to yourself');
    }

    // Find sender wallet
    const senderWallet = await Wallet.findOne({ 
      userId: senderId 
    }).session(session);

    if (!senderWallet) {
      throw new Error('Sender wallet not found');
    }

    // Check sender balance
    if (senderWallet.balances[currency] < amount) {
      throw new Error('Insufficient balance');
    }

    // Get balances before transaction
    const senderBalanceBefore = senderWallet.balances[currency];
    const receiverBalanceBefore = receiverWallet.balances[currency];

    // Deduct from sender
    senderWallet.balances[currency] -= amount;
    senderWallet.totalMoneySent += amount;
    await senderWallet.save({ session });

    // Add to receiver
    receiverWallet.balances[currency] += amount;
    receiverWallet.totalMoneyReceived += amount;
    await receiverWallet.save({ session });

    // Get balances after transaction
    const senderBalanceAfter = senderWallet.balances[currency];
    const receiverBalanceAfter = receiverWallet.balances[currency];

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Create transaction for sender
    const senderTransaction = await Transaction.create([{
      transactionId,
      userId: senderId,
      senderId: senderId,
      receiverId: receiver._id,
      type: 'SEND',
      amount,
      currency,
      category: 'transfer',
      description: note || `Sent to ${receiver.fullName}`,
      status: 'SUCCESS',
      balanceBefore: senderBalanceBefore,
      balanceAfter: senderBalanceAfter,
      metadata: {
        senderName: sender.fullName,
        receiverName: receiver.fullName,
        receiverEmail: receiver.email,
        receiverWalletId: receiverWallet.walletId
      }
    }], { session });

    // Create transaction for receiver
    await Transaction.create([{
      transactionId,
      userId: receiver._id,
      senderId: senderId,
      receiverId: receiver._id,
      type: 'RECEIVE',
      amount,
      currency,
      category: 'transfer',
      description: note || `Received from ${sender.fullName}`,
      status: 'SUCCESS',
      balanceBefore: receiverBalanceBefore,
      balanceAfter: receiverBalanceAfter,
      metadata: {
        senderName: sender.fullName,
        senderEmail: sender.email,
        senderWalletId: senderWallet.walletId,
        receiverName: receiver.fullName
      }
    }], { session });

    // Create notification for sender
    await Notification.create([{
      userId: senderId,
      title: 'Money Sent',
      message: `You sent ${amount} ${currency} to ${receiver.fullName}`,
      type: 'TRANSFER',
      metadata: {
        transactionId,
        amount,
        currency,
        receiverName: receiver.fullName,
        type: 'SEND'
      }
    }], { session });

    // Create notification for receiver
    await Notification.create([{
      userId: receiver._id,
      title: 'Money Received',
      message: `You received ${amount} ${currency} from ${sender.fullName}`,
      type: 'RECEIVE',
      metadata: {
        transactionId,
        amount,
        currency,
        senderName: sender.fullName,
        type: 'RECEIVE'
      }
    }], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      transactionId,
      transaction: senderTransaction[0],
      sender: {
        name: sender.fullName,
        newBalance: senderBalanceAfter
      },
      receiver: {
        name: receiver.fullName,
        walletId: receiverWallet.walletId
      }
    };
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  sendMoney
};
