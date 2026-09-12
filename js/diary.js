/* ==========================================
   ExpenseTrackify
   Expense Journal V3
   Part 1 - Foundation
========================================== */

const STORAGE_KEY = "diaryEntries";

let diaryEntries =
JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let diaryPhotos = [];

let selectedMood = "😊";

let selectedDate = "";

let editId = null;

let currentMonth = new Date().getMonth();

let currentYear = new Date().getFullYear();

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

/* ==========================
   DOM
========================== */

const todayDate =
document.getElementById("todayDate");

const todaySpending =
document.getElementById("todaySpending");

const calendarTitle =
document.getElementById("calendarTitle");

const calendarGrid =
document.getElementById("calendarGrid");

const diaryList =
document.getElementById("diaryList");

const noteInput =
document.getElementById("journalNote");

const tagInput =
document.getElementById("journalTags");

const favoriteInput =
document.getElementById("favorite");

const galleryInput =
document.getElementById("galleryInput");

const cameraInput =
document.getElementById("cameraInput");

const previewBox =
document.getElementById("photoPreview");

const searchInput =
document.getElementById("searchDiary");

const filterInput =
document.getElementById("filterDate");

/* ==========================
   Init
========================== */

document.addEventListener(

"DOMContentLoaded",

function(){

initDiary();

}

);

function initDiary(){

loadTodayDate();

loadTodaySpending();

bindInputs();

renderPhotos();

renderCalendar();

renderDiary();

}

/* ==========================
   Today Date
========================== */

function loadTodayDate(){

if(!todayDate) return;

todayDate.textContent =

new Date().toLocaleDateString(

"en-IN",

{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

}

);

}

/* ==========================
   Today's Spending
========================== */

function loadTodaySpending(){

if(!todaySpending) return;

const today =

new Date()

.toISOString()

.split("T")[0];

const tx =

getTransactions()

.filter(t=>

t.date===today &&

t.type==="Expense"

);

const total =

tx.reduce(

(sum,t)=>

sum+Number(t.amount),

0

);

todaySpending.textContent =

getCurrency() +

total.toLocaleString();

}

/* ==========================
   Events
========================== */

function bindInputs(){

if(galleryInput){

galleryInput?.addEventListener("change",function(){

    loadImages(this.files);

    this.value="";

});
}

if(cameraInput){

cameraInput?.addEventListener("change",function(){

    loadImages(this.files);

    this.value="";

});

}

}

/* ==========================
   Mood
========================== */

function selectMood(mood){

selectedMood = mood;

document

.querySelectorAll(".mood-btn")

.forEach(btn=>{

btn.classList.remove("active");

if(

btn.textContent.trim()

=== mood

){

btn.classList.add("active");

}

});

}

/* ==========================
   Photos
========================== */

function loadImages(files){

     if(!files || files.length===0) return;

     Array.from(files).forEach(file=>{

         if(!file.type.startsWith("image/")) return;

         const reader = new FileReader();

         reader.onload = function(e){

             diaryPhotos.push(e.target.result);

             renderPhotos();

         };

         reader.readAsDataURL(file);

     });

 }

function renderPhotos(){

if(!previewBox) return;

previewBox.innerHTML="";

diaryPhotos.forEach(

(img,index)=>{

previewBox.innerHTML+=`

<div class="receipt-item">

<img
src="${img}"
class="receipt-thumb"
onclick="openPhoto('${img}')">

<button
onclick="removePhoto(${index})">

✖

</button>

</div>

`;

}

);

}

function removePhoto(index){

diaryPhotos.splice(index,1);

renderPhotos();

}

/* ==========================================
   ExpenseTrackify
   Expense Journal V3
   Part 2 - Save / Edit / Delete
========================================== */

function saveDiary(){

    const note = noteInput.value.trim();

    if(note===""){

        document.getElementById("journalNote").focus();

        showToast("Please write your journal first.");

        return;

    }
    const item={

        id:editId || Date.now(),

        date:selectedDate ||

        new Date()

        .toISOString()

        .split("T")[0],

        mood:selectedMood,

        note:note,

        tags:tagInput.value.trim(),

        favorite:favoriteInput.checked,

        photos:[...diaryPhotos]

    };

    if(editId){

        diaryEntries=

        diaryEntries.map(d=>

        d.id===editId

        ? item

        : d

        );

        editId=null;

    }else{

        diaryEntries.unshift(item);

    }

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(diaryEntries)

    );

    clearForm();

    renderDiary();

    renderCalendar();
    loadMoodStatistics();

    loadExpenseMoodChart();

    showToast("Journal Saved");

}

