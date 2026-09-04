/**
 * Authentication Handler
 */

// Check if API is loaded
if (typeof api === 'undefined') {
    console.error('API module not loaded');
}

// Show/Hide messages
function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showError(message) {
    showMessage('errorMessage', message, 'error');
    hideSuccess();
}

function showSuccess(message) {
    showMessage('successMessage', message, 'success');
    hideError();
}

function hideError() {
    const element = document.getElementById('errorMessage');
    if (element) element.style.display = 'none';
}

function hideSuccess() {
    const element = document.getElementById('successMessage');
    if (element) element.style.display = 'none';
}

// Set loading state
function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Processing...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
        }
    }
}

// ==================== REGISTRATION ====================

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        hideError();
        hideSuccess();

        // Get form data
        const formData = new FormData(registerForm);
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            mobile: formData.get('mobile'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            dateOfBirth: formData.get('dateOfBirth'),
            country: formData.get('country'),
            preferredCurrency: formData.get('preferredCurrency')
        };

        // Validation
        if (!userData.fullName || !userData.email || !userData.mobile || 
            !userData.password || !userData.dateOfBirth || !userData.country) {
            showError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(userData.email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(userData.password)) {
            showError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            return;
        }

        // Password match
        if (userData.password !== userData.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            setLoading('registerBtn', true);
            
            const response = await api.register(userData);
            
            if (response.success) {
                showSuccess(response.message || 'Registration successful! Redirecting to login...');
                registerForm.reset();
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showError(response.message || 'Registration failed');
            }
        } catch (error) {
            showError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading('registerBtn', false);
        }
    });
}

// ==================== LOGIN ====================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        hideError();
        hideSuccess();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email || !password) {
            showError('Please enter email and password');
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }

        try {
            setLoading('loginBtn', true);
            
            const response = await api.login(email, password);
            
            if (response.success) {
                // Store token
                api.setToken(response.data.token);
                
                // Store user data
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('wallet', JSON.stringify(response.data.wallet));
                
                showSuccess('Login successful! Redirecting...');
                
                // Redirect based on role
                setTimeout(() => {
                    if (response.data.user.role === 'ADMIN') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                showError(response.message || 'Login failed');
            }
        } catch (error) {
            showError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading('loginBtn', false);
        }
    });
}

// ==================== LOGOUT ====================

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        api.logout().catch(() => {});
        api.setToken(null);
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// ==================== AUTH CHECK ====================

function checkAuth() {
    if (!api.isAuthenticated()) {
        // Allow access to public pages
        const publicPages = ['index.html', 'login.html', 'register.html', '/', ''];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (!publicPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
}

// Check authentication on protected pages
if (window.location.pathname.includes('dashboard') || 
    window.location.pathname.includes('wallet') ||
    window.location.pathname.includes('admin') ||
    window.location.pathname.includes('profile') ||
    window.location.pathname.includes('transactions')) {
    checkAuth();
}
