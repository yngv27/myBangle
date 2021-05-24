
const _Locale = require('locale');
const _Storage = require('Storage');
//require("FontHaxorNarrow7x17").add(Graphics);
//g.setFont("HaxorNarrow7x17", 1); // bitmap font, 1x magnified
//g.setFont("Vector", 18);
require("m_knxt").add(Graphics);
g.setFont("KNXT", 1); // bitmap font, 1x magnified

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

let _Msgs = [], _Alarms = [], _StepData = {};
try {
  _Msgs = _Storage.readJSON('yngv27.msgs.json');
} catch (err) {_Msgs = [];}
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

if(getToday() === _StepData.lastDate) {
  _StepData.stepCache += _StepData.lastStepCount;
  _StepData.lastStepCount = 0;
}


function showMsg(msg) {
  g.clearRect(60, 160, 200, 232);
  g.setFontAlign(0,-1);
  g.setColor(1,1,1);
  g.drawString("__ ALARM __", 120, 180, true);
  g.drawString(msg, 120, 200, true);
  Bangle.buzz();
  setTimeout(Bangle.buzz, 800);
  setTimeout(Bangle.buzz, 1600);
  setTimeout(Bangle.buzz, 2400);
  setTimeout(Bangle.buzz, 3200);
  inAlarm = true;
}

function checkMsgs() {
  for(let idx=0; idx < _Alarms.length; idx++) {
    let tdiff = Date.now() - Date.parse(_Alarms[idx].time);
    // 10 sec margin of error
    if(tdiff > 0 && tdiff < 10000) {
      showMsg(_Alarms[idx].msg);
    }
  }
}

for(let idx=0; idx < _Alarms.length; idx++) {
  let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
  let msg = _Alarms[idx].msg;
  if(tdiff > 0) {
    /*console.log(`will alarm ${msg} in ${tdiff}`);*/
    setTimeout(checkMsgs, tdiff);
  }
}

function logD(str) {
  //console.log(str);
}

const startX = [  6,  52, 106, 152 ];
const startY = [ 20,  20,  20,  20 ];
let xS = 1;
let yS = 1;

let lastH1 = -1;
let lastH2 = -1;
let lastM1 = -1;
let lastM2 = -1;

function setScale(x, y) {
  xS = x; yS = y;
}

function Poly(arr, fill) {
  if (fill) g.fillPoly(arr, true);
  else g.drawPoly(arr, true);
}

function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] =Math.floor(arr[i+1]*yS) + y;
    // straighten
    //newArr[i] -= Math.floor((125-newArr[i+1])/8.75);
  }
  Poly(newArr, true);
}

function drawTopSeg(x, y) {
  drawScaledPoly([
  20, 35, 22, 34, 43, 34, 39, 42, 27, 42
  ], x, y);
}

function drawTopLeftSeg(x, y) {
  drawScaledPoly([
   18, 37, 25, 44, 25, 58, 20, 63, 17, 63, 17, 39
  ], x, y);
}

function drawTopRightSeg(x, y) {
  drawScaledPoly([
    41, 45, 46, 35, 47, 35, 49, 37, 49, 63, 46, 63, 41, 58
  ], x, y);
}


function drawMiddleSeg(x, y) {
  drawScaledPoly([
   26, 61, 40, 61, 44, 65, 40, 69, 26, 69, 22, 65
  ], x, y);
}

function drawBottomLeftSeg(x, y) {
  drawScaledPoly([
    18, 93, 25, 86, 25, 72, 20, 67, 17, 67, 17, 91
  ],  x, y);
}

function drawBottomRightSeg(x, y) {
  drawScaledPoly([
   41, 85, 46, 95, 47, 95, 49, 93, 49, 67, 46, 67, 41, 72
  ],  x, y);
}

function drawBottomSeg(x, y) {
  drawScaledPoly([
    20, 95, 22, 96, 43, 96, 39, 88, 27, 88
   //27, 89, 40, 89, 45, 97, 23, 97, 21, 96 
  ],  x, y);
}

function drawSegments(xOff, yOff, val) {
  //logD("drawSegments");
  if (val != 1 && val != 4)
    drawTopSeg(xOff, yOff);
  if (val != 1 && val != 2 && val != 3 && val != 7)
    drawTopLeftSeg(xOff, yOff);
  if (val != 5 && val != 6)
    drawTopRightSeg(xOff, yOff);
  if (val != 0 && val !=1 && val != 7)
    drawMiddleSeg(xOff, yOff);
  if (val == 0 || val == 2 || val == 6 || val == 8)
    drawBottomLeftSeg(xOff, yOff);
  if (val != 2 )
    drawBottomRightSeg(xOff, yOff);
  if (val != 1 && val != 4 && val != 7)
    drawBottomSeg(xOff, yOff);
}


