/* ==========================================
   ExpenseTrackify Dashboard
========================================== */

function loadDashboard() {

    const transactions = getTransactions();

    const income = getIncome();

    const expense = getExpense();

    const balance = getBalance();

    document.getElementById("totalBalance").innerText =
formatMoney(balance);

document.getElementById("balanceIncome").innerText =
formatMoney(income);

document.getElementById("balanceExpense").innerText =
formatMoney(expense);

document.getElementById("summaryIncome").innerText =
    formatMoney(income);

document.getElementById("summaryExpense").innerText =
    formatMoney(expense);
    
const list = document.getElementById("transactionList");

list.innerHTML = "";

// No Transactions
if (transactions.length === 0) {

    list.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                <i class="fas fa-wallet"></i>
            </div>

            <h4>No Transactions Yet</h4>

            <p>
                Tap the + button below to add your first Income or Expense.
            </p>

        </div>
    `;

    return;
}

transactions.slice().reverse().forEach(item => {

    list.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-left">

                <div class="transaction-icon">
                    <i class="fas fa-wallet"></i>
                </div>

                <div>

                    <div class="transaction-name">
                        ${item.category}
                    </div>

                    <div class="transaction-date">
                        ${item.date}
                    </div>

                </div>

            </div>


<div class="transaction-amount ${item.type === 'Income' ? 'income-text' : 'expense-text'}">

${item.type === "Income" ? "+" : "-"}${formatMoney(Number(item.amount))}

</div>

        </div>

        `;

    });

}




function showNotification(){

showToast("No Notifications");

}

function updateReminderBadge(){

const badge=

document.getElementById("bellBadge");

if(!badge) return;

const reminders=

JSON.parse(

localStorage.getItem("reminders")

)||[];

const pending=

reminders.filter(

r=>!r.completed

).length;

badge.innerText=pending;

badge.style.display=

pending>0?

"flex":"none";

}

updateReminderBadge();

function toggleMenu(){

    document.getElementById("sideMenu").classList.toggle("open");
    document.getElementById("menuOverlay").classList.toggle("show");

}

function closeMenu(){

    document.getElementById("sideMenu").classList.remove("open");
    document.getElementById("menuOverlay").classList.remove("show");

}