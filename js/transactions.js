/* ==========================================
   ExpenseTrackify - Transactions
========================================== */
let currentImages = [];

let currentImageIndex = 0;

let currentPage = 1;

const perPage = 10;

let filteredTransactions = [...getTransactions()];

function renderTransactions(list = filteredTransactions){

    const container =
    document.getElementById("transactionsContainer");

    if(!container) return;

    container.innerHTML = "";

    const start = (currentPage - 1) * perPage;

    const end = start + perPage;

    const pageData = list.slice(start, end);

    if(list.length===0){

        container.innerHTML=`

        <div class="empty-state">

            <div class="empty-icon">

                <i class="fas fa-wallet"></i>

            </div>

            <h4>No Transactions Found</h4>

            <p>

                Try changing filters.

            </p>

        </div>

        `;

        return;

    }

pageData.forEach(item=>{
        container.innerHTML += `

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

            <div class="transaction-right">

    <div class="${item.type === "Income" ? "income-text" : "expense-text"}">

        ${item.type === "Income" ? "+" : "-"}

${formatMoney(item.amount)}
    </div>

<button onclick="toggleFavorite(${item.id})">

    <i class="fas ${item.favorite ? "fa-star" : "fa-regular fa-star"}"></i>

</button>
    <div class="transaction-actions">

        <button onclick="viewTransaction(${item.id})">

            <i class="fas fa-eye"></i>

        </button>

        <button onclick="editTransaction(${item.id})">

            <i class="fas fa-edit"></i>

        </button>

        <button onclick="shareTransaction(${item.id})">

    <i class="fas fa-share-alt"></i>

</button>

        <button onclick="removeTransaction(${item.id})">

            <i class="fas fa-trash"></i>

        </button>

    </div>

</div>

        `;

   });

renderPagination(list.length);

}

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");
const closePopup = document.getElementById("closePopup");

if(searchInput){
    searchInput.addEventListener("input", filterTransactions);
}

if(categoryFilter){
    categoryFilter.addEventListener("change", filterTransactions);
}

if(typeFilter){
    typeFilter.addEventListener("change", filterTransactions);
}

if(sortFilter){
    sortFilter.addEventListener("change", filterTransactions);
}

if(closePopup){
    closePopup.addEventListener("click", () => {
        document.getElementById("transactionPopup").style.display = "none";
    });
}

function filterTransactions(){

    const search =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const category =
    document
    .getElementById("categoryFilter")
    .value;

    const type =
    document
    .getElementById("typeFilter")
    .value;

    const sort =
    document
    .getElementById("sortFilter")
    .value;

filteredTransactions =
getTransactions().filter(item=>{
        const matchSearch =

        item.category
        .toLowerCase()
        .includes(search)

        ||

        (item.note||"")
        .toLowerCase()
        .includes(search);

        const matchCategory =

        category==="all"

        ||

        item.category===category;

        const matchType =

        type==="all"

        ||

        item.type===type;

return matchSearch &&
       matchCategory &&
       matchType;
    });

        switch(sort){

        case "oldest":

            filteredTransactions.sort(

            (a,b)=>

            new Date(a.date)-new Date(b.date)

            );

            break;

        case "highest":

            filteredTransactions.sort(

            (a,b)=>b.amount-a.amount

            );

            break;

        case "lowest":

            filteredTransactions.sort(

            (a,b)=>a.amount-b.amount

            );

            break;

        default:

            filteredTransactions.sort(

            (a,b)=>

            new Date(b.date)-new Date(a.date)

            );

    }

    filteredTransactions.sort((a,b)=>{

    if(a.favorite === b.favorite) return 0;

    return (b.favorite === true) - (a.favorite === true);

});

    renderTransactions();

    

}

filterTransactions();

