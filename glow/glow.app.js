let EMULATOR = false;

if(EMULATOR) {
  g.setFontVector(16);
} else {
  require('m_knxt').add(Graphics);
  g.setFont('KNXT',1);
  let v = require('m_vatch');
} 

function logD(s) { //console.log(s); 
                 }

var min = {
  width : 16, height : 240, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("/wA/AH4A/AH4A/AH4AUmQACBxddr1eroQJBwOIxOJxAQJmVexOPx+JrwPIq4PEslXB5FkB/4P/B/4P/B/4P/B/4P/B/4P/B/4P/B/4P/B/4P/B/4P/B/4Per2JAAVeB5EyrteAAVdmQPHCAMyq1WAYIOIAH4ARLgJeMQAZ+LruITwOICBMyV4K/CrwPZF4dkIBhPMN4ksWf7eucBSODSBdXX4IACr1XB5FkZ4dkB/4P/B/EyZ4IPCrzfId4OIbwOId5IQCfxYQDAAQOKAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AFQA="))
}
;
var hr = {
  width : 16, height : 240, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("/wA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A0mQACBxddr1eroQJBwOIxOJxAQJmVexOPx+JrwPIq9kB4dkq4P/B/4P/B/4P/B/4P/B/4P/B/4P/B/4P/B5FexIACrwPImVdrwACrsyB44QBmVWqwDBBxAA/ACJcBLxiADPxddxCeBxAQJmSvBX4VeB7IvDshAMJ5hvEliz/b1zgKRwaQLq6/BAAVeq4PIsjPDsgP5J4IPMmQPErxvIP4IwBxOIP5KQEBxSwFen4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AEoA=="))
}
;


var tik = {
  width : 7, height : 240, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("/wAHlkylgFDq9dq8yAwMyr2JrwG/Ax5aGNAQFDAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AC4A=="))
}
;

// nm == night mode (set when BTN1 is pushed)
let drawBkgd = (nm) => {
  g.clear();
  if(nm) return;

  let r = 8;
  g.setColor('#80a0c0');
  g.fillCircle(120,r,r);
  g.setColor('#a0c0f0');
  g.fillCircle(120,r-2,r-2);
  g.setColor('#c0e0ff');
  g.fillCircle(120,r-4,r-4);

  for(let idx = 0; idx < 12; idx++ ) {
    if(idx) // % 3)
      g.drawImage(tik, 120, 120, { rotate: Math.PI * idx / 6 } );
  }

};

// d contains hours, mins and each digit, nm == night mode (set when BTN1 is pushed)
let drawTime = (d, nm) => {
  let hrRot = Math.PI * 2 * ((d.hour % 12) * 60 + d.min) / 720;
  let minRot = Math.PI* 2 * d.min / 60 ;

  g.setColor('#000000');
  g.fillCircle(120,120,100);
  g.drawImage(hr, 120, 120, { rotate: hrRot } );
  g.drawImage(min, 120, 120, { rotate: minRot } );

};

/*
** draws indicator dots in an arc. 'p' specifies the start angle 
** in degrees, space (angle) between each, # of dots (segs), 
** direction (1 = CW, -1 = CCW) and color
*/
let drawDots = (data, p) => {
  g.setColor(p.color);
  let csize = 2;
  if(p.spacing < 4) csize = 1;
  for(let idx=0; idx<p.segs; idx++) {
    angle = p.startAngle + (p.dir * p.spacing * idx);
    const a = angle * Math.PI / 180;
    const x = 120 + Math.sin(a) * 130;
    const y = 120 - Math.cos(a) * 130;
    if(data & (1 << idx)) {
      g.fillCircle(x,y,2);
    } else {
      g.setColor('#000000');
      g.fillCircle(x,y,2);
      g.setColor(p.color);
      g.drawCircle(x,y,csize);
    }
  }
};

let drawData = (d, nm) => {
  if(nm) return;

  g.setColor('#c0d0f0');
  g.setFontAlign(-1, 1);

  // DOW
  let dow = new Date().getDay();
  let p = { segs: 7, spacing: 5, dir: -1, color: '#c0c0f0', startAngle: 240};
  drawDots(1 << dow, p);


  // dots as binary date
  p = { segs: 5, spacing: 6, dir: 1, color: '#f0f0f0', startAngle: 123};
  drawDots(d.date, p);

  // dots for power (20% chunks)
  p = { segs: 5, spacing: 6, dir: -1, 
       color: d.batt > 30 ? '#00c000' : '#c0c000', 
       startAngle: 57};
  logD(d.batt + ':' + Math.ceil(d.batt/20));
  // we don't want zero dots ever... so use Math.ceil 
  drawDots((1<<Math.ceil(d.batt/20))-1, p);

  // dots as % of 10k steps (3 levels: bronze, silver, gold )
  let level = [ '#c09000','#b0b0c0','#e0e080' ];
  p = { segs: 10, spacing: 3, dir: 1, 
  	color: level[Math.floor(d.steps / 10000)], //? '#c080c0' : '#c0a080', 
  	startAngle: -59};
  d.steps %= 10000; // will track <= 20k
  logD(d.steps + ':' + Math.floor(d.steps/1000));
  drawDots((1<<Math.floor(d.steps/1000))-1, p);

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
