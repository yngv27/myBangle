g.clear();

require("FontHaxorNarrow7x17").add(Graphics);
g.setFont("HaxorNarrow7x17", 2); // bitmap font, 1x magnified

let interval = null;
let stepCounter = 0;

const optWireframe = 0;
const optWireframe2 = 1;
const optFilled = 2;
const maxStyles = 6;

let vOption = 2;
let nightMode = false;

function logD(str) {
  //console.log(str);
}

const startX = [  64,  100, 160, 195 ];
const startY = [ 64, 64, 64, 64 ];
let xS = 0.5;
let yS = 0.5;

let lastH1 = -1;
let lastH2 = -1;
let lastM1 = -1;
let lastM2 = -1;

function setScale(x, y) {
  xS = x; yS = y;
}

function pad0(n) {
  return (n > 9) ? n : ("0"+n);
}

function drawBackground() {
  g.clear();
  
  g.setColor("#2B88B4");
  g.fillPoly([
      0, 119,
      0, 39,
     49, 0,
    179, 0,
    239, 44,
    239, 171,
    180, 239,
     60, 239,
      0, 178,
     67, 178,
     67, 119,
    ], true);
  g.setColor("#303030");
  g.fillPoly([
     67, 0,
    124, 0,
    124, 44,
    239, 44,
    239, 172,
    182, 239,
    120, 239,
    120, 205,
    67, 205,
    
  ], true);
  
  g.setColor("#39ACDE");
  g.fillPoly([
     0, 178,
    103, 178,
     87, 239, 
    60, 239,
    ], true);
  g.fillPoly([
    124, 0,
    150, 0,
    139, 44,
    124, 44
  ], true);
  g.fillPoly([
     0, 37,
     49, 0,
     67, 0,
     67, 120,
     0, 120
     ], true);
     
  g.setColor("#B81379");
  g.fillPoly([
    74, 120,
    239, 120,
    239, 169,
    215, 199,
    74, 199,
     ], true);
  
  g.setColor("#E641A4");
  g.fillPoly([
    74, 128,
    117, 128,
    98, 199,
    74, 199,
     ], true);
  
  g.setColor("#4F4856");
  g.fillPoly([
    137, 52,
    239, 52,
    239, 120,
    120, 120
     ], true);
  
  g.setColor("#908F97");
  g.fillPoly([
    59, 52,
    137, 52,
    120, 120,
    59, 120
     ], true);
}

const w = 60;
const h = 90;
const fillDigits = true;
let fgColor = "#FFFFFF";
let fgColor1 = fgColor;
let fgColor2 = fgColor;
let bgColor = "#000000";
const setFG = () => { g.setColor(fgColor);};
const setBG = () => { g.setColor(bgColor);};

function ellipse(x1, y1, x2, y2, xOrg, yOrg) {
  g.fillEllipse(x1*xS+xOrg, y1*yS+yOrg, x2*xS+xOrg, y2*yS+yOrg);
}

function poly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] = Math.floor(arr[i+1]*yS) + y;
  }
  g.fillPoly(newArr, true);
}

function rect(x1, y1, x2, y2, xOrg, yOrg) {
  g.fillRect(x1*xS+xOrg, y1*yS+yOrg, x2*xS+xOrg, y2*yS+yOrg);
}


/** DIGITS **/
function drawDigit(x, y, d) {
  const funcs = [ draw0, draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9]; 
  funcs[d](x, y);
}

/* zero */
function draw0(xOrig, yOrig) {
  setFG();
  ellipse(0, 0, 0+w, 0+h, xOrig, yOrig);
  if(fillDigits) setBG();
  ellipse(0+15, 0+15, 0+w-15, 0+h-15, xOrig, yOrig);
}

/* one */
function draw1(xOrig, yOrig) {
  setFG();
  poly([w/2-6, 0, 
        w/2-12, 0,
        w/2-20, 12,
        w/2-6, 12
        ], xOrig, yOrig);
  rect(w/2-6, 0, w/2+6, h-3, xOrig, yOrig);
 
}

/* two */
function draw2(xOrig, yOrig) { 
  setFG();
  ellipse(0, 0, 0+56, 0+56, xOrig, yOrig);
    if(fillDigits) setBG();
  ellipse(0+13, 0+13, 0+43, 0+43, xOrig, yOrig);
  
 setBG();
  rect(0, 0+27, 0+40, 0+61, xOrig, yOrig);

  setFG();
  poly([0, 0+88,
        0+56, 0+88,
        0+56, 0+75,
        0+25, 0+75,
        0+46, 0+50,
        0+42, 0+36
  ], xOrig, yOrig);
}

