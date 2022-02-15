
const _Storage = require('Storage');
eval(_Storage.read("SN80.drivers.js"));

// translate from paletted to regular
var pal=
  [ '#000000','#000080','#008000','#008080','#800000','#800080','#808000','#808080',
'#c0c0c0', '#8080f0', '#80f080', '#80f0f0', '#f08080', '#f080f0', '#f0f080', '#f0f0f0'
  ];
g.sc= (col) => {
  g.setColor(pal[col]);
};
g.on = g.lcd_wake;
g.off = g.lcd_sleep;

// chill out that green
pal[2] = '#004000';

require("FontDylex7x13").add(Graphics);
g.setFont("Dylex7x13");

let logD = (msg) => { console.log(msg); };


/*
** BEGIN WATCH FACE
*/
const startX=[90,125,90,125],startY=[18,18,80,80],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=.8,yS=.8;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];EMULATOR&&(a+=80),drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}

function pct2col(r,g,b,p) {
  let r1 = Math.floor(r*32*p);
  if(r1 > 31) r1 = 31;
    let g1 = Math.floor(g*32*p);
  if(g1 > 31) g1 = 31;
    let b1 = Math.floor(b*32*p);
  if(b1 > 31) b1 = 31;
  //r1 *= p; g1 *= p; b1 *= p;
  return (r1 << 11) + (g1 << 6) + b1;
}

/*
** END WATCH FACE
*/
var volts;
var batt=battInfo();
let lastTime = '';
let EMULATOR = false; 
let Sixay = "e6:a5";
let Eebie = "eb:7b";
let showClockTO = 0;

//let buzzLock = 0;  // 0b10 = lockout, 0b01 = cancel
let myName = NRF.getAddress().slice(-5);
console.log(myName);

/**** BEGIN ALARMS *******/


let _Alarms = [];
let inAlarm = false;
let loadAlarms = () => {
  _Alarms =  _Storage.readJSON('alarms.json');
  if(!_Alarms) _Alarms = [{"msg":"16:00|Get back to Xmas!","time":"2021-12-23T15:49:00"}];
  //_Alarms.sort((a,b) => {return(a.time > b.time);});
  scheduleAlarms();
};

function vibrat(lvl, cnt, onms, offms) {
  let tout = 0;
  digitalWrite(VIB, 0);
  for(let x=0; x < cnt; x++) {
    setTimeout(analogWrite, tout, VIB, lvl);
    tout += onms;
    setTimeout(analogWrite, tout, VIB, 0);
    tout += offms;
  }
  
}
function notify() {
  logD('notify START');

  vibrat(0.8, 5, 600, 200);

  logD('notify END');
}

function buzz() {
    //analogWrite(VIB, 0.999);
    //setTimeout(analogWrite, 200, VIB, 0);
    vibrat(0.6, 1, 500, 250);
}

let showMsg = (title, msg) => {
  logD('showMsg START');
  inAlarm = true;
  
  //g.setFont("Dylex7x13");
  
  g.sc(1);
  g.fillRect(0,0,g.getWidth()-1,g.getHeight()-1);
  g.sc(15);
  g.setFontAlign(0,-1);
  let y = 24;
  if(title) {
    g.drawString('* '+title+' *', 120, y);
    g.drawString('* '+title+' *', 121, y);
    y = 20; //g.getFontHeight();
    logD(`t:${title}`);
  }
  let lines = msg.split("|");
  for(let l = 0; l < lines.length; l++) {
    g.drawString(lines[l], 120, y);
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
      logD(`tdiff is ${tdiff}; tossing out ${idx}`);
    }
  }
};
loadAlarms();
var la = loadAlarms;
/*
********************************************* END ALARMS *******************************
*/
let pad0 = (n) => {return ('0'+n).slice(-2);};

function checkClock() {
  //logD('checkClock START');
  let d=Date();
  let dt=d.toString().substr(0,10);
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  if(lastTime == tm) return;
  lastTime = tm;
  
  drawDayClock({hr:hr, min:min, dt:dt});

}

function drawDayClock(d) {
  //g.on();
  let xmid = 120;
  if(inAlarm) {
    logD(`inAlarm - returning`);
    return;
  }
  /*
  let tm=d.hr+':'+d.min;
  if (tm == lastTime) {
    logD(`clock unchanged - returning`);
    return;
  }
  lastTime = tm;
  */
  g.clear();
  console.log("DrawClock: time to draw");

  // TOP BAR
  //g.setFont("Dylex7x13");
  g.setFontAlign(0,-1);
  g.sc(2);
  /* pill
  g.fillCircle(6,6,6);
  g.fillCircle(73,6,6);
  g.fillRect(6,0,73,12);
  */
  let batt = battInfo(); //process.env.VERSION; //battInfo();
  // full bkgd
  //g.fillPoly([0,0,8,12,71,12,79,0],true);
  // par'l bkgd
  g.fillPoly([80,0,88,8,151,8,159,0],true);
  g.drawString(batt,xmid,1);
  g.sc(10);
  //g.setClipRect(0,0,79,7)
  g.drawString(batt,xmid,1);
//g.setClipRect(0,0,79,159);
  
  rotate = false;
  g.sc(8+3);
  //g.sc(5);
  if(EMULATOR) g.setColor(1,1,1);
  drawDigit(0,Math.floor(d.hr/10), false);
  drawDigit(1,Math.floor(d.hr%10), false);
  g.flip();
  g.sc(8+7);
  //g.sc(8+5);
  drawDigit(2,Math.floor(d.min/10), false);
  drawDigit(3,Math.floor(d.min%10), false);
  g.flip();

  // BOTTOM BAR 
  g.sc(1);
  // 1
  g.fillPoly([80,159,88,151,151,151,159,159],true);
  //g.fillRect(0,140,79,159);
  g.sc(14);
  g.drawString(d.dt,xmid/*-g.stringWidth(d.dt)/2*/,143);

  g.flip();
  
}


function clock(){
  /*
  volts=0;
  showClockTO = 0;
  setTimeout(checkClock, 2000);
  return setInterval(function(){
    checkClock();
  },20000);
  */
  ACCEL.on('faceup', checkClock);
}

function sleep(){
  //g.off();
  inAlarm = false;
  ACCEL.removeListener('faceup', checkClock);
}


var screens=[clock,sleep];
var currscr= 0;
var currint=screens[currscr]();
//let longpress = 0;
let longpressTO = 0;

let nextScreen = () => {
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint > 0) clearInterval(currint);
  logD(`Running screen ${currscr}`);
  currint = screens[currscr]();
  buzz();
};

const btnDown = (b) => {
  //longpress = b.time;
  longpressTO = setTimeout(function(){
    // long press behaviour
    nextScreen();
    longpressTO = 0;
  }, 1000);
  setWatch(btnUp, BTN1, { repeat:false, edge:'falling', debounce:25});
};
const btnUp = (b) => {
  /*
  if(b.time - longpress > 1.0) {
    g.setBrightness(256);
    setTimeout(function(){g.setBrightness(32);}, 10000);
  }
  */
  if(longpressTO) {
    // short press behaviour
    clearTimeout(longpressTO);
  } else {
    // long press (post)
    //setTimeout(()=>{g.setBrightness(32);},10000);
  }
  setWatch(btnDown, BTN1, { repeat:false, edge:'rising', debounce:25});
};

setWatch(btnDown, BTN1, { repeat:false, edge:'rising', debounce:25});
ACCEL.on('faceup', ()=>{console.log('FACE uP!');});


