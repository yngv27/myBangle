/*
** "Swoop" version of the gXX series
** Actually similar layout to the original G26, but the swoop is dynamic
** This version uses wireframe numerals, not the original G26 polygons
*/
g.clear();

let opts = {
  power: 2,
  xFudge:  12,
  xoff: 80,
  yoff: 200,
  minR: 2,
  rFactor: 10,
};

let v = require("m_vatch");

require("m_omnigo").add(Graphics);
g.setFont("Omnigo", 2); // bitmap font, x magnified
g.setFontAlign(-1,-1);

let fgColor = "#FFFFFF";
let bgColor = "#000000";

let fillDigits = true;

const startX = [ 48, 116,  48, 116 ];
const startY = [ 22,  22, 128, 128 ];
/*
const hht = 60;
const vht = 40;
*/
const w = 60;
const h = 90;

const xyScale = 0.75;

let lastH1 = -1;
let lastH2 = -1;
let lastM1 = -1;
let lastM2 = -1;

let setFG = (c) => { g.setColor(fgColor); };
let setBG = (c) => { g.setColor(bgColor); };

function scaleArray(arrOrig) {
  let scaled = [];
  for(let i=0; i< arrOrig.length; i++) {
    scaled.push(arrOrig[i]*xyScale);
  }
  return scaled;
}
function ellipse(x1, y1, x2, y2, fill) {
  if (fill) g.fillEllipse(x1*xyScale, y1*xyScale, x2*xyScale, y2*xyScale);
  else g.drawEllipse(x1*xyScale, y1*xyScale, x2*xyScale, y2*xyScale);
}

function poly(arr, fill) {
  let sarr = scaleArray(arr);
  if (fill) g.fillPoly(sarr, true);
  else g.drawPoly(sarr, true);
}

function rect(x1, y1, x2, y2, fill) {
  if (fill) g.fillRect(x1*xyScale, y1*xyScale, x2*xyScale, y2*xyScale);
  else g.drawRect(x1*xyScale, y1*xyScale, x2*xyScale, y2*xyScale);
}


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
  rect(x, y, (x+w), (y+h), true);
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

function drawBkgd(nightMode) {
  g.clear();
  fillDigits = !nightMode; 
  lastH1 = -1;
  lastH2 = -1;
  lastM1 = -1;
  lastM2 = -1;
  
  swoop(opts);
}

function setCoolColor(x) {
  let r = 0.3 + Math.sin(x/32)/2;
  let g = 0.3 + Math.cos(x/32)/2;
  let b = x/240;
  g.setColor(r,g,b);
}

function swoop(o) {
  for(let x=0; x < 320; x+=3) {
    let r = o.minR + Math.floor(x/o.rFactor);
    let x0 = x - Math.sin(x/180*Math.PI)*r;
    let x1 = x + Math.sin(x/180*Math.PI)*r;
    let y = o.yoff - Math.pow((x-o.xoff)/o.xFudge, o.power);
    let y0 = y - Math.cos(x/180*Math.PI)*r;
    let y1 = y + Math.cos(x/180*Math.PI)*r;
    setCoolColor(x);
    g.drawLine(x0,y0,x1,y1);
  }
}

function drawTime(d, nightMode) {
  
  if(d.hour > 12) {
    let h = d.hour - 12;
    if(h === 0)  h=12;
    d.h1= Math.floor(h / 10);
    d.h2 = h % 10;
  }

  fgColor = nightMode ? "#404040" : "#FFFFFF";
  if(d.h1 != lastH1) {
    drawDigit(0, d.h1);
  }
  if(d.h2 != lastH2) {
    drawDigit(1, d.h2);
  }
  
  fgColor = nightMode ? "#004040" : "#00FFFF";
  if(d.m1 != lastM1) {
    drawDigit(2, d.m1);
  }
  if(d.m2 != lastM2) {
    drawDigit(3, d.m2);
  }  
  lastH1 = d.h1;
  lastH2 = d.h2;
  lastM1 = d.m1;
  lastM2 = d.m2;
}

function drawData(d, nightMode) {
  if(nightMode) return;

  g.setColor("#80e0e0");
  g.setFontAlign(1, 1);
  g.drawString(d.steps, 239, 239, true);
  g.drawString(d.batt+'%', 239, 210, true);
  g.setColor("#e0e0e0");
  g.setFontAlign(0, 1);
  str = d.dateStr;
  g.drawString(str, 82, 239, true);
}

v.setDrawBackground(drawBkgd);
v.setDrawTime(drawTime);
v.setDrawData(drawData);
v.begin();
