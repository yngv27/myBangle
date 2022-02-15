E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(15, false);

// create a Bangle..
if(typeof(Bangle) === 'undefined') var Bangle = {};

let thisWatch = 
    "C16";

NRF.setAdvertising({},{name:thisWatch+" "+NRF.getAddress().split(':').slice(-2).join('')});

// load em up
const STOR = "Storage";
eval(require(STOR).read("btns.C16.js"));
eval(require(STOR).read("motor.C16.js"));
eval(require(STOR).read("display.C16.js"));
eval(require(STOR).read("battery.C16.js"));
eval(require(STOR).read("accel.C16.js"));
ACCEL.faceupThreshold = 192;

// Go for watch!

logD = console.log;

/**************** ALARMS **********************/
let _Alarms = [];
let inAlarm = false;
let loadAlarms = () => {
  _Alarms =  _Storage.readJSON('alarms.json');
  if(!_Alarms) _Alarms = [{"msg":"16:00|Stop|working|today","time":"2021-10-28T17:13:00"}];
  //_Alarms.sort((a,b) => {return(a.time > b.time);});
  scheduleAlarms();
};
function vibrat(lvl, cnt, onms, offms) {
  let tout = 0;
  digitalWrite(VIB, 0);
  for(let x=0; x < cnt; x++) {
    setTimeout(analogWrite, tout, VIB, lvl);
    tout += onms;
    setTimeout(digitalWrite, tout, VIB, 1);
    tout += offms;
  }
}
function notify() {vibrat(0.8, 5, 600, 200);}

function buzz() {vibrat(0.8, 1, 800, 200);}
let showMsg = (title, msg) => {
  logD('showMsg START');
  inAlarm = true;
  
  //g.setFont("Dylex7x13");
  
  g.setColor(1);
  g.fillRect(0,0,g.getWidth()-1,g.getHeight()-1);
  g.setColor(15);
  g.setFontAlign(0,-1);
  let y = 4;
  let midX= g.getWidth()/2;
  if(title) {
    g.drawString('* '+title+' *', midX, y);
    g.drawString('* '+title+' *', midX+1, y);
    y = 20; //g.getFontHeight();
    logD(`t:${title}`);
  }
  let lines = msg.split("|");
  for(let l = 0; l < lines.length; l++) {
    g.drawString(lines[l], midX, y);
    logD(`l:${lines[l]}`);
    y += g.getFontHeight();
  }

  notify();
  logD('showMsg END');
};

/*
** alarms are in order, pop the top and show it
*/

function showAlarm(msg) {
  console.log(`alarming w ${msg}`);
  showMsg('ALARM', msg);
  // remove the TO from the list, so we don't kill something by accident
}

let alarmTOs = [];
let scheduleAlarms = () => {
  for(let idx=0; idx < alarmTOs.length; idx++) {
    clearTimeout(alarmTOs[idx]);
  }
  alarmTOs = [];
  for(let idx=0; idx < _Alarms.length; idx++) {
    logD('idx = '+idx);
    let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
    let msg = _Alarms[idx].msg;
    if(tdiff > 0) {
      logD(`will alarm ${msg} in ${tdiff}`);
      alarmTOs.push(setTimeout(showAlarm, tdiff,_Alarms[idx].msg));
    } else {
      //expired
      logD('tossing out' + idx);
    }
  }
};
//loadAlarms();
var la = loadAlarms;
/******************************** END ALARMS *************************/

/**********************************************/

