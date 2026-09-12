/* ==========================================
   Utilities
========================================== */

/* Currency */

/* Currency */
function getCurrency(){

    return localStorage.getItem("currency") || "₹";

}

function convertAmount(amount){

    amount = Number(amount);

    const currency = getCurrency();

    if(currency==="₹"){
        return amount;
    }

    if(currency==="$"){
        return amount * exchangeRates.USD;
    }

    if(currency==="€"){
        return amount * exchangeRates.EUR;
    }

    if(currency==="£"){
        return amount * exchangeRates.GBP;
    }

    return amount;

}
/* ============================
   Live Currency Rates
============================ */

let exchangeRates = JSON.parse(
    localStorage.getItem("exchangeRates")
) || {

    INR: 1,
    USD: 0.0116,
    EUR: 0.0091,
    GBP: 0.0078

};

async function updateExchangeRates(){

    const lastUpdate = Number(

        localStorage.getItem("ratesTime") || 0

    );

    const oneDay = 24 * 60 * 60 * 1000;

    if(Date.now() - lastUpdate < oneDay){

        exchangeRates = JSON.parse(

            localStorage.getItem("exchangeRates")

        ) || exchangeRates;

        console.log("Using Cached Rates");

        return;

    }

    try{

        const response = await fetch(

            "https://api.frankfurter.dev/v1/latest?base=INR&symbols=USD,EUR,GBP"

        );

        const data = await response.json();

        exchangeRates={

            INR:1,

            USD:data.rates.USD,

            EUR:data.rates.EUR,

            GBP:data.rates.GBP

        };

        localStorage.setItem(

            "exchangeRates",

            JSON.stringify(exchangeRates)

        );

        localStorage.setItem(

            "ratesTime",

            Date.now()

        );

        console.log("Rates Updated");

    }catch(e){

        exchangeRates = JSON.parse(

            localStorage.getItem("exchangeRates")

        ) || exchangeRates;

        console.log("Offline Rates Used");

    }

}
updateExchangeRates();
/* Format Money */

function formatMoney(amount){

    const currency = getCurrency();

    const converted = convertAmount(amount);

    const digits = currency === "₹" ? 0 : 2;

    return currency +
        converted.toLocaleString("en-IN",{
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        });

}

/* Today's Date */

function today(){

    return new Date()

    .toISOString()

    .split("T")[0];

}

/* Current Time */

function currentTime(){

    return new Date()

    .toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}



function showToast(message){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.innerHTML = "✔ " + message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}