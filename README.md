# WalletX - Digital Wallet Platform

![WalletX](https://img.shields.io/badge/WalletX-v1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

**WalletX** is a complete full-stack digital wallet and payment management platform designed as an academic Semester 7 CSE mini project. It provides a secure, simulated environment for digital payments, money transfers, bill payments, and financial management.

> ⚠️ **IMPORTANT**: This is an academic demo application. **NO REAL MONEY** is transferred. All transactions are simulated for educational purposes only.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Testing Guide](#testing-guide)
- [Screenshots](#screenshots)
- [Security Features](#security-features)
- [Future Scope](#future-scope)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

---

## 🎯 Project Overview

**Domain**: Fintech, Digital Payments, Financial Services  
**Type**: Mini Project (Disciplinary)  
**Academic Level**: Semester 7  
**Department**: Computer Science & Engineering  
**Year**: 2026

### Objectives

1. Build a secure digital wallet platform for managing simulated finances
2. Implement multi-currency support with demo exchange rates
3. Enable peer-to-peer money transfers between users
4. Provide QR code-based payment functionality
5. Support utility bill payments across multiple categories
6. Track and analyze all financial transactions
7. Implement role-based access control (User & Admin)

---

## ✨ Features

### User Features

- ✅ **User Registration & Authentication** - Secure JWT-based authentication
- ✅ **Wallet Management** - Multi-currency wallet (INR, USD, EUR, GBP, AED)
- ✅ **Add/Withdraw Money** - Simulated money operations
- ✅ **Send Money** - Transfer to users via email, mobile, or wallet ID
- ✅ **Request Money** - Request payments from other users
- ✅ **QR Payments** - Generate and scan QR codes for payments
- ✅ **Bill Payments** - Pay 8 types of bills (electricity, water, mobile, internet, gas, DTH, insurance, credit card)
- ✅ **Transaction History** - Complete history with search and filters
- ✅ **Currency Conversion** - Convert between supported currencies
- ✅ **Analytics Dashboard** - View spending patterns and statistics
- ✅ **Notifications** - Real-time notifications for all activities
- ✅ **Profile Management** - Update personal information
- ✅ **Security Settings** - Change password, view login history

### Admin Features

- ✅ **System Statistics** - View comprehensive system metrics
- ✅ **User Management** - View, search, block/unblock users
- ✅ **Transaction Monitoring** - View all system transactions
- ✅ **Dashboard Analytics** - System-wide analytics and reports

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - RESTful API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (Local)
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing

### Development Tools
- **nodemon** - Development server with auto-restart
- **dotenv** - Environment variable management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│              WALLETX SYSTEM                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐         ┌──────────────┐  │
│  │  FRONTEND   │ ◄─────► │   BACKEND    │  │
│  │ HTML/CSS/JS │  HTTP   │  Node.js +   │  │
│  │             │  REST   │  Express.js  │  │
│  └─────────────┘         └──────┬───────┘  │
│                                 │           │
│                          ┌──────▼───────┐   │
│                          │   Mongoose   │   │
│                          └──────┬───────┘   │
│                                 │           │
│                          ┌──────▼───────┐   │
│                          │  LOCAL       │   │
│                          │  MONGODB     │   │
│                          │  Database    │   │
│                          └──────────────┘   │
│                                             │
│  Connection: mongodb://127.0.0.1:27017     │
│  Database: walletx                          │
└─────────────────────────────────────────────┘
```

### Data Flow

1. **Frontend** → User interacts with HTML interface
2. **JavaScript (api.js)** → Sends HTTP requests to backend
3. **Express Routes** → Route requests to controllers
4. **Controllers** → Business logic and data validation
5. **Services** → Complex operations (atomic transactions)
6. **Mongoose Models** → Database operations
7. **MongoDB** → Data persistence
8. **Response** → JSON data back to frontend

---

## 📦 Prerequisites

Before installation, ensure you have:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB Community Server** (Local installation)
   - Download: https://www.mongodb.com/try/download/community
   - Verify: `mongod --version`

3. **Git** (Optional, for cloning)
   - Download: https://git-scm.com/

4. **Code Editor** (VS Code recommended)
   - Download: https://code.visualstudio.com/

---

## 📥 Installation Guide

### Step 1: Clone or Download Project

```bash
# Option A: Clone with Git
git clone <repository-url>
cd WALLET X

# Option B: Download ZIP and extract
# Navigate to extracted folder
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

**Expected output:**
```
added 138 packages, and audited 139 packages in 8s
```

### Step 3: Configure Environment Variables

Create `.env` file in `server` directory:

```bash
# Copy example file
cp .env.example .env
```

**server/.env:**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/walletx
JWT_SECRET=walletx_secret_key_change_in_production_2026
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> ⚠️ **Important**: Never commit `.env` file to version control!

### Step 4: Start MongoDB Service

**Windows:**
```powershell
# Open Services (Win + R, type: services.msc)
# Find "MongoDB" service and start it
# OR use Command Prompt as Administrator:
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
```

**Verify MongoDB is running:**
```bash
# Connect to MongoDB shell
mongosh

# You should see MongoDB shell prompt
test>
```

### Step 5: Seed Database with Demo Data

```bash
# From server directory
npm run seed
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║       WALLETX DATABASE SEEDING        ║
╚═══════════════════════════════════════╝

→ Clearing existing data...
✓ Existing data cleared

→ Creating admin user...
✓ Admin created: admin@walletx.demo
  Wallet ID: WX-ABC123DEF456

→ Creating demo users...
✓ User 1: john@walletx.demo | Wallet: WX-...
✓ User 2: jane@walletx.demo | Wallet: WX-...
✓ User 3: mike@walletx.demo | Wallet: WX-...

╔═══════════════════════════════════════╗
║       SEEDING COMPLETED SUCCESSFULLY  ║
╚═══════════════════════════════════════╝
```

---

## 🚀 Running the Application

### Start Backend Server

```bash
# From server directory

# Option 1: Development mode (with auto-restart)
npm run dev

# Option 2: Production mode
npm start
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║         WALLETX SERVER STARTED        ║
╚═══════════════════════════════════════╝
  
  Server: Running
  Port: 5000
  Environment: development
  Database: mongodb://127.0.0.1:27017/walletx
  
  API Status: http://localhost:5000/api/health
  
  ⚠️  IMPORTANT: This is a DEMO application.
      No real money is transferred.
```

### Start Frontend

**Option 1: Using Live Server (VS Code Extension)**
1. Install "Live Server" extension in VS Code
2. Right-click `client/index.html`
3. Select "Open with Live Server"
4. Browser opens at `http://localhost:5500` (or similar)

**Option 2: Using Python HTTP Server**
```bash
# From client directory
python -m http.server 3000
# Open browser: http://localhost:3000
```

**Option 3: Using Node.js http-server**
```bash
# Install globally
npm install -g http-server

# From client directory
http-server -p 3000
# Open browser: http://localhost:3000
```

### Verify Installation

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/health
   - Should see: `{"success":true,"message":"WalletX API is running"}`

2. **Frontend Access:**
   - Open: http://localhost:3000 (or your server port)
   - Should see: WalletX landing page

---

## 🔑 Demo Credentials

### Admin Account
```
Email: admin@walletx.demo
Password: Admin@12345
Role: ADMIN
```

### User Accounts
```
Email: john@walletx.demo
Password: User@12345
Wallet: ~₹5,000 (demo balance)

Email: jane@walletx.demo
Password: User@12345
Wallet: ~₹8,000 (demo balance)

Email: mike@walletx.demo
Password: User@12345
Wallet: ~₹10,000 (demo balance)
```

> 💡 **Tip**: Use demo credentials for quick testing!

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "+919876543210",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123",
  "dateOfBirth": "1995-01-01",
  "country": "India",
  "preferredCurrency": "INR"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...},
    "wallet": {...}
  }
}
```

### Wallet Endpoints

#### Get Wallet
```http
GET /api/wallet
Authorization: Bearer <token>
```

#### Add Money
```http
POST /api/wallet/add-money
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "currency": "INR"
}
```

#### Send Money
```http
POST /api/transfers/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverIdentifier": "jane@walletx.demo",
  "amount": 500,
  "currency": "INR",
  "note": "Payment for lunch"
}
```

### Transaction Endpoints

#### Get Transactions
```http
GET /api/transactions?page=1&limit=20&type=SEND&status=SUCCESS
Authorization: Bearer <token>
```

**Full API documentation available in source code comments.**

---

## 🗄️ Database Schema

### Collections

1. **users** - User accounts
2. **wallets** - User wallets with balances
3. **transactions** - All financial transactions
4. **moneyrequests** - Money request records
5. **billpayments** - Bill payment records
6. **notifications** - User notifications
7. **currencies** - Currency information
8. **loginsessions** - Login session tracking

### Key Relationships

```
User (1) ──────── (1) Wallet
User (1) ──────── (N) Transactions
User (1) ──────── (N) Notifications
User (1) ──────── (N) MoneyRequests
Transaction (N) ── (1) User
```

---

## 📁 Project Structure

```
WALLET X/
├── client/                    # Frontend
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── dashboard.html        # User dashboard
│   ├── wallet.html           # Wallet management
│   ├── send-money.html       # Send money
│   ├── transactions.html     # Transaction history
│   ├── css/
│   │   ├── style.css         # Global styles
│   │   ├── dashboard.css     # Dashboard styles
│   │   ├── auth.css          # Auth page styles
│   │   └── responsive.css    # Responsive design
│   └── js/
│       ├── api.js            # API client
│       ├── auth.js           # Authentication
│       ├── dashboard.js      # Dashboard logic
│       ├── wallet.js         # Wallet logic
│       └── transfer.js       # Transfer logic
│
├── server/                    # Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── walletController.js
│   │   ├── transferController.js
│   │   ├── transactionController.js
│   │   ├── billController.js
│   │   ├── qrController.js
│   │   ├── notificationController.js
│   │   ├── currencyController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Wallet.js
│   │   ├── Transaction.js
│   │   ├── MoneyRequest.js
│   │   ├── BillPayment.js
│   │   ├── Notification.js
│   │   ├── Currency.js
│   │   └── LoginSession.js
│   ├── routes/               # Express routes
│   ├── middleware/           # Custom middleware
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   ├── seed.js               # Database seeder
│   ├── server.js             # Entry point
│   ├── package.json          # Dependencies
│   └── .env                  # Environment variables
│
├── README.md                 # This file
├── .env.example              # Environment template
└── .gitignore               # Git ignore rules
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### 1. Authentication Flow
- [ ] Register new user with valid data
- [ ] Register with invalid email (should fail)
- [ ] Register with weak password (should fail)
- [ ] Register with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected page without login (should redirect)
- [ ] Logout successfully

