/*
** G28: Using line drawn numerals and colored flyouts
*/
let v = require('m_vatch');
require("m_knxt").add(Graphics);
g.setFont("KNXT", 1);


const pad0 = (n) => (n > 9) ? n : ("0"+n); 
const logD = (str)=> {
  //console.log(str);
};


let fgColor = "#FFFFFF";
let bgColor = "#000000";

let fillDigits = true;
let nightMode = false;

const startX = [ 12, 68,  12,  68 ];
const startY = [ 18, 18, 124, 124 ];

let prevH1 = -1;
let prevH2 = -1;
let prevM1 = -1;
let prevM2 = -1;

let xS = 0.4, yS = 0.4;

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
  rect(x, y, x+60, y+120, true);
  dFuncs[dig](x,y);
  setFG();

}

function clearDataAreas() {
  g.setColor('#408040');
  
  g.fillPoly([130, 20, 239, 20, 239, 40, 130, 40], true);
  g.setColor('#404080');
  
  g.fillPoly([130, 110, 239, 110, 239, 130, 130, 130], true);
  g.setColor('#804080');
  
  g.fillPoly([130, 200, 239, 200, 239, 220, 130, 220], true);
  
}

function drawBackground(nmode) {

  g.clear();
  if(nmode) return;
  
  g.setColor('#408040');
  g.drawPoly([0, 0, 10, 10, 120, 10, 130, 20], false);
  
  g.setColor('#404080');
  g.drawLine(0, 120, 239, 120);
  
  g.setColor('#804080');
  g.drawPoly([0, 239, 9, 230, 120, 230, 130, 220], false);
  
}
  
function drawRealData(d, nmode) {

  if(nmode) return;
	
  clearDataAreas();
  g.setFontAlign(1, 0);
  g.setColor(1,1,1);
  g.drawString("STEP " + d.steps, 230, 122);

  g.drawString("BTY " + d.batt, 230, 212);

  g.drawString(d.dateStr, 230, 32);

}

function drawRealTime(d, nmode) {
  logD('in drawRealTIme');  
    

  fgColor = nmode ? "#404040" : "#FFFFFF";
  if(d.h1 != prevH1) {
     drawDigit(0, d.h1);
  }
  if(d.h2 != prevH2) {
    drawDigit(1, d.h2);
  }
  
  fgColor = nmode ? "#004040" : "#00FFFF";
  if(d.m1 != prevM1) {
    drawDigit(2, d.m1);
  }
  if(d.m2 != prevM2) {
     drawDigit(3, d.m2);
  }

  prevH1 = d.h1;
  prevH2 = d.h2;
  prevM1 = d.m1;
  prevM2 = d.m2;

}

let orientationSwitch = (nmode) => {
  prevH1 = -1;
  prevH2 = -1;
  prevM1 = -1;
  prevM2 = -1;
};

v.setDrawBackground(drawBackground);
v.setDrawTime(drawRealTime);
v.setDrawData(drawRealData);

v.begin();

