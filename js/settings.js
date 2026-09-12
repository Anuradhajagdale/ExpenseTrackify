/* ==========================================
   ExpenseTrackify Settings
========================================== */

// Theme

const themeSwitch =
document.getElementById("themeSwitch");

if(themeSwitch){

themeSwitch.checked =
localStorage.getItem("theme")==="light";

themeSwitch.addEventListener("change",()=>{

if(themeSwitch.checked){

document.body.classList.remove("dark-theme");

document.body.classList.add("light-theme");

localStorage.setItem("theme","light");

}else{

document.body.classList.remove("light-theme");

document.body.classList.add("dark-theme");

localStorage.setItem("theme","dark");

}

});

}

/* ==========================================
   Load Settings
========================================== */

function loadSettings() {

    const currency =
    localStorage.getItem("currency") || "₹";

    const budget =
        localStorage.getItem("monthlyBudget") || 50000;

    document.getElementById("currency").value = currency;

    document.getElementById("monthlyBudget").value = budget;

}

/* ==========================================
   Save Settings
========================================== */


function saveSettings() {

    const currency = document.getElementById("currency").value;

    const budget = Number(document.getElementById("monthlyBudget").value);

    localStorage.setItem("currency", currency);

    localStorage.setItem("monthlyBudget", budget);

    console.log("Saved Budget =", budget);

    showToast("Settings Saved Successfully");

    setTimeout(() => {
        location.reload();
    }, 1200);

}



/* ==========================================
   Events
========================================== */

document
.getElementById("saveSettings")
.addEventListener("click", saveSettings);

loadSettings();

if(themeSwitch){

    themeSwitch.checked =
    localStorage.getItem("theme")==="light";

}


/* ==========================================
   Restore
========================================== */

document

.getElementById("restoreBtn")

.addEventListener("click",()=>{

    document

    .getElementById("restoreFile")

    .click();

});

document

.getElementById("restoreFile")

.addEventListener("change",(event)=>{

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        const data = JSON.parse(e.target.result);

        localStorage.setItem(

            "transactions",

            JSON.stringify(data.transactions||[])

        );

        localStorage.setItem(

            "currency",

            data.currency||"₹"

        );

        localStorage.setItem(

            "monthlyBudget",

            data.monthlyBudget||50000

        );

        localStorage.setItem(

            "theme",

            data.theme||"dark"

        );



        location.reload();

    };

    reader.readAsText(file);

});

/* ==========================================
   Reset
========================================== */

const modal = document.getElementById("confirmModal");

document.getElementById("resetBtn").addEventListener("click",()=>{

    modal.classList.add("show");

});

document.getElementById("cancelDelete").addEventListener("click",()=>{

    modal.classList.remove("show");

});

document.getElementById("confirmDelete").addEventListener("click",()=>{

    localStorage.clear();

    modal.classList.remove("show");

    showToast("All Data Deleted");

    setTimeout(()=>{

        location.reload();

    },1200);

});
/* ==========================================
   Events
========================================== */

