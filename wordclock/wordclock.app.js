
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

let litWords = [
  { str: 'to' , x: 8, y: 3} ,
  { str: 'past', x: 0, y: 4 },
  { str: 'minutes', x: 0, y: 3 },
  { str: 'oclock', x: 5, y: 9 },

  ];

function drawWord(s) {
  let sp = 18;
  lf.drawString(s.str, 22+s.x * sp, 22+s.y * sp);
}

let drawTime = (d) => {
  lf.setScale(15,15);
  lf.setSpacing(3);
  let s = {};
  let h = d.hour;
  let m = d.min;


  g.setColor('#808080');
  for(let i = 0; i < minWords.length; i++) {
    drawWord(minWords[i]);
  }
  for(let i = 0; i < hrWords.length; i++) {
    drawWord(hrWords[i]);
  }
  for(let i = 0; i < litWords.length; i++) {
    drawWord(litWords[i]);
  }

  g.setColor('#ffffff');
  //console.log(h,m);
  m = Math.round(m / 5) % 12;
  //console.log('m is now '+m);
  if (m == 0) {
    drawWord(litWords[3]); //OCLOCK
  } else if (m == 6) {
    drawWord(minWords[5]); //HALF
    drawWord(litWords[1]); //PAST
  } else if(m > 5) {
    drawWord(litWords[0]); //TO
    if(m != 9) drawWord(litWords[2]); //MIN
    h++;
  } else {
    drawWord(litWords[1]); //PAST
    if(m != 3) drawWord(litWords[2]);//MIN
  }
  h %= 12;
  drawWord(hrWords[h]);
  if(m === 0 || m === 6) return;

  if(m > 6) m = 12-m;
  //console.log('and now m is '+m);
  //m %= 6;
  
  if(m === 5) {
    drawWord(minWords[4]); //TWENTY
    drawWord(minWords[1]); //FIVE
  } else {
    drawWord(minWords[m]);
  }

};


let drawData = (d) => {

  return;
};


v.setDrawBackground(drawBkgd);
v.setDrawTime(drawTime);
v.setDrawData(drawData);
v.begin();
