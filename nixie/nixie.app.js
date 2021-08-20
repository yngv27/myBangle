
// which Bangle?
const isB2 = g.getWidth() < 200;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

// colors
const col_bg = 0;
const col_nm =isB2 ? 1 :"#206040";
const col_sep = isB2 ? 6 :"#202020";
const col_off = isB2 ? 1 : "#202020";
const col_shad1 = isB2 ? 4 :"#FF0000";
const col_shad2 = isB2 ? 6 :"#FF6000";
const col_hi =isB2 ? 7 : "#FFC000";
const col_data = isB2 ? 6 :"#C06000";

g.setBgColor(col_bg);
g.clear();

require("Font8x12").add(Graphics);
g.setFont("8x12", 1);
let interval = null;

let alarming = false;
let nightMode = false;

// our scale factor
let xs = 0.5 * wX/240;
let ys = 0.75 * wY/240;

let prevH1 = -1;
let prevH2 = -1;
let prevM1 = -1;
let prevM2 = -1;


let points0 = new Uint8Array([
  0, 40,
  1, 35,
  7, 20, 
  16, 8,
  28, 2,
  40, 0,
  
  51, 2,
  63, 10,
  72, 20,
  77, 35,
  78, 40,
  
  78, 59,
  77, 64,
  72, 79,
  63, 89,
  51, 97,
  
  40, 99,
  28, 97,
  16, 91,
  7, 79,
  1, 64,
  0, 59,
  0, 40
]);

let points1 = new Uint8Array([ 40, 99, 40, 0]);

let points2 = new Uint8Array([ 0, 25,
               2, 22,
              6, 13, 
              17, 5,
              28, 2,
              40, 0,
              52, 2,
              63, 5,
              74, 13,
              79, 23,
              79, 28,
              74, 38,
               63, 46,
              51, 54,
              40, 58,
              29, 62,
              17, 68,
              8, 80,
              0, 99,
              79, 99
              ]);

let points4 = new Uint8Array([ 60, 99, 60, 0, 0, 75, 79, 75 ]);

let points8 = new Uint8Array([
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  
  52, 39,
  62, 34,
  69, 29,
  72, 23,
  72, 19,
  69, 12,
  62, 6,
  52, 2,
  40, 0,
  
  28, 2,
  18, 6,
  11, 12,
  8, 19,
  8, 23,
  11, 29,
  18, 34,
  28, 39,
  40, 40,
  ]);

let points6 = new Uint8Array([
  50, 0,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  ]);

let points3 = new Uint8Array([
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  39, 40,
  79, 0,
  1, 0
  ]);

let points7 = new Uint8Array([ 0, 0, 79, 0, 30, 99 ]);

let points9 = new Uint8Array(points6.length);
let points5 = new Uint8Array([
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  26, 42,
  15, 46,
  27,  0,
  79,  0,
]);

function drawPoints(points, x0, y0) {
  let x = points[0]*xs+x0, y = points[1]*ys+y0;
   //g.drawEllipse(x-2, y-2, x+2, y+2);
   g.moveTo(x, y);
  for(let idx=1; idx*2 < points.length; idx ++) {
    let x = points[idx*2]*xs+x0;
    let y = points[idx*2+1]*ys+y0;
    //g.drawEllipse(x-2, y-2, x+2, y+2);
    g.lineTo(x, y);
  }
}

/* create 5 from 2  */
/* uncomment if you want the 5 to look more authentic (but uglier)
for (let idx=0; idx*2 < points2.length; idx++) {
   points5[idx*2] = points2[idx*2];
   points5[idx*2+1] = 99-points2[idx*2+1];
}
*/
/* create 9 from 6 */
for (let idx=0; idx*2 < points6.length; idx++) {
   points9[idx*2] = 79-points6[idx*2];
   points9[idx*2+1] = 99-points6[idx*2+1];
}

pointsArray = [points0, points1, points2, points3, points4, points5, points6, points7, points8, points9];

function eraseDigit(d, x, y) {
  if(d < 0 || d > 9) return;
  g.setColor(col_bg);
  if(nightMode) {
    drawPoints(pointsArray[d], x, y);
    return;
  }
  drawPoints(pointsArray[d], x-2, y-2);
  drawPoints(pointsArray[d], x+2, y-2);
  drawPoints(pointsArray[d], x-2, y+2);
  drawPoints(pointsArray[d], x+2, y+2);
  drawPoints(pointsArray[d], x-1, y-1);
  drawPoints(pointsArray[d], x+1, y-1);
  drawPoints(pointsArray[d], x-1, y+1);
  drawPoints(pointsArray[d], x+1, y+1);
}