#### 2. Wallet Operations
- [ ] View wallet balance
- [ ] Add money (₹1000)
- [ ] Verify balance increased
- [ ] Check transaction created
- [ ] Withdraw money (₹500)
- [ ] Try withdraw more than balance (should fail)
- [ ] View all currency balances

#### 3. Money Transfer
- [ ] Search recipient by email
- [ ] Search recipient by wallet ID
- [ ] Send money to valid user
- [ ] Verify sender balance decreased
- [ ] Verify receiver balance increased
- [ ] Check both users have transaction records
- [ ] Try send more than balance (should fail)
- [ ] Try send to self (should fail)

#### 4. Transaction History
- [ ] View all transactions
- [ ] Filter by type (SEND, RECEIVE, etc.)
- [ ] Filter by status
- [ ] Search transactions
- [ ] View transaction details

#### 5. Notifications
- [ ] Check notification badge count
- [ ] Open notifications dropdown
- [ ] Mark notification as read
- [ ] Mark all as read
- [ ] Verify unread count updates

#### 6. Admin Functions (Login as admin)
- [ ] View system statistics
- [ ] View all users
- [ ] Search users
- [ ] Block user
- [ ] Unblock user
- [ ] View all transactions

### Testing with Demo Users

**Scenario: User-to-User Transfer**

