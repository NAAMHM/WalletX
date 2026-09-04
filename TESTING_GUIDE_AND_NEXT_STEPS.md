# 🧪 WALLETX COMPREHENSIVE TESTING GUIDE

## 🎯 PURPOSE

This guide helps you test EVERY feature in WalletX to determine:
- ✅ What's working
- ⚠️ What needs fixes
- ❌ What's missing

---

## 🚀 STEP-BY-STEP TESTING PROCESS

### **PREPARATION**

1. **Start Backend**:
```cmd
cd "c:\Users\realh\Desktop\WALLET X\server"
npm run dev
```

2. **Start Frontend**:
```cmd
cd "c:\Users\realh\Desktop\WALLET X\client"
npm start
```

3. **Open Browser**: http://localhost:3000

4. **Open Developer Tools**: Press F12 (check Console and Network tabs)

---

## 📋 TEST CHECKLIST

### **1. LANDING PAGE** ✅

**URL**: http://localhost:3000/index.html

**Tests**:
- [ ] Page loads with dark theme
- [ ] "Get Started" button works
- [ ] "Login" button works
- [ ] "🎭 Try Demo Account" button works
- [ ] Features section displays
- [ ] No console errors

**Expected**: All buttons navigate correctly

---

### **2. REGISTRATION** ✅

**URL**: http://localhost:3000/register.html

**Tests**:
- [ ] Form displays all fields
- [ ] Password strength indicator works
- [ ] Form validation works
- [ ] "Create Account" button works
- [ ] "🎭 Use Demo Account Instead" button works

**Test Data**:
```
Full Name: Test User
Email: test123@example.com
Mobile: +1234567890
Country: United States
Currency: USD
Password: Test@12345
Confirm Password: Test@12345
```

**Expected Behavior**:
1. Click "Create Account"
2. See "Account created successfully!" message
3. Redirect to login page after 2 seconds
4. Check server logs for user creation

**Check**:
- [ ] Success message appears
- [ ] Redirects to login
- [ ] No errors in console
- [ ] Server logs show new user created

---

### **3. LOGIN** ✅

**URL**: http://localhost:3000/login.html

**Tests**:
- [ ] Demo button fills credentials
- [ ] Form validation works
- [ ] Login button works
- [ ] Password toggle works

**Test Credentials**:
```
Email: john@walletx.demo
Password: User@12345
```

**Expected Behavior**:
1. Enter credentials (or use demo button)
2. Click "Login"
3. See "Login successful!" message
4. Redirect to dashboard
5. Check that JWT token is stored

**Check**:
- [ ] Login successful
- [ ] Redirects to dashboard
- [ ] Token in localStorage
- [ ] No console errors

---

### **4. DASHBOARD** ✅

**URL**: http://localhost:3000/dashboard.html

**Tests**:
- [ ] Page loads with data
- [ ] Balance card shows amount (not undefined)
- [ ] Wallet ID displays
- [ ] Stats cards show numbers
- [ ] Recent transactions display
- [ ] Quick action buttons work

**Expected**: 
- Balance: ₹10000.00 (or similar)
- Wallet ID: WLTX-XXXXX
- Stats show real numbers
- Transactions list appears

**Check**:
- [ ] Balance is a number (not undefined/NaN)
- [ ] Stats are numbers
- [ ] Transactions show
- [ ] Sidebar navigation works
- [ ] No console errors

---

### **5. WALLET OPERATIONS** 🟡

**URL**: http://localhost:3000/wallet.html

#### **Test 5A: Add Money**

**Steps**:
1. Click "Add Money" button
2. Modal opens
3. Enter amount: 1000
4. Select currency: INR
5. Click "Add Money"

**Expected Behavior**:
1. Modal closes
2. Success message appears
3. Balance increases by 1000
4. Transaction created
5. Dashboard balance updates

**Check in Browser Console**:
```javascript
// Should see API call to:
POST http://localhost:5000/api/wallet/add-money
// Response should be:
{ success: true, data: { ... } }
```

**Check**:
- [ ] Modal opens/closes
- [ ] API call succeeds
- [ ] Balance increases
- [ ] Success message shows
- [ ] No console errors

#### **Test 5B: Withdraw Money**

**Steps**:
1. Click "Withdraw" button
2. Modal opens
3. Enter amount: 500
4. Select currency: INR
5. Click "Withdraw"

**Expected Behavior**:
1. Modal closes
2. Success message appears
3. Balance decreases by 500
4. Transaction created

**Check**:
- [ ] Modal works
- [ ] API call succeeds
- [ ] Balance decreases
- [ ] No console errors