function drawDigit(d, x, y) {
  if(nightMode) {
    g.setColor(col_nm);
    drawPoints(pointsArray[d], x, y);
    return;
  }
  g.setColor(col_off);
  for (let idx = pointsArray.length - 1; idx >= 0 ; idx--) {
    if(idx == d)  {
      g.setColor(col_shad1);
      drawPoints(pointsArray[d], x-2, y-2);
      drawPoints(pointsArray[d], x+2, y-2);
      drawPoints(pointsArray[d], x-2, y+2);
      drawPoints(pointsArray[d], x+2, y+2);
      g.setColor(col_shad2);
      drawPoints(pointsArray[d], x-1, y-1);
      drawPoints(pointsArray[d], x+1, y-1);
      drawPoints(pointsArray[d], x-1, y+1);
      drawPoints(pointsArray[d], x+1, y+1);

      g.setColor(col_hi);
      drawPoints(pointsArray[d], x, y);

      g.setColor(col_off);
    } else {
      drawPoints(pointsArray[idx], x, y);
    }
  }
}

function drawTime(d,nm) {
  const dx = [relX(0.042), relX(0.271), relX(0.55), relX(0.791)]; //[ 10, 65, 135, 190];
  const dy = [relY(0.333),relY(0.333),relY(0.333),relY(0.333)];
  
  let h1 = Math.floor(d.hour / 10);
  let h2 = d.hour % 10;
  let m1 = Math.floor(d.min / 10);
  let m2 = d.min % 10;

  if(h1 == prevH1 && h2 == prevH2 && m1 == prevM1 && m2 == prevM2) {
    return;
  }
  nightMode = nm;

  if(h1 != prevH1) {
    eraseDigit(prevH1, dx[0], dy[0]);
    drawDigit(h1, dx[0], dy[0]);
  }
  if(h2 != prevH2) {
    eraseDigit(prevH2, dx[1], dy[1]);
    drawDigit(h2, dx[1], dy[1]);
  }
  if(m1 != prevM1) {
    eraseDigit(prevM1, dx[2], dy[2]);
    drawDigit(m1, dx[2], dy[2]);
  }
  if(m2 != prevM2) {
    eraseDigit(prevM2, dx[3], dy[3]);
    drawDigit(m2, dx[3], dy[3]);
  }
  prevH1 = h1;
  prevH2 = h2;
  prevM1 = m1;
  prevM2 = m2;

}

function drawData(d) {
  if(!nightMode) {
    g.setColor(col_bg);
    g.fillRect(0, relY(0.042), wX, relY(0.1));
    g.fillRect(0, relY(0.925), wX, wY);
    g.setColor(col_sep);
    g.drawLine(0, relY(0.11), wX, relY(0.11));
    g.drawLine(0,  relY(0.93), wX,  relY(0.93));
    g.setColor(col_data);
    g.setFontAlign(0, -1);
    g.drawString(d.mon3 + " " + d.date, wX/2, relX(0.042));
    g.setFontAlign(-1,-1);
    g.drawString("STEP " + d.steps, 0, relY(0.94));
    g.setFontAlign(1,-1);
    g.drawString("BTY "+d.batt, wX, relY(0.94));
  }
}
Bangle.setUI("clock");
//setWatch(E.showLauncher, BTN1, {repeat:true,edge:"falling"});
/*
let d = new Date();

let hour = d.getHours();
let minute = d.getMinutes();

let h1 = Math.floor(hour / 10);
let h2 = hour % 10;
let m1 = Math.floor(minute / 10);
let m2 = minute % 10;

let data = {
  h1: h1,
  h2: h2,
  m1: m1,
  m2: m2,
  hour: hour,
  min: minute,
};
drawTime(data, nightMode);
const mstr="JanFebMarAprMayJunJulAugSepOctNovDec";
const dowstr = "SunMonTueWedThuFriSat";

let month = d.getMonth();
let dow = d.getDay();
data.month = month;
data.date = d.getDate();

data.mon3 = mstr.slice(month*3,month*3+3);
data.dow = dowstr.substr(dow*3,3);
data.dateStr = data.dow + " " + data.mon3 + " " + data.date;
data.steps = 12345;
data.batt = E.getBattery() + (Bangle.isCharging() ? "+" : "");
data.charging = Bangle.isCharging();

drawData(data);

*/
let v = require("m_vatch.js");
v.setDrawTime(drawTime);
v.setDrawBackground(()=>{g.clear();prevH1=-1;prevH2=-1;prevM1=-1;prevM2=-1;});
v.setDrawData(drawData);
v.begin();
/**/
