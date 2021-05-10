let newAlarm = {
  days: 0,
  hour: 12,
  minute: 0,
  msg: "None",
};

let alarmFile = 'yngv27.alarms.json';

//let msgs = require("Storage").readJSON('yngv27.msgs.json');
let alarms = require("Storage").readJSON(alarmFile);
if( ! alarms ) alarms = [];


function addDays(days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

function pad0(n) {
  return (n > 9) ? n : ("0"+n);
}

function getNiceTime() {
  d = new Date();
  return( pad0(d.getHours())+':'+pad0(d.getMinutes()));
}

function addAlarm() {
  let d = addDays(newAlarm.days);
  d.setHours(newAlarm.hour);
  d.setMinutes(newAlarm.minute);
  d.setSeconds(0);
  let aTime = 
      d.getFullYear()+"-"+pad0(d.getMonth()+1)+"-"+pad0(d.getDate())+"T"+
      pad0(d.getHours())+":"+pad0(d.getMinutes())+":00";
  //console.log(aTime);
  //console.log("In "+newAlarm.days+" days, at "+newAlarm.hour +":"+newAlarm.minute+", "+ newAlarm.msg);
  alarms.push( {'time': aTime, 'msg': newAlarm.msg});
  return;
}

// Add menu
let addMenu = {
  "" : { "title" : "Create -- " + getNiceTime() },
  "In _ days" : {
    value : 0,
    min:0,max:7,step:1,
    onchange : v => { newAlarm.days=v; }
  },
  "Hour" : {
    value : 12,
    min:0,max:23,step:1,
    onchange : v => { newAlarm.hour=v; }
  },
   "Minute" : {
    value : 0,
    min:0,max:50,step:10,
    onchange : v => { newAlarm.minute=v; }
  },
  "Message" : function() { E.showMenu(submenu); },
  "Save" : function() { addAlarm(); buildMainMenu(); E.showMenu(mainMenu); }, 
};

// Alarm msg submenu
function setAlarmMsg(str) {
  newAlarm.msg = str;
  E.showMenu(addMenu);
}

// Submenu
let submenu = {
  "" : { "title" : "-- Messages --" },
  "< Back" : function() { E.showMenu(mainmenu); },
  "Get up" : function() { setAlarmMsg ("Wake up!");}, // do nothing
  "Pool" : function() { setAlarmMsg("Check pool");},
  "Meeting" : function() { setAlarmMsg("Meeting");},
    "Laundry" : function() { setAlarmMsg("Laundry");},
    "Solar thing" : function() { setAlarmMsg("Solar thing");},
  "Water garden" : function() { setAlarmMsg("Water garden");},
  "Reminder" : function() { setAlarmMsg("Generic Reminder|of high importance!");},
};

function deleteAlarm(q) {
  E.showPrompt("Delete "+q+"?",{
    buttons : {"Delete":true,"Cancel":false}
}).then(function(v) {
    if (v) {
      //console.log(q);
      for(let idx=0; idx < alarms.length; idx++) {
        let a = alarms[idx];
        if (a.time.indexOf(q) > 0) {
          //console.log('deleting', a);
          alarms.splice(idx, 1);
        }
      }
    }
    buildMainMenu();
    E.showMenu(mainMenu);
  });
  
}

function showAddMenu() {
  E.showMenu(addMenu);
}

let mainMenu = [];
function buildMainMenu() {
  mainMenu = [];
  mainMenu['Exit'] = function() {
    require("Storage").writeJSON(alarmFile, alarms);
    Bangle.showLauncher();
};
  mainMenu['New'] = showAddMenu;
  let n = 1;
  for (let a of alarms) {
    ab = a.time.slice(5,16);
    mainMenu[n+' '] = { 
      value:ab ,
      onchange: x => {deleteAlarm(x);} };
    mainMenu[n+'  '] = { 
      value:a.msg, 
       }; 
    n++;
  }
  
} 

function showMenu() {
  buildMainMenu();
  E.showMenu(mainMenu);
}

showMenu();
