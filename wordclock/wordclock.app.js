
/*
** WORD WATCH
** Yeh, been done before...
*/
let EMULATOR = false;
let lf = require('m_lfont');
let v = require('m_vatch');


let drawBkgd = (nm) => {
  g.clear();
};


let drawTime3 = (d) => {
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

let minWords = [
  { str: 'it is', x: 0, y: 0 },
  { str: 'five', x: 6, y: 1 },
  { str: 'ten', x: 8, y: 2 },
  { str: 'quarter', x: 0, y: 2 },
  { str: 'twenty', x: 0, y: 1 },
  { str: 'half', x: 6, y: 0 },
  /* dummies */
  { str: 'x  m    e', x:2, y:0 },
  { str: 'm', x:10, y:1 },
  { str: 's', x:7, y:2 },
  { str: 'd  v', x:7, y:3 },
  { str: 'r', x:4, y:4 },
  { str: 'g', x:4, y:6 },
  { str: 'm    s', x:5, y:8 },
  { str: 'f', x:4, y:9 },
/**/
  ];
let hrWords = [
  { str: 'twelve', x: 5, y: 4 },
  { str: 'one', x: 0, y: 5 },
  { str: 'two', x: 8, y: 6 },
  { str: 'three', x: 6, y: 5 },
  { str: 'four', x: 0, y: 6 },
  { str: 'five', x: 0, y: 9 },
  { str: 'six', x: 3, y: 5 },
  { str: 'seven', x: 0, y: 8 },
  { str: 'eight', x: 0, y: 7 },
  { str: 'nine', x: 6, y: 8 },
  { str: 'ten', x: 5, y: 6 },
  { str: 'eleven', x: 5, y: 7 },

  ];
let map = {
  'to': 0,
  'past': 1,
};

let litWords = [
  { str: 'to' , x: 8, y: 3} ,
  { str: 'past', x: 0, y: 4 },
  { str: 'minutes', x: 0, y: 3 },
  { str: 'oclock', x: 5, y: 9 },

  ];

let drawTime = (d) => {
  lf.setScale(12,12);
  let sp = 16;
  g.setColor('#808080');
  for(let i = 0; i < minWords.length; i++) {
    let s = minWords[i];
    lf.drawString(s.str, 22+s.x * sp, 22+s.y * sp);
  }
  for(let i = 0; i < hrWords.length; i++) {
    let s = hrWords[i];
    lf.drawString(s.str, 22+s.x * sp, 22+s.y * sp);
  }
  for(let i = 0; i < litWords.length; i++) {
    let s = litWords[i];
    lf.drawString(s.str, 22+s.x * sp, 22+s.y * sp);
  }
};


let drawData = (d) => {
  
  return;
  /*
  lf.setScale(11,10);
  g.setColor('#b0d0d0');
  for(let i=0; i<10; i++) {
    if(d.batt / 10 > i ) g.drawRect( 226, 180-i*10, 234, 188-i*10);
  }
  //lf.drawString(d.steps.toString(), 42, 224);
  
  lf.drawString(d.dow+' '+d.date, 76, 180);
  */
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

