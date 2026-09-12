/* ==========================================
   ExpenseTrackify - Reminders
   PART 1
========================================== */

// -----------------------------
// Storage
// -----------------------------

let reminders =
JSON.parse(localStorage.getItem("reminders")) || [];

const reminderSound = document.getElementById("reminderSound");

let editingId = null;
let deleteReminderId = null;

// -----------------------------
// Save Reminder
// -----------------------------

function saveReminder(){

const title =
document.getElementById("reminderTitle").value.trim();

const date =
document.getElementById("reminderDate").value;

const time =
document.getElementById("reminderTime").value;

const type =
document.getElementById("reminderType").value;

const note =
document.getElementById("reminderNote").value.trim();



if(title===""){

showToast("Please Enter Reminder Title");

return;

}

if(date===""){

showToast("Please Select Date");

return;

}

if(time===""){

showToast("Please Select Time");

return;

}

const reminder={

id: editingId || Date.now(),

title,

date,

time,

type,

note,

sound: document.getElementById("reminderSoundType").value,

repeat: document.getElementById("repeatType").value,

snooze: Number(document.getElementById("snoozeTime").value),

notified: false,

completed: false


};

const triggerTimeMillis = new Date(
    date + "T" + time + ":00"
).getTime();



if(editingId){

const index =
reminders.findIndex(r=>r.id===editingId);

if(index!==-1){
if (typeof Android !== "undefined") {

    Android.cancelReminder(
        editingId
    );

}


reminders[index]=reminder;

}

editingId=null;

}else{

reminders.push(reminder);

}

localStorage.setItem(
    "reminders",
    JSON.stringify(reminders)
);

if (typeof Android !== "undefined") {
    Android.saveReminders(
        JSON.stringify(reminders)
    );
}

if (typeof Android !== "undefined") {

    Android.scheduleReminder(
        reminder.id,
        triggerTimeMillis,
        reminder.title,
        reminder.note || reminder.type,
        reminder.sound
    );

}

showToast("Reminder Saved Successfully");

clearReminderForm();

renderReminders();

}

// -----------------------------
// Clear Form
// -----------------------------

function clearReminderForm(){

document.getElementById("reminderTitle").value="";

document.getElementById("reminderDate").value="";

document.getElementById("reminderTime").value="";

document.getElementById("reminderType").value="Payment";

document.getElementById("reminderNote").value="";

}

// -----------------------------
// Bell Badge
// -----------------------------

function updateBellBadge(){

const badge =
document.getElementById("bellBadge");

if(!badge) return;

const pending =
reminders.filter(r=>!r.completed).length;

badge.innerText = pending;

badge.style.display =
pending>0 ? "flex" : "none";

}

function checkReminderNotifications(){

const now = new Date();

reminders.forEach(item => {

    if(item.completed) return;

    const reminderTime =
    new Date(item.date + "T" + item.time);

    const diff =
    Math.abs(now - reminderTime);

    if(now >= reminderTime && !item.notified){

        item.notified = true;

        localStorage.setItem(
            "reminders",
            JSON.stringify(reminders)
        );

        if (typeof Android !== "undefined") {

            Android.saveReminders(
                JSON.stringify(reminders)
            );

        }



        const player = document.getElementById("reminderSound");

        if (player) {

            player.src = "assets/sounds/" + (item.sound || "bell.mp3");

            player.currentTime = 0;

            player.play().catch(err => console.log("Sound error:", err));

        }


        showToast("🔔 " + item.title);

        snoozeReminder(item.id);

        applyRepeat(item);

        renderReminders();

         }


     });

}


// -----------------------------
// Render Reminders
// -----------------------------

function renderReminders(){

const upcoming =
document.getElementById("upcomingList");

const overdue =
document.getElementById("overdueList");

const completed =
document.getElementById("completedList");

if(!upcoming || !overdue || !completed){
return;
}

upcoming.innerHTML="";

overdue.innerHTML="";

completed.innerHTML="";

let upcomingCount=0;
let overdueCount=0;
let completedCount=0;

const now=new Date();

reminders.sort((a,b)=>{

return new Date(a.date+"T"+a.time)
-
new Date(b.date+"T"+b.time);

});

reminders.forEach(item=>{

const reminderDate=
new Date(item.date+"T"+item.time);

let html=`

<div class="reminder-item">

<div class="reminder-left">

<h4>${item.title}</h4>

<p>

${item.type}

<br>

${item.date}

&nbsp;

${item.time}

</p>

${item.note
?
`<small>${item.note}</small>`
:""}

</div>

<div class="reminder-right">

<div class="reminder-time">

${item.time}

</div>

`;

if(item.completed){

completedCount++;

html+=`

<span class="status completed">

Completed

</span>

`;

}else if(reminderDate<now){

overdueCount++;

html+=`

<span class="status overdue">

Overdue

</span>

`;

}else{

upcomingCount++;

html+=`

<span class="status upcoming">

Upcoming

</span>

`;

}

html+=`

<div class="reminder-actions">

<button
class="edit-btn"
onclick="editReminder(${item.id})">

<i class="fas fa-pen"></i>

</button>

<button
class="complete-btn"
onclick="completeReminder(${item.id})">

<i class="fas fa-check"></i>

</button>

<button
class="delete-btn"
onclick="deleteReminder(${item.id})">

<i class="fas fa-trash"></i>

</button>

</div>

</div>

</div>

`;

if(item.completed){

completed.innerHTML+=html;

}else if(reminderDate<now){

overdue.innerHTML+=html;

}else{

upcoming.innerHTML+=html;

}

});

if(upcoming.innerHTML===""){

upcoming.innerHTML=`

<div class="empty-state">

<div class="empty-icon">

<i class="fas fa-bell"></i>

</div>

<h4>No Upcoming Reminders</h4>

<p>Add your first reminder.</p>

</div>

`;

}

if(overdue.innerHTML===""){

overdue.innerHTML=`

<div class="empty-state">

<div class="empty-icon">

<i class="fas fa-clock"></i>

</div>

<h4>No Overdue Reminders</h4>

</div>

`;

}

if(completed.innerHTML===""){

completed.innerHTML=`

<div class="empty-state">

<div class="empty-icon">

<i class="fas fa-check"></i>

</div>

<h4>No Completed Reminders</h4>

</div>

`;

}

const upcomingCounter =
document.getElementById("upcomingCount");

const overdueCounter =
document.getElementById("overdueCount");

const completedCounter =
document.getElementById("completedCount");

if(upcomingCounter)
upcomingCounter.innerText=upcomingCount;

if(overdueCounter)
overdueCounter.innerText=overdueCount;

if(completedCounter)
completedCounter.innerText=completedCount;

updateBellBadge();

}