let font=atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==');
let widths=atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=');

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(font, 32, widths, 256 + 13);
};
let h = require("heatshrink");
let font2 = h.decompress(atob('ABEP8kf5AFBuEA8AEBgeAg4EBkECvEH+F/gHz4E/wf4g+QgIhCjkQskh//hiGCj4JBD4IEBkUQvlgueAhkAsEDzkMvkQxEB+EB4AjB98D/8EoUI4kf7Ec+EA4ED4EEwEAgkAhw7Cj/gv/hwFigFAgEIgMYg0f/AOBCQNsNgMD/AzBgw1CAAMCE4U+gF8OoIiCAAILBnBWBAwMQBwhCBAAMwBwaYCgEeMwMPwF4LQILBgP/g//hECiEEkEIv6mBB4JABBwMP/wkE8GPUgNCkGEoMPwR5DoCaBkIOCw4uBLoKGBwE/NQkIFgpxCDouEdAIdDJAPwBxR8E8MP4V8g/AJAcdDo5KGgF/iGCkLsCBwX8BwMMsEYSgVi4HHOQbVDBwMgXIVIgGQgMggVAggKCBwNjeYbgDbALOBw1BjmD8EDC4UH8Ef8FgsOeoV+wmFhP6iPkmFomHAUgIAB/+D/8EiEIkEQoE/+E/8DtCBwRrBwkRhAOBnZoC/8DBwMChAgCmEwkBQBDogOEFgQdBFhIoBv/g//BiECkEEOoUPDYPwoCFBoMIwcfgT5BYAP4BwMEgAiBiBKBg/+Bwp2CwEBAIMAgUAggOCOoJmB4P/wF4gOYg0YAAKJBBwodEGwRZD4DGBZ4LEBHYwdCwI+DwAOFv+B/+CgKVDBwLgBDomCQwUIDoMAjhnCDo8cj/8j/oDpf4jo7CuOB+eCkLCDjv4jI7COgSkDVYQ5D4B3BCIcCh45BFQV+HYMAg+AQYMebwMfwAOHg8H+gOBgF4gEwFgQTBgcDg+egfwS4MP4F58HAHYMD4EHAgP8gP4nwgCgEBg+Cj8EsRoBicInkQuEgMwXH/+ILYMAjEAnjVBgEPK4PAGwJ1BgU//l//AUD+EDwEMgEOC4MAgyICgAuBoCIEgEEBYNwgFgCIUmgHegMkgVIg/wg61BgP/wZ7BcYUD/EDYQRKBn+AoIODRwXgh/giFAkAdBaIJ/CFQPwhMgiVAnmAnAMCEwP4n/wpBICPYN/kGCoMEEYX8BgP/4P/wBpDWYQMBp/gz69BPYdJ/+TH4V/8H/4EIgE4gPegccBgI7BBwIFCwF/FgZ3BNYJoBeYIjCgH+UoaVELIaVJj5uCSoZZB+AMBg/Aj/AkCkCNwYsCUgRlCaoJ5BS4OQg+wUgc3wDgBUgQbC+EIDQJoBJQT8CJQIQBK4YOBgcAgyiBdosfQIKGCXgMMDoSCCjHAneAUAKmB7kDjAdCFgQqBgUgNAQMBgkwhHgidAlmAuMA4TWCQQP4vn4wB4Bg//97XBgEQgU+vigBgwXCwAvBZoMMAITrBmCRDAA4='));
let widths2 = h.decompress(atob('gcEg0IhENhUDgsFg0HgkFgkHhEFBwIAFgcDgwAChkIhIKBAwIOCAQMHBQQADEgMIhYECFgMEAoMDg8HHAMHgoCBIIICBhIGBAAYNCBIcFCQMJA=='));
Graphics.prototype.setFontBlocky = function() {
    this.setFontCustom(E.toString(font2), 32, E.toString(widths2), 256 + 15);
};

let EMULATOR = false;
// which Bangle?
const isB2 = (process.env.BOARD == 'BANGLEJS2');

const MY_HEIGHT = 70;  // in inches..  divide by 2.54 if cm
const MY_WEIGHT = 170; // in pounds.. multipley by 2.2 if kg
// calories / step == 0.57 * weight(lb) * height(in) / 126720
const MY_BURN_RATE = 0.57 * MY_WEIGHT * MY_HEIGHT / 126720;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

//require("knxt.fnt").add(Graphics);
//g.setFont("Omnigo",isB2 ? 1 : 2);
g.setFont("Blocky",isB2 ? 1 : 1);

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([14,64482,15,9]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,11,11,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([12,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

function drawBattery(x,y) {
  // x,y is top/left
  g.setColor(fgc);
  let segX = isB2 ? 2 : 3;
  let segY = isB2 ? 12 : 18;
  let yinc = segY / 4;
  let xinc = (segX + 3) * 4;
  g.drawPoly([
    x,y,
    x+xinc,y,
    x+xinc,y+yinc,
    x+xinc+segX,y+yinc,
    x+xinc+segX,y+yinc*3,
    x+xinc,y+yinc*3,
    x+xinc, y+yinc*4,
    x, y+yinc*4
    ], true);
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
}
/*
** BEGIN WATCH FACE
*/
const startX=[6,47,95,136],startY=[60,60,60,60],nmX=[16,42,88,126],nmY=[12,12,12,12];
let xS=1,yS=1;
function setScale(t,r){xS=t;yS=r;}
function drawScaledPoly(r,n,a){
  let d=[];
   for(let t=0;t<r.length;t+=2){
    var e;
     d[t]=Math.floor(r[t]*xS)+n;
     d[t+1]=Math.floor(r[t+1]*yS)+a;
   }
  g.fillPoly(d,!1);
}
let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t);}
/*
** END WATCH FACE
*/

let lastTime = '9999';
let WHITE = isB2 ? 7 : '#ffffff';
let BLACK = 0;
let bgc = BLACK;
let fgc = WHITE;
// set to true for some playful color blocks
let MONDRIAN = false;

// adjust coords by Bangle
if(isB2) {
  xS = 1; yS = 1;
} else {
  xS = 1.36; yS = 1.36;
  for(let i=0; i<4; i++) {
    startX[i] *= xS;
    startY[i] *= yS;
  }
}

if(MONDRIAN) {
  for(let i=0; i<4; i++) {
    startX[i] *= 0.6;
    startY[i] *= 0.6;
  }
  xS *= 0.6; yS *= 0.8;
}

function drawBkgd(nm) {
  // Bangle1 and B2 if night mode
  bgc = BLACK; fgc = WHITE; 
  if(!nm && isB2)  { bgc = WHITE; fgc = BLACK; }
  g.setBgColor(bgc);
  g.clear();
  lastTime = '    ';

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
  }
  g.flip();
}

