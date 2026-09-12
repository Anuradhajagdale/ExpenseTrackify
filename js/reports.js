/* ==========================================
   ExpenseTrackify - Reports
========================================== */

// ------------------------------
// Load Transactions
// ------------------------------

function getCurrentTransactions(filter = "all") {

    const transactions = getTransactions();

    if (filter === "all") {
        return transactions;
    }

    const today = new Date();

    return transactions.filter(item => {

        if (!item.date) return false;

        const date = new Date(item.date);

        switch (filter) {

            case "today":
                return date.toDateString() === today.toDateString();

            case "week": {

                const weekAgo = new Date();

                weekAgo.setDate(today.getDate() - 7);

                return date >= weekAgo;
            }

            case "month":

                return (
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );

            case "year":

                return date.getFullYear() === today.getFullYear();

            default:

                return true;

        }

    });

}

// ------------------------------
// Dashboard Totals
// ------------------------------

function updateSummaryCards(data = getTransactions()) {
    let income = 0;
    let expense = 0;

    data.forEach(item => {

        if (item.type === "Income") {
            income += Number(item.amount);
        } else {
            expense += Number(item.amount);
        }

    });

    const balance = income - expense;

    document.getElementById("reportBalance").textContent =
        getCurrency() + balance.toLocaleString();

    document.getElementById("reportIncome").textContent =
        getCurrency() + income.toLocaleString();

    document.getElementById("reportExpense").textContent =
        getCurrency() + expense.toLocaleString();

        document.getElementById("compareIncome").textContent =
    getCurrency() + income.toLocaleString();

document.getElementById("compareExpense").textContent =
    getCurrency() + expense.toLocaleString();

}

// ------------------------------
// Pie Chart
// ------------------------------

function createCategoryPieChart(data = getTransactions()){    const categoryData = {};

data.forEach(item => {
        if (item.type !== "Expense") return;

        if (!categoryData[item.category]) {
            categoryData[item.category] = 0;
        }

        categoryData[item.category] += Number(item.amount);

    });

    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);

if (labels.length === 0) {

    labels.push("No Expense");

    values.push(1);

}
    const ctx = document
        .getElementById("categoryChart")
        .getContext("2d");
if (pieChart) {
    pieChart.destroy();
}

pieChart = new Chart(ctx, {

    type: "doughnut",

    data: {

        labels: labels,

        datasets: [{

            data: values,

            backgroundColor: labels.map(() => {

    const hue = Math.floor(Math.random() * 360);

    return `hsl(${hue}, 75%, 55%)`;

}),

        }]

    },

    options: {

        responsive: true,
animation:{
        duration:1800,
        easing:"easeOutBounce"
    },
        maintainAspectRatio: false,

        cutout: "68%",

        plugins: {

            legend: {

                position: "bottom",

                labels: {

                    color: "#fff",

                    padding: 15,

                    font: {

                        size: 12

                    }

                }

            }

        }

    }

});   // ← हे missing होतं

}      // ← function इथे बंद होते

// ------------------------------
// Initialize
// ------------------------------



// ------------------------------
// Monthly Expense Line Chart
// ------------------------------

