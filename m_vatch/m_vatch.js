const _Locale = require('locale');
const _Storage = require('Storage');

const pad0 = (n) => (n > 9) ? n : ("0"+n); 

const getToday = () => {
  let d = new Date();
  return d.getFullYear()+'-'+ pad0(d.getMonth()+1) + '-' + pad0(d.getDate());
};
let interval = null;
let inAlarm = false;


//let vOption = 2;
let nightMode = false;
let bgColor = "#202020";
let fgColor1 = "#FFFFFF";
let fgColor2 = "#FFFFFF";

let stepFile = 'yngv27.steps.json';

let _Alarms = [], _StepData = {};
let _List = '';

function reload() {
  try {
    _List = _Storage.readJSON('yngv27.list.json');
  } catch (err) {
    _List = ['Nothing to see here...'];
  }
  try {
    _Alarms =  _Storage.readJSON('yngv27.alarms.json');
  } catch (err) {_Alarms = [];}
  try {
    _StepData =  _Storage.readJSON(stepFile);
  } catch (err) {
    _StepData = {
      lastDate: '1999-09-09',
      stepCache: 0,
      lastStepCount: 0,
      updated: true,
    };
  }
}
reload();

if(getToday() === _StepData.lastDate) {
  _StepData.stepCache += _StepData.lastStepCount;
  _StepData.lastStepCount = 0;
}

function stringFromArray(data)
{
  var count = data.length;
  var str = "";

  for(var index = 0; index < count; index += 1)
    str += String.fromCharCode(data[index]);

  return str;
}

function notify() {
  Bangle.buzz(200);
}

function showMsg(title, msg) {
  inAlarm = true;
  Bangle.setLCDPower(true);
  g.setFontAlign(0,-1);
  g.setColor('#FFFF00');
  g.fillRect(18, 18, 222, 222);
  /*
  g.fillPoly([
    18, 30,30, 18,210, 18,222, 30,222, 210,210, 222,30, 222,18, 210,18, 30
  ], true);
  */
  g.setColor('#202020');
  g.fillRect(20, 20, 220, 220);
  /*
  g.fillPoly([
    20, 30,30, 20,210, 20,220, 30,220, 210,210, 220,30, 220,20, 210,20, 30
  ], true);
  */
  g.setColor('#FFFFFF');
  
  g.drawString('___'+title+'___', 120, 30);
  g.drawString('___'+title+'___', 121, 30);
  let lines = msg.split("|");
  for(let l = 0; l < lines.length; l++) 
    g.drawString(lines[l], 120, 50+g.getFontHeight()*l);

  setTimeout(notify, 800);
  setTimeout(notify, 1600);
  setTimeout(notify, 2400);
  setTimeout(notify, 3200);
  setTimeout(notify, 4000);
}

function checkMsgs() {
  for(let idx=0; idx < _Alarms.length; idx++) {
    let tdiff = Date.now() - Date.parse(_Alarms[idx].time);
    // 10 sec margin of error
    if(tdiff > 0 && tdiff < 10000) {
      showMsg('ALARM',_Alarms[idx].msg);
    }
  }
}

let alarmTOs = [];
function scheduleAlarms() {
  for(let idx=0; idx < alarmTOs.length; idx++) {
    clearTimeout(alarmTOs[idx]);
  }
  for(let idx=0; idx < _Alarms.length; idx++) {
    let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
    let msg = _Alarms[idx].msg;
    if(tdiff > 0) {
      /*console.log(`will alarm ${msg} in ${tdiff}`);*/
      alarmTOs.push(setTimeout(checkMsgs, tdiff));
    }
  }
}
scheduleAlarms();

function logD(str) {
  //console.log(str);
}


let lastH1 = -1;
let lastH2 = -1;
let lastM1 = -1;
let lastM2 = -1;


let drawBackground = () => {};
let drawTime = () => {};
let drawData = () => {};


