/**
 * Storage Controller
 * Handles all LocalStorage interactions for transactions.
 */
const Storage = (() => {
    const STORAGE_KEY = 'finance_tracker_transactions';

    // Public methods
    return {
        getTransactions: () => {
            const data = localStorage.getItem(STORAGE_KEY);
            const transactions = data ? JSON.parse(data) : [];
            
            // Data Healing: Ensure every record has a unique ID
            let hasChanges = false;
            const updated = transactions.map((t, index) => {
                if (!t.id) {
                    t.id = 'txn_healed_' + Date.now() + '_' + index;
                    hasChanges = true;
                }
                return t;
            });

            if (hasChanges) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }

            return updated;
        },

        saveTransaction: (transaction) => {
            const transactions = Storage.getTransactions();
            const now = new Date().toISOString();
            const newRecord = {
                ...transaction,
                createdAt: now,
                updatedAt: now
            };
            transactions.push(newRecord);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        },

        updateTransaction: (id, updatedData) => {
            let transactions = Storage.getTransactions();
            const now = new Date().toISOString();
            transactions = transactions.map(t => {
                if (t.id === id) {
                    return { ...t, ...updatedData, updatedAt: now };
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
                if (!jsonData || !jsonData.transactions || !Array.isArray(jsonData.transactions)) {
                    throw new Error('Invalid data format: Missing transactions array.');
                }
                
                // Essential structure validation for each imported item
                const isValid = jsonData.transactions.every(t => 
                    t.id && t.description && t.amount && t.category && t.date
                );

                if (!isValid) {
                    throw new Error('Some records are missing required fields (id, description, amount, etc.).');
                }
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
