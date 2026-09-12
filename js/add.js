/* ==========================================
   ExpenseTrackify
   Add Transaction
========================================== */
console.log("ADD_JS_VERSION_250725_2300");
let receiptImages = [];



const galleryInput =
document.getElementById("galleryInput");

const cameraInput =
document.getElementById("cameraInput");

function loadImages(files) {

    Array.from(files).forEach(file => {

        if (!file.type.startsWith("image/")) return;

        const uri = URL.createObjectURL(file);

        receiptImages.push(uri);

    });

    renderReceiptPreview();

    }



if(galleryInput){

galleryInput?.addEventListener("change",function(){

    loadImages(this.files);

    this.value="";

});
}

if (cameraInput) {

    cameraInput.addEventListener("click", function () {

        this.setAttribute("capture", "environment");

    });

    cameraInput.addEventListener("change", function () {

        loadImages(this.files);

        this.value = "";

    });

}

const editId =
localStorage.getItem("editTransaction");

if(editId){

    const item =
    getTransactions().find(

    t=>t.id==editId

    );

    if(item){

        document.getElementById("type").value=item.type;

        document.getElementById("amount").value=item.amount;

        document.getElementById("category").value=item.category;

        document.getElementById("date").value=item.date;

        document.getElementById("time").value=item.time;

        document.getElementById("payment").value=item.payment;

        document.getElementById("note").value=item.note;

        document.getElementById("tags").value=item.tags;

receiptImages = item.receipt || [];

renderReceiptPreview();
    }

}
function saveExpense() {




    const type = document.getElementById("type").value;

    const amount = document.getElementById("amount").value.trim();

    const category = document.getElementById("category").value;

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const payment = document.getElementById("payment").value;

    const note = document.getElementById("note").value.trim();

    const tags = document.getElementById("tags").value.trim(); 
    if (amount === "") {
        showToast("Please Enter Amount");
        return;
    }

    if (category === "") {
        showToast("Please Select Category");
        return;
    }

  console.log("Before Save:", receiptImages);
  console.log("Android =", typeof Android);
  console.log("receiptImages =", receiptImages);


const transaction = {

    id: editId ? Number(editId) : Date.now(),

    type,
    amount: Number(amount),
    category,
    date,
    time,
    payment,
    note,
    tags,
    favorite: false,

    receipt: []

};

if (typeof Android !== "undefined" &&
    typeof Android.saveReceipt === "function") {

receiptImages.forEach(uri => {

    const path = Android.saveReceipt(uri);

    if (path && path.trim() !== "") {
        transaction.receipt.push(path);
    } else {
        transaction.receipt.push(uri);
    }

});

} else {

    transaction.receipt = [...receiptImages];

}

transaction.receiptCount = transaction.receipt.length;

console.log("Saved Receipt =", transaction.receipt);
console.log(transaction);


if(editId){

    updateTransaction(editId,transaction);

    localStorage.removeItem("editTransaction");

}else{

    addTransaction(transaction);

    console.log(getTransactions());

}


showToast(type + " Saved Successfully");

 setTimeout(()=>{

     window.location.href="index.html";

 },1800);
}
/* ==========================
   Transaction Type Toggle
========================== */

const expenseBtn = document.getElementById("expenseBtn");
const incomeBtn = document.getElementById("incomeBtn");
const typeInput = document.getElementById("type");

expenseBtn.addEventListener("click", () => {

    typeInput.value = "Expense";

    expenseBtn.classList.add("active");

    incomeBtn.classList.remove("active");

});

incomeBtn.addEventListener("click", () => {

    typeInput.value = "Income";

    incomeBtn.classList.add("active");

    expenseBtn.classList.remove("active");

});

function renderReceiptPreview(){

    const preview = document.getElementById("receiptPreview");

    preview.innerHTML = "";

    receiptImages.forEach((file, index) => {

        let img = file;

        if (
            file.startsWith("/") &&
            typeof Android !== "undefined" &&
            typeof Android.getReceiptUri === "function"
        ) {
            img = Android.getReceiptUri(file);
        }

        preview.innerHTML += `
        <div class="receipt-item">
            <img
                src="${img}"
                loading="lazy"
onclick="window.open('${img}','_blank')">

            <button onclick="removeReceipt(${index})">
                ✖
            </button>
        </div>
        `;

    });


}

function removeReceipt(index){

    receiptImages.splice(index,1);

    renderReceiptPreview();

}

function showToast(message){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

    }