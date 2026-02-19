/**
 * UI Controller
 * Handles navigation switching and basic UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation logic removed for Multi-Page Application refactor
    // Mobile menu logic to be verified/retained if separate

    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');


    // Handle Mobile Menu Toggle
    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('open');
        });
    }
});

/**
 * UI Utilities
 */
const UI = (() => {
    return {
        /**
         * Shows a toast notification at the top right of the screen
         * @param {string} message - Message to display
         * @param {string} type - Notification type (unused for now but good for future extension)
         */
        showNotification: (message, type = 'success') => {
            const notification = document.createElement('div');
            notification.className = `toast-notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => notification.classList.add('active'), 10);
            
            // Remove after delay
            setTimeout(() => {
                notification.classList.remove('active');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };
})();

