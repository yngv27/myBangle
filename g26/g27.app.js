g.clear();
//const _Storage = require('Storage');

//require("FontHaxorNarrow7x17").add(Graphics);
g.setFont("HaxorNarrow7x17", 18); // bitmap font, 8x magnified
g.setFontAlign(-1,-1);

const pad0 = (n) => (n > 9) ? n : ("0"+n); 
const logD = (str)=> {
  //console.log(str);
};

const getToday = () => {
  let d = new Date();
  return d.getFullYear()+'-'+ pad0(d.getMonth()+1) + '-' + pad0(d.getDate());
};

let inAlarm = false;
let interval = null;

let fgColor = "#FFFFFF";
let bgColor = "#000000";

let fillDigits = true;
let nightMode = false;

const startX = [ 12, 68,  12, 68 ];
const startY = [ 22,  22, 128, 128 ];

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
  }
  Poly(newArr, true);
}

let _Msgs = [], _Alarms = [], _StepData = {};
try {
  _Msgs = _Storage.readJSON('yngv27.msgs.json');
} catch (err) {_Msgs = [];}
try {
  _Alarms =  _Storage.readJSON('yngv27.alarms.json');
} catch (err) {_Alarms = [];}
try {
  _StepData =  _Storage.readJSON('yngv27.steps.json');
} catch (err) {
  console.log(err);
  _StepData = {
    lastDate: '1999-09-09',
    stepCache: 0,
    lastStepCount: 0,
    updated: true,
  };
}

_Msgs = [];
_Alarms =  [
  {'time':'2020-09-15T17:22:00','msg':'This is just a test'}
  ];
_StepData = {
    lastDate: '1999-09-09',
    stepCache: 0,
    lastStepCount: 0,
    updated: true,
  };


logD("stepz: " + JSON.stringify(_StepData));
if(getToday() === _StepData.lastDate) {
  _StepData.stepCache += _StepData.lastStepCount;
  _StepData.lastStepCount = 0;
}

function notify() {
  Bangle.buzz(200);
}
function showMsg(msg) {
  inAlarm = true;
  g.setFontAlign(0,-1);
  g.setColor('#F0C080');
  g.fillRect(20, 30, 220, 210);
  g.fillRect(30, 20, 210, 220);
  g.fillEllipse(20, 20, 40, 40);
  g.fillEllipse(200, 20, 220, 40);
  g.fillEllipse(20, 200, 40, 220);
  g.fillEllipse(200, 200, 220, 220);
  g.setColor(0,0,0);
  g.drawString("<< ALARM >>", 120, 30);
  g.drawString(msg, 120, 50);

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

function setFG() {
  g.setColor(fgColor);
}

function setBG() {
  g.setColor(bgColor);
}

function ellipse(x1, y1, x2, y2, fill) {
  if (fill) g.fillEllipse(x1, y1, x2, y2);
  else g.drawEllipse(x1, y1, x2, y2);
}

function poly(arr, fill) {
  if (fill) g.fillPoly(arr, true);
  else g.drawPoly(arr, true);
}

function rect(x1, y1, x2, y2, fill) {
  if (fill) g.fillRect(x1, y1, x2, y2);
  else g.drawRect(x1, y1, x2, y2);
}

setBG();
rect(0, 0, 240, 240, true);


/** DIGITS **/

/* zero */
function draw0(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    1,20 ,
    20,1 ,
    100,1 ,
    119,20 ,
    119,220 ,
    100,239 ,
    20,239 ,
    1,220,
    1,20 ,
	         
    10,22 , 
    10,218 ,
    22,230 ,
    98,230 ,
    110,218, 
    110,22,
    98,10 ,
    22,10 ,
    10,22, 22, 10
    ], xOrig, yOrig);
}

/* one */
function draw1(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    30,239, 
    90,239, 
    90,230, 
    65,230, 
    65,1, 
    55,1 ,
    35,21, 
    35,31, 
    55,11,   
    55,230, 
    30,230,
    ],xOrig, yOrig);
 
}

/* two */
function draw2(xOrig, yOrig) { 
  setFG();
  drawScaledPoly([1,20, 
                 20,1,
                 100,1,
                 119,20 ,
                 119,100, 
                 100,120, 
                 22,120 ,
                 10,132 ,
                 10,218, 
                 22,230 ,
                 119,230, 
                 119,239,

                 20,239 ,
                 1,220,
                 1,130 ,
                 22,110 ,
                 98,110 ,
                 110,98 ,
                 110,22 ,
                 98,10 ,
                 22,10 ,
                12,20 ,
                 1,20],
                xOrig, yOrig);
}