let b2NightMode = false;

function drawClock(d, nm) {
  if(inAlarm) {
    logD(`inAlarm - returning`);
    return;
  }
  
  //console.log(d);
  d.hour %= 12;
  if (d.hour === 0) d.hour = 12;
  
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) {
    //console.log(`no change: last time = [${lastTime}]`);
    return;
  }
  console.log("tm/last= "+tm+"/"+lastTime);

  //drawBkgd(nm);
  for(let i=0; i<4; i++) {
    console.log(`${tm[i]}:${lastTime[i]}`);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      g.setColor(i > 1 ? fgc : 11);
      console.log(`calling dD: ${i} ${tm[i]}`);
      drawDigit(i,tm[i], false);
      //g.flip();
    } else {
      console.log('skipping digit '+i);
    }
  }
  lastTime = tm;
  g.flip();
}

// uses constants from top; set to your own
function calcCalories(steps) {
  // calories / step == 0.57 * weight(lb) * height(in) / 126720
  return Math.floor(MY_BURN_RATE * steps);
}



function drawData(d, nm) {
  //console.log(d);
  g.setColor(10);
  let dy = isB2 ? 2 : 20;

  g.setFontAlign(1,-1);
  g.drawString(' '+d.batt+'% ', wX-16, dy, true);
  g.setFontAlign(-1,-1);
  g.drawString(' '+d.dateStr+' ', 16, dy, true);
  g.flip();
  
  g.drawImage(imgCalorie, relX(0.17), relY(0.71));
  g.flip();
  g.drawImage(imgStep, relX(0.454),  relY(0.71));
  g.flip();
  g.drawImage(imgPulse, relX(0.739),  relY(0.71));
  g.flip();
  
  if(MONDRIAN) g.setBgColor(1);
  
  g.setFontAlign(0,-1); // center X, top Y
  g.setColor(14);
  g.drawString(' '+('0000'+calcCalories(d.steps)).slice(-4)+' ', relX(0.21), relY(0.84), true);
  g.drawString(' '+('00000'+d.steps).slice(-5)+' ', relX(0.5), relY(0.84), true);
  //g.setColor(fgc);
  g.drawString(' '+('000'+d.hrm).slice(-3)+' ', relX(0.8), relY(0.84), true);
  g.setBgColor(bgc);
  
  g.flip();
}

let needData = true;
function clock(){
  //lastmin=-1;
  drawBkgd(false);
  return setInterval(function(){
    let dt = new Date();
    let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
    drawClock(d, false);
    if(d.sec == 0 || needData) {
      d.dateStr = dt.toString().substr(0,10);
      d.batt = Math.floor(battLevel());
      d.steps = 0;
      d.hrm = 0;
      drawData(d, false);
      needData = false;
    }
  },1000);
}


function sleep(){
  //g.clear();//g.flip();
  g.off();
  inAlarm = false;
  currscr=-1;
  needData = true;
  return 0;
}

var screens=[clock,sleep];
var currscr= -1;
var currint=0;

let BUTN = (thisWatch == 'C16' ? D46 : D4);
setWatch(() => {
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
  setTimeout(()=>{g.off();}, 8000);
},BUTN,{repeat: true, edge:'rising', debounce:25});

Bangle.on('faceUp',() => {
  g.on();
  setTimeout(()=>{g.off();}, 8000);
});