1. Login as `john@walletx.demo`
2. Note current balance
3. Send ₹500 to `jane@walletx.demo`
4. Logout
5. Login as `jane@walletx.demo`
6. Verify ₹500 received
7. Check notification
8. Verify transaction in history

### API Testing with cURL

**Test Health Endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Test Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "mobile": "+919999999999",
    "password": "Test@12345",
    "confirmPassword": "Test@12345",
    "dateOfBirth": "1995-01-01",
    "country": "India",
    "preferredCurrency": "INR"
  }'
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@walletx.demo",
    "password": "User@12345"
  }'
```

---

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - Minimum 8 characters
   - Requires: uppercase, lowercase, number, special character
   - Passwords never stored in plain text

2. **Authentication**
   - JWT tokens (7-day expiration)
   - Token stored in localStorage
   - Protected routes check authentication
   - Automatic logout on token expiry

3. **Authorization**
   - Role-based access control (USER/ADMIN)
   - Middleware validates user permissions
   - Admin-only endpoints protected

4. **Data Validation**
   - Frontend and backend validation
   - Input sanitization
   - Email format validation
   - Amount validation (positive numbers only)

5. **Transaction Security**
   - Atomic MongoDB transactions
   - Automatic rollback on failure
   - Balance verification before deduction
   - Duplicate transaction prevention

6. **API Security**
   - CORS configuration
   - Error message sanitization
   - No stack traces in production
   - Rate limiting ready (not implemented)

---

## 🚀 Future Scope

### Planned Enhancements

1. **Real Payment Integration**
   - Razorpay/Stripe gateway
   - Real bank account linking
   - UPI integration

2. **Advanced Features**
   - Split bills
   - Recurring payments
   - Payment reminders
   - Spending limits
   - Budget planning

3. **Security Enhancements**
   - Two-factor authentication (2FA)
   - Biometric authentication
   - Transaction PIN
   - OTP verification
   - Device fingerprinting

4. **Mobile Application**
   - React Native app
   - Push notifications
   - Touch ID/Face ID
   - Offline mode

5. **Analytics & Reports**
   - Export transactions (CSV/PDF)
   - Monthly statements
   - Tax reports
   - Spending insights with AI

6. **Social Features**
   - Contact list integration
   - Split expense groups
   - Payment requests timeline
   - Activity feed

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Problem:** `MongoDB connection failed`

**Solution:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Verify MongoDB is running
mongosh
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

### CORS Error

**Problem:** `Access to fetch blocked by CORS policy`

**Solution:**
- Ensure backend is running
- Check `CLIENT_URL` in `.env` matches frontend URL
- Clear browser cache
- Try incognito/private mode

### Token Expired

**Problem:** `Invalid or expired token`

**Solution:**
- Logout and login again
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET is set in `.env`

### Seeding Fails

**Problem:** Seed script hangs or fails

**Solution:**
```bash
# Drop database and retry
mongosh
use walletx
db.dropDatabase()
exit