/* three */

function draw3(xOrig, yOrig) {
  setFG();
   drawScaledPoly([
     1,20 ,
     20,1 ,
     100,1 ,
     119,20 ,
     119,100 ,
     105,115 ,
			
     119,130 ,
     119,220 ,
     100,239 ,
     20,239 ,
     1,220,
			
     1,220 ,
     12,220 ,
     22,230 ,
     98,230 ,
     110,218 ,
     110,132 ,
     99,120   ,
     45,120  ,
     45,110 ,
     98,110 ,
     110,98,
     110,22, 
     98,10 ,
     22,10 ,
     12,20 ,
     1,20],
      xOrig, yOrig);
}

/* four */
function draw4(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    119,239 , 
    119,1,
    110,1,
	110,110, 
    22,110 ,
    10,98 ,
    10,10 ,
    1,10 ,
    1,102 ,
    20,120 ,
    110,120,
	110,239],
      xOrig, yOrig);
}

function draw5(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    1,220 ,
    20,239 ,
    100,239 ,
    119,220 ,
    119,130 ,
    100,110 ,
    16,110 ,
    10,104 ,
    10,10 ,
    100,10 ,
    100,1,
			 
    1,1 ,
    1,110, 
    12,120, 
    98,120 ,
    110,132 ,
    110,218 ,
    98,230 ,
    22,230 ,
    10,220 ,
    1,220,
    ],xOrig,yOrig);
}
/* six */
function draw6(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
100,10 ,
    100,1 ,
    20,1 ,
    1,20 ,
    1,220 ,
			
    20,239 ,
    100,239 ,
    119,220 ,
    119,130 ,
    100,110 ,
    12,110,
			
    12,120 ,
    98,120 ,
    110,132 ,
    110,218 ,
    98,230 ,
    22,230 ,
    10,218 ,
			
    10,22 ,
    22,10 ,
    100,10,
  ],xOrig,yOrig);

}

/* seven */
function draw7(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    65,239, 
    65,155 ,
    100,120 , 
    119,100 ,
    119,1 ,
			
    100,1 ,
    20,1 ,
    1,1 ,
    1,22 , 
			
    10,22 ,
    10,10 ,
    22,10 ,
    98,10 ,
    110,10 ,
    110,22 ,
			
    110,98 ,
    98,110 ,
    55,153 ,
    55,239,
    ], xOrig, yOrig);
}

function draw8(xOrig, yOrig) {
  setFG();
   drawScaledPoly([
      1,20 ,
     20,1 ,
     100,1 ,
     119,20 ,
     119,100 ,
     100,120 ,
     20,120 ,
     1,100 ,
     1,20 ,
	         
     10,22 ,
     10,98 ,
     22,110 ,
     98,110 ,
     110,98 ,
     110,22,  
     98, 10,
     22, 10, 
     10, 22, 22, 10],
     xOrig, yOrig);
  // weird bug in bangle, not emulator: extra coord at end prevents a horiz line ???
   drawScaledPoly([
      1,130 ,
     20,111 ,
     100,111 ,
     119,130 ,
     119,220 ,
     100,239 ,
     20,239 ,
     1,220 ,
     1,130 ,
	         
     10,132 ,
     10,218 ,
     22,230 ,
     98,230 ,
     110,218 ,
     110,132  , 
     98,120 ,
     22,120 ,
     10,132, 22, 120],
      xOrig, yOrig);
}
function draw9(xOrig, yOrig) { 
  setFG();
  drawScaledPoly([
    20,230 ,
    20,239, 
    100,239, 
    119,220 ,
    119,20 ,
			
    100,1 ,
    20,1 ,
    1,20 ,
    1,110 ,
    20,130 ,
    108,130,
			
    108,120 ,
    22,120 ,
    10,108 ,
    10,22 ,
    22,10 ,
    98,10 ,
    110,22 ,
			
    110,218 ,
    98,230
    ], xOrig, yOrig);
}

/** END DIGITS **/

