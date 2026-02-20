/**
 * Add Transaction Controller
 * Handles form submission and validation for new transactions.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    // strict regex validation patterns
    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const duplicateWordRegex = /\b(\w+)\s+\1\b/i; // Advanced: Back-reference to find repeated words

    // UI Elements for error feedback
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const dateInput = document.getElementById('date');
    const liveStatus = document.getElementById('form-status');

    const validateInput = (input, regex, customMsg = null) => {
        const errorMsg = input.nextElementSibling;
        const value = input.value;
        let isValid = regex.test(value);

        // Check for advanced duplicate words in description
        if (isValid && input === descriptionInput && duplicateWordRegex.test(value)) {
            isValid = false;
            if (errorMsg) errorMsg.textContent = 'Repeating words detected (e.g. "Lunch Lunch").';
        } else if (errorMsg && customMsg) {
             errorMsg.textContent = customMsg;
        }

        if (!isValid) {
            input.classList.add('invalid');
            input.setAttribute('aria-invalid', 'true');
            if (errorMsg) errorMsg.style.display = 'block';
            return false;
        } else {
            input.classList.remove('invalid');
            input.setAttribute('aria-invalid', 'false');
            if (errorMsg) errorMsg.style.display = 'none';
            return true;
        }
    };

    // Helper for simple non-empty check (date)
    const validateFilled = (input) => {
        const errorMsg = input.nextElementSibling;
        if (!input.value) {
            input.classList.add('invalid');
            errorMsg.style.display = 'block';
            return false;
        } else {
            input.classList.remove('invalid');
            errorMsg.style.display = 'none';
            return true;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isDescriptionValid = validateInput(descriptionInput, descriptionRegex);
        const isAmountValid = validateInput(amountInput, amountRegex);
        const isCategoryValid = validateInput(categoryInput, categoryRegex);
        const isDateValid = validateInput(dateInput, dateRegex, 'Please enter a valid date (YYYY-MM-DD).');

        if (isDescriptionValid && isAmountValid && isCategoryValid && isDateValid) {
            const newTransaction = {
                id: 'txn_' + Date.now(),
                description: descriptionInput.value,
                amount: parseFloat(amountInput.value).toFixed(2),
                category: categoryInput.value,
                date: dateInput.value
            };

            // Save to LocalStorage
            Storage.saveTransaction(newTransaction);

            // Reset form and give feedback
            form.reset();
            UI.showNotification('Transaction added successfully!');
            // Optional: Redirect to records page
            // window.location.href = 'records.html';
        }
    });

    // Real-time validation (optional but good UX)
    descriptionInput.addEventListener('input', () => validateInput(descriptionInput, descriptionRegex));
    amountInput.addEventListener('input', () => validateInput(amountInput, amountRegex));
    categoryInput.addEventListener('change', () => validateInput(categoryInput, categoryRegex));
    dateInput.addEventListener('change', () => validateFilled(dateInput));
});