# Run seed again
npm run seed
```

---

## 👥 Contributors

- **Your Name** - Full Stack Development
- **Project Guide** - Technical Guidance

---

## 📄 License

This project is created for academic purposes under the MIT License.

```
MIT License

Copyright (c) 2026 WalletX Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 Support

For issues, questions, or suggestions:

- 📧 Email: support@walletx.demo (demo only)
- 🐛 Issues: Create an issue in the repository
- 📖 Docs: Read this README carefully

---

## ⚠️ Disclaimer

**WalletX is an academic demonstration project.**

- NO real money is transferred
- NO real banking transactions occur
- All payments are simulated
- Use for educational purposes only
- Do not use in production without proper security audits
- Not responsible for misuse

---

## 🎓 Academic Information

**Project Title:** WalletX - Digital Wallet Platform  
**Domain:** Fintech, Digital Payments  
**Type:** Mini Project (Disciplinary)  
**Level:** Semester 7  
**Department:** Computer Science & Engineering  
**Year:** 2026

### Learning Outcomes

1. Full-stack web development
2. RESTful API design
3. Database design and management
4. Authentication and authorization
5. Transaction management
6. Frontend-backend integration
7. Security best practices

---

## 📚 References

- Node.js Documentation: https://nodejs.org/docs
- Express.js Guide: https://expressjs.com/
- MongoDB Manual: https://docs.mongodb.com/
- JWT: https://jwt.io/
- MDN Web Docs: https://developer.mozilla.org/

---

**Built with ❤️ for academic excellence**

*Last Updated: September 3, 2026*