function drawDigit(pos, dig) {
  let x = startX[pos];
  let y = startY[pos];
  const dFuncs = [ draw0, draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9];
  setBG();
  g.fillRect(x, y, x+60, y+120);
  dFuncs[dig](x,y);
}


function drawTime() {
  
  if (inAlarm) return;
  
  let d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();
  
  let h1 = Math.floor(hour / 10);
  let h2 = hour % 10;
  let m1 = Math.floor(minute / 10);
  let m2 = minute % 10;
  
  if(h1 == lastH1 && h2 == lastH2 && m1 == lastM1 && m2 == lastM2) {
    return;
  }
  
  //logD("drawing!");
  setScale(0.375, 0.375);

  fgColor = nightMode ? "#404040" : "#FFFFFF";
  if(h1 != lastH1) {
    drawDigit(0, Math.floor(hour / 10));
  }
  if(h2 != lastH2) {
    drawDigit(1, hour % 10);
  }
  fgColor = nightMode ? "#004040" : "#00FFFF";

  if(m1 != lastM1) {
    drawDigit(2, Math.floor(minute / 10));
    
  }  
  if(m2 != lastM2) {
    drawDigit(3, minute % 10);
  }
  lastH1 = h1;
  lastH2 = h2;
  lastM1 = m1;
  lastM2 = m2;

  if(nightMode) return;
  
  setBG();
  rect(0, 0, 239, 10);
  rect(0, 226, 240, 240, true);
  g.setColor('#408040');
  g.drawPoly([0, 0, 10, 10, 120, 10, 130, 20], false);
  g.fillPoly([130, 20, 239, 20, 239, 40, 130, 40], true);
  g.setColor('#404080');
  g.drawLine(0, 120, 239, 120);
  g.fillPoly([130, 110, 239, 110, 239, 130, 130, 130], true);
  g.setColor('#804080');
  g.drawPoly([0, 239, 9, 230, 120, 230, 130, 220], false);
  g.fillPoly([130, 200, 239, 200, 239, 220, 130, 220], true);
  g.setColor("#FFFFFF");
  
  g.setFontAlign(1,0);
  let stepCounter = _StepData.stepCache + _StepData.lastStepCount;
  g.drawString("STEP " + stepCounter, 230, 120);

  let bty = "BTY "+E.getBattery() + (Bangle.isCharging() ? "+" : "");
  g.drawString(bty, 230, 210);

  const dowstr="SUNMONTUEWEDTHUFRISAT";
  const mstr="JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC";

  let month = d.getMonth();
  let date = d.getDate();

  let today = mstr.slice(month*3,month*3+3);
  let dow = d.getDay();
  dow = dowstr.slice(dow*3,dow*3+3);
  g.drawString(dow + " " + today + " " + date, 230, 30);

  if(_StepData.updated) {
     //_Storage.writeJSON('yngv27.steps.json', _StepData);
     logD(JSON.stringify(_StepData));
    _StepData.updated = false;
  }
}

function drawRightBar() {

  for(let c = 0; c < 120; c++) {
    g.setColor(0, 0, 0.5-c/240);
    g.fillRect(180, c*2, 240, c*2+1);
  }
  g.setColor("#808080");
  g.setFontAlign(-1,-1);
  for(let i=0; i < msgs.length; i++) {
    g.drawString(msgs[i], 184, 36+20*(i));
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

start();


Bangle.on('lcdPower', function (on) {
  if (on) {
    start();
  } else {
    stop();
  }
});

function btn1Func() {
  if( ! inAlarm) {
    nightMode = !nightMode;
    g.setRotation(nightMode ? 1 : 0, 0);
  }
  inAlarm = false;
  g.clear();
  g.setFont("HaxorNarrow7x17", 1); // bitmap font, 8x magnified
  lastH1 = -1;
  lastH2 = -1;
  lastM1 = -1;
  lastM2 = -1;
  drawTime();
  //drawRightBar();
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
// redraw
setWatch(btn1Func, BTN1, {repeat:true,edge:"falling"});


setWatch(function(dir) { 
  let bigMsg = msgs.join("\n");
  showMsg(bigMsg);
}, BTN3, {repeat:true,edge:"falling"});


Bangle.on('step', function(cnt) { 
  if(_StepData.lastDate !== getToday()) {
    _StepData.stepCache = 0 - cnt;
    _StepData.lastDate = getToday();
  }
  _StepData.lastStepCount = cnt;
  _StepData.updated = true;
});


