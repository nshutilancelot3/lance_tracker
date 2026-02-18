```javascript
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
}
