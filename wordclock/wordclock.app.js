
/*
** WORD WATCH
** Yeh, been done before...
*/
let EMULATOR = false;
let lf = require('m_lfont');
let v = require('m_vatch');
//g.setFont('6x8',3);

let drawBkgd = (nm) => {
  g.setBgColor(nm ? '#000000' : '#202020');
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
  { str: 'c  m    a', x:2, y:0 },
  { str: 'm', x:10, y:1 },
  { str: 's', x:7, y:2 },
  { str: 'd  v', x:7, y:3 },
  { str: 'r', x:4, y:4 },
  { str: 'g', x:4, y:6 },
  { str: 'o    t', x:5, y:8 },
  { str: 't', x:4, y:9 },
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
  let sp = 19; 
  lf.drawString(s.str.toUpperCase(), 12+s.x * sp, 12+s.y * (sp+2));
}

let drawTime = (d, nm) => {
  setScale(15,18);
  setSpacing(4);
  let s = {};
  let h = d.hour;
  let m = d.min;

  if(!nm) {
    g.setColor('#101010');
    for(let i = 0; i < minWords.length; i++) {
      drawWord(minWords[i]);
    }
    for(let i = 0; i < hrWords.length; i++) {
      drawWord(hrWords[i]);
    }
    for(let i = 0; i < litWords.length; i++) {
      drawWord(litWords[i]);
    }
  }

  //h = 8; 
  //m = 3;
  
  g.setColor(E.getBattery() < 30 ? '#e0e0b0' : '#808080');
  if(nm) g.setColor('#203040');
  drawWord(minWords[0]);
  
  // custom round
  m += 2;
  if (m > 59 ) { m -= 60; h++; }
  //console.log(h,m);
  m = Math.floor(m / 5) % 12;
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