---

### **6. SEND MONEY** 🟡

**URL**: http://localhost:3000/send-money.html

**Steps**:
1. Enter recipient: `sarah@walletx.demo`
2. Click "🔍 Search Recipient"
3. Recipient card appears
4. Enter amount: 100
5. Select currency: INR
6. Add note: "Test transfer"
7. Click "📤 Send Money"

**Expected Behavior**:
1. User search works
2. Recipient details show
3. Transfer confirmation
4. Success message
5. Sender balance decreases
6. Recipient balance increases
7. Transaction records created

**Check in Network Tab**:
```
GET /api/wallet/search/sarah@walletx.demo
POST /api/transfers
```

**Check**:
- [ ] Search works
- [ ] Recipient found
- [ ] Transfer processes
- [ ] Balances update
- [ ] Transactions created
- [ ] No console errors

---

### **7. REQUEST MONEY** 🟡

**URL**: http://localhost:3000/request-money.html

**Steps**:
1. Enter recipient: `mike@walletx.demo`
2. Enter amount: 250
3. Select currency: INR
4. Add note: "Lunch money"
5. Click "📥 Send Request"

**Expected Behavior**:
1. Request created
2. Success message
3. Request appears in "My Money Requests"
4. Status shows "PENDING"

**Check**:
- [ ] Request created
- [ ] Appears in list
- [ ] Status correct
- [ ] No console errors

**Note**: Accept/Reject workflow may need implementation

---

### **8. QR PAYMENT** 🟡

**URL**: http://localhost:3000/qr-payment.html

#### **Test 8A: Generate QR**

**Steps**:
1. Enter amount: 500
2. Select currency: INR
3. Add note: "Payment for service"
4. Click "📱 Generate QR Code"

**Expected Behavior**:
1. QR code generates
2. QR image displays
3. Payment info shows

**Check in Network Tab**:
```
POST /api/qr/generate
```

**Check**:
- [ ] QR generates
- [ ] Image displays
- [ ] No console errors

#### **Test 8B: Scan QR**

**Steps**:
1. Copy QR data from generated QR
2. Paste in "Paste QR Data" field
3. Click "🔍 Process QR Code"

**Expected Behavior**:
1. QR decoded
2. Payment details shown
3. Confirmation prompt
4. Payment processes

**Check**:
- [ ] QR decodes
- [ ] Payment works
- [ ] No console errors

---

### **9. BILL PAYMENTS** 🟡

**URL**: http://localhost:3000/bills.html

**Steps**:
1. Click "⚡ Electricity" category
2. Select provider from dropdown
3. Enter account number: 123456789
4. Enter amount: 500
5. Select currency: INR
6. Click "🧾 Pay Bill"

**Expected Behavior**:
1. Category selects
2. Providers load
3. Form validates
4. Payment processes
5. Wallet balance decreases
6. Transaction created
7. Bill appears in history

**Check in Network Tab**:
```
GET /api/bills/providers/ELECTRICITY
POST /api/bills/pay
```

**Check**:
- [ ] Category selection works
- [ ] Providers load
- [ ] Payment processes
- [ ] Balance decreases
- [ ] Transaction created
- [ ] History updates
- [ ] No console errors

---

### **10. TRANSACTIONS** ✅

**URL**: http://localhost:3000/transactions.html

**Tests**:
- [ ] All transactions display
- [ ] Summary stats show correct totals
- [ ] Type filter works
- [ ] Status filter works
- [ ] Transactions have correct icons
- [ ] Amounts show +/- correctly
- [ ] Status badges display

**Steps**:
1. Load page
2. Check summary stats
3. Select filter: "SEND"
4. Click "Apply Filters"
5. Verify only SEND transactions show

**Check**:
- [ ] Transactions load
- [ ] Stats are correct
- [ ] Filters work
- [ ] No console errors

---

### **11. ANALYTICS** ✅ FIXED

**URL**: http://localhost:3000/analytics.html

**Tests**:
- [ ] Stats show numbers (not "undefined")
- [ ] Total Income shows
- [ ] Total Expense shows
- [ ] Total Sent shows
- [ ] Total Received shows
- [ ] Period filters work
- [ ] Transaction breakdown shows

**Steps**:
1. Load page
2. Check all 4 stats
3. Click "30 Days" button
4. Verify stats recalculate

**Expected**: All stats show as `₹0.00` or actual amounts, NOT "undefined"

**Check**:
- [ ] No "undefined" values
- [ ] Stats are numbers
- [ ] Period filter works
- [ ] Breakdown displays
- [ ] No console errors