function viewTransaction(id){

const item =
getTransactions().find(t=>t.id===id);
    if(!item) return;

    currentImages = item.receipt || [];

    document.getElementById("popupBody").innerHTML=`

        <p><strong>Type:</strong> ${item.type}</p>

        <p><strong>Amount:</strong>

        ${formatMoney(item.amount)}</p>

        <p><strong>Category:</strong> ${item.category}</p>

        <p><strong>Date:</strong> ${item.date}</p>

        <p><strong>Time:</strong> ${item.time}</p>

        <p><strong>Payment:</strong> ${item.payment}</p>

        <p><strong>Note:</strong> ${item.note || "-"}</p>

        <p><strong>Tags:</strong> ${item.tags || "-"}</p>

${Array.isArray(item.receipt)
 ? item.receipt.map((receipt, index) => {

    const img =
        (typeof Android !== "undefined" && receipt.startsWith("/"))
            ? Android.getReceiptUri(receipt)
            : receipt;

    return `
        <img
            src="${img}"
            class="receipt-thumb"
            onclick="openReceipt(${index})">
    `;

 }).join("")
 : ""}


    `;

    document
    .getElementById("transactionPopup")
    .style.display="flex";

}


function removeTransaction(id){

    showToast("Transaction Deleted");

    setTimeout(() => {

        deleteTransaction(id);

        filteredTransactions = [...getTransactions()];
        filterTransactions();

    }, 400);

}

function editTransaction(id){

    localStorage.setItem(

        "editTransaction",

        id

    );

    window.location.href="add.html";

}

function shareTransaction(id){

    const item = getTransactions().find(t => t.id == id);

    if(!item) return;

    const text =
`ExpenseTrackify

Type : ${item.type}
Amount : ${formatMoney(item.amount)}
Category : ${item.category}
Date : ${item.date}`;

    try{

        if(window.Android && typeof Android.share === "function"){

            Android.share(text);
            return;

        }

    }catch(e){

        console.log(e);

    }

    if(navigator.share){

        navigator.share({
            title:"Expense",
            text:text
        });

    }else{

        navigator.clipboard.writeText(text);
        showToast("Copied Successfully");

    }

}

function toggleFavorite(id){

    const item = getTransactions().find(t => t.id == id);

    if(!item) return;

    item.favorite = !item.favorite;

    saveTransactions();

    filterTransactions();

}

function renderPagination(total){

    const pages = Math.ceil(total / perPage);

    let html = "";

    for(let i = 1; i <= pages; i++){

        html += `
        <button
        onclick="goPage(${i})"
        class="${currentPage === i ? "active" : ""}">
        ${i}
        </button>
        `;

    }

    document.getElementById("pagination").innerHTML = html;

}

function goPage(page){

    currentPage = page;

    renderTransactions(filteredTransactions);

}

function openReceipt(index){

    currentImageIndex = index;

    document.getElementById("imageModal").style.display = "flex";

let img = currentImages[index];

if (
    img.startsWith("/") &&
    typeof Android !== "undefined" &&
    typeof Android.getReceiptUri === "function"
) {
    img = Android.getReceiptUri(img);
}
    document.getElementById("fullReceipt").src = img;

}

function closeReceipt(){

    document.getElementById("imageModal").style.display="none";

}

function nextReceipt(){

    currentImageIndex++;

    if(currentImageIndex >= currentImages.length){

        currentImageIndex = 0;

    }

    const img = currentImages[currentImageIndex].startsWith("/")
        ? Android.getReceiptUri(currentImages[currentImageIndex])
        : currentImages[currentImageIndex];

    document.getElementById("fullReceipt").src = img;

}


function prevReceipt(){

    currentImageIndex--;

    if(currentImageIndex < 0){

        currentImageIndex = currentImages.length - 1;

    }

    const img = currentImages[currentImageIndex].startsWith("/")
        ? Android.getReceiptUri(currentImages[currentImageIndex])
        : currentImages[currentImageIndex];

    document.getElementById("fullReceipt").src = img;

}