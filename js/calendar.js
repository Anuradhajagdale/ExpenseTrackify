/* ==========================================
   ExpenseTrackify Calendar
========================================== */

const currentDate = new Date();

let currentMonth = currentDate.getMonth();

let currentYear = currentDate.getFullYear();

/* ==========================================
   Month Names
========================================== */

const monthNames = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];

/* ==========================================
   Render Calendar
========================================== */
function renderCalendar() {

    const calendar =
        document.getElementById("calendarGrid");

    const monthYear =
        document.getElementById("monthYear");

    calendar.innerHTML = "";

    monthYear.textContent =
        monthNames[currentMonth] + " " + currentYear;

    const firstDay =
        new Date(currentYear,currentMonth,1).getDay();

    const totalDays =
        new Date(currentYear,currentMonth+1,0).getDate();
// Day Click


    // Empty Boxes

    for(let i=0;i<firstDay;i++){

        const blank=document.createElement("div");

        calendar.appendChild(blank);

    }

    // Days

    for (let day = 1; day <= totalDays; day++) {

    const box = document.createElement("div");
    box.addEventListener("click", () => {
        showDayTransactions(dateString);
    });
    
    box.className = "day";

    box.innerHTML = day;

        // Today Highlight

        if(

            day===currentDate.getDate() &&

            currentMonth===currentDate.getMonth() &&

            currentYear===currentDate.getFullYear()

        ){

            box.classList.add("today");

        }

        // Transaction Dot

        const transactions=
            JSON.parse(localStorage.getItem("transactions"))||[];

        const dateString=

            currentYear+"-"+

            String(currentMonth+1).padStart(2,"0")+"-"+

            String(day).padStart(2,"0");

        const hasTransaction=

            transactions.some(t=>t.date===dateString);

        if(hasTransaction){

            const dot=document.createElement("div");

            dot.className="dot";

            box.appendChild(dot);

        }

calendar.appendChild(box);


    }

}

/* ==========================================
   Navigation
========================================== */

document.getElementById("prevMonth")

.addEventListener("click",()=>{

    currentMonth--;

    if(currentMonth<0){

        currentMonth=11;

        currentYear--;

    }

    refreshCalendar();

});

document.getElementById("nextMonth")

.addEventListener("click",()=>{

    currentMonth++;

    if(currentMonth>11){

        currentMonth=0;

        currentYear++;

    }

    refreshCalendar();

});

/* ==========================================
   Start
========================================== */

renderCalendar();

/* ==========================================
   Day Popup
========================================== */

function showDayTransactions(date){

    const popup =
        document.getElementById("dayPopup");

    const title =
        document.getElementById("popupDate");

    const summary =
        document.getElementById("popupSummary");

    const list =
        document.getElementById("popupTransactions");

    const transactions = getTransactions();
    const dayData =
        transactions.filter(t => t.date === date);

    title.textContent = date;

    let income = 0;
    let expense = 0;

    list.innerHTML = "";

    if(dayData.length === 0){

        summary.innerHTML = "<p>No Transactions</p>";

    }else{

        dayData.forEach(item=>{

            if(item.type==="Income"){

                income += Number(item.amount);

            }else{

                expense += Number(item.amount);

            }

            list.innerHTML += `

                <div class="transaction-item">

                    <strong>${item.category}</strong><br>

                    ₹${item.amount}<br>

                    ${item.payment}

                </div>

            `;

        });

        summary.innerHTML = `

            <p><strong>Income:</strong> ₹${income}</p>

            <p><strong>Expense:</strong> ₹${expense}</p>

        `;

    }

    popup.style.display = "flex";

}

document
.getElementById("closePopup")
.addEventListener("click",()=>{

    document.getElementById("dayPopup").style.display="none";

});

/* ==========================================
   Monthly Summary
========================================== */

function updateMonthlySummary() {

    const transactions = getTransactions();

    let income = 0;
    let expense = 0;

    console.log("Current Month =", currentMonth);
    console.log("Current Year =", currentYear);
    console.log("Transaction Date =", transactions.map(t => t.date));

    transactions.forEach(item => {

        if (!item.date) return;

        const d = new Date(item.date);

        if (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
        ) {

if ((item.type || "").toLowerCase() === "income") {

    income += Number(item.amount);

} else {

    expense += Number(item.amount);

}

        }

    });

    document.getElementById("monthIncome").textContent =
    getCurrency() + income.toLocaleString();

document.getElementById("monthExpense").textContent =
    getCurrency() + expense.toLocaleString();


    console.log("Income =", income);
    console.log("Expense =", expense);

}

/* ==========================================
   Budget Progress
========================================== */
function updateBudgetProgress() {

    const budget =
        Number(localStorage.getItem("monthlyBudget")) || 50000;

    const transactions = getTransactions();

    let expense = 0;


    console.log("Transactions =", transactions);

    transactions.forEach(item => {

        if ((item.type || "").toLowerCase() !== "expense") return;

        if (!item.date) return;

        const d = new Date(item.date);

        if (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
        ) {
            expense += Number(item.amount);
        }

    });


    let percent = (expense / budget) * 100;

    if (percent > 100) percent = 100;

    document.getElementById("budgetProgress").style.width =
        percent + "%";

    document.getElementById("budgetText").textContent =
        getCurrency() +
        expense.toLocaleString() +
        " / " +
        getCurrency() +
        budget.toLocaleString();

        console.log("Budget Text =", document.getElementById("budgetText").textContent);

}

/* ==========================================
   Auto Refresh
========================================== */

function refreshCalendar() {

    renderCalendar();

    updateMonthlySummary();

    updateBudgetProgress();

}


/* ==========================================
   Start
========================================== */

refreshCalendar();