---

### **12. CURRENCY EXCHANGE** 🟡

**URL**: http://localhost:3000/currency.html

**Steps**:
1. Select From: INR
2. Enter Amount: 1000
3. Select To: USD
4. Check converted amount
5. Click swap button (⇅)
6. Click "💱 Convert Now"

**Expected Behavior**:
1. Conversion calculates
2. Exchange rate displays
3. Swap button works
4. Conversion processes
5. Wallet balances update

**Check in Network Tab**:
```
GET /api/currency/rates
POST /api/currency/convert
```

**Check**:
- [ ] Rates load
- [ ] Conversion calculates
- [ ] Swap works
- [ ] Convert processes
- [ ] No console errors

---

### **13. PROFILE** ✅

**URL**: http://localhost:3000/profile.html

**Tests**:
- [ ] User info displays
- [ ] Avatar shows initials
- [ ] Name shows
- [ ] Email shows
- [ ] Mobile shows
- [ ] Country shows
- [ ] Currency shows
- [ ] Status shows
- [ ] Member since shows

**Check**:
- [ ] All fields populated
- [ ] No "undefined" values
- [ ] No console errors

---

### **14. SETTINGS** 🟡

**URL**: http://localhost:3000/settings.html

**Steps**:
1. Enter current password
2. Enter new password: NewPass@123
3. Confirm new password: NewPass@123
4. Click "Update Password"

**Expected Behavior**:
1. Password validates
2. Update processes
3. Success message shows

**Check in Network Tab**:
```
POST /api/users/change-password
```

**Check**:
- [ ] Form validates
- [ ] Password updates
- [ ] Success message shows
- [ ] No console errors

---

### **15. LOGOUT** ✅

**Steps**:
1. Click "Logout" in sidebar
2. Should redirect to login/landing

**Expected Behavior**:
1. Token cleared from localStorage
2. Redirect to login
3. Cannot access protected pages

**Check**:
- [ ] Logout works
- [ ] Token cleared
- [ ] Redirects correctly
- [ ] No console errors

---

## 🐛 ERROR TRACKING TEMPLATE

For each test that fails, document:

```
Feature: [Name]
URL: [Page URL]
Steps: [What you did]
Expected: [What should happen]
Actual: [What actually happened]
Error: [Console error message]
Network: [API call status code]
Screenshot: [If helpful]
```

---

## 📊 RESULTS SUMMARY TEMPLATE

After testing, fill this out:

```
TOTAL TESTS: [Number]
✅ PASSED: [Number]
⚠️ PARTIAL: [Number]
❌ FAILED: [Number]

CRITICAL ISSUES:
1. [Issue]
2. [Issue]

HIGH PRIORITY FIXES:
1. [Fix needed]
2. [Fix needed]

WORKING WELL:
1. [Feature]
2. [Feature]
```

---

## 🎯 WHAT TO DO NEXT

### **If Most Tests Pass** ✅
Your WalletX is largely functional! Focus on:
1. Fixing specific failed tests
2. Adding security features (OTP, 2FA)
3. Adding charts to analytics
4. Polish and optimization

### **If Many Tests Fail** ⚠️
Prioritize:
1. Fix authentication issues first
2. Fix wallet operations
3. Fix core transfers
4. Then move to advanced features

### **If Nothing Works** ❌
Check:
1. MongoDB running?
2. Backend server running?
3. Frontend server running?
4. Environment variables set?
5. Dependencies installed?

---

## 💡 DEBUGGING TIPS

### **Backend Not Starting**:
```cmd
# Check MongoDB
net start MongoDB

# Reinstall dependencies
cd server
npm install
npm run dev
```

### **Frontend Not Loading**:
```cmd
# Reinstall dependencies
cd client
npm install
npm start
```

### **API Calls Failing**:
1. Check Network tab in DevTools
2. Look at Response data
3. Check server terminal for errors
4. Verify authentication token

### **"undefined" or "null" Values**:
1. Check API response structure
2. Verify data path in frontend code
3. Add safe defaults: `(value || 0)`

---

## 📞 FINAL CHECKLIST

Before finishing testing:

- [ ] Tested all 14 pages
- [ ] Documented all failures
- [ ] Checked all console errors
- [ ] Verified authentication
- [ ] Tested wallet operations
- [ ] Tested transactions
- [ ] Tested analytics
- [ ] Created issue list
- [ ] Prioritized fixes

---

**READY TO TEST!** Start from the top and work through each test systematically. Good luck! 🚀
