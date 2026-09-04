/**
 * Dashboard Handler
 */

let userData = null;
let walletData = null;
let balanceHidden = false;

// Currency symbols
const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ'
};

// Initialize dashboard
async function initDashboard() {
    try {
        // Load user data
        await loadUserData();
        
        // Load wallet data
        await loadWalletData();
        
        // Load recent transactions
        await loadRecentTransactions();
        
        // Load notifications
        await loadNotifications();
        
    } catch (error) {
        console.error('Dashboard init error:', error);
        window.toast?.error('Failed to load dashboard data');
    }
}

// Load user data
async function loadUserData() {
    try {
        // Try from localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            userData = JSON.parse(storedUser);
            updateUserDisplay();
        }
        
        // Fetch fresh data
        const response = await api.getProfile();
        if (response.success) {
            userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            updateUserDisplay();
        }
    } catch (error) {
        console.error('Load user error:', error);
    }
}

// Load wallet data
async function loadWalletData() {
    try {
        const response = await api.getWallet();
        if (response.success) {
            walletData = response.data;
            updateWalletDisplay();
        }
    } catch (error) {
        console.error('Load wallet error:', error);
        window.toast?.error('Failed to load wallet data');
    }
}

// Update user display
function updateUserDisplay() {
    if (!userData) return;
    
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = userData.fullName || 'User';
    }
    
    // Set user avatar initials
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl && userData.fullName) {
        const initials = userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2);
        avatarEl.textContent = initials;
    }
}

// Update wallet display
function updateWalletDisplay() {
    if (!walletData) return;
    
    const currency = userData?.preferredCurrency || 'INR';
    const balance = walletData.balances?.[currency] || 0;
    
    // Update balance
    const balanceValueEl = document.getElementById('balanceValue');
    const currencySymbolEl = document.getElementById('currencySymbol');
    const walletIdEl = document.getElementById('walletId');
    
    if (balanceValueEl) {
        balanceValueEl.textContent = balanceHidden ? '****' : formatAmount(balance);
    }
    
    if (currencySymbolEl) {
        currencySymbolEl.textContent = currencySymbols[currency] || currency;
    }
    
    if (walletIdEl) {
        walletIdEl.textContent = walletData.walletId || '-';
    }
    
    // Update preferred currency display
    const preferredCurrencyEl = document.getElementById('preferredCurrency');
    if (preferredCurrencyEl) {
        preferredCurrencyEl.textContent = currency;
    }
    
    // Update stats
    updateStatsDisplay();
}

// Update stats display
function updateStatsDisplay() {
    if (!walletData) return;
    
    const currency = userData?.preferredCurrency || 'INR';
    const symbol = currencySymbols[currency] || currency;
    
    const totalAddedEl = document.getElementById('totalAdded');
    const totalSentEl = document.getElementById('totalSent');
    const totalReceivedEl = document.getElementById('totalReceived');
    
    if (totalAddedEl) {
        totalAddedEl.textContent = `${symbol}${formatAmount(walletData.totalMoneyAdded || 0)}`;
    }
    
    if (totalSentEl) {
        totalSentEl.textContent = `${symbol}${formatAmount(walletData.totalMoneySent || 0)}`;
    }
    
    if (totalReceivedEl) {
        totalReceivedEl.textContent = `${symbol}${formatAmount(walletData.totalMoneyReceived || 0)}`;
    }
}

// Load recent transactions
async function loadRecentTransactions() {
    try {
        const response = await api.getTransactions({ page: 1, limit: 5 });
        
        if (response.success) {
            displayRecentTransactions(response.data.transactions);
            
            const countEl = document.getElementById('transactionCount');
            if (countEl) {
                countEl.textContent = response.data.pagination.total;
            }
        }
    } catch (error) {
        console.error('Load transactions error:', error);
        const listEl = document.getElementById('recentTransactions');
        if (listEl) {
            listEl.innerHTML = '<p class="empty-state">Failed to load transactions</p>';
        }
    }
}

// Display recent transactions
function displayRecentTransactions(transactions) {
    const listEl = document.getElementById('recentTransactions');
    if (!listEl) return;
    
    if (!transactions || transactions.length === 0) {
        listEl.innerHTML = '<p class="empty-state">No transactions yet</p>';
        return;
    }
    
    const html = transactions.map(tx => `
        <div class="transaction-item" onclick="window.location.href='transaction-details.html?id=${tx.transactionId}'">
            <div class="transaction-icon ${tx.type.toLowerCase()}">${getTransactionIcon(tx.type)}</div>
            <div class="transaction-info">
                <h4>${tx.description || tx.type.replace('_', ' ')}</h4>
                <p class="transaction-date">${formatDate(tx.createdAt)}</p>
            </div>
            <div class="transaction-amount ${getAmountClass(tx.type)}">
                ${getAmountSign(tx.type)}${currencySymbols[tx.currency] || tx.currency}${formatAmount(tx.amount)}
            </div>
            <div class="transaction-status ${tx.status.toLowerCase()}">${tx.status}</div>
        </div>
    `).join('');
    
    listEl.innerHTML = html;
}

