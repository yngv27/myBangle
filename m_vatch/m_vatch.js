

const _Storage = require('Storage');

let interval = null;

let nightMode = false;

let stepFile = 'v.steps.json';
let stepArchiveFile = 'v.stephist.json';

let _List = '';
let _Alarm = {
  inAlarm: true,
  reload: () => {},
  scheduleAlarms: () => {},
  showMsg: (title, msg) => {},
  showNotes: () => {},
};

let _StepData = {};

let _Options = {
  autoNightMode: true,
  useAlarms: true,
  stepManager: true,
};

const pad0 = (n) => (n > 9) ? n : ("0"+n); 

const getToday = () => {
  let d = new Date();
  return d.getFullYear()+'-'+ pad0(d.getMonth()+1) + '-' + pad0(d.getDate());
};

function reload() {
  _StepData =  _Storage.readJSON(stepFile);
  if(!_StepData) {
    _StepData = {
      lastDate: '1999-09-09',
      stepCache: 0,
      lastStepCount: 0,
      updated: true,
    };
  }
  if(getToday() === _StepData.lastDate) {
    _StepData.stepCache += _StepData.lastStepCount;
    _StepData.lastStepCount = 0;
  }
}



function stringFromArray(data)
{
  var count = data.length;
  var str = "";

  for(var index = 0; index < count; index += 1)
    str += String.fromCharCode(data[index]);

  return str;
}


function logD(str) {
  console.log(str);
}


let lastH1 = -1;
let lastH2 = -1;
let lastM1 = -1;
let lastM2 = -1;


let drawBackground = () => {};
let drawTime = () => {};
let drawData = () => {};


function timeCheck() {
  
  if(_Alarm.inAlarm) return;
  
  logD('opt.nm = '+_Options.autoNightMode);
  if(_Options.autoNightMode) {
    let a = Bangle.getAccel();
    a.x = Math.floor(a.x * 100);
    logD('a.x = ' + a.x);
    if(a.x === 100 || a.x === 99) {
      if(!nightMode) {
        setNightMode();
      }
    } else {
      if(nightMode) {
        setNightMode();
      }
    }
  }
  
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

  if(!nightMode && !_Alarm.inAlarm) {
    logD("drawing data...");
    const mstr="JanFebMarAprMayJunJulAugSepOctNovDec";
    const dowstr = "SunMonTueWedThuFriSat";

    let month = d.getMonth();
    let dow = d.getDay();
    data.month = month;
    data.date = d.getDate();

    data.mon3 = mstr.slice(month*3,month*3+3);
    data.dow = dowstr.substr(dow*3,3);
    data.dateStr = data.dow + " " + data.mon3 + " " + data.date;
    data.steps = _StepData.stepCache + _StepData.lastStepCount;
    data.batt = E.getBattery() + (Bangle.isCharging() ? "+" : "");
    data.charging = Bangle.isCharging();

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
  if(_Options.autoNightMode) {
    //Bangle.buzz(400);
  }

  if(_Alarm.inAlarm ) {
    _Alarm.inAlarm = false;
  } else {
    nightMode = ! nightMode;
  }
  logD('nm is '+nightMode);
  
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
  _Alarm.reload();
  _Alarm.scheduleAlarms();
  _Alarm.showNotes();
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN3, {repeat:false,edge:"falling"});
setWatch(setNightMode, BTN1, {repeat:true,edge:"falling"});
setWatch(btn2Func, BTN2, {repeat:true,edge:"falling"});

Bangle.on('step', function(cnt) { 
  if(!_StepData.lastDate) return;
  if(_StepData.lastDate !== getToday()) {
    // save previous day's step count
    try {
      let sf = _Storage.readJSON(stepArchiveFile);
      if(!sf) sf = [];
      logD('sf is '+ (typeof sf) +':'+sf);
      // trim to 30
      if(sf.length >= 30 ) sf.shift();
      let steps = _StepData.stepCache +_StepData.lastStepCount;
      let sd = `${_StepData.lastDate},${steps}`;
      sf.push(sd);
      _Storage.writeJSON(stepArchiveFile, sf);
    } catch (err) {
      _Storage.write('err.txt',err);
    }
    _Storage.write(_StepData.lastDate +'.steps', JSON.stringify(
      _StepData.stepCache +_StepData.lastStepCount
    ));
    _StepData.stepCache = 0 - cnt;
    _StepData.lastDate = getToday();
  }
  _StepData.lastStepCount = cnt;
  _StepData.updated = true;
});

/*
** Advertise a writeable characteristic. Accepts text (in 20 char
** chunks) terminated with __EOM__ by itself. If there's text, show
** it (as an alarm), otherwise reload the alarm & msg files (empty
** string signals another BLE process updated those files)
*/
/*
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
*/

exports.setDrawBackground = function(dBkgd) {
  drawBackground = dBkgd;
};
exports.setDrawTime = function(dTime) {
  drawTime = dTime;
};
exports.setDrawData = function( dData) {
  drawData = dData;
};
exports.begin = function(opts) {
  if(opts) _Options = opts;
  if(_Options.useAlarms) {
    _Alarm = require('m_alarms');
    _Alarm.reload();
    _Alarm.scheduleAlarms();
    setTimeout(alarmUp, 2000);
  }
  reload();
  drawBackground(nightMode);
  start();
};

function alarmUp() {
  _Alarm.showMsg('Congrats!','Alarms are up');
}
