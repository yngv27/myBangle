let EMULATOR = false;
// which Bangle?
const isB2 = g.getWidth() < 200;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

require("omnigo.fnt").add(Graphics);

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([65504,64482,65535,62434]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,23558,23559,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([63488,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

/*
** BEGIN WATCH FACE
*/

const startX=[6,47,95,136],startY=[40,40,40,40],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=1,yS=1;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
/*
** END WATCH FACE
*/

let lastTime = '    ';
let bgc = 7;
let fgc = 0;
let MONDRIAN = Math.random() > 0.6;
if(!MONDRIAN && Math.random() < 0.5) {
  bgc = fgc;
  fgc = 7;
}

function drawBkgd(nm) {
  g.setBgColor(bgc);
  g.clear();
  if(MONDRIAN) {
    g.setColor(0);
    g.fillRect(110,0,117,175);
    g.fillRect(0,110,175,117);
    g.setColor(4);
    g.fillRect(118,0,175,109);
    g.setColor(1);
    g.fillRect(0,118,109,175);
    g.setColor(6);
    g.fillRect(118,118,175,176);
    for(let i=0; i<4; i++) {
      startX[i] *= 0.6;
      startY[i] *= 0.6;
    }
    xS = 0.6; yS = 0.8;
  }
}

function checkClock() {
  let dt=Date();
  let sec=dt.getSeconds();
  let hr=dt.getHours();
  let min=dt.getMinutes();
  let nm = false;

  if((hr > 20 || hr < 8)) {
   //  nm = true;
  }

  min = parseInt(min);

  if(nm) {
    drawNightClock({hr:hr,min:min});
    lastTime = tm;
    return;
  }

  drawDayClock({ hr:hr, min:min, mon:dt.getMonth(), dt:dt.getDate(), dow:dt.getDay(), sec:sec });
}

function drawDayClock(d, nm) {
  if(!MONDRIAN) {
    if(Date().getSeconds() % 2 ) g.setColor(fgc); else g.setColor(bgc);
    g.fillCircle(88,  74, 3);
    g.fillCircle(88,  98, 3);
  }
    //console.log(d);
  d.hour %= 12;
  if (d.hour === 0) d.hour = 12;
  
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) return;
  //console.log("tm/last= "+tm+" "+lastTime);


  rotate = false;
  for(let i=0; i<4; i++) {
    //console.log(tm[i],lastTime[i]);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      g.setColor(fgc);
      drawDigit(i,tm[i], false);
      g.flip();
    }
  }
  lastTime = tm;
}

function drawData(d, nm) {
  g.setColor(fgc);
  //let s = "SUNMONTUEWEDTHUFRISAT".substr(d.dow*3,3) + ' ' + d.dt;
  //console.log(d);

  g.setFont("Omnigo",1);

  g.setColor(fgc);
  //let batt = ' '+Math.floor(E.getBattery())+'%';
  g.drawString(d.batt,175-g.stringWidth(d.batt),2,true);
  g.drawString(d.dateStr,4,2,true);
  g.flip();
  
  g.drawImage(imgCalorie, 30, 125);
  g.drawImage(imgStep, 80, 125);
  g.drawImage(imgPulse, 130, 125);
  
  if(MONDRIAN) g.setBgColor(1);
  g.setColor(7);
  g.drawString(' 000 ', 28, 148, false);
  g.drawString(' '+('00000'+d.steps).slice(-5)+' ', 74, 148, true);
  g.setColor(fgc);
  g.drawString('000', 131, 148, false);
  g.setBgColor(bgc);
  
  g.flip();
}


let SCstate = 0;
let SCcnt = 0;
let SCprev, SCcurr;

Bangle.on("step",(s)=>{SCcnt=s;});

let getSteps = () => {return (SCcnt);};

if(!EMULATOR) {
  let v = require("m_vatch.js");
  v.setDrawBackground(drawBkgd);
  v.setDrawTime(drawDayClock);
  v.setDrawData(drawData);
  v.begin();
}
