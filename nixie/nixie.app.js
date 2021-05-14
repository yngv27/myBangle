let EMULATOR = 0;

if(! EMULATOR) {
  let v = require('m_vatch');
  require("m_knxt").add(Graphics);
  g.setFont('KNXT', 1);
} else {
  g.setFontVector('18');
}

let xs = 0.625;
let ys = 0.8;

let  prevH1 = -1;
let  prevH2 = -1;
let  prevM1 = -1;
let  prevM2 = -1;

let nightMode = false;

let logD = (msg) => { console.log(msg); };


function rebuild2DArray(arr) {
  let Arr2D = [];
  let outerArrIdx = 0;
  //console.log('max='+arr.length);
  while(outerArrIdx < arr.length) {
    let innerArrLength = arr[outerArrIdx++];
    //console.log('len: '+innerArrLength);
    let innerArr = [];
    while( innerArrLength-- > 0) {
      innerArr.push(arr[outerArrIdx]);
      //console.log('pushing '+arr[outerArrIdx]);
      outerArrIdx++;
    }
    Arr2D.push(innerArr);
    //console.log('idx='+outerArrIdx);
  }
  return Arr2D;
}

let pts = 'l0AlEBkcHikQhEcgUogEzgU/hVIilNkdOlFOndNoFIp8/rMzsMosccsMQrcHp8BoEAnYrBggOBEwIBBjMCi0GhsRgozDmgzBgtKhtPi9PjlKk0/l0zm0onUdn0RokIqEAsdPscggNNg1XiNeIAI1Bmlhn9epVXp9Np9Cpc4oEumkqk8op8AgMAhE8sc8QYNLp9LkwpHk1jlQrOm0qlEojUqh8ujcAGIMomUAgk4gNCKzIqFEYMGKoItBj1jpgPHGZJgVmknn0iosdpEXpETosMn0GaYLXBbYMSg0LhkIicIi8LjsSkUcV4IABjtjpcrp0hp0WpIiBgszgUngEbgUQgsFhkAi0AkMElcPmsbnMnnc1nNAmojB';
//console.log(rebuild2DArray(require('heatshrink').decompress(atob(pts))));
pointsArray = rebuild2DArray(require('heatshrink').decompress(atob(pts)));



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
  //console.log('in drawDigit');
  let halo = 1 ? "#808080" : '#FF6000' ;
  let colour = 1 ? "#F0F0F0" : '#FFC000' ;
  if(nightMode) {
    g.setColor("#206040");
    drawPoints(pointsArray[d], x, y);
    return;
  }

  //console.log('setting color to ' + halo);
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
  let r = 8;
  let c = g.getColor();
  g.fillCircle(x+r, y+r, r);
  g.fillPoly([x, y+r, x+r+r, y+r, x+r, y+3*r], true);
  g.setColor('#202020');
  g.fillCircle(x+r, y+r, r/2);
  g.setColor(c);
}
function drawStepIcon2(x, y) {
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
  //logD('in drawRealTIme');
  nightMode = nmode;
  
  let x1 = 12, x2 = 70, y1 = 28, y2 = 130;
  if(nmode) {
    x1 += 60; x2 += 60;
  }
  
  if(d.h1 != prevH1) {
    eraseDigit(prevH1, x1, y1);
    drawDigit(d.h1, x1, y1);
  }
  if(d.h2 != prevH2) {
    eraseDigit(prevH2, x2, y1);
    drawDigit(d.h2, x2, y1);
  }
  if(d.m1 != prevM1) {
    eraseDigit(prevM1, x1, y2);
    drawDigit(d.m1, x1, y2);
  }
  if(d.m2 != prevM2) {
    eraseDigit(prevM2, x2, y2);
    drawDigit(d.m2, x2, y2);
  }

  prevH1 = d.h1;
  prevH2 = d.h2;
  prevM1 = d.m1;
  prevM2 = d.m2;

}

let  drawBackground = (nmode) => {
  //logD('in drawBkgd');
  g.clear();
  prevH1 = -1;
  prevH2 = -1;
  prevM1 = -1;
  prevM2 = -1;

  if(nmode) return;
  
  for(let x=0; x < 100; x++) {
    g.setColor(x/120, x/240, 0);
    g.setPixel(140+x, 92);
    g.setPixel(140+x, 146);
  }
  
  for(let x=0; x < 12; x++) {
    let c = (240-x*20)/256;
    g.setColor(0,c/2,c);
    g.drawCircle(x*2-20, 120, 180);
  }
  
  g.setColor("#00C0C0");
  drawStepIcon(203, 198);
  drawBtyIcon(200, 30);

};


let drawRealData = (d, nmode)=> {
  if (nmode) return;
  g.setColor('#C0C0C0');

  g.setFontAlign(0, 0);
  let dt = ' '+d.dow.toUpperCase() + ' ' + d.date;
  g.drawString(dt, 212, 120, true);
  g.drawString(dt, 213, 120, false);

  g.drawString(' '+d.batt+' ', 212, 64, true);
  g.drawString(' '+d.steps+' ', 212, 185, true);
  drawBtyIcon(200, 30, d.batt);
};

if(!EMULATOR) {
  v.setDrawBackground(drawBackground);
  v.setDrawTime(drawRealTime);
  v.setDrawData(drawRealData);
  v.begin();
} else {
  let dt = new Date();
  let d = { hour:dt.getHours(), min:dt.getMinutes(),
    steps: 12345, batt: 47,
          dow: 'Thu', date: 29,
          h1: Math.floor(dt.getHours() / 10),
          h2: Math.floor(dt.getHours() % 10),
          m1: Math.floor(dt.getMinutes() / 10),
          m2: Math.floor(dt.getMinutes() % 10),
          };
  drawBackground(false);
  drawRealTime(d, false);
  drawRealData(d, false);
}
