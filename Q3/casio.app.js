let EMULATOR = false;

g.setBgColor(0);
g.clear();
g.setColor(6);
let wX = g.getWidth()-1, wY = g.getHeight()-1;
let isB2 = (wX < 200);
let dix = (x) => {return x*g.getWidth(); };
let diy = (y) => {return y*g.getHeight(); };

const pad0 = (n) => (n > 9) ? n : ("0"+n); 

const getToday = () => {
  let d = new Date();
  return d.getFullYear()+'-'+ pad0(d.getMonth()+1) + '-' + pad0(d.getDate());
};

let interval = null;

let nightMode = false;
let bgColor = 6;
let fgColor1 = 0;
let fgColor2 = 0;


function logD(str) {
  console.log(str);
}

const startX = [dix(0.08),  dix(0.21), dix(0.38), dix(0.51), dix(0.69), dix(0.77) ];
const startY = [diy(0.3),  diy(0.3),diy(0.3),diy(0.3),diy(0.42),diy(0.42) ];
let xS = 0.3;
let yS = 0.3;

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

function drawRoundRect(x0, y0, x1, y1, r) {
  g.C = g.fillCircle;
  
  g.C(x0+r,y0+r,r);
  g.C(x1-r,y1-r,r);
  g.C(x0+r,y1-r,r);
  g.C(x1-r,y0+r,r);

  g.R = g.fillRect;
  g.R(x0,y0+r,x1,y1-r);
  g.R(x0+r,y0,x1-r,y1);
}

function drawBkgd(nm) {
  g.setColor(3);
  drawRoundRect(0, 0, wX, wY, 16);
  g.setColor(0);
  drawRoundRect(4, 4, wX-4, wY-4, 14);
  g.fillRect(0, 20, wX, wY-24);

  g.setColor(2);
  g.fillRect(0, 24, 3, wY-28);
  g.fillRect(wX-3, 24, wX, wY-28);
  
  g.setColor(7);
  drawRoundRect(dix(0.1)-4, diy(0.3)-4, dix(0.9)+4, diy(0.7)+4, 10);
  g.setColor(0);
  drawRoundRect(dix(0.1)-3, diy(0.3)-3, dix(0.9)+3, diy(0.7)+3, 9);
  g.setColor(7);
  drawRoundRect(dix(0.1), diy(0.3), dix(0.9), diy(0.7), 8);
  
  var img = {
  width : 109, height : 34, bpp : 1,
  buffer : require("heatshrink").decompress(atob("AH4A7n/6AQIBB/kLgP/+AMBg///EH/kDAgN8n//4ANBv//8E/AIP/8fh///BgIVB/+BAIX/j8f//8GoXV/kfvkfwH4/H9k/ggEBGgPg/Pw/kCg/P4ASBgEPwEIh+Pwf1oE+n0A/AoBvgCCFAP/8Pz+AjBIYICBg/h+BDBx+fwAcBgEfAQM+h5RB/gfBIAIKBAQOh//+gEX+fn8BABEoPgj+fR4UPz4jBIAU/yX8GYPfwH8NgMvIAMABQPvFAKaB8/HSoawB/w9B/YEBnymBIYRnB+49B5//+PwDwJDBGwP+jcAnVf/0NMQLZCAH4AsA="))
};
  g.drawImage(img,33,10);
  Bangle.buzz(900);
  lastH1 = -1;
  lastH2 = -1;
  lastM1 = -1;
  lastM2 = -1;
}

function drawTime(d, nmode) {

  //logD(d);
  setScale(0.6, 0.6);
  d.sec = Date().getSeconds();
  
  if(d.hour > 12) {
    d.hour -= 12;
    if(d.hour == 0) d.hour = 12;
    d.h1 = Math.floor(d.hour/12);
    d.h2 = d.hour%12;
  }
  d.m1 = Math.floor(d.min/10);
  d.m2 = d.min%10;
  d.s1 = Math.floor(d.sec/10);
  d.s2 = d.sec%10;
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
  // always seconds
  setScale(0.36, 0.38);
  g.setColor(bgColor);
  drawSegments(startX[4], startY[4], 8);
  drawSegments(startX[5], startY[5], 8);
  g.setColor(fgColor2);
  drawSegments(startX[4], startY[4], d.s1);
  drawSegments(startX[5], startY[5], d.s2);
  
  
  lastH1 = d.h1;
  lastH2 = d.h2;
  lastM1 = d.m1;
  lastM2 = d.m2;
}

function drawData(d,nm) {
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
  v = require('m_vatch.js');
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawTime);
  v.setDrawData(drawData);
  v.begin();
}