function drawScrew(x, y) {
  let d = 24;
  g.setColor("#888888");
  g.fillEllipse(x, y, x+d, y+d);
  d -= 8;x+=4; y+=4;
  g.setColor("#222222");
  g.drawLine(x+1,y,x+1+d,y+d);
  g.drawLine(x,y,x+d,y+d);
  g.drawLine(x,y+1,x+d,y+1+d);
}

function drawBackground() {
  g.clear();
  g.setColor("#524f69");
  g.drawPoly([
    10,  60, 
    20,  50,
    220, 50,
    230, 60,
    230, 140,
    220, 150,
     20, 150,
     10, 140
  ], true);
  g.setColor("#CCCCCC");
  g.fillEllipse(116,  90, 123, 96);
  g.fillEllipse(116, 108, 123, 114);
  
  drawScrew(8, 8);
  drawScrew(208, 8);
  drawScrew(8, 168);
  drawScrew(208, 168);
}


function drawTime() {
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
  
  logD("drawing!");
  setScale(1.25, 1.25);
  
  g.setColor(bgColor);
  if(h1 != lastH1) {
    g.setColor(bgColor);
    drawSegments(startX[0], startY[0], 8);
    g.setColor(fgColor1);
    drawSegments(startX[0], startY[0], h1);
  }
  if(h2 != lastH2) {
    g.setColor(bgColor);
    drawSegments(startX[1], startY[1], 8);
    g.setColor(fgColor1);
    drawSegments(startX[1], startY[1], h2);
  }
  if(m1 != lastM1) {
    g.setColor(bgColor);
    drawSegments(startX[2], startY[2], 8);
    g.setColor(fgColor2);
    drawSegments(startX[2], startY[2], m1);
  }  
  if(m2 != lastM2) {
    g.setColor(bgColor);
    drawSegments(startX[3], startY[3], 8);
    g.setColor(fgColor2);
    drawSegments(startX[3], startY[3], m2);
  }
  
  lastH1 = h1;
  lastH2 = h2;
  lastM1 = m1;
  lastM2 = m2;

  if(!nightMode && !inAlarm) {
    setScale(0.25, 0.25);
    g.clearRect(70, 0, 200, 29);
    g.setColor("#80C080");
    /*
    let mon = pad0(d.getMonth() + 1);
    let dt = pad0(d.getDate());
    drawSegments(92, 8, Math.floor((mon / 10) % 10));
    drawSegments(104, 8, Math.floor((mon) % 10));
    drawSegments(124, 8, Math.floor((dt / 10) % 10));
    drawSegments(136, 8, Math.floor((dt) % 10));
    */
    const mstr="JanFebMarAprMayJunJulAugSepOctNovDec";
    //JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC";

    let month = d.getMonth();
    let date = d.getDate();

    g.setFontAlign(0, -1);
    let month3 = mstr.slice(month*3,month*3+3);
    let dayString = _Locale.dow(d, true);
    g.drawString(dayString + " " + month3 + " " + date, 120, 8);

    setScale(0.375, 0.375);
    g.clearRect(0, 200, 239, 239);
    // steps
    g.setColor("#4080C0");
    let stepCounter = _StepData.stepCache + _StepData.lastStepCount;
    /*
    drawSegments(20, 158, Math.floor((stepCounter / 10000) % 10));
    drawSegments(35, 158, Math.floor((stepCounter / 1000) % 10));
    drawSegments(50, 158, Math.floor((stepCounter / 100) % 10));
    drawSegments(65, 158, Math.floor((stepCounter / 10) % 10));
    drawSegments(80, 158, Math.floor((stepCounter) % 10));
    */
    g.setFontAlign(-1, 1);
    g.drawString(Math.floor(stepCounter), 10, 239);
    // battery
    g.setColor("#20C060");
    let batt = E.getBattery();
    if(batt < 20) g.setColor('#C0C040');
    /*
    drawSegments(168, 158, Math.floor((batt / 100) % 10));
    drawSegments(184, 158, Math.floor((batt / 10) % 10));
    drawSegments(200, 158, Math.floor((batt) % 10));
    */
    g.setFontAlign(1, 1);
    g.drawString(Math.floor(batt), 230, 239);
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
  interval = setInterval(drawTime, 10000);
  drawTime();
}

drawBackground();
start();

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
  g.clear();

  if(nightMode) {
    g.setRotation(1,0);
    bgColor = "#000000";
    fgColor1 = "#202050";
    fgColor2 = fgColor1;
  } else {
    g.setRotation(0,0);
    bgColor = "#202020";
    fgColor1 = "#7FFFFF";
    fgColor2 = "#FFFFFF";
    drawBackground();
  }
  lastM1 = -1;
  lastM2 = -1;
  lastH1 = -1;
  lastH2 = -1;
  drawTime();
}

function btn2Func() {
  showMsg("You pressed button 2");
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

