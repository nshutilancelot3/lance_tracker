/**
 * Dashboard Controller
 * Handles calculating stats and rendering charts.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const totalRecordsEl = document.getElementById('total-records');
    const totalAmountEl = document.getElementById('total-amount');
    const topCategoryEl = document.getElementById('top-category');
    const chartCanvas = document.getElementById('trend-chart');

    // Get Data
    const transactions = Storage.getTransactions();

    // --- 1. Calculate Stats ---

    // Total Records
    const totalRecords = transactions.length;
    totalRecordsEl.textContent = totalRecords;

    // Total Amount
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;

    // Top Category
    const categoryCounts = {};
    transactions.forEach(t => {
        const cat = t.category;
        if (cat) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
    });

    let topCategory = '-';
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topCategory = cat;
        }
    }
    topCategoryEl.textContent = topCategory;


    // --- 2. Chart Implementation ---

    // Helper to get last 7 days dates formatted as YYYY-MM-DD
    const getLast7Days = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates.reverse(); // Oldest to newest
    };

    const last7Days = getLast7Days();
    const dailyTotals = last7Days.map(date => {
        // Find transactions for this date
        const dayTransactions = transactions.filter(t => t.date === date);
        // Sum amounts
        return dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    });

    // Format dates for labels (e.g., "Oct 14")
    const labels = last7Days.map(dateStr => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Render Chart
    if (chartCanvas) {
        new Chart(chartCanvas, {
            type: 'bar', // Mixing line and bar effectively
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Spending',
                    data: dailyTotals,
                    backgroundColor: 'rgba(79, 70, 229, 0.6)', // Accent color
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    hoverBackgroundColor: 'rgba(79, 70, 229, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                         callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                         ticks: {
                            callback: function(value, index, values) {
                                return '$' + value;
                            }
                        },
                        grid: {
                             color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
});
