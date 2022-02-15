let EMULATOR = false;
// which Bangle?
const isB2 = g.getWidth() < 200;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

require("omnigo.fnt").add(Graphics);

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([65504,64482,65535,62434]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,23558,23559,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([63488,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

/*
** BEGIN WATCH FACE
*/

const startX = [  relX(0.18), relX(0.34), relX(0.56), relX(0.72) ];
const startY = [  relY(0.25), relY(0.25), relY(0.25), relY(0.25) ];
let xS = 0.75;
let yS = 0.75;

let lastH1 = -1;
let lastH2 = -1;
let lastM1 = -1;
let lastM2 = -1;

function setScale(x, y) {
  xS = x; yS = y;
}

function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] =Math.floor(arr[i+1]*yS) + y;
    // straighten
    //newArr[i] -= Math.floor((125-newArr[i+1])/8.75);
  }
  g.fillPoly(newArr, true);
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
function drawDigit(t,r,n){
  let x=(n?nmX:startX)[t];
  let y=(n?nmY:startY)[t];
  drawSegments(x,y,r);
}
/*
** END WATCH FACE
*/

let lastTime = '    ';
let bgc = 7;
let fgc = 0;


function drawBkgd(nm) {
  g.setBgColor(bgc);
  g.clear();
  g.setColor(fgc);
  g.fillRect(0,12,wX,12+2);
  g.fillRect(0,relY(0.3),wX,relY(0.3)+2);
  g.fillRect(0,relY(0.75),wX,relY(0.75)+2);
  for(let x =0; x < 200; x+=4) {
    g.drawLine(x, 12, x-12, 24);
  }
}
let blinky = false;

function drawTime(d, nm) {
  g.setColor(blinky ? fgc : bgc);
  blinky = !blinky;
  //console.log(blinky);
  g.fillCircle(relX(0.58),midY, 2);
  g.fillCircle(relX(0.58),midY+16, 2);
   
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) return;
  for(let i=0; i<4; i++) {
    //console.log(tm[i],lastTime[i]);
    if(tm[i] != lastTime[i]) {
      g.setColor(3);
      drawDigit(i, 8, false);
      g.setColor(fgc);
      drawDigit(i,tm[i], false);
      //g.flip();
    }
  }
  lastTime = tm;
}

function drawData(d, nm) {
}

if(!EMULATOR) {
  let v = require("m_vatch.js");
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawTime);
  v.setDrawData(drawData);
  v.begin();
}