// Get transaction icon
function getTransactionIcon(type) {
    const icons = {
        ADD_MONEY: '➕',
        WITHDRAW: '➖',
        SEND: '📤',
        RECEIVE: '📥',
        BILL_PAYMENT: '🧾',
        QR_PAYMENT: '📱',
        CURRENCY_CONVERSION: '💱',
        REQUEST: '📥'
    };
    return icons[type] || '💳';
}

// Get amount class
function getAmountClass(type) {
    if (['ADD_MONEY', 'RECEIVE'].includes(type)) return 'positive';
    if (['SEND', 'WITHDRAW', 'BILL_PAYMENT', 'QR_PAYMENT'].includes(type)) return 'negative';
    return '';
}

// Get amount sign
function getAmountSign(type) {
    if (['ADD_MONEY', 'RECEIVE'].includes(type)) return '+';
    if (['SEND', 'WITHDRAW', 'BILL_PAYMENT', 'QR_PAYMENT'].includes(type)) return '-';
    return '';
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await api.getUnreadCount();
        
        if (response.success) {
            const badge = document.getElementById('notificationBadge');
            if (badge) {
                const count = response.data.unreadCount;
                badge.textContent = count;
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        }
    } catch (error) {
        console.error('Load notifications error:', error);
    }
}

// Toggle notifications dropdown
async function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    const isActive = dropdown.classList.contains('active');
    
    if (isActive) {
        dropdown.classList.remove('active');
    } else {
        dropdown.classList.add('active');
        await fetchNotifications();
    }
}

// Fetch notifications
async function fetchNotifications() {
    const listEl = document.getElementById('notificationList');
    if (!listEl) return;
    
    try {
        listEl.innerHTML = '<div style="padding: var(--spacing-lg); text-align: center; color: var(--text-tertiary);"><div class="spinner"></div></div>';
        
        const response = await api.getNotifications({ page: 1, limit: 10 });
        
        if (response.success && response.data.notifications.length > 0) {
            const html = response.data.notifications.map(notif => `
                <div class="notification-item ${notif.isRead ? '' : 'unread'}" 
                     onclick="markNotificationRead('${notif._id}')">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span style="font-size: var(--font-xs); color: var(--text-tertiary);">${formatDate(notif.createdAt)}</span>
                </div>
            `).join('');
            listEl.innerHTML = html;
        } else {
            listEl.innerHTML = '<div class="notification-empty"><div style="font-size: 3rem; opacity: 0.5;">🔔</div><p>No notifications</p></div>';
        }
    } catch (error) {
        listEl.innerHTML = '<div class="notification-empty" style="color: var(--danger);"><p>Failed to load notifications</p></div>';
    }
}

// Mark notification as read
async function markNotificationRead(notificationId) {
    try {
        await api.markNotificationAsRead(notificationId);
        await loadNotifications();
        await fetchNotifications();
    } catch (error) {
        console.error('Mark notification error:', error);
    }
}

// Mark all as read
async function markAllAsRead() {
    try {
        await api.markAllNotificationsAsRead();
        await loadNotifications();
        await fetchNotifications();
        window.toast?.success('All notifications marked as read');
    } catch (error) {
        window.toast?.error('Failed to mark notifications as read');
    }
}

// Toggle balance visibility
function toggleBalance() {
    balanceHidden = !balanceHidden;
    updateWalletDisplay();
    
    const toggleBtn = document.getElementById('balanceToggle');
    if (toggleBtn) {
        toggleBtn.textContent = balanceHidden ? '🔒' : '👁️';
        toggleBtn.title = balanceHidden ? 'Show balance' : 'Hide balance';
    }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Format amount
function formatAmount(amount) {
    return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    
    // Less than 1 hour
    if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
}

// Close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificationDropdown');
    const notifBell = e.target.closest('.notification-bell');
    
    if (dropdown && dropdown.classList.contains('active') && !dropdown.contains(e.target) && !notifBell) {
        dropdown.classList.remove('active');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
