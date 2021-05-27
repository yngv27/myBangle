/*
** WORD WATCH
** Yeh, been done before...
*/
let EMULATOR = true;
if(EMULATOR) {
  g.setFont('6x8',3);
  let lf = {
    setScale: function(x,y) {},
    setSpacing: function(x) {},
    drawString: function(s,x,y) { g.drawString(s,x,y); },
  };
} else {
  let lf = require('m_lfont');
  let v = require('m_vatch');
}
/* words are XYword, where X is column, Y is row */
let minWords = [
  '00it is', '61five', '82ten', 
  '02quarter', '01twenty','60half', 
  ];
let hrWords = [
  '54twelve',   '05one',   '86two', 
  '65three', '06four', '09five', 
  '35six', '08seven', '07eight', 
  '68nine', '56ten', '57eleven', 
  ];
let litWords = ['83to','04past','03minutes','59oclock'];
let dmyWords = [
  '20c  m    a', ':1m', '72s', 
  '73d  v', '44r', '46g', 
  '58o    t', '49t', 
  ];

function drawWord(s) {
  let x = s.charCodeAt(0) - 48;
  let y = s.charCodeAt(1) - 48;
  let str = s.slice(2);
  let sp = 19; 
  lf.drawString(str.toUpperCase(), 16+x * sp, 16+y * (sp+2));
}

let drawBkgd = (nm) => {
  g.setBgColor(nm ? '#000000' : '#403020');
  g.clear();
};

let drawTime = (d, nm) => {
  lf.setScale(15,18);
  lf.setSpacing(4);
  let s = {};
  let h = d.hour;
  let m = d.min;

  if(!nm) {
    g.setColor('#201810');
    for(let i = 0; i < minWords.length; i++) {
      drawWord(minWords[i]);
    }
    for(let i = 0; i < hrWords.length; i++) {
      drawWord(hrWords[i]);
    }
    for(let i = 0; i < litWords.length; i++) {
      drawWord(litWords[i]);
    }
    for(let i = 0; i < dmyWords.length; i++) {
      drawWord(dmyWords[i]);
    }

  }

  //h = 8; 
  //m = 3;
  
  g.setColor(E.getBattery() < 30 ? '#e0e0b0' : '#a0a0a0');
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

if (EMULATOR ) {
  let dt = new Date();
  let d = { hour: dt.getHours(), min: dt.getMinutes() ,
          date: 27, batt: 99, steps: 8000, dow: 'Fri'
          };
  drawBkgd(false);
  drawTime(d, false);
  drawData(d, false);
} else {
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawTime);
  v.setDrawData(drawData);
  v.begin();
}