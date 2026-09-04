/**
 * WalletX Theme Management
 * Handles Light/Dark Mode Toggle with LocalStorage Persistence
 */

class ThemeManager {
    constructor() {
        this.THEME_KEY = 'walletx-theme';
        this.init();
    }

    init() {
        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(theme, false);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.THEME_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });

        // Setup toggle button listeners
        this.setupToggleListeners();
    }

    setTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (save) {
            localStorage.setItem(this.THEME_KEY, theme);
        }

        // Update toggle button states
        this.updateToggleButtons(theme);

        // Dispatch theme change event for components that need to react
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    setupToggleListeners() {
        // Setup click handlers for all theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-theme-toggle]')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    updateToggleButtons(theme) {
        // Update all theme toggle buttons to show correct icon/state
        const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
        toggleButtons.forEach(button => {
            const icon = button.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
            button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            button.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        });
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Expose globally for manual control if needed
window.themeManager = themeManager;
