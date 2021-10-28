let EMULATOR = false;
// which Bangle?
const isB2 = (process.env.BOARD == 'BANGLEJS2');

const MY_HEIGHT = 70;  // in inches..  divide by 2.54 if cm
const MY_WEIGHT = 170; // in pounds.. multipley by 2.2 if kg
// calories / step == 0.57 * weight(lb) * height(in) / 126720
const MY_BURN_RATE = 0.57 * MY_WEIGHT * MY_HEIGHT / 126720;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

require("blocky.fnt").add(Graphics);
g.setFont("Blocky",isB2 ? 1 : 1);

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

function drawBattery(x,y) {
  // x,y is top/left
  g.setColor(fgc);
  let segX = isB2 ? 2 : 3;
  let segY = isB2 ? 12 : 18;
  let yinc = segY / 4;
  let xinc = (segX + 3) * 4;
  g.drawPoly([
    x,y,
    x+xinc,y,
    x+xinc,y+yinc,
    x+xinc+segX,y+yinc,
    x+xinc+segX,y+yinc*3,
    x+xinc,y+yinc*3,
    x+xinc, y+yinc*4,
    x, y+yinc*4
    ], true);
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
}
/*
** BEGIN WATCH FACE
*/

const startX=[6,47,95,136],startY=[40,40,40,40],nmX=[16,42,88,126],nmY=[12,12,12,12];let xS=1,yS=1;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
/*
** END WATCH FACE
*/

let lastTime = '    ';
let WHITE = isB2 ? 7 : '#ffffff';
let BLACK = 0;
let bgc = WHITE;
let fgc = BLACK;
// set to true for some playful color blocks
let MONDRIAN = false;

// adjust coords by Bangle
if(isB2) {
  xS = 1; yS = 1;
} else {
  xS = 1.36; yS = 1.36;
  for(let i=0; i<4; i++) {
    startX[i] *= xS;
    startY[i] *= yS;
  }
}

if(MONDRIAN) {
  for(let i=0; i<4; i++) {
    startX[i] *= 0.6;
    startY[i] *= 0.6;
  }
  xS *= 0.6; yS *= 0.8;
}

function drawBkgd(nm) {
  // Bangle1 and B2 if night mode
  bgc = BLACK; fgc = WHITE; 
  if(!nm && isB2)  { bgc = WHITE; fgc = BLACK; }
  g.setBgColor(bgc);
  g.clear();
  lastTime = '    ';

  if(MONDRIAN) {
    g.setColor(0);
    g.fillRect(110,0,117,175);
    g.fillRect(0,110,175,117);
    g.setColor(4);
    g.fillRect(118,0,175,109);
    g.setColor(1);
    g.fillRect(0,118,109,175);
    g.setColor(6);
    g.fillRect(118,118,175,176);
  }
}

let b2NightMode = false;
function drawClock(d, nm) {
  // ignore the watch position nightmode for B2
  if(isB2) {
    if(d.hour > 17 || d.hour < 7) { 
      if(!b2NightMode) {
        b2NightMode = true;
        drawBkgd(b2NightMode);
      }
    } else {
      if(b2NightMode) {
        b2NightMode = false;
        drawBkgd(b2NightMode);
      }
    }
  }
  if(!MONDRIAN) {
    if(Date().getSeconds() % 2 ) g.setColor(fgc); else g.setColor(bgc);
    g.fillCircle(midX,  relY(0.42), 3);
    g.fillCircle(midX,  relY(0.56), 3);
  }
  //console.log(d);
  d.hour %= 12;
  if (d.hour === 0) d.hour = 12;
  
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) {
    //console.log(`no change: last time = [${lastTime}]`);
    return;
  }
  console.log("tm/last= "+tm+"/"+lastTime);

  //drawBkgd(nm);
  for(let i=0; i<4; i++) {
    console.log(`${tm[i]}:${lastTime[i]}`);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      g.setColor(fgc);
      console.log(`calling dD: ${i} ${tm[i]}`);
      drawDigit(i,tm[i], false);
      //g.flip();
    } else {
      console.log('skipping digit '+i);
    }
  }
  lastTime = tm;
}

// uses constants from top; set to your own
function calcCalories(steps) {
  // calories / step == 0.57 * weight(lb) * height(in) / 126720
  return Math.floor(MY_BURN_RATE * steps);
}



function drawData(d, nm) {
  //console.log(d);
  g.setColor(fgc);
  let dy = isB2 ? 2 : 20;

  g.setFontAlign(1,-1);
  g.drawString(' '+d.batt+' ', wX, dy, true);
  g.setFontAlign(-1,-1);
  g.drawString(' '+d.dateStr+' ', 0, dy, true);
  //g.flip();
  
  g.drawImage(imgCalorie, relX(0.17), relY(0.71));
  g.drawImage(imgStep, relX(0.454),  relY(0.71));
  g.drawImage(imgPulse, relX(0.739),  relY(0.71));
  
  if(MONDRIAN) g.setBgColor(1);
  
  g.setFontAlign(0,-1); // center X, top Y
  g.drawString(' '+('0000'+calcCalories(d.steps)).slice(-4)+' ', relX(0.21), relY(0.84), true);
  g.drawString(' '+('00000'+d.steps).slice(-5)+' ', relX(0.5), relY(0.84), true);
  g.setColor(fgc);
  g.drawString(' '+('000'+d.hrm).slice(-3)+' ', relX(0.8), relY(0.84), true);
  g.setBgColor(bgc);
  
  g.flip();
}


if(!EMULATOR) {
  let v = require("m_vatch.js");
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawClock);
  v.setDrawData(drawData);
  v.begin();
} else {
  drawBkgd();
  drawClock({dow:3, hr:12, min: 34, mon:5, dt:31, sec:56}, false);
}