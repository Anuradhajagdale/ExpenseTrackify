/* ==========================================
   Load Theme
========================================== */

const savedTheme = localStorage.getItem("theme") || "dark";

document.body.classList.remove("dark-theme","light-theme");

if(savedTheme === "light"){

    document.body.classList.add("light-theme");

}else{

    document.body.classList.add("dark-theme");

}
/* ==========================================
   ExpenseTrackify App
========================================== */


// Transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Save Transactions
function saveTransactions() {

    try {

        // Keep only last 500 transactions
        if (transactions.length > 500) {
            transactions = transactions.slice(-500);
        }

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );

    } catch (e) {

        console.error(e);

        showToast("Storage Full");

    }

}

// Generate Unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Add Transaction
function addTransaction(data) {

    if (!data.id) {
        data.id = generateId();
    }

    transactions.push(data);

    saveTransactions();

}
// Get All Transactions
function getTransactions() {
    return transactions;
}

// Delete Transaction
function deleteTransaction(id) {

    id = Number(id);

    transactions = transactions.filter(item => Number(item.id) !== id);

    saveTransactions();

}

// Update Transaction
function updateTransaction(id, newData) {

    transactions = transactions.map(item => {

        if (Number(item.id) === Number(id)) {

            return {

                ...item,

                ...newData

            };

        }

        return item;

    });

    saveTransactions();

}

// Total Income
function getIncome() {

    return transactions
        .filter(item => item.type === "Income")
        .reduce((sum, item) => sum + Number(item.amount), 0);

}

// Total Expense
function getExpense() {

    return transactions
        .filter(item => item.type === "Expense")
        .reduce((sum, item) => sum + Number(item.amount), 0);

}

// Balance
function getBalance() {

    return getIncome() - getExpense();

}

/* ==========================================
   Toast
========================================== */

function showToast(message){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.textContent = "✔ " + message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}