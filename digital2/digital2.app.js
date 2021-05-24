let v = require('m_vatch');
require('m_knxt').add(Graphics);
g.setFont('KNXT',1);

digitX = [28, 122];
digitY = [24, 118];

let radius = 5;
let width = 12;
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
let endcap = (x, y) => { 
  if(goForFill) g.fillCircle(x, y, radius); 
  else g.drawCircle(x, y, radius); 
};

function drawSegments(xOff, yOff, arr) {
  g.setColor(bgColor);
  g.fillRect(xOff-radius, yOff-radius, xOff+80+radius, yOff+80+radius);
  g.setColor(fgColor);
  let x0 = arr[0]+xOff;
  let y0 = arr[1]+yOff;
  let x1 = 0, y1 = 0;
  endcap(x0, y0);
  
  for(let idx = 2; idx < arr.length; idx+=2) {
  	x1 = arr[idx]+xOff;
  	y1 = arr[idx+1]+yOff;
  	endcap(x1, y1);
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
  



let digit = [ draw0, draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9];

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
  g.setColor('#808080');
  g.drawLine(0, 210, 239, 210);
}

function drawRealTime(d, nmode) {
  //screw military
  let hour = (d[0] * 10 + d[1]) % 12;
  if(hour == 0) hour = 12;
  d[0] = hour > 9 ? 1 : 0;
  d[1] = hour % 10;
  
  fgColor = '#a0a0a0';
  if(lastH1 != d[0]) drawSegments(digitX[0], digitY[0], digit[d[0]]);
  if(lastH2 != d[1]) drawSegments(digitX[1], digitY[0], digit[d[1]]);
  
  fgColor = '#00f0f0';
  if(lastM1 != d[2]) drawSegments(digitX[0], digitY[1], digit[d[2]]);
  if(lastM2 != d[3]) drawSegments(digitX[1], digitY[1], digit[d[3]]);
}

function drawRealData(d, nmode) {
  if(nmode) return;
  g.setColor(bgColor);
  g.fillRect(0, 216, 239, 239);
  g.fillRect(110, 0, 140, 14);
  g.setColor('#c0c000');
  /*
  g.setFontAlign(-1, -1);
  g.drawString(d.dow+' '+d.date, 8, 218);
  g.setFontAlign(0, -1);
  g.drawString(d.battery, 112, 2);
  g.setFontAlign(1, -1);
  g.drawString(d.steps, 238, 218, 1);
  */  
  g.setFontAlign(-1, -1);
  g.drawString(d.steps, 8, 218);
  g.setFontAlign(0, -1);
  g.drawString(d.dow+' '+d.date, 118, 218);
  g.setFontAlign(1, -1);
  g.drawString(d.battery, 238, 218, 1);

}

v.setDrawBackground(drawBkgd);
v.setDrawTime(drawRealTime);
v.setDrawData(drawRealData);
//v.setOrientationChange(orientationSwitch);
v.start();
/*
drawBkgd(false);
drawRealTime([2,2,8,9], false);
//drawRealTime([0,5,6,7], false);
drawRealData( { dow: 'wed', date: '22', battery: '57', steps: '1234' }, false);
*/



