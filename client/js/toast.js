/**
 * WalletX Toast Notification System
 * Premium toast notifications with animations
 */

class Toast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 500px;
            padding: 16px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-left: 4px solid var(--${type === 'info' ? 'primary' : type});
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            pointer-events: all;
            animation: toastSlideIn 0.3s ease-out;
            transition: all 0.2s;
        `;

        this.container.appendChild(toast);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'toastSlideOut 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Add toast animations to document
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes toastSlideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .toast:hover {
            transform: scale(1.02);
            box-shadow: var(--shadow-xl);
        }

        .toast-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            border-radius: var(--radius-full);
            flex-shrink: 0;
        }

        .toast-success .toast-icon {
            background: var(--success-light);
            color: var(--success-dark);
        }

        .toast-error .toast-icon {
            background: var(--danger-light);
            color: var(--danger-dark);
        }

        .toast-warning .toast-icon {
            background: var(--warning-light);
            color: var(--warning-dark);
        }

        .toast-info .toast-icon {
            background: var(--info-light);
            color: var(--info-dark);
        }

        .toast-message {
            flex: 1;
            font-size: var(--font-sm);
            font-weight: var(--font-medium);
            color: var(--text-primary);
            line-height: 1.5;
        }

        .toast-close {
            background: transparent;
            border: none;
            color: var(--text-tertiary);
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            line-height: 1;
            transition: all 0.2s;
            border-radius: var(--radius);
        }

        .toast-close:hover {
            background: var(--surface-secondary);
            color: var(--text-primary);
        }

        @media (max-width: 640px) {
            #toast-container {
                right: 10px;
                left: 10px;
                top: 10px;
            }

            .toast {
                min-width: auto;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Create global toast instance
window.toast = new Toast();

// Also expose showMessage for backward compatibility
window.showMessage = function(message, type = 'info') {
    toast.show(message, type);
};
