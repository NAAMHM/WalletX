const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Wallet = require('./models/Wallet');
const Transaction = require('./models/Transaction');
const Notification = require('./models/Notification');
const BillPayment = require('./models/BillPayment');
const generateWalletId = require('./utils/generateWalletId');
const generateTransactionId = require('./utils/generateTransactionId');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║       WALLETX DATABASE SEEDING        ║');
    console.log('╚═══════════════════════════════════════╝\n');

    // Clear existing data
    console.log('→ Clearing existing data...');
    await User.deleteMany({});
    await Wallet.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});
    await BillPayment.deleteMany({});
    console.log('✓ Existing data cleared\n');

    // Create Admin
    console.log('→ Creating admin user...');
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@walletx.demo',
      mobile: '+919876543210',
      password: 'Admin@12345',
      dateOfBirth: new Date('1990-01-01'),
      country: 'India',
      preferredCurrency: 'INR',
      role: 'ADMIN',
      isBlocked: false
    });

    const adminWallet = await Wallet.create({
      userId: admin._id,
      walletId: generateWalletId(),
      balances: {
        INR: 100000,
        USD: 500,
        EUR: 300,
        GBP: 200,
        AED: 1000
      },
      totalMoneyAdded: 100000
    });

    console.log(`✓ Admin created: ${admin.email}`);
    console.log(`  Wallet ID: ${adminWallet.walletId}\n`);

    // Create Demo Users
    console.log('→ Creating demo users...');
    
    const user1 = await User.create({
      fullName: 'John Doe',
      email: 'john@walletx.demo',
      mobile: '+919876543211',
      password: 'User@12345',
      dateOfBirth: new Date('1995-05-15'),
      country: 'India',
      preferredCurrency: 'INR',
      role: 'USER'
    });

    const wallet1 = await Wallet.create({
      userId: user1._id,
      walletId: generateWalletId(),
      balances: {
        INR: 5000,
        USD: 50,
        EUR: 30,
        GBP: 20,
        AED: 100
      },
      totalMoneyAdded: 5000,
      totalMoneySent: 500,
      totalMoneyReceived: 200
    });

    const user2 = await User.create({
      fullName: 'Jane Smith',
      email: 'jane@walletx.demo',
      mobile: '+919876543212',
      password: 'User@12345',
      dateOfBirth: new Date('1992-08-20'),
      country: 'India',
      preferredCurrency: 'USD',
      role: 'USER'
    });

    const wallet2 = await Wallet.create({
      userId: user2._id,
      walletId: generateWalletId(),
      balances: {
        INR: 8000,
        USD: 100,
        EUR: 50,
        GBP: 40,
        AED: 200
      },
      totalMoneyAdded: 8000,
      totalMoneySent: 300,
      totalMoneyReceived: 600
    });

    const user3 = await User.create({
      fullName: 'Mike Johnson',
      email: 'mike@walletx.demo',
      mobile: '+919876543213',
      password: 'User@12345',
      dateOfBirth: new Date('1988-12-10'),
      country: 'United States',
      preferredCurrency: 'USD',
      role: 'USER'
    });

    const wallet3 = await Wallet.create({
      userId: user3._id,
      walletId: generateWalletId(),
      balances: {
        INR: 10000,
        USD: 200,
        EUR: 80,
        GBP: 60,
        AED: 300
      },
      totalMoneyAdded: 10000,
      totalMoneySent: 1000,
      totalMoneyReceived: 400
    });

    console.log(`✓ User 1: ${user1.email} | Wallet: ${wallet1.walletId}`);
    console.log(`✓ User 2: ${user2.email} | Wallet: ${wallet2.walletId}`);
    console.log(`✓ User 3: ${user3.email} | Wallet: ${wallet3.walletId}\n`);

    // Create Demo Transactions
    console.log('→ Creating demo transactions...');

    const transactions = [];

    // Add Money transactions
    transactions.push(
      await Transaction.create({
        transactionId: generateTransactionId(),
        userId: user1._id,
        type: 'ADD_MONEY',
        amount: 5000,
        currency: 'INR',
        category: 'wallet',
        description: 'Added money to wallet',
        status: 'SUCCESS',
        balanceBefore: 0,
        balanceAfter: 5000
      }),
      await Transaction.create({
        transactionId: generateTransactionId(),
        userId: user2._id,
        type: 'ADD_MONEY',
        amount: 8000,
        currency: 'INR',
        category: 'wallet',
        description: 'Added money to wallet',
        status: 'SUCCESS',
        balanceBefore: 0,
        balanceAfter: 8000
      })
    );

    // Transfer transactions
    const transferRefId = generateTransactionId();
    transactions.push(
      await Transaction.create({
        transactionId: generateTransactionId(),
        userId: user1._id,
        senderId: user1._id,
        receiverId: user2._id,
        type: 'SEND',
        amount: 500,
        currency: 'INR',
        category: 'transfer',
        description: `Sent to ${user2.fullName}`,
        status: 'SUCCESS',
        referenceId: transferRefId,
        balanceBefore: 5000,
        balanceAfter: 4500
      }),
      await Transaction.create({
        transactionId: generateTransactionId(),
        userId: user2._id,
        senderId: user1._id,
        receiverId: user2._id,
        type: 'RECEIVE',
        amount: 500,
        currency: 'INR',
        category: 'transfer',
        description: `Received from ${user1.fullName}`,
        status: 'SUCCESS',
        referenceId: transferRefId,
        balanceBefore: 8000,
        balanceAfter: 8500
      })
    );

    console.log(`✓ Created ${transactions.length} transactions\n`);

    // Create Demo Bill Payments
    console.log('→ Creating demo bill payments...');

    const billTxId = generateTransactionId();
    await Transaction.create({
      transactionId: billTxId,
      userId: user1._id,
      type: 'BILL_PAYMENT',
      amount: 1500,
      currency: 'INR',
      category: 'electricity',
      description: 'Electricity bill payment',
      status: 'SUCCESS',
      balanceBefore: 4500,
      balanceAfter: 3000
    });

    await BillPayment.create({
      paymentId: `BILL-${Date.now()}-ABC123`,
      userId: user1._id,
      provider: 'State Power Corporation',
      category: 'ELECTRICITY',
      accountNumber: '1234567890',
      amount: 1500,
      currency: 'INR',
      status: 'SUCCESS',
      transactionId: billTxId
    });

    console.log('✓ Created demo bill payments\n');

    // Create Demo Notifications
    console.log('→ Creating demo notifications...');

    await Notification.create([
      {
        userId: user1._id,
        title: 'Welcome to WalletX!',
        message: `Welcome ${user1.fullName}! Your wallet has been created successfully.`,
        type: 'SYSTEM',
        isRead: false
      },
      {
        userId: user1._id,
        title: 'Money Added',
        message: '5000 INR has been added to your wallet successfully.',
        type: 'SYSTEM',
        isRead: false
      },
      {
        userId: user2._id,
        title: 'Welcome to WalletX!',
        message: `Welcome ${user2.fullName}! Your wallet has been created successfully.`,
        type: 'SYSTEM',
        isRead: false
      },
      {
        userId: user2._id,
        title: 'Money Received',
        message: `You received 500 INR from ${user1.fullName}`,
        type: 'RECEIVE',
        isRead: false
      }
    ]);

    console.log('✓ Created demo notifications\n');

    console.log('╔═══════════════════════════════════════╗');
    console.log('║       SEEDING COMPLETED SUCCESSFULLY  ║');
    console.log('╚═══════════════════════════════════════╝\n');

    console.log('Demo Credentials:\n');
    console.log('┌─────────────────────────────────────┐');
    console.log('│ ADMIN ACCOUNT                       │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ Email:    admin@walletx.demo        │');
    console.log('│ Password: Admin@12345               │');
    console.log('└─────────────────────────────────────┘\n');
    
    console.log('┌─────────────────────────────────────┐');
    console.log('│ USER ACCOUNTS                       │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ Email:    john@walletx.demo         │');
    console.log('│ Email:    jane@walletx.demo         │');
    console.log('│ Email:    mike@walletx.demo         │');
    console.log('│ Password: User@12345 (for all)      │');
    console.log('└─────────────────────────────────────┘\n');

    console.log('⚠️  IMPORTANT: This is a DEMO application.');
    console.log('    No real money is transferred.\n');

  } catch (error) {
    console.error('\n✗ Seeding Error:', error);
    throw error;
  }
};

// Run seeding
const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

runSeed();
