/*
** DIGITAL2
** Squared numerals with rounded ends
** non-military time presentation
** all data (steps, date, power) on bottom row, small square numerals
*/
let EMULATOR = false;

if(! EMULATOR) {
  let v = require('m_vatch');
  require("m_knxt").add(Graphics);
  g.setFont('KNXT', 1);
} else {
  g.setFontVector('18');
}


digitX = [28, 124];
digitY = [22, 118];

let fgColor = '#FFFFFF';
let bgColor = '#000000';
let goForFill = true;

lastH1 = -1;
lastH2 = -1;
lastM1 = -1;
lastM2 = -1;

let rect = (x1, y1, x2, y2) => { 
  if(goForFill) g.fillRect(x1, y1, x2, y2); 
  else g.drawRect(x1, y1, x2, y2); 
};
let endcap = (x, y, radius) => { 
  if(goForFill) g.fillCircle(x, y, radius); 
  else g.drawCircle(x, y, radius); 
};

function drawSegments(xOff, yOff, scale, radius, arr) {
  g.setColor(bgColor);
  g.fillRect(xOff-radius, yOff-radius, xOff+80*scale+radius, yOff+80*scale+radius);
  g.setColor(fgColor);
  /* allow for blank leading zero */
  if(arr.length < 2) return;
  let x0 = arr[0]*scale+xOff;
  let y0 = arr[1]*scale+yOff;
  let x1 = 0, y1 = 0;
  endcap(x0, y0, radius);
  
  for(let idx = 2; idx < arr.length; idx+=2) {
   x1 = arr[idx]*scale+xOff;
   y1 = arr[idx+1]*scale+yOff;
   endcap(x1, y1, radius);
   if(x1 == x0) {
     rect(x0 - radius, y0, x0 + radius, y1);
   } else {
     rect(x0, y0 - radius, x1, y0 + radius);
   }
  
  x0 = x1;
  y0 = y1;
  }
}

let draw0 =  [
0,0,  80,0,  80,80,  0,80,  0,0  
 ];
let draw1 =  [
60,0,  80,0,  80,80  
 ];
let draw2 =  [
0,0,  80,0,  80,40,  0,40,  0,80,  80,80  
 ];
let draw3 =  [
0,0,  80,0,  80,40,  40,40,  80,40,  80,80,  0,80  
 ];
let draw4 =  [
0,20,  0,40,  80,40,  80,0,  80,80  
 ];
let draw5 =  [
80,0,  0,0,  0,40,  80,40,  80,80,  0,80  
 ];
let draw6 =  [
80,0,  0,0,  0,40,  80,40,  80,80,  0,80,  0,40
 ];
let draw7 =  [
0,20,  0,0,  80,0,  80,80  
 ];
let draw8 =  [
0,80,  0,0,  80,0,  80,80,  0,80,  0,40,  80,40  
 ];
let draw9 =  [
80,40,  0,40,  0,0,  80,0,  80,80,  0,80  
 ];
let drawBlank = [ 0 ];



let digit = [ draw0, draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9, drawBlank];

/* nice frame */

/* SAVE FOR ANOTHER CLOCK
for(let idy = 0, offX=20; idy <= 20; idy += 5) {
  g.setColor(idy/100, idy/100, idy/100);
  g.drawRect(offX, idy, 239-offX, idy);
  g.drawRect(offX, 239-idy, 239-offX, 239-idy);
  offX -= 5;
}
*/



/** **/
function drawBkgd(nmode) {
  g.setBgColor(bgColor);
  g.clear();
  lastH1 = -1;
  lastH2 = -1;
  lastM1 = -1;
  lastM2 = -1;
  if (nmode) return;
  //g.setColor('#808080');
  //g.drawLine(0, 210, 239, 210);
}

function drawRealTime(d, nmode) {
  //screw military
  let hour = (d.h1 * 10 + d.h2) % 12;
  if(hour == 0) hour = 12;
  d.h1 = hour > 9 ? 1 : 10; // 10 == blank
  d.h2 = hour % 10;
  
  fgColor = nmode? '#004040' : '#e0e0e0';
  if(lastH1 != d.h1) drawSegments(digitX[0], digitY[0], 1, 5, digit[d.h1]);
  if(lastH2 != d.h2) drawSegments(digitX[1], digitY[0], 1, 5, digit[d.h2]);
  
  fgColor = nmode ? '#004040' : '#00f0f0';
  if(lastM1 != d.m1) drawSegments(digitX[0], digitY[1], 1, 5, digit[d.m1]);
  if(lastM2 != d.m2) drawSegments(digitX[1], digitY[1], 1, 5, digit[d.m2]);
  
  lastH1 = d.h1;
  lastH2 = d.h2;
  lastM1 = d.m1;
  lastM2 = d.m2;
}

function drawDigits(num, x0, y0, places) {

  for(let x=places-1; x >= 0 ; x--) {
    let col = Math.pow(10,x);
    let val = Math.floor(num / col);
    //console.log('col=' + col+' ; val='+val);
    drawSegments(x0, y0, 0.22, 1, digit[val]);
    x0 += 24;
    num -= val*col;
  }

}

function drawRealData(d, nmode) {
  if(nmode) return;
  g.setColor(bgColor);
  g.fillRect(0, 216, 239, 239);
  //g.fillRect(110, 0, 140, 14);
  
  /*
  g.setColor('#c0c000');
  g.setFontAlign(-1, -1);
  g.drawString(d.steps, 8, 218);
  g.setFontAlign(0, -1);
  g.drawString(d.dow+' '+d.date, 118, 218);
  g.setFontAlign(1, -1);
  g.drawString(d.batt, 238, 218, 1);
  */
  let x = 1;
  fgColor = '#e0d080';
  drawDigits(d.steps, x, 213, 5);
  fgColor = '#c080c0';
  x += 120;
  drawDigits(d.date, x, 213, 2);
  fgColor = '#c0e0c0';
  x += 48;
  drawDigits(d.batt, x, 213, 3);
}



if(!EMULATOR) {
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawRealTime);
  v.setDrawData(drawRealData);
  v.begin();
} else {
  let dt = new Date();
  let d = { hour:dt.getHours(), min:dt.getMinutes(),
    steps: 12345, batt: 47,
          dow: 'Thu', date: dt.getDate(),
          h1: Math.floor(dt.getHours() / 10),
          h2: Math.floor(dt.getHours() % 10),
          m1: Math.floor(dt.getMinutes() / 10),
          m2: Math.floor(dt.getMinutes() % 10),
          };
  drawBkgd(false);
  drawRealTime(d, false);
  drawRealData(d, false);
}
