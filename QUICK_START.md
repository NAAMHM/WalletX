# 🚀 WalletX Quick Start Guide

## ✅ Status: ALL FIXED AND WORKING!

---

## Start the Application (3 Steps)

### Step 1: Ensure MongoDB is Running
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it
net start MongoDB
```

### Step 2: Start Backend Server
```powershell
cd "c:\Users\realh\Desktop\WALLET X\server"
npm run dev
```
✅ Backend will be available at: **http://localhost:5000**

### Step 3: Start Frontend Server
```powershell
cd "c:\Users\realh\Desktop\WALLET X\client"
npm start
```
✅ Frontend will be available at: **http://localhost:3000**

---

## 🌐 Access the Website

Open your browser and go to: **http://localhost:3000**

---

## 🔐 Login Credentials

### Demo User (Recommended for Testing)
- **Email:** `john@walletx.demo`
- **Password:** `User@12345`

### Admin Account
- **Email:** `admin@walletx.demo`
- **Password:** `Admin@12345`

### Other Demo Users
- `jane@walletx.demo` / `User@12345`
- `mike@walletx.demo` / `User@12345`

---

## 🎯 Quick Test

1. Go to http://localhost:3000/login.html
2. Click **"Use Demo User"** button (auto-fills credentials)
3. Click **"Login"**
4. ✅ You should see the dashboard with wallet balance!

---

## 🧪 Try These Features

1. **Add Money** → Go to Wallet → Click "Add Money" → Enter 1000 INR
2. **Send Money** → Click "Send Money" → Send to `jane@walletx.demo`
3. **View Transactions** → Click "Transactions" → See all history
4. **Pay Bills** → Click "Bill Payments" → Pay electricity bill
5. **QR Payment** → Click "QR Payment" → Generate QR code

---

## 🛑 Stop Servers

Press `Ctrl + C` in each terminal window running the servers.

---

## 🔄 Reseed Database (If Needed)

```powershell
cd "c:\Users\realh\Desktop\WALLET X\server"
npm run seed
```

---

## 📖 Full Documentation

See **FIXES_APPLIED.md** for:
- Complete list of fixes
- Detailed testing steps (15 test cases)
- Troubleshooting guide
- Technical details

---

## ✨ What Was Fixed

✅ "api is not defined" error - Fixed script loading order
✅ Missing pages - Created all 9 missing HTML pages  
✅ Database seeding errors - Fixed transaction ID uniqueness
✅ Port conflicts - Cleaned up processes
✅ CORS/Fetch errors - Serving via HTTP instead of file://

---

## 🎓 For Your College Project

This is a **complete, working full-stack application** ready for:
- Demo presentations
- Project submissions
- Code reviews
- Documentation showcase

**Features:** Authentication, Wallet, Transfers, Bills, QR Payments, Analytics, Admin Panel

**Tech Stack:** Node.js, Express, MongoDB, HTML, CSS, Vanilla JavaScript

**Status:** ✅ Production Ready (Demo Mode)

---

**Need help?** Check the browser console and server terminal for any errors.

**Everything working?** 🎉 You're ready to demo your project!
