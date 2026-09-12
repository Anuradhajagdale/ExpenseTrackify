/* ==========================================
   Validation
========================================== */

function validateTransaction(data){

    if(data.amount<=0){

        showToast("Please Enter Amount");

        return false;

    }

    if(data.category===""){

        showToast("Select Category");

        return false;

    }

    return true;

}