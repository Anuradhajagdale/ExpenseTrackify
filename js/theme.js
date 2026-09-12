/* ==========================================
   Theme Manager
========================================== */

function loadTheme(){

    const theme=

    localStorage.getItem("theme") ||

    "dark";

    document.body.classList.remove(

        "dark-theme",

        "light-theme"

    );

    document.body.classList.add(

        theme+"-theme"

    );

}

loadTheme();