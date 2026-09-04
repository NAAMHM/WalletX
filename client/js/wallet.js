/**
 * Wallet Page Handler
 */

let walletData = null;
let userData = null;

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ'
};

const currencyNames = {
    INR: 'Indian Rupee',
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    AED: 'UAE Dirham'
};

// Initialize
async function init() {
    await loadUserData();
    await loadWalletData();
}

async function loadUserData() {
    const stored = localStorage.getItem('user');
    if (stored) {
        userData = JSON.parse(stored);
        updateUserDisplay();
    }
}

async function loadWalletData() {
    try {
        const response = await api.getWallet();
        if (response.success) {
            walletData = response.data;
            displayWalletData();
        }
    } catch (error) {
        showToast('Failed to load wallet data', 'error');
    }
}

function updateUserDisplay() {
    const userName = document.getElementById('userName');
    if (userName && userData) {
        userName.textContent = userData.fullName;
    }
}

function displayWalletData() {
    if (!walletData) return;
    
    // Display wallet ID
    const walletIdEl = document.getElementById('walletId');
    if (walletIdEl) {
        walletIdEl.textContent = walletData.walletId;
    }
    
    // Display main balance (preferred currency)
    const currency = userData?.preferredCurrency || 'INR';
    const balance = walletData.balances[currency] || 0;
    
    // Update currency symbol
    const mainCurrencySymbol = document.getElementById('mainCurrencySymbol');
    if (mainCurrencySymbol) {
        mainCurrencySymbol.textContent = currencySymbols[currency];
    }
    
    // Update balance value
    const mainBalanceEl = document.getElementById('mainBalance');
    if (mainBalanceEl) {
        mainBalanceEl.textContent = formatAmount(balance);
    }
    
    const currencyLabelEl = document.getElementById('currencyLabel');
    if (currencyLabelEl) {
        currencyLabelEl.textContent = `${currency} - ${currencyNames[currency]}`;
    }
    
    // Display all currency balances
    displayCurrencyBalances();
}

function displayCurrencyBalances() {
    const grid = document.getElementById('currencyGrid');
    if (!grid || !walletData) return;
    
    const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
    const html = currencies.map(currency => {
        const balance = walletData.balances[currency] || 0;
        return `
            <div class="currency-card">
                <div class="currency-info">
                    <h4>${currency}</h4>
                    <p>${currencyNames[currency]}</p>
                </div>
                <div class="currency-balance">
                    <h3>${currencySymbols[currency]}${formatAmount(balance)}</h3>
                </div>
            </div>
        `;
    }).join('');
    
    grid.innerHTML = html;
}

// Show modals
function showAddMoneyModal() {
    document.getElementById('addMoneyModal').style.display = 'flex';
}

function showWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Add money
async function submitAddMoney() {
    const amount = parseFloat(document.getElementById('addAmount').value);
    const currency = document.getElementById('addCurrency').value;
    
    if (!amount || amount <= 0) {
        showMessage('addErrorMessage', 'Please enter a valid amount');
        return;
    }
    
    try {
        const response = await api.addMoney(amount, currency);
        if (response.success) {
            showMessage('addSuccessMessage', 'Money added successfully!');
            setTimeout(() => {
                closeModal('addMoneyModal');
                document.getElementById('addMoneyForm').reset();
                hideMessage('addSuccessMessage');
                loadWalletData();
            }, 1500);
        } else {
            showMessage('addErrorMessage', response.message || 'Failed to add money');
        }
    } catch (error) {
        showMessage('addErrorMessage', error.message || 'Failed to add money');
    }
}

// Withdraw money
async function submitWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const currency = document.getElementById('withdrawCurrency').value;
    
    if (!amount || amount <= 0) {
        showMessage('withdrawErrorMessage', 'Please enter a valid amount');
        return;
    }
    
    try {
        const response = await api.withdrawMoney(amount, currency);
        if (response.success) {
            showMessage('withdrawSuccessMessage', 'Money withdrawn successfully!');
            setTimeout(() => {
                closeModal('withdrawModal');
                document.getElementById('withdrawForm').reset();
                hideMessage('withdrawSuccessMessage');
                loadWalletData();
            }, 1500);
        } else {
            showMessage('withdrawErrorMessage', response.message || 'Failed to withdraw money');
        }
    } catch (error) {
        showMessage('withdrawErrorMessage', error.message || 'Failed to withdraw money');
    }
}

function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
}

function formatAmount(amount) {
    return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Check for add-money hash
if (window.location.hash === '#add-money') {
    setTimeout(showAddMoneyModal, 500);
}

document.addEventListener('DOMContentLoaded', init);
