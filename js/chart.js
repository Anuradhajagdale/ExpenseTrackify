/* ==========================================
   ExpenseTrackify - Dynamic Expense Chart
========================================== */

let expenseChart = null;

function loadExpenseChart() {

    const canvas = document.getElementById("expenseChart");

    if (!canvas) return;

    // जुना Chart असेल तर Delete
    if (expenseChart) {
        expenseChart.destroy();
    }

    const transactions = getTransactions();

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (transaction.type === "Expense") {

            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }

            categoryTotals[transaction.category] += Number(transaction.amount);

        }

    });

    const labels = Object.keys(categoryTotals);

    const values = Object.values(categoryTotals);

    // जर Expense नसतील
    if (labels.length === 0) {

        labels.push("No Expense");

        values.push(1);

    }

    expenseChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                backgroundColor: [

                    "#14E4B5",
                    "#00C2FF",
                    "#FF4D6D",
                    "#F59E0B",
                    "#8B5CF6",
                    "#EC4899",
                    "#10B981",
                    "#3B82F6",
                    "#F43F5E",
                    "#06B6D4"

                ],

                borderWidth: 0,

                hoverOffset: 10

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: "#ffffff",

                        padding: 15,

                        font: {

                            family: "Poppins",

                            size: 12

                        }

                    }

                }

            }

        }

    });

}

window.addEventListener("load", () => {

loadDashboard();

loadExpenseChart();

});