/**
 * Settings Controller
 * Handles application settings including Theme, Currency, and Data Management.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }

    const currencySelect = document.getElementById('currency-select');
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    currencySelect.value = savedCurrency;

    currencySelect.addEventListener('change', (e) => {
        const newCurrency = e.target.value;
        localStorage.setItem('currency', newCurrency);
        window.dispatchEvent(new Event('currencyChanged'));
    });

    // --- Budget Target ---
    const budgetTargetInput = document.getElementById('budget-target');
    const savedTarget = localStorage.getItem('budgetTarget') || '';
    budgetTargetInput.value = savedTarget;

    budgetTargetInput.addEventListener('input', (e) => {
        localStorage.setItem('budgetTarget', e.target.value);
    });

    // --- Data Management ---
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const clearBtn = document.getElementById('clear-btn');
    const fileInput = document.getElementById('import-file');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = Storage.exportData();
            
            // Standard Download Method
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'financial_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (typeof UI !== 'undefined' && UI.showNotification) {
                 UI.showNotification('Data exported successfully!');
            } else {
                 alert('Data exported successfully!');
            }
        });
    }

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);
                const result = Storage.importData(jsonData);
                
                if (result.success) {
                    if (typeof UI !== 'undefined' && UI.showNotification) {
                        UI.showNotification('Data imported successfully!');
                    } else {
                        alert('Data imported successfully!');
                    }
                    setTimeout(() => location.reload(), 1500);
                } else {
                    alert('Import failed: ' + result.error);
                }
            } catch (err) {
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Dynamically create modal to bypass any HTML caching or native browser suppression
            let existingModal = document.getElementById('dynamic-clear-modal');
            if (!existingModal) {
                const modalHtml = `
                    <div id="dynamic-clear-modal" class="modal active" style="z-index: 9999;">
                        <div class="modal-content card" style="background: var(--color-bg-primary); padding: 2rem; border-radius: 8px; max-width: 400px; width: 90%; margin: 20% auto; text-align: center; border: 1px solid var(--color-danger);">
                            <h2 style="color: var(--color-danger); margin-bottom: 1rem;">Clear All Data?</h2>
                            <p style="margin-bottom: 1.5rem;">Are you absolutely sure you want to permanently delete all transactions? This cannot be undone.</p>
                            <div style="display: flex; gap: 1rem; justify-content: center;">
                                <button id="dyn-cancel-btn" class="btn btn-outline">Cancel</button>
                                <button id="dyn-confirm-btn" class="btn btn-danger">Yes, Delete Everything</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                existingModal = document.getElementById('dynamic-clear-modal');

                document.getElementById('dyn-cancel-btn').addEventListener('click', () => {
                    existingModal.remove();
                });

                document.getElementById('dyn-confirm-btn').addEventListener('click', () => {
                    localStorage.removeItem('finance_tracker_transactions');
                    existingModal.remove();
                    
                    if (typeof UI !== 'undefined' && UI.showNotification) {
                         UI.showNotification('All data cleared.');
                    }
                    setTimeout(() => window.location.reload(true), 800);
                });
            } else {
                existingModal.classList.add('active');
            }
        });
    }
});

/**
 * Currency Utilities
 */
const Currency = (() => {
    // Mock Exchange Rates (Base: USD)
    const rates = {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'JPY': 150.12
    };

    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥'
    };

    return {
        format: (amount, currencyCode = null) => {
            const currency = currencyCode || localStorage.getItem('currency') || 'USD';
            const rate = rates[currency] || 1;
            const convertedAmount = (amount * rate).toFixed(2);
            return `${symbols[currency]}${convertedAmount}`;
        },
        convert: (amount) => {
             const currency = localStorage.getItem('currency') || 'USD';
             const rate = rates[currency] || 1;
             return (amount * rate);
        },
        getSymbol: () => {
             const currency = localStorage.getItem('currency') || 'USD';
             return symbols[currency];
        }
    };
})();