/* three */
function draw8(xOrig, yOrig) {
  setFG();
  ellipse(0+3, 0, 0+53, 0+46, xOrig, yOrig);
  ellipse(0, 0+33, 0+56, 0+89, xOrig, yOrig);
  if(fillDigits) setBG();
  ellipse(0+17, 0+13, 0+40, 0+33, xOrig, yOrig);
  ellipse(0+13, 0+46, 0+43, 0+76, xOrig, yOrig);
}

function draw3(xOrig, yOrig) {
  draw8(xOrig, yOrig);
  setBG();
  rect(0, 0+24, 0+24, 0+61, xOrig, yOrig);
}

/* four */
function draw4(xOrig, yOrig) {
  setFG();
  rect(0+8, 0+54, 0+w-4, 0+67, xOrig, yOrig);
  rect(0+36, 0+12, 0+49, 0+88, xOrig, yOrig);
  poly([0, 0+67,
            0+12, 0+67,
            0+49, 0+12,
            0+49, 0+1,
            0+42, 0+1
  ], xOrig, yOrig);
}

function draw5(xOrig, yOrig) {
  setFG();
  ellipse(0, 0+33, 0+56, 0+89, xOrig, yOrig);
  setBG();
  ellipse(0+13, 0+46, 0+43, 0+76, xOrig, yOrig);
  
  setBG();
  rect(0, 0+24, 0+19, 0+61, xOrig, yOrig);
  
  setFG();
  poly([20, 1,
        7, 47, 
        19, 47,
        32, 1      
        ], xOrig, yOrig);
  rect(20, 1, 53, 13, xOrig, yOrig);
}

/* six */
function draw6(xOrig, yOrig) {
  setFG();
  ellipse(0, 0+33, 0+56, 0+89, xOrig, yOrig);
  poly([0+2, 0+48,
        0+34, 0,
        0+46, 0+7,
        0+14, 0+56
        ], xOrig, yOrig);
  if(fillDigits) setBG();
  ellipse(0+13, 0+46, 0+43, 0+76, xOrig, yOrig);
}

/* seven */
function draw7(xOrig, yOrig) {
  setFG();
  poly([4, 1, 
        w-1, 1,
        w-7, 13,
        4, 13
        ], xOrig, yOrig);
  poly([w-1, 1,
        15, 88,
        5, 81,
        w-19, 9
        ], xOrig, yOrig);
}

function draw9(xOrig, yOrig) { 
  setFG();
  ellipse(0, 0, 0+56, 0+56, xOrig, yOrig);
  poly([0+54, 0+41,
        0+22, 0+89,
        0+10, 0+82,
        0+42, 0+33
        ], xOrig, yOrig);
  if(fillDigits) setBG();
  ellipse(0+13, 0+13, 0+43, 0+43, xOrig, yOrig);
}

/** END DIGITS **/


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
  //setScale(1, 1);
  
  g.setColor(bgColor);
  if(h1 != lastH1) {
    g.setColor(fgColor1);
    drawDigit(startX[0], startY[0], h1);
  }
  if(h2 != lastH2) {
    g.setColor(fgColor1);
    drawDigit(startX[1], startY[1], h2);
  }
  if(m1 != lastM1) {
    g.setColor(fgColor2);
    drawDigit(startX[2], startY[2], m1);
  }  
  if(m2 != lastM2) {
    g.setColor(fgColor2);
    drawDigit(startX[3], startY[3], m2);
  }
  
  lastH1 = h1;
  lastH2 = h2;
  lastM1 = m1;
  lastM2 = m2;

  if(!nightMode) {
    g.setFontAlign(1, 0);
    g.drawString(stepCounter + 10000, 200, 160);
    g.drawString(E.getBattery() + 99, 180, 24);
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
  nightMode = ! nightMode;
  if(nightMode) {
    g.setRotation(1,0);
    bgColor = "#000000";
    fgColor = "#202050";
  } else {
    g.setRotation(0,0);
    bgColor = "#202020";
    fgColor = "#7FFFFF";
  }
  lastM1 = -1;
  lastM2 = -1;
  lastH1 = -1;
  lastH2 = -1;
  g.clear();
  drawTime();
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});

setWatch(setNightMode, BTN3, {repeat:true,edge:"falling"});

Bangle.on('step', function(cnt) { 
  stepCounter = cnt;
});



