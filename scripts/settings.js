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
    const exportBtn = document.querySelector('button span:contains("Export JSON")')?.closest('button') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Export JSON'));
    const importBtn = document.querySelector('button span:contains("Import JSON")')?.closest('button') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Import JSON'));
    const clearBtn = document.querySelector('button span:contains("Clear All Data")')?.closest('button') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Clear All Data'));
    
    // Create hidden file input for import
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = Storage.exportData();
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance_data_${new Date().toISOString().slice(0, 10)}.json`;
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
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                Storage.clearAll();
                 if (typeof UI !== 'undefined' && UI.showNotification) {
                     UI.showNotification('All data cleared.');
                 }
                setTimeout(() => location.reload(), 1000);
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
