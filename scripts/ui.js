/**
 * UI Controller
 * Handles navigation switching and basic UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    // Handle Link Clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target section id
            const targetId = link.getAttribute('href').substring(1);
            
            // Update Active Link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update Active Section
            sections.forEach(section => {
                if(section.id === targetId) {
                    section.classList.remove('hidden-section');
                    section.classList.add('active-section');
                } else {
                    section.classList.add('hidden-section');
                    section.classList.remove('active-section');
                }
            });

            // Close mobile menu if open
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Handle Mobile Menu Toggle
    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('open');
        });
    }
}