// -----------------------------
// Edit Reminder
// -----------------------------

function editReminder(id){

const reminder =
reminders.find(r=>r.id===id);

if(!reminder) return;

editingId = id;

document.getElementById("reminderTitle").value =
reminder.title;

document.getElementById("reminderDate").value =
reminder.date;

document.getElementById("reminderTime").value =
reminder.time;

document.getElementById("reminderSoundType").value =
 reminder.sound || "default.mp3";

document.getElementById("reminderType").value =
reminder.type;

document.getElementById("reminderNote").value =
reminder.note;


window.scrollTo({

top:0,

behavior:"smooth"

});

}

// -----------------------------
// Delete Reminder
// -----------------------------

function deleteReminder(id){

    deleteReminderId = id;

    document
        .getElementById("deleteReminderModal")
        .style.display = "flex";

}

function closeDeleteReminder(){

    deleteReminderId = null;

    document
        .getElementById("deleteReminderModal")
        .style.display = "none";

}



function confirmDeleteReminder(){

    if (typeof Android !== "undefined") {

        Android.cancelReminder(
            deleteReminderId
        );

    }

    reminders = reminders.filter(
        r => r.id !== deleteReminderId
    );

    localStorage.setItem(
        "reminders",
        JSON.stringify(reminders)
    );

    if (typeof Android !== "undefined") {

        Android.saveReminders(
            JSON.stringify(reminders)
        );

    }

    showToast("Reminder Deleted");

    closeDeleteReminder();

    renderReminders();

}

// -----------------------------
// Complete Reminder
// -----------------------------

function completeReminder(id){

const reminder =
reminders.find(r=>r.id===id);

if(!reminder) return;

reminder.completed = true;

localStorage.setItem(

"reminders",

JSON.stringify(reminders)

);

if (typeof Android !== "undefined") {
    Android.saveReminders(
        JSON.stringify(reminders)
    );
}

renderReminders();

}

// -----------------------------
// Start
// -----------------------------

window.addEventListener("load",()=>{

renderReminders();

checkReminderNotifications();

});

// -----------------------------
// Browser Notification Permission
// -----------------------------



// -----------------------------
// Auto Notification Check
// -----------------------------

setInterval(()=>{

checkReminderNotifications();

},60000);

// -----------------------------
// Auto Refresh
// -----------------------------

setInterval(()=>{

renderReminders();

},60000);

/* ==========================================
   Repeat Reminder
========================================== */

function applyRepeat(item){

if(item.repeat==="none") return;

const d=

new Date(

item.date+"T"+item.time

);

if(item.repeat==="daily"){

d.setDate(

d.getDate()+1

);

}

if(item.repeat==="weekly"){

d.setDate(

d.getDate()+7

);

}

if(item.repeat==="monthly"){

d.setMonth(

d.getMonth()+1

);

}

item.date=

d.toISOString()

.split("T")[0];

item.notified=false;

localStorage.setItem(

"reminders",

JSON.stringify(reminders)

);
if (typeof Android !== "undefined") {
    Android.saveReminders(
        JSON.stringify(reminders)
    );
}

}

/* ==========================================
   Snooze Reminder
========================================== */

function snoozeReminder(id){

const reminder=

reminders.find(

r=>r.id===id

);

if(!reminder) return;

if(reminder.snooze===0) return;

const d=

new Date(

reminder.date+

"T"+

reminder.time

);

d.setMinutes(

d.getMinutes()+

reminder.snooze

);

reminder.date=

d.toISOString()

.split("T")[0];

reminder.time=

d.toTimeString()

.substring(0,5);

reminder.notified=false;

localStorage.setItem(

"reminders",

JSON.stringify(reminders)

);

if (typeof Android !== "undefined") {
    Android.saveReminders(
        JSON.stringify(reminders)
    );
}

renderReminders();

}

/* ==========================================
   Toast
========================================== */

function showToast(text){

const toast=

document.getElementById("toast");

if(!toast) return;

toast.innerText=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

function changeReminderVolume(){

    const player =
    document.getElementById("reminderSound");

    player.volume =
    document.getElementById("soundVolume").value;

}

function previewReminderSound() {

    const player = document.getElementById("reminderSound");

    const sound = document.getElementById("reminderSoundType").value;

    const volume = Number(document.getElementById("soundVolume").value);

    player.pause();

    player.currentTime = 0;

    player.volume = volume;

    // Android WebView
    player.src = "file:///android_asset/sounds/" + sound;

    player.load();

    player.oncanplaythrough = function () {

        player.play().catch(function (e) {

            console.log(e);

            showToast("Unable to play sound");

        });

    };

    player.onerror = function () {

        console.log("Sound File Not Found :", player.src);

        showToast("Sound file missing");

    };

}

