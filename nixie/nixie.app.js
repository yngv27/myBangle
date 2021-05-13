let v = require('m_vatch');
require("m_knxt").add(Graphics);
g.setFont('KNXT', 1);

let xs = 0.5;
let ys = 0.625;

let  prevH1 = -1;
let  prevH2 = -1;
let  prevM1 = -1;
let  prevM2 = -1;

let nightMode = false;

let logD = (msg) => { console.log(msg); };

let points0 = [
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
];

let points1 = [ 40, 99, 40, 0];

let points2 = [ 0, 25,
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
              ];

let points4 = [ 60, 99, 60, 0, 0, 75, 79, 75 ];

let points8 = [
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
  ];

let points6 = [
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
  ];

let points3 = [
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
  ];

let points7 = [ 0, 0, 79, 0, 30, 99 ];

let points9 = [];
let points5 = [
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
];

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
  if(d < 0) return;
  g.setColor("#000000");
  if(nightMode) {
    drawPoints(pointsArray[d], x, y);
    return;
  }
  drawPoints(pointsArray[d], x, y);
  drawPoints(pointsArray[d], x-1, y-1);
  drawPoints(pointsArray[d], x+1, y-1);
  drawPoints(pointsArray[d], x-1, y+1);
  drawPoints(pointsArray[d], x+1, y+1);
}

function drawDigit(d, x, y) {
  console.log('in drawDigit');
  let halo = "#808080"; /* #FF6000 */
  let colour = "#F0F0F0"; /* #FFC000 */
  if(nightMode) {
    g.setColor("#206040");
    drawPoints(pointsArray[d], x, y);
    return;
  }

  console.log('setting color to ' + halo);
  g.setColor(halo);
  drawPoints(pointsArray[d], x-1, y-1);
  drawPoints(pointsArray[d], x+1, y-1);
  drawPoints(pointsArray[d], x-1, y+1);
  drawPoints(pointsArray[d], x+1, y+1);

  g.setColor(colour);
  drawPoints(pointsArray[d], x, y);

}

function drawBtyIcon(x, y, pct) {
  const btyPoints = [
    0,0,
    30, 0,
    30, 5,
    35, 5,
    35, 15,
    30, 15,
    30, 20,
    0, 20,
    0, 0
    ];
  drawPoints(btyPoints, x, y);
  if(!pct) return;
  // calc pct (remove +)
  // heck use 28 as 'full'
  let width = Math.floor(parseInt(pct) * 28 * xs / 100);
  // erase inner bkgd
  g.setColor(0,0,0);
  g.fillRect(x+1, y+1, x+(Math.floor(29*xs)), y+Math.floor(19*ys));
  // draw it -- color?
  if(parseInt(pct) < 30) g.setColor('#C0C000');
  else g.setColor('#00C0C0');
  g.fillRect(x+1, y+1, x+1+width, y+Math.floor(19*ys));
}

function drawStepIcon(x, y) {
   const stepPoints2 = [
    10, 7,
     11,6,
     12,7,
     11, 8
    ];
  const stepPoints = [
    11, 20,
    0, 10,
    0, 5,
    6, 0,
    15, 0,
    20, 5,
    20, 10,
    11, 20
    ];
  drawPoints(stepPoints, x, y);
  drawPoints(stepPoints2, x, y);
}

function drawRealTime(d, nmode) {
  logD('in drawRealTIme');
  nightMode = nmode;
  
  if(d.h1 != prevH1) {
    eraseDigit(prevH1, 20, 60);
    drawDigit(d.h1, 20, 60);
  }
  if(d.h2 != prevH2) {
    eraseDigit(prevH2, 70, 60);
    drawDigit(d.h2, 70, 60);
  }
  if(d.m1 != prevM1) {
    eraseDigit(prevM1, 130, 60);
    drawDigit(d.m1, 130, 60);
  }
  if(d.m2 != prevM2) {
    eraseDigit(prevM2, 180, 60);
    drawDigit(d.m2, 180, 60);
  }

  prevH1 = d.h1;
  prevH2 = d.h2;
  prevM1 = d.m1;
  prevM2 = d.m2;

}

let  drawBackground = (nmode) => {
  logD('in drawBkgd');
  g.clear();
  prevH1 = -1;
  prevH2 = -1;
  prevM1 = -1;
  prevM2 = -1;

  if(nmode) return;
  
  g.setColor("#C0C0C0");
    //g.drawLine(20, 140, 219, 140);
    //g.drawLine(20, 226, 219, 226);
  for(let x=0; x < 120; x++) {
       g.setColor(x/120, x/120, x/120);
       g.setPixel(x, 140);
       g.setPixel(239-x, 140);
  }

  g.setColor("#00C0C0");
  drawStepIcon(44, 160);
  drawBtyIcon(190, 160);

};


let drawRealData = (d, nmode)=> {
  logD('in drawRealData');
  if (nmode) return;
  g.setColor("#000000");
  g.fillRect(0, 175, 239, 200);
  g.setColor('#00C0C0');

  g.setFontAlign(0, -1);
  g.drawString(d.dow, 120, 160);
  g.drawString(d.date, 120, 175);
  g.drawString(d.steps, 50, 175);
  g.drawString(d.batt, 200, 175);
  drawBtyIcon(190, 160, d.battery);

};

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
