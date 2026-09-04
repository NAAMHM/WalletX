/**
 * WalletX API Module
 * Centralized API communication
 */

const API_BASE_URL = 'https://walletx-backend.onrender.com/api';

class API {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Set authorization token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    // Get authorization headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            ...options,
            headers: this.getHeaders(options.auth !== false)
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle unauthorized
                if (response.status === 401) {
                    this.handleUnauthorized();
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Handle unauthorized access
    handleUnauthorized() {
        this.setToken(null);
        localStorage.clear();
        if (!window.location.pathname.includes('login') && 
            !window.location.pathname.includes('register') &&
            !window.location.pathname.includes('index')) {
            window.location.href = '/login.html';
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // ==================== AUTH ENDPOINTS ====================

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            auth: false
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            auth: false
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    async getMe() {
        return this.request('/auth/me');
    }

    // ==================== WALLET ENDPOINTS ====================

    async getWallet() {
        return this.request('/wallet');
    }

    async addMoney(amount, currency) {
        return this.request('/wallet/add-money', {
            method: 'POST',
            body: JSON.stringify({ amount, currency })
        });
    }

    async withdrawMoney(amount, currency) {
        return this.request('/wallet/withdraw', {
            method: 'POST',
            body: JSON.stringify({ amount, currency })
        });
    }

    async searchWallet(identifier) {
        return this.request(`/wallet/search/${identifier}`);
    }

    async getBalance(currency) {
        return this.request(`/wallet/balance/${currency}`);
    }

    // ==================== TRANSFER ENDPOINTS ====================

    async sendMoney(receiverIdentifier, amount, currency, note = '') {
        return this.request('/transfers/send', {
            method: 'POST',
            body: JSON.stringify({ receiverIdentifier, amount, currency, note })
        });
    }

    async requestMoney(receiverIdentifier, amount, currency, note = '') {
        return this.request('/transfers/request', {
            method: 'POST',
            body: JSON.stringify({ receiverIdentifier, amount, currency, note })
        });
    }

    async getMoneyRequests(type = null, status = null) {
        let url = '/transfers/requests';
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (status) params.append('status', status);
        if (params.toString()) url += `?${params.toString()}`;
        return this.request(url);
    }

    async getMoneyRequestDetails(requestId) {
        return this.request(`/transfers/requests/${requestId}`);
    }

    async acceptMoneyRequest(requestId) {
        return this.request(`/transfers/requests/${requestId}/accept`, {
            method: 'PUT'
        });
    }

    async rejectMoneyRequest(requestId) {
        return this.request(`/transfers/requests/${requestId}/reject`, {
            method: 'PUT'
        });
    }

    async cancelMoneyRequest(requestId) {
        return this.request(`/transfers/requests/${requestId}/cancel`, {
            method: 'PUT'
        });
    }

    // ==================== QR ENDPOINTS ====================

    async generateQRCode(amount = null, currency = null, note = '') {
        return this.request('/qr/generate', {
            method: 'POST',
            body: JSON.stringify({ amount, currency, note })
        });
    }

    async scanQRCode(qrData) {
        return this.request('/qr/scan', {
            method: 'POST',
            body: JSON.stringify({ qrData })
        });
    }

    async payViaQR(qrData, amount, currency, note = '') {
        return this.request('/qr/pay', {
            method: 'POST',
            body: JSON.stringify({ qrData, amount, currency, note })
        });
    }

    // ==================== BILL ENDPOINTS ====================

    async getBillProviders(category = null) {
        let url = '/bills/providers';
        if (category) url += `?category=${category}`;
        return this.request(url);
    }

    async payBill(billData) {
        return this.request('/bills/pay', {
            method: 'POST',
            body: JSON.stringify(billData)
        });
    }

    async getBillHistory(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/bills/history?${params.toString()}`);
    }

    async getBillDetails(paymentId) {
        return this.request(`/bills/${paymentId}`);
    }

    // ==================== TRANSACTION ENDPOINTS ====================

    async getTransactions(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/transactions?${params.toString()}`);
    }

    async getTransactionDetails(transactionId) {
        return this.request(`/transactions/${transactionId}`);
    }

    async getTransactionStats(period = 'month') {
        return this.request(`/transactions/stats/summary?period=${period}`);
    }

    // ==================== NOTIFICATION ENDPOINTS ====================

    async getNotifications(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/notifications?${params.toString()}`);
    }

    async getUnreadCount() {
        return this.request('/notifications/unread/count');
    }

    async markNotificationAsRead(notificationId) {
        return this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    }

    async markAllNotificationsAsRead() {
        return this.request('/notifications/read-all', {
            method: 'PUT'
        });
    }

    async deleteNotification(notificationId) {
        return this.request(`/notifications/${notificationId}`, {
            method: 'DELETE'
        });
    }

    // ==================== CURRENCY ENDPOINTS ====================

    async getCurrencies() {
        return this.request('/currency');
    }

    async convertCurrency(fromCurrency, toCurrency, amount) {
        return this.request('/currency/convert', {
            method: 'POST',
            body: JSON.stringify({ fromCurrency, toCurrency, amount })
        });
    }

    async calculateConversion(fromCurrency, toCurrency, amount) {
        return this.request('/currency/calculate', {
            method: 'POST',
            body: JSON.stringify({ fromCurrency, toCurrency, amount })
        });
    }

    // ==================== USER ENDPOINTS ====================

    async getProfile() {
        return this.request('/users/me');
    }

    async updateProfile(profileData) {
        return this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(currentPassword, newPassword, confirmPassword) {
        return this.request('/users/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });
    }

    async getLoginHistory() {
        return this.request('/users/login-history');
    }

    // ==================== ADMIN ENDPOINTS ====================

    async getAdminStatistics() {
        return this.request('/admin/statistics');
    }

    async getAllUsers(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/admin/users?${params.toString()}`);
    }

    async getUserDetails(userId) {
        return this.request(`/admin/users/${userId}`);
    }

    async blockUser(userId) {
        return this.request(`/admin/users/${userId}/block`, {
            method: 'PUT'
        });
    }

    async unblockUser(userId) {
        return this.request(`/admin/users/${userId}/unblock`, {
            method: 'PUT'
        });
    }

    async getAllTransactions(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/admin/transactions?${params.toString()}`);
    }
}

// Create global API instance
const api = new API();