function timeCheck() {
  
  if(inAlarm) return;
  
  let d = new Date();

  let hour = d.getHours();
  let minute = d.getMinutes();

  let h1 = Math.floor(hour / 10);
  let h2 = hour % 10;
  let m1 = Math.floor(minute / 10);
  let m2 = minute % 10;
  
  logD("lastH1 = "+lastH1+": lastM2 = "+lastM2);
  if(h1 == lastH1 && h2 == lastH2 && m1 == lastM1 && m2 == lastM2) {
    return;
  }
  
  logD("drawing time");
  let data = {
    h1: h1,
    h2: h2,
    m1: m1,
    m2: m2,
    hour: hour,
    min: minute,
  };
  drawTime(data, nightMode);
  
  lastH1 = h1;
  lastH2 = h2;
  lastM1 = m1;
  lastM2 = m2;

  if(!nightMode && !inAlarm) {
    logD("drawing data...");
    const mstr="JanFebMarAprMayJunJulAugSepOctNovDec";

    let month = d.getMonth();
    data.month = month;
    data.date = d.getDate();

    data.mon3 = mstr.slice(month*3,month*3+3);
    data.dow = _Locale.dow(d, true);
    data.dateStr = data.dow + " " + data.mon3 + " " + data.date;
    data.steps = _StepData.stepCache + _StepData.lastStepCount;
    data.batt = E.getBattery() + (Bangle.isCharging() ? "+" : "");

    drawData(data);
  }

  if(_StepData.updated) {
     _Storage.writeJSON(stepFile, _StepData);
     logD(JSON.stringify(_StepData));
    _StepData.updated = false;
  }
}

function stop () {
  if (interval) {
    clearInterval(interval);
  }
}

function start () {
  if (interval) {
    clearInterval(interval);
  }
  // first time init
  interval = setInterval(timeCheck, 10000);
  timeCheck();
}

Bangle.on('lcdPower', function (on) {
  if (on) {
    start();
  } else {
    stop();
  }
});

function setNightMode() {
  logD("setNightMode");
  if(inAlarm ) {
    inAlarm = false;
  } else {
    nightMode = ! nightMode;
  }

  if(nightMode) {
    g.setRotation(1,0);
  } else {
    g.setRotation(0,0);
  }
  lastM1 = -1;
  lastM2 = -1;
  lastH1 = -1;
  lastH2 = -1;
  drawBackground(nightMode);
  timeCheck();
}

function btn2Func() {
  reload();
  scheduleAlarms();
  showMsg('ACK!',_List);
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN3, {repeat:false,edge:"falling"});
setWatch(setNightMode, BTN1, {repeat:true,edge:"falling"});
setWatch(btn2Func, BTN2, {repeat:true,edge:"falling"});

Bangle.on('step', function(cnt) { 
  if(_StepData.lastDate !== getToday()) {
    _StepData.stepCache = 0 - cnt;
    _StepData.lastDate = getToday();
  }
  _StepData.lastStepCount = cnt;
  _StepData.updated = true;
});

var BLEMessage = "";
NRF.setServices({
  "feb10001-f00d-ea75-7192-abbadabadebb": {
    "feb10002-f00d-ea75-7192-abbadabadebb": {
      value : [0],
      maxLen : 20,
      writable : true,
      onWrite : function(evt) {
        let str = stringFromArray(evt.data);
        if(str === "__EOM__") {
          if(BLEMessage) {
            showMsg('Message',BLEMessage);
          } else {
            reload();
            scheduleAlarms();
            showMsg('', 'Reloading...');
          }
          BLEMessage = '';
        } else {
          BLEMessage += str;
        }
      }
    }
  }
}, { });

exports.setDrawBackground = function(dBkgd) {
  drawBackground = dBkgd;
};
exports.setDrawTime = function(dTime) {
  drawTime = dTime;
};
exports.setDrawData = function( dData) {
  drawData = dData;
};
exports.begin = function() {
  drawBackground(nightMode);
  start();
};
