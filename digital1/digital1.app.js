const _Storage = require('Storage');

let EMULATOR = false;
if(EMULATOR) {
  g.setFont('6x8',3);
} else {
  let v = require('m_vatch');
  require("m_knxt").add(Graphics);
  g.setFont("KNXT", 1); // bitmap font, 1x magnified

}

const pad0 = (n) => (n > 9) ? n : ("0"+n); 

const getToday = () => {
  let d = new Date();
  return d.getFullYear()+'-'+ pad0(d.getMonth()+1) + '-' + pad0(d.getDate());
};
let interval = null;

let nightMode = false;
let bgColor = "#202020";
let fgColor1 = "#FFFFFF";
let fgColor2 = "#80FFFF";


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
  g.drawEllipse(x, y, x+d, y+d);
  d -= 8;x+=4; y+=4;
  //g.setColor("#222222");
  g.drawLine(x+1,y,x+1+d,y+d);
  g.drawLine(x,y,x+d,y+d);
  g.drawLine(x,y+1,x+d,y+1+d);
}

function drawBkgd(nmode) {
  g.clear();
  lastH1 = -1;
  lastH2 = -1;
  lastM1 = -1;
  lastM2 = -1;

  bgColor = "#000000";
  fgColor1 = "#404040";
  fgColor2 = "#404040";

  if(nmode) return;

  bgColor = "#202020";
  fgColor1 = "#FFFFFF";
  fgColor2 = "#80FFFF";


  g.setColor("#524f69");
  g.drawPoly([
    10, 140,
    10,  60, 
    20,  50,
    220, 50,
    230, 60,
    230, 140,
    220, 150,
     20, 150,
     10, 140,
    
     10, 180,
     20, 190,
    220, 190,
    230, 180,
    230, 140
  ], false);
  
  g.setColor("#CCCCCC");
  g.fillEllipse(116,  90, 123, 96);
  g.fillEllipse(116, 108, 123, 114);
  
  drawScrew(8, 8);
  drawScrew(208, 8);
  drawScrew(8, 208);
  drawScrew(208, 208);
}


function drawTime(d, nmode) {

  logD("drawing!");
  setScale(1.25, 1.25);
  
  if(d.hour > 12) {
    d.hour -= 12;
    if(d.hour == 0) d.hour = 12;
    d.h1 = Math.floor(d.hour/12);
    d.h2 = d.hour%12;
  }
  g.setColor(bgColor);
  if(d.h1 != lastH1) {
    g.setColor(bgColor);
    drawSegments(startX[0], startY[0], 8);
    g.setColor(fgColor1);
    drawSegments(startX[0], startY[0], d.h1);
  }
  if(d.h2 != lastH2) {
    g.setColor(bgColor);
    drawSegments(startX[1], startY[1], 8);
    g.setColor(fgColor1);
    drawSegments(startX[1], startY[1], d.h2);
  }
  if(d.m1 != lastM1) {
    g.setColor(bgColor);
    drawSegments(startX[2], startY[2], 8);
    g.setColor(fgColor2);
    drawSegments(startX[2], startY[2], d.m1);
  }  
  if(d.m2 != lastM2) {
    g.setColor(bgColor);
    drawSegments(startX[3], startY[3], 8);
    g.setColor(fgColor2);
    drawSegments(startX[3], startY[3], d.m2);
  }
  
  lastH1 = d.h1;
  lastH2 = d.h2;
  lastM1 = d.m1;
  lastM2 = d.m2;
}

function drawData(d, nmode) {
  if(!nmode) {
    setScale(0.25, 0.25);
    g.clearRect(70, 0, 200, 29);
    g.setColor("#80C080");
    
    g.setFontAlign(0, -1);
    g.drawString(d.dateStr, 120, 8);

    setScale(0.375, 0.375);
    //g.clearRect(20, 162, 219, 190);
    // steps
    g.setColor("#4080C0");
    /*
    drawSegments(20, 158, Math.floor((stepCounter / 10000) % 10));
    drawSegments(35, 158, Math.floor((stepCounter / 1000) % 10));
    drawSegments(50, 158, Math.floor((stepCounter / 100) % 10));
    drawSegments(65, 158, Math.floor((stepCounter / 10) % 10));
    drawSegments(80, 158, Math.floor((stepCounter) % 10));
    */
    g.setFontAlign(-1, 1);
    g.drawString(d.steps, 28, 182, true);
    // battery
    g.setColor("#20C060");
    if(d.batt < 20) g.setColor('#C0C040');
    /*
    drawSegments(168, 158, Math.floor((batt / 100) % 10));
    drawSegments(184, 158, Math.floor((batt / 10) % 10));
    drawSegments(200, 158, Math.floor((batt) % 10));
    */
    g.setFontAlign(1, 1);
    g.drawString(d.batt, 214, 182, true);
  }

}


if (EMULATOR ) {
  let dt = new Date();
  let d = { hour: dt.getHours(), min: dt.getMinutes() ,
           dateStr: 'Sun Jan 1',
          date: 27, batt: 99, steps: 8000, dow: 'Fri'
          };
  drawBkgd(false);
  drawTime(d, false);
  drawData(d, false);
} else {
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawTime);
  v.setDrawData(drawData);
  v.begin();
}
