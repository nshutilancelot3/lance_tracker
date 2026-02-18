/**
 * Records Controller
 * Handles displaying and managing transactions.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('records-table-body');
    const searchInput = document.getElementById('search');
    const sortSelect = document.querySelector('.form-select');

    // Modal Elements
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    let transactionToDeleteId = null;

    // strict regex validation patterns (matching add.js)
    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    const renderRecords = () => {
        const transactions = Storage.getTransactions();
        let filteredTransactions = transactions;

        // Apply Search
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredTransactions = filteredTransactions.filter(t =>
                t.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply Sort
        const sortValue = sortSelect.value;
        filteredTransactions.sort((a, b) => {
            if (sortValue === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (sortValue === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (sortValue === 'amount-desc') return parseFloat(b.amount) - parseFloat(a.amount);
            if (sortValue === 'amount-asc') return parseFloat(a.amount) - parseFloat(b.amount);
            return 0;
        });

        tableBody.innerHTML = '';

        if (filteredTransactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No records found.</td></tr>';
            return;
        }

        filteredTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.dataset.id = transaction.id;
            row.innerHTML = `
                <td data-label="Date">${transaction.date}</td>
                <td data-label="Description">${transaction.description}</td>
                <td data-label="Category"><span class="badge badge-category">${transaction.category}</span></td>
                <td data-label="Amount">$${transaction.amount}</td>
                <td data-label="Actions">
                    <button class="btn-icon edit-btn" aria-label="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" style="color: var(--color-danger);" aria-label="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Re-attach event listeners
        attachActionListeners();
    };

    const attachActionListeners = () => {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;

                // Show Modal
                transactionToDeleteId = id;
                deleteModal.classList.add('active');
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                enableEditMode(row);
            });
        });
    };

    // Modal Event Listeners
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (transactionToDeleteId) {
                Storage.deleteTransaction(transactionToDeleteId);
                renderRecords();
                deleteModal.classList.remove('active');
                transactionToDeleteId = null;
            }
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.classList.remove('active');
            transactionToDeleteId = null;
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('active');
            transactionToDeleteId = null;
        }
    });

    const enableEditMode = (row) => {
        const id = row.dataset.id;
        const transactions = Storage.getTransactions();
        const transaction = transactions.find(t => t.id === id);

        if (!transaction) return;

        row.innerHTML = `
            <td data-label="Date">
                <input type="date" class="form-input edit-date" value="${transaction.date}" required>
            </td>
            <td data-label="Description">
                <input type="text" class="form-input edit-desc" value="${transaction.description}" required>
            </td>
            <td data-label="Category">
                 <select class="form-select edit-category" required>
                    <option value="" disabled>Select</option>
                    <option value="Food" ${transaction.category === 'Food' ? 'selected' : ''}>Food</option>
                    <option value="Books" ${transaction.category === 'Books' ? 'selected' : ''}>Books</option>
                    <option value="Transport" ${transaction.category === 'Transport' ? 'selected' : ''}>Transport</option>
                    <option value="Entertainment" ${transaction.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                    <option value="Fees" ${transaction.category === 'Fees' ? 'selected' : ''}>Fees</option>
                    <option value="Other" ${transaction.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </td>
            <td data-label="Amount">
                <input type="number" class="form-input edit-amount" value="${transaction.amount}" step="0.01" min="0" required>
            </td>
            <td data-label="Actions">
                <button class="btn-icon save-btn" style="color: var(--color-success);" aria-label="Save">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </button>
                <button class="btn-icon cancel-btn" style="color: var(--color-danger);" aria-label="Cancel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </td>
        `;

        const saveBtn = row.querySelector('.save-btn');
        const cancelBtn = row.querySelector('.cancel-btn');

        saveBtn.addEventListener('click', () => saveEdit(row, id));
        cancelBtn.addEventListener('click', () => renderRecords());
    };

    const saveEdit = (row, id) => {
        const dateInput = row.querySelector('.edit-date');
        const descInput = row.querySelector('.edit-desc');
        const catInput = row.querySelector('.edit-category');
        const amountInput = row.querySelector('.edit-amount');

        // Validate
        const isDescValid = descriptionRegex.test(descInput.value);
        const isAmountValid = amountRegex.test(amountInput.value);
        const isCatValid = categoryRegex.test(catInput.value);
        const isDateValid = dateInput.value !== ''; // Simple check

        if (!isDescValid) { alert('Invalid Description'); return; }
        if (!isAmountValid) { alert('Invalid Amount'); return; }
        if (!isCatValid) { alert('Invalid Category'); return; }
        if (!isDateValid) { alert('Invalid Date'); return; }

        const updatedTransaction = {
            date: dateInput.value,
            description: descInput.value,
            category: catInput.value,
            amount: parseFloat(amountInput.value).toFixed(2)
        };

        Storage.updateTransaction(id, updatedTransaction);
        renderRecords();
    };

    // Initial Render
    renderRecords();

    // Listeners for filters
    searchInput.addEventListener('input', renderRecords);
    sortSelect.addEventListener('change', renderRecords);
});