/* ==========================
   Timeline
========================== */

function renderDiary(

list=diaryEntries

){

    if(!diaryList) return;

    diaryList.innerHTML="";

    if(list.length===0){

        diaryList.innerHTML=`

<div class="empty-state">

<h3>

No Journal Yet

</h3>

<p>

Write your first journal.

</p>

</div>

`;

        return;

    }

    list.forEach(item=>{

        diaryList.innerHTML+=`

<div

class="diary-card"

data-date="${item.date}">

<div class="diary-date">

📅 ${item.date}

</div>

<h3>

<span style="font-size:28px">

${item.mood}

</span>

${item.favorite ?

'<span class="favorite-badge">⭐ Favorite</span>'

:

''

}

</h3>

<p class="journal-preview">

${item.note}

</p>

<div class="diary-tags">

🏷️ ${item.tags || "-"}

</div>

${item.photos.length ?

`

<div class="photo-row">

${item.photos.map(img=>`

<img
src="${img}"
class="receipt-thumb"
onclick="openPhoto('${img}')">

`).join("")}

</div>

`

:

""

}

<div class="timeline-actions">

<button

onclick="editDiary(${item.id})">

<i class="fas fa-edit"></i>

</button>

<button

onclick="deleteDiary(${item.id})">

<i class="fas fa-trash"></i>

</button>

</div>

</div>

`;

    });

}

/* ==========================
   Edit
========================== */

function editDiary(id){

    const item=

    diaryEntries.find(

    d=>d.id===id

    );

    if(!item) return;

    editId=item.id;

    selectedDate=item.date;

    noteInput.value=item.note;

    tagInput.value=item.tags;

    favoriteInput.checked=

    item.favorite;

    diaryPhotos=[

    ...item.photos

    ];

    renderPhotos();

    selectMood(item.mood);

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ==========================
   Delete
========================== */

function deleteDiary(id){

    showToast("Journal Deleted");

    setTimeout(()=>{

        diaryEntries = diaryEntries.filter(d=>d.id!==id);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(diaryEntries)
        );

        renderDiary();
        renderCalendar();

    },400);

}


/* ==========================
   Clear
========================== */

function clearForm(){

    noteInput.value="";

    tagInput.value="";

    favoriteInput.checked=false;

    diaryPhotos=[];

    editId=null;

    selectedMood="😊";

    renderPhotos();

    selectMood("😊");

}

/* ==========================================
   ExpenseTrackify
   Expense Journal V3
   Part 3 - Calendar
========================================== */

