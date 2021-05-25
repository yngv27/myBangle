/*
** DIGITAL 3
*/
let EMULATOR = false;
let lf = require('m_lfont');
let v = require('m_vatch');

function frame(x,y, len) {
  g.setColor('#103030');
  g.drawLine(x,y,x,y+len);
  g.drawLine(x,y,x+len,y);
  g.setColor('#305050');
  g.drawLine(x+len,y,x+len, y+len);
  g.drawLine(x+len,y+len,x,y+len);
}

let drawBkgd = (nm) => {
  g.setColor('#304040');
  g.fillPoly([
    0,0,
    120, 0,
    0, 120,
    0, 0,
    ]);

  g.setColor('#283838');
  g.fillPoly([
    120, 0,
    240, 0,
    240, 120,
    120, 240,
    0, 240,
    0, 120,
    120, 0,
    ]);
  g.setColor('#243434');
  g.fillPoly([
    240, 240, 
    120, 240,
    240, 120,
    240, 240,
    ]);

  let w = 160;
  frame(40, 40, w);
  frame(-140, 40, w);
  frame(220, 40, w);

  w = 70;
  //frame(-50, 130, w);
  //frame(220, 130, w);

  frame(40, -50, w);
  frame(-50, -50, w);
  frame(130, -50, w);
  frame(220, -50, w);

  frame(40, 220, w);
  frame(-50, 220, w);
  frame(130, 220, w);
  frame(220, 220, w);
};

let drawTime2 = (d) => {
  let norm = '#305050';
  let white = '#e0ffff';
  g.setColor(norm);
  lf.setScale(12,18);
  for(let i=0; i<10; i++) {
    g.setColor(norm);
    if(i == d.h1) g.setColor(white);
    lf.drawString(i.toString(), 46+i*15, 56);
    g.setColor(norm);
    if(i == d.h2) g.setColor(white);
    lf.drawString(i.toString(), 46+i*15, 88);
    g.setColor(norm);
    if(i == d.m1) g.setColor(white);
    lf.drawString(i.toString(), 46+i*15, 124);
    g.setColor(norm);
    if(i == d.m2) g.setColor(white);
    lf.drawString(i.toString(), 46+i*15, 156);
  }
};

let drawTime = (d) => {
  g.setColor('#283838');
  g.fillRect(42, 76, 180, 144);
  lf.setScale(36, 64);
  let colors = [ '#103030','#305050','#c0f0f0','#c0f0f0'];
  /* no military */
  for(let i=0; i< 4; i++) {
    g.setColor(colors[i]);
    if(d.h1 === 1) {
      lf.drawString('1', 38-i, 84-i);
    }
    lf.drawString(d.h2.toString(), 68-i, 84-i);
    lf.drawString(d.m1.toString(), 112-i, 84-i);
    lf.drawString(d.m2.toString(), 156-i, 84-i);
  }
};

let drawData = (d) => {
  lf.setScale(11,10);
  g.setColor('#b0d0d0');
  for(let i=0; i<10; i++) {
    if(d.batt / 10 > i ) g.drawRect( 226, 180-i*10, 234, 188-i*10);
  }
  //lf.drawString(d.steps.toString(), 42, 224);
  
  lf.drawString(d.dow+' '+d.date, 76, 180);
};

let hourHand = [
  -2, -10,
  -4, 56,
   0, 60,
  4, 56,
  2, -10,
  -2, -10,
  ];

let minHand = [
  -2, -10,
  -4, 74,
   0, 78,
  4, 74,
  2, -10,
  -2, -10,
  ];

if(!EMULATOR) {
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawTime);
  v.setDrawData(drawData);
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
  drawBkgd(false);
  drawTime(d, false);
  drawData(d, false);
}



