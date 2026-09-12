/* ==========================================
   ExpenseTrackify Storage Manager
========================================== */

const STORAGE_KEY = "transactions";

/* Get All Transactions */

function getTransactions() {

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    ) || [];

}

/* Save All Transactions */

function saveTransactions(data) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

/* Add Transaction */

function addTransaction(item) {

    const data = getTransactions();

    data.push(item);

    saveTransactions(data);

}

/* Update Transaction */

function updateTransaction(index, item) {

    const data = getTransactions();

    data[index] = item;

    saveTransactions(data);

}

/* Delete Transaction */

function deleteTransaction(index) {

    const data = getTransactions();

    data.splice(index,1);

    saveTransactions(data);

}