function renderCalendar(){

    if(!calendarGrid) return;

    calendarGrid.innerHTML = "";

    calendarTitle.textContent =

    monthNames[currentMonth] +

    " " +

    currentYear;

    const firstDay =

    new Date(

        currentYear,

        currentMonth,

        1

    ).getDay();

    const daysInMonth =

    new Date(

        currentYear,

        currentMonth+1,

        0

    ).getDate();

    /* Empty cells */

    for(let i=0;i<firstDay;i++){

        calendarGrid.innerHTML +=

        `<div class="calendar-empty"></div>`;

    }

    /* Days */

    for(

        let day=1;

        day<=daysInMonth;

        day++

    ){

        const date =

        `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        const entry =

        diaryEntries.find(

            d=>d.date===date

        );

        const tx =

        getTransactions()

        .filter(t=>

            t.date===date &&

            t.type==="Expense"

        );

        const spending =

        tx.reduce(

            (sum,t)=>

            sum+Number(t.amount),

            0

        );

        let mood="";

        let favorite="";

        let photo="";

        let colorClass="";

        if(entry){

            mood=entry.mood;

            favorite=

            entry.favorite

            ?"⭐"

            :"";

            photo=

            entry.photos.length

            ?"📷"

            :"";

            if(

                mood==="😊" ||

                mood==="😁" ||

                mood==="😎"

            ){

                colorClass="mood-green";

            }

            else if(

                mood==="😐"

            ){

                colorClass="mood-yellow";

            }

            else{

                colorClass="mood-red";

            }

        }

        calendarGrid.innerHTML += `

<div

class="calendar-day

${colorClass}

${selectedDate===date ? "selected-day" : ""}"

onclick="openDiaryDate('${date}')">

<div class="calendar-top">

<span>

${day}

</span>

<span>

${favorite}

</span>

</div>

<div class="calendar-mood">

${mood}

</div>

${photo ?

`<div class="calendar-photo">

📷

</div>`

:

""

}

${spending>0 ?

`<div class="calendar-spending">

${getCurrency()}${spending}

</div>`

:

""

}

</div>

`;

    }

}

/* ==========================
   Calendar Navigation
========================== */

function nextMonth(){

    currentMonth++;

    if(currentMonth>11){

        currentMonth=0;

        currentYear++;

    }

    renderCalendar();

}

function prevMonth(){

    currentMonth--;

    if(currentMonth<0){

        currentMonth=11;

        currentYear--;

    }

    renderCalendar();

}

/* ==========================
   Date Click
========================== */

function openDiaryDate(date){

    selectedDate=date;

    renderCalendar();

    const card=

    document.querySelector(

        `[data-date="${date}"]`

    );

    if(card){

        card.scrollIntoView({

            behavior:"smooth",

            block:"center"

        });

    }else{

        showToast(

        "No Journal on this date"

        );

    }

}

/* ==========================================
   ExpenseTrackify
   Expense Journal V3
   Part 4 - Search / Filter / Toast / Finish
========================================== */




/* ==========================
   Toast
========================== */

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

/* ==========================
   Utilities
========================== */

function getDiaryByDate(date){

    return diaryEntries.find(

        item=>item.date===date

    );

}

function reloadDiary(){

    diaryEntries =

    JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    ) || [];

    renderCalendar();

    renderDiary();

}

/* ==========================
   Initial Render
========================== */

renderCalendar();

renderDiary();

console.log(

"Expense Journal V3 Loaded Successfully"

);

/* ==========================================
Part 8
Mood Statistics
Paste at END of diary.js
========================================== */

function loadMoodStatistics(){

    const canvas=document.getElementById("moodChart");

    if(!canvas) return;

    const ctx=canvas.getContext("2d");

    if(window.moodChart instanceof Chart){

        window.moodChart.destroy();

    }

    const moods={

        "😊":0,
        "😁":0,
        "😎":0,
        "😐":0,
        "😔":0

    };

    diaryEntries.forEach(item=>{

        if(moods[item.mood]!==undefined){

            moods[item.mood]++;

        }

    });

    window.moodChart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:Object.keys(moods),

            datasets:[{

                data:Object.values(moods),

                backgroundColor:[

                    "#22c55e",
                    "#38bdf8",
                    "#a855f7",
                    "#f59e0b",
                    "#ef4444"

                ],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    labels:{

                        color:"#fff"

                    }

                }

            }

        }

    });

}
/* ==========================================
Part 9
Expense vs Mood
Paste BELOW loadMoodStatistics()
========================================== */

function loadExpenseMoodChart(){

    const result={};

    diaryEntries.forEach(item=>{

        const amount=

        getTransactions()

        .filter(t=>

            t.date===item.date &&

            t.type==="Expense"

        )

        .reduce(

            (sum,t)=>

            sum+Number(t.amount),

            0

        );

        result[item.mood]=

        (result[item.mood]||0)

        +amount;

    });

    const ctx=

    document

    .getElementById("expenseMoodChart")

    ?.getContext("2d");

    if(!ctx) return;

    if(window.expenseChart instanceof Chart){

        window.expenseChart.destroy();

    }

    window.expenseChart=

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:

            Object.keys(result),

            datasets:[{

                data:

                Object.values(result),

                borderRadius:10,

                backgroundColor:"#A855F7"

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    ticks:{

                        color:"#fff"

                    }

                },

                x:{

                    ticks:{

                        color:"#fff"

                    }

                }

            }

        }

    });

}

loadExpenseMoodChart();

/* ==========================================
Part 10
Update Charts Automatically
Paste INSIDE saveDiary()
AFTER renderDiary();
========================================== */

function openPhoto(img){

    const overlay = document.createElement("div");

    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,.95)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "99999";

    overlay.innerHTML = `
        <img src="${img}"
             style="
                max-width:95%;
                max-height:95%;
                border-radius:12px;
             ">
    `;

    overlay.onclick = function(){
        overlay.remove();
    };

    document.body.appendChild(overlay);

}