const _Storage = require('Storage');
eval(_Storage.read("F07.js"));

require("m_dylex13").add(Graphics);
//require("m_knxt").add(Graphics);

let logD = (msg) => { console.log(msg); };


/*
** BEGIN WATCH FACE
*/

const startX=[10,45,10,45],startY=[16,16,78,78],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=.8,yS=.8;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];EMULATOR&&(a+=80),drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
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
  if(!_Alarms) _Alarms = [{"msg":"16:00|Stop|working|today","time":"2021-10-28T17:13:00"}];
  scheduleAlarms();
};

function notify() {
  analogWrite(VIB, 0.95);
  setTimeout(analogWrite,200,VIB,0);
}

let showMsg = (title, msg) => {
  inAlarm = true;
  g.clear();
  
  g.setFont("Dylex7x13");
  g.sc(15);
  g.clear();  
  g.setFontAlign(0,-1);
  let y = 4;
  if(title) {
    g.drawString('* '+title+' *', 40, y);
    g.drawString('* '+title+' *', 41, y);
    y = 20; //g.getFontHeight();
  }
  let lines = msg.split("|");
  for(let l = 0; l < lines.length; l++) {
    g.drawString(lines[l], 40, y);
    y += g.getFontHeight();
  }
  //if(! title) return;

  setTimeout(notify, 800);
  setTimeout(notify, 1600);
  setTimeout(notify, 2400);
  setTimeout(notify, 3200);
  setTimeout(notify, 4000);
};

/*
** alarms are in order, pop the top and show it
*/
let _alarmMsgs = [];
function showAlarm(msg) {
  if(!msg) msg = _alarmMsgs.shift();
  showMsg('ALARM', msg);
}

let alarmTOs = [];
let scheduleAlarms = () => {
  for(let idx=0; idx < alarmTOs.length; idx++) {
    clearTimeout(alarmTOs[idx]);
  }
  for(let idx=0; idx < _Alarms.length; idx++) {
    logD('idx = '+idx);
    let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
    let msg = _Alarms[idx].msg;
    if(tdiff > 0) {
      logD(`will alarm ${msg} in ${tdiff}`);
      alarmTOs.push(setTimeout(showAlarm, tdiff,_Alarms[idx].msg));
      //_alarmMsgs.push(`foo${idx}`/*_Alarms[idx].msg*/);
    } else {
      //expired
      logD('tossing out' + idx);
    }
  }
};
loadAlarms();
/*
********************************************* END ALARMS *******************************
*/

/*
function buzzClock (h,m) {
  // skip if either lockout or canceled: 10 or 01 (i.e. not 0)
  if(buzzLock) {
    buzzLock &= 0b10;
    console.log('no buzz..resetting');
    return;
  }
  console.log('buzzing');
  // vibrate: long = 5, short = 1
  const lvl = 0.8, LONGBZ = 600, SHORTBZ = 150;
  // hours
  let n = Math.floor(h/5);
  if(n) vibrate(lvl, n, LONGBZ, 100);
  vibrate(lvl, h%5, SHORTBZ, 200);
  // delay
  vibrate(0.0, 1, 500, 500);
  // 10 mins - always single pulses
  n = Math.floor(m/10);
  if(n) vibrate(lvl, n, SHORTBZ, 200);
  vibrate(0.0, 1, 500, 500);
  // 1 mins
  if(m % 10 >= 5){ vibrate(lvl, 1, LONGBZ, 100); m -= 5; }
  vibrate(lvl, m%5, SHORTBZ, 200);
  // lockout for one minute
  buzzLock |= 0b10;
  setTimeout(function() { buzzLock &= 0b01; }, 60000);
}
*/

let youThere = 0;

function checkClock() {
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  let nm = false;
  
  if((hr > 20 || hr < 8)) { // && myName == Eebie) {
    nm = true;
    g.setBrightness(1);
  }
  let realHour = hr;
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);
  xmid = 40;

  //nm = true;

  let xyz = accCoords();
  //console.log(JSON.stringify(xyz));
  if(xyz.x < 0 || xyz.x > 58 || xyz.y < -12 || xyz.y > 20 || xyz.z > 0) {
    g.off();
    //buzzLock |= 1;
    //console.log('Canceling buzz');
    if(showClockTO) {
      clearTimeout(showClockTO);
      showClockTO = 0;
      console.log('watch moved.. no show');
      youThere = 0; //reset
    }
    return;
  }
  if(!showClockTO) {
    showClockTO = setTimeout(drawDayClock, 1000,{hr24: realHour,hr:hr,min:min,dt:(d[1]+" "+d[2]).toUpperCase()});
  } else {
    // in case it's on too long...
    if(youThere < 7) youThere++;
    else {
      //console.log('youThere == 7');
      g.off();
    }
  }
}
function drawDayClock(d) {
  g.on();
  if(inAlarm) return;
  
  let tm=d.hr+':'+d.min;
  if (tm == lastTime) return;
  lastTime = tm;
  console.log("here");

  g.clear();
  g.setBrightness(Math.sin(d.hr24/24*Math.PI)*250+1);
  g.setFont("Dylex7x13");
  g.setFontAlign(0,-1);
  g.sc(2);
  if(EMULATOR) g.setColor(0,1,0);
  g.fillCircle(6,6,6);
  g.fillCircle(73,6,6);
  g.fillRect(6,0,73,12);
  g.sc(0);
  let batt = battInfo();
  g.drawString(batt,xmid/*-g.stringWidth(batt)/2*/,0);

  rotate = false;
  g.sc(8+7);
  if(EMULATOR) g.setColor(1,1,1);
  drawDigit(0,Math.floor(d.hr/10), false);
  drawDigit(1,Math.floor(d.hr%10), false);
  drawDigit(2,Math.floor(d.min/10), false);
  drawDigit(3,Math.floor(d.min%10), false);

  //g.setFont("KNXT"); 
  g.sc(1);
  if(EMULATOR) g.setColor(0,1,0);
  g.fillRect(0,140,79,159);
  g.sc(14);
  g.drawString(d.dt,xmid/*-g.stringWidth(d.dt)/2*/,141);
  g.flip();
  /*
  console.log('buzing in 3...');
  buzzLock &= 0b10;
  setTimeout(buzzClock, 3000, hr, min);
  */
}

function drawNightClock(d) {
  g.clear();
    g.on();
    rotate = true;
    g.setColor(4);
    if(EMULATOR) g.setColor(0.5,0.5,0.5);
  //console.log("draw1: "+d.hr);
    if (d.hr>9) drawDigit(0,Math.floor(d.hr/10), true);
    drawDigit(1,Math.floor(d.hr%10), true);
  //console.log("draw2: "+d.min);
    drawDigit(2,Math.floor(d.min/10), true);
    drawDigit(3,Math.floor(d.min%10), true);
    g.fillCircle(40, 80,2);
    g.fillCircle(24, 80,2);
    let b = battLevel();
    for(let c=0; c<5; c++) {
      if(b > c*20) g.drawCircle(16+12*c, 8, 4);
      //else g.drawCircle(14+12*c,8,4);
    }
    g.flip();
}

function clock(){
  volts=0;
  return setInterval(function(){
    checkClock();
},777);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  inAlarm = false;
  //currscr=-1;
  return 0;
}

g.setBrightness(32);
var screens=[clock,sleep];
var currscr= 0;
var currint=screens[currscr]();
//let longpress = 0;
let longpressTO = 0;

const btnDown = (b) => {
  //longpress = b.time;
  longpressTO = setTimeout(function(){
    // long press behaviour
    //g.setBrightness(256);
    currscr = currscr ? 0 : 1; // easy enough when there's only two
    if (currint > 0) clearInterval(currint);
    logD(`Running screen ${currscr}`);
    currint = screens[currscr]();
    longpressTO = 0;
    notify();
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

/* screen switching
 currscr++;if (currscr>=screens.length) currscr=0;
    if (currint>0) clearInterval(currint);
    currint=screens[currscr]();
*/
