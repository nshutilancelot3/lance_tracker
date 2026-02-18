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
        }
    };
})();
