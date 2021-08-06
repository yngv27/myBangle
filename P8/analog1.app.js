eval(require("Storage").read("analogBkgd.img"));
require("omnigo.fnt").add(Graphics);

function battVolts(){
  return P8.batV();
}

function battLevel(v){
  var l=3.3,h=4.1;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return Math.floor(100*(v-l)/(h-l));
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}

function to16bit(r,g,b) { return Math.floor((r*31<<11)+(g*63<<5)+(b*31));}
let cl=console.log;

g.sc = (c) => {
  switch(c) {
    case 0: g.setColor(0); break;
    case 15: g.setColor('#ffffff'); break;
    default: g.setColor(c);
  }
};

var imin = {
  width : 5, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([0,0xc658,0,0]),
  buffer : require("heatshrink").decompress(atob("AAcQisFoNQqgE/Als3Wn4AiA"))
};
var ihr = {
  width : 7, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([0,0xdf1b,0,0]),
  buffer : require("heatshrink").decompress(atob("AHMVgNVitVAH4AmstUhtgV/4A/ABIA=="))
}
;
let lastTime='';
let showClockTO;
let faceAlreadyUp = false;

// d contains hours, mins and each digit, nm == night mode (set when BTN1 is pushed)
let drawDayClock = (d) => {
  g.clear();
  g.drawImage(analogBkgdImg,0,0);

  let hrRot = Math.PI * 2 * ((d.hour % 12) * 60 + d.min) / 720;
  let minRot = Math.PI* 2 * d.min / 60 ;
  let ctr = g.getWidth()/2;
  g.sc(0);
  g.fillCircle(ctr,118,10);

  g.sc(15);
  g.fillCircle(ctr,ctr,6);
  let s = "SUNMONTUEWEDTHUFRISAT".substr(d.dow*3,3) + ' ' + d.dt;
  //console.log(d.dow, s);
  g.drawString(s, ctr*1.8-g.stringWidth(s), ctr*0.95);
  g.drawString(d.batt,ctr-g.stringWidth(d.batt)/2,ctr*1.34);

  g.drawImage(ihr, ctr, ctr, { rotate: hrRot } );
  g.drawImage(imin, ctr, ctr, { rotate: minRot } );
  g.sc(0);
  g.fillCircle(ctr,ctr,3);
  g.flip();
};


function checkClock() {
  let dt=new Date();
  var tm=('00'+dt.getHours()).slice(-2)+('00'+dt.getMinutes()).slice(-2);
  var hr=dt.getHours();
  var min=dt.getMinutes();
  let nm = false;

  if((hr > 20 || hr < 8)) {
   //  nm = true;
  }

  hr %= 12;
  if (hr === 0) hr = 12;

  let d = { 
    hour:hr, min:min, dt:dt.getDate(), dow:dt.getDay(), batt: battLevel(),
  }; 

  if(nm) {
    drawNightClock(d);
    lastTime = tm;
    return;
  }
  /**/
  if(ACCEL.isFaceUp()) {
    if(lastTime != tm) {
      drawDayClock(d);
      lastTime = tm;
    }
    if(!faceAlreadyUp) {
      // delay, in case we're 'passing through'
      showClockTO = setTimeout(()=>{
        ACCEL.emit("faceup");
      }, 500);
      faceAlreadyUp = true;
    }
  } else {
    // now face down
    if(showClockTO) clearTimeout(showClockTO);
    faceAlreadyUp = false;
    return;
  }
  /**/
}

function begin() {
  g.setFont("Omnigo",1);
  setInterval(checkClock, 1000);
}
setTimeout(begin, 1000);
//