function createMonthlyChart(data = getTransactions()) {    const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const monthlyExpense = new Array(12).fill(0);

data.forEach(item => {
        if (item.type !== "Expense") return;

        if (!item.date) return;

        const month = new Date(item.date).getMonth();

        monthlyExpense[month] += Number(item.amount);

    });

    const ctx = document
        .getElementById("monthlyChart")
        .getContext("2d");
if (lineChart) {
    lineChart.destroy();
}

lineChart = new Chart(ctx, {
        type: "line",

        data: {

            labels: months,

            datasets: [{

                label: "Monthly Expense",

                data: monthlyExpense,

                borderColor: "#14E4B5",

                backgroundColor: "rgba(20,228,181,0.15)",

                fill: true,

                tension: 0.35

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ------------------------------
// Income vs Expense Bar Chart
// ------------------------------

function createIncomeExpenseChart(data = getTransactions()) {    let income = 0;
    let expense = 0;

data.forEach(item => {
        if (item.type === "Income") {

            income += Number(item.amount);

        } else {

            expense += Number(item.amount);

        }

    });

    const ctx = document
        .getElementById("incomeExpenseChart")
        .getContext("2d");

        if (barChart) {
    barChart.destroy();
}

barChart = new Chart(ctx,{
        type: "bar",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{

                label: "Amount",

                data: [income, expense]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ------------------------------
// Auto Load Charts
// ------------------------------



// ==========================================
// ExpenseTrackify
// Reports Analytics
// ==========================================

// ------------------------------
// Top Spending Categories
// ------------------------------

function updateTopCategories(data = transactions) {

    const container = document.getElementById("topCategories");

    if (!container) return;

    container.innerHTML = "";

    const totals = {};

    data.forEach(item => {

        if (item.type !== "Expense") return;

        const category = item.category || "Other";

        totals[category] = (totals[category] || 0) + Number(item.amount);

    });

    const categories = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (categories.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <h4>No Expense Data</h4>
                <p>Add some expenses to see analytics.</p>
            </div>
        `;

        return;
    }

    const max = categories[0][1];

    categories.forEach(([name, amount]) => {

        const percent = ((amount / max) * 100).toFixed(0);

        container.innerHTML += `

        <div class="top-category-card">

            <div class="category-row">

                <span>
                    <i class="fas fa-wallet"></i>
                    ${name}
                </span>

                <strong>${formatMoney(amount)}</strong>

            </div>

            <div class="progress">

                <div class="progress-fill"
                     style="width:${percent}%">

                </div>

            </div>

        </div>

        `;

    });

}
// ------------------------------
// Analytics Cards
// ------------------------------

function updateAnalyticsCards(data = transactions) {

    const analytics = document.getElementById("analyticsList");

    if (!analytics) return;

    let income = 0;
    let expense = 0;
    let highestExpense = 0;
    let expenseCount = 0;

    data.forEach(item => {

        if (item.type === "Income") {

            income += Number(item.amount);

        } else {

            expense += Number(item.amount);

            expenseCount++;

            if (Number(item.amount) > highestExpense) {

                highestExpense = Number(item.amount);

            }

        }

    });

    const averageExpense =
        expenseCount ? Math.round(expense / expenseCount) : 0;

    const savingsRate =
        income > 0
            ? (((income - expense) / income) * 100).toFixed(1)
            : 0;

    analytics.innerHTML = `

    <div class="analytics-card">

        <div class="analytics-title">
            <i class="fas fa-chart-line"></i>
            Average Expense
        </div>

        <div class="analytics-value counter"
             data-target="${averageExpense}">
            0
        </div>

    </div>

    <div class="analytics-card">

        <div class="analytics-title">
            <i class="fas fa-arrow-trend-up"></i>
            Highest Expense
        </div>

        <div class="analytics-value counter"
             data-target="${highestExpense}">
            0
        </div>

    </div>

    <div class="analytics-card">

        <div class="analytics-title">
            <i class="fas fa-piggy-bank"></i>
            Savings Rate
        </div>

        <div class="analytics-value">

            ${savingsRate}%

        </div>

    </div>

    <div class="analytics-card">

        <div class="analytics-title">
            <i class="fas fa-receipt"></i>
            Total Transactions
        </div>

        <div class="analytics-value counter"
             data-target="${data.length}">
            0
        </div>

    </div>

    `;

    animateCounters();

}

// ------------------------------
// Filter Buttons
// ------------------------------

function refreshReports(filter = "all", showNotification = true) {
    const filtered = getFilteredTransactions(filter);

    updateSummaryCards(filtered);

    updateTopCategories(filtered);

    updateAnalyticsCards(filtered);

    createCategoryPieChart(filtered);

    createMonthlyChart(filtered);

    createIncomeExpenseChart(filtered);
    
if (showNotification) {
    showToast("Filter Applied");
}
}


// ------------------------------
// Start Reports
// ------------------------------




/* ==========================================
   Helper Functions
========================================== */

function getFilteredTransactions(filter = "all") {

    const transactions = getTransactions();

    const today = new Date();

    return transactions.filter(item => {

        if (!item.date) return false;

        const transactionDate = new Date(item.date);

        switch (filter) {

            case "today":

                return transactionDate.toDateString() === today.toDateString();

            case "week": {

                const weekAgo = new Date();
                weekAgo.setDate(today.getDate() - 7);

                return transactionDate >= weekAgo;
            }

            case "month":

                return transactionDate.getMonth() === today.getMonth() &&
                       transactionDate.getFullYear() === today.getFullYear();

            case "year":

                return transactionDate.getFullYear() === today.getFullYear();

            default:

                return true;

        }

    });

}

/* ==========================================
   Chart Refresh
========================================== */

let pieChart = null;
let lineChart = null;
let barChart = null;


refreshReports("all", false);
/* ==========================================
   Export PDF
========================================== */

document.getElementById("exportPdf").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("ExpenseTrackify Report", 20, 20);

    pdf.setFontSize(12);

    pdf.text(
        "Balance : " +
        document.getElementById("reportBalance").textContent,
        20,
        40
    );

    pdf.text(
        "Income : " +
        document.getElementById("reportIncome").textContent,
        20,
        50
    );

    pdf.text(
        "Expense : " +
        document.getElementById("reportExpense").textContent,
        20,
        60
    );

    pdf.save("ExpenseTrackify_Report.pdf");
    const pdfBlob = pdf.output("blob");

    const reader = new FileReader();

    reader.onloadend = function () {

        const base64 = reader.result.split(",")[1];

        if (typeof Android !== "undefined") {

            Android.downloadFile(
                "ExpenseTrackify_Report.pdf",
                base64
            );

            showToast("PDF Saved");

        } else {

            pdf.save("ExpenseTrackify_Report.pdf");

        }

    };

    reader.readAsDataURL(pdfBlob);


    showToast("PDF Exported Successfully");

});

/* ==========================================
   Export Excel
========================================== */

document.getElementById("exportExcel").addEventListener("click", () => {

    const data = getTransactions().map(item => ({

        Date: item.date,

        Title: item.title,

        Category: item.category,

        Type: item.type,

        Amount: item.amount,

        Payment: item.paymentMethod,

        Note: item.note,

        Receipt: item.receipt ? "Yes" : "No"

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Transactions"
    );

    XLSX.writeFile(
        workbook,
        "ExpenseTrackify_Report.xlsx"
    );

    const wbout = XLSX.write(
        workbook,
        {
            bookType: "xlsx",
            type: "base64"
        }
    );

    if (typeof Android !== "undefined") {

        Android.downloadFile(
            "ExpenseTrackify_Report.xlsx",
            wbout
        );

        showToast("Excel Saved");

    } else {

        XLSX.writeFile(
            workbook,
            "ExpenseTrackify_Report.xlsx"
        );

    }

    showToast("Excel Exported Successfully");

});

function animateCounters() {

    document.querySelectorAll(".counter").forEach(counter => {

        const target = Number(counter.dataset.target);

        let value = 0;

        const step = Math.max(1, Math.ceil(target / 40));

        const timer = setInterval(() => {

            value += step;

            if (value >= target) {

                value = target;

                clearInterval(timer);

            }

            counter.textContent =
                formatMoney(value);

        }, 20);
    });


}

function setActiveFilter(button){

    document
    .querySelectorAll(".filter-btn")
    .forEach(btn=>btn.classList.remove("active"));

    button.classList.add("active");

}

function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}