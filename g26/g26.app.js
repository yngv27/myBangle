
g.clear();

require("FontHaxorNarrow7x17").add(Graphics);
g.setFont("HaxorNarrow7x17", 1); // bitmap font, 8x magnified
g.setFontAlign(-1,-1);

let interval = null;
let stepCounter = 0;

let fgColor = "#FFFFFF";
let bgColor = "#000000";

let fillDigits = true;
let nightMode = false;

const startX = [ 54, 120,  54, 120 ];
const startY = [ 22,  22, 128, 128 ];

const hht = 60;
const vht = 40;
const w = 60;
const h = 90;

let lastHour = -99;
let lastMinute = -99;

let msgs = require("Storage").readJSON('yngv27.msgs.json');
let alarms = require("Storage").readJSON('yngv27.alarm.json');
/*
alarms = [
  {'time':'2020-05-28T17:32:00','msg':'This is just a test'}
  ];
*/
let alarming = false;

function notify() {
  Bangle.buzz(200);
}

function showMsg(msg) {
  alarming = true;
  g.setFontAlign(0,-1);
  g.setColor('#204080');
  g.fillRect(20, 30, 220, 210);
  g.fillRect(30, 20, 210, 220);
  g.fillEllipse(20, 20, 40, 40);
  g.fillEllipse(200, 20, 220, 40);
  g.fillEllipse(20, 200, 40, 220);
  g.fillEllipse(200, 200, 220, 220);
  g.setColor(1,1,1);
  g.drawString("<< ALARM >>", 120, 30);
  g.drawString(msg, 120, 50);

  setTimeout(notify, 800);
  setTimeout(notify, 1600);
  setTimeout(notify, 2400);
  setTimeout(notify, 3200);
  setTimeout(notify, 4000);
}

function checkMsgs() {
  for(let idx=0; idx < alarms.length; idx++) {
    let tdiff = Date.now() - Date.parse(alarms[idx].time);
    // 10 sec margin of error
    if(tdiff > 0 && tdiff < 10000) {
	  alarming = true;
      Bangle.setLCDPower(true);
      showMsg(alarms[idx].msg);
    }
  }
}

for(let idx=0; idx < alarms.length; idx++) {
  let tdiff = Date.parse(alarms[idx].time) - Date.now();
  let msg = alarms[idx].msg;
  if(tdiff > 0) {
    /*console.log(`will alarm ${msg} in ${tdiff}`);*/
    setTimeout(checkMsgs, tdiff);
  }
}

function pad0(n) {
  return (n > 9) ? n : ("0"+n);
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
  ellipse(xOrig, yOrig, xOrig+w, yOrig+h, fillDigits);
  if(fillDigits) setBG();
  ellipse(xOrig+15, yOrig+15, xOrig+w-15, yOrig+h-15, fillDigits);
}

/* one */
function draw1(xOrig, yOrig) {
  setFG();
  poly([xOrig+w/2-6, yOrig, 
        xOrig+w/2-12, yOrig,
        xOrig+w/2-20, yOrig+12,
        xOrig+w/2-6, yOrig+12
        ], fillDigits);
  rect(xOrig+w/2-6, yOrig, xOrig+w/2+6, yOrig+h-3, fillDigits);
 
}

/* two */
function draw2(xOrig, yOrig) { 
  setFG();
  ellipse(xOrig, yOrig, xOrig+56, yOrig+56, fillDigits);
    if(fillDigits) setBG();
  ellipse(xOrig+13, yOrig+13, xOrig+43, yOrig+43, fillDigits);
  
 setBG();
  rect(xOrig, yOrig+27, xOrig+40, yOrig+61, true);

  setFG();
  poly([xOrig, yOrig+88,
        xOrig+56, yOrig+88,
        xOrig+56, yOrig+75,
        xOrig+25, yOrig+75,
        xOrig+46, yOrig+50,
        xOrig+42, yOrig+36
  ], fillDigits);
}

/* three */
function draw8(xOrig, yOrig) {
  setFG();
  ellipse(xOrig+3, yOrig, xOrig+53, yOrig+46, fillDigits);
  ellipse(xOrig, yOrig+33, xOrig+56, yOrig+89, fillDigits);
  if(fillDigits) setBG();
  ellipse(xOrig+17, yOrig+13, xOrig+40, yOrig+33, fillDigits);
  ellipse(xOrig+13, yOrig+46, xOrig+43, yOrig+76, fillDigits);
}

function draw3(xOrig, yOrig) {
  draw8(xOrig, yOrig);
  setBG();
  rect(xOrig, yOrig+24, xOrig+24, yOrig+61, true);
}

/* four */
function draw4(xOrig, yOrig) {
  setFG();
  rect(xOrig+8, yOrig+54, xOrig+w-4, yOrig+67, fillDigits);
  rect(xOrig+36, yOrig+12, xOrig+49, yOrig+88, fillDigits);
  poly([xOrig, yOrig+67,
            xOrig+12, yOrig+67,
            xOrig+49, yOrig+12,
            xOrig+49, yOrig+1,
            xOrig+42, yOrig+1
  ], fillDigits);
}

function draw5(xOrig, yOrig) {
  setFG();
  ellipse(xOrig, yOrig+33, xOrig+56, yOrig+89, fillDigits);
  if(fillDigits) setBG();
  ellipse(xOrig+13, yOrig+46, xOrig+43, yOrig+76, fillDigits);
  
  setBG();
  rect(xOrig, yOrig+24, xOrig+19, yOrig+61, true);
  
  setFG();
  poly([xOrig+20, yOrig+1,
        xOrig+7, yOrig+47, 
        xOrig+19, yOrig+47,
        xOrig+32, yOrig+1      
        ], fillDigits);
  rect(xOrig+20, yOrig+1, xOrig+53, yOrig+13, fillDigits);
}

/* six */
function draw6(xOrig, yOrig) {
  setFG();
  ellipse(xOrig, yOrig+33, xOrig+56, yOrig+89, fillDigits);
  poly([xOrig+2, yOrig+48,
        xOrig+34, yOrig,
        xOrig+46, yOrig+7,
        xOrig+14, yOrig+56
        ], fillDigits);
  if(fillDigits) setBG();
  ellipse(xOrig+13, yOrig+46, xOrig+43, yOrig+76, fillDigits);
}

/* seven */
function draw7(xOrig, yOrig) {
  setFG();
  poly([xOrig+4, yOrig+1, 
        xOrig+w-1, yOrig+1,
        xOrig+w-7, yOrig+13,
        xOrig+4, yOrig+13
        ], fillDigits);
  poly([xOrig+w-1, yOrig+1,
        xOrig+15, yOrig+88,
        xOrig+5, yOrig+81,
        xOrig+w-19, yOrig+9
        ], fillDigits);
}

function draw9(xOrig, yOrig) { 
  setFG();
  ellipse(xOrig, yOrig, xOrig+56, yOrig+56, fillDigits);
  poly([xOrig+54, yOrig+41,
        xOrig+22, yOrig+89,
        xOrig+10, yOrig+82,
        xOrig+42, yOrig+33
        ], fillDigits);
  if(fillDigits) setBG();
  ellipse(xOrig+13, yOrig+13, xOrig+43, yOrig+43, fillDigits);
}

/** END DIGITS **/

function drawDigit(pos, dig) {
  let x = startX[pos];
  let y = startY[pos];
  
  setBG();
  rect(x, y, x+w, y+h, true);
  switch(dig) {
    case 0:
      draw0(x, y);
      break;
    case 1:
      draw1(x, y);
      break;
    case 2:
      draw2(x, y);
      break;
    case 3:
      draw3(x, y);
      break;
    case 4:
      draw4(x, y);
      break;
    case 5:
      draw5(x, y);
      break;
    case 6:
      draw6(x, y);
      break;
    case 7:
      draw7(x, y);
      break;
    case 8:
      draw8(x, y);
      break;
    case 9:
      draw9(x, y);
      break;
  }
}


function drawTime() {
  
  if (alarming) return;
  
  let d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();
  

  if(hour == lastHour && minute == lastMinute) {
    return;
  }
  
  fgColor = nightMode ? "#404040" : "#FFFFFF";
  if(hour != lastHour) {
    drawDigit(0, Math.floor(hour / 10));
    drawDigit(1, hour % 10);
  }
  
  fgColor = nightMode ? "#004040" : "#00FFFF";
  if(minute != lastMinute) {
    drawDigit(2, Math.floor(minute / 10));
    drawDigit(3, minute % 10);
  }  
  lastHour = hour;
  lastMinute = minute;
  
  if(nightMode) return;
  
  setBG();
  rect(0, 0, 239, 10);
  rect(0, 226, 240, 240, true);
  setFG();
  g.drawLine(0,    7,  80, 7);
  g.drawLine(160,  7, 239, 7);
  g.drawLine(50, 232, 190, 232);
  g.setColor("#808080");
  
  g.setFontAlign(-1,-1);
  g.drawString("STEP " + stepCounter, 0, 226);
  g.drawString("STEP " + stepCounter, 1, 226);
  //g.drawString("BPM", 184, 140);
  //g.drawString("BTY", 184, 210);
  
  g.setFontAlign(1,-1);
  //g.drawString(stepCounter, 236, 70);
  //g.drawString(myHeartRate, 236, 140);  
  let bty = "BTY "+E.getBattery() + (Bangle.isCharging() ? "+" : "");
  g.drawString(bty, 239, 226);
  g.drawString(bty, 238, 226);

  const mstr="JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC";

  let month = d.getMonth();
  let date = d.getDate();

  g.setFontAlign(0, -1);
  let today = mstr.slice(month*3,month*3+3);
  g.drawString(today + " " + date, 120, 1);
  g.drawString(today + " " + date, 119, 1);
 
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
//drawRightBar();



// Bangle.loadWidgets();
// Bangle.drawWidgets();

Bangle.on('lcdPower', function (on) {
  if (on) {
    start();
  } else {
    stop();
  }
});

function btn1Func() {
  if( ! alarming) {
    fillDigits = !fillDigits;
    nightMode = !fillDigits;
    g.setRotation(nightMode ? 1 : 0, 0);
  }
  alarming = false;
  g.clear();
  g.setFont("HaxorNarrow7x17", 1); // bitmap font, 8x magnified
  lastHour = -99;
  lastMinute = -99;
  drawTime();
  //drawRightBar();
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
// redraw
setWatch(btn1Func, BTN1, {repeat:true,edge:"falling"});

Bangle.on('step', function(cnt) { 
  stepCounter = Math.floor(cnt/10);
});

setWatch(function(dir) { 
  let bigMsg = msgs.join("\n");
  showMsg(bigMsg);
}, BTN3, {repeat:true,edge:"falling"});

Bangle.on('HRM', function(hrm) { 
   myHeartRate = hrm.bpm;                            
});




