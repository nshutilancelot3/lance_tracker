/**
 * Storage Controller
 * Handles all LocalStorage interactions for transactions.
 */
const Storage = (() => {
    const STORAGE_KEY = 'finance_tracker_transactions';

    // Public methods
    return {
        getTransactions: () => {
            const transactions = localStorage.getItem(STORAGE_KEY);
            return transactions ? JSON.parse(transactions) : [];
        },

        saveTransaction: (transaction) => {
            const transactions = Storage.getTransactions();
            transactions.push(transaction);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        },

        updateTransaction: (id, updatedData) => {
            let transactions = Storage.getTransactions();
            transactions = transactions.map(t => {
                if (t.id === id) {
                    return { ...t, ...updatedData };
                }
                return t;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        },

        deleteTransaction: (id) => {
            let transactions = Storage.getTransactions();
            transactions = transactions.filter(t => t.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        },

        // Helper to clear all data (useful for testing)
        clearAll: () => {
            localStorage.removeItem(STORAGE_KEY);
        },

        // Export data as JSON string
        exportData: () => {
            const transactions = Storage.getTransactions();
            const data = {
                transactions: transactions,
                exportedAt: new Date().toISOString(),
                version: '1.0'
            };
            return JSON.stringify(data, null, 2);
        },

        // Import data from JSON object
        importData: (jsonData) => {
            try {
                if (!jsonData.transactions || !Array.isArray(jsonData.transactions)) {
                    throw new Error('Invalid data format: Missing transactions array.');
                }
                
                // Merge strategy: Overwrite local storage with imported data
                // To keep existing and add new, we'd need ID checks, but simple overwrite is safer for "Restore"
                // Let's implement a merge that avoids duplicates by ID
                const current = Storage.getTransactions();
                const imported = jsonData.transactions;
                
                const merged = [...current];
                const currentIds = new Set(current.map(t => t.id));
                
                imported.forEach(t => {
                    if (!currentIds.has(t.id)) {
                        merged.push(t);
                    }
                });

                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                return { success: true, count: merged.length };
            } catch (e) {
                return { success: false, error: e.message };
            }
        }
    };
})();
