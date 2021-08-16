eval(require("Storage").read("boot0"));

//require("m_dylex13").add(Graphics);
//require("m_knxt").add(Graphics);
//require("Font8x12").add(Graphics);
require("m_omnigo").add(Graphics);


/*
** BEGIN WATCH FACE
*/
let myPal = new Uint16Array([0,15,8,8]);
const startX=[0,20,40,60],startY=[56,56,56,56],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1;
let d0 = {
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette : myPal, //new Uint16Array([0,65535,59196,6339]),
  buffer : E.toArrayBuffer(atob("AAAAAADqqqqwNVVVVcJVVVVYJb//5YJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJYAAJYJb//5YJVVVVYJVVVVYClVVWgAAAAAAAAAAAA"))
},d1 = {
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette : myPal, //new Uint16Array([0,65535,38066,25388]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAANUAAAAJUAAAAJUAAAAFUAAAAFUAAAA1UAAAA1UAAAAlUAAAAlUAAAAVUAAAA5UAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAJUAAAAAAAAAAAAAA"))
},d2 = {
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette :  myPal, //new Uint16Array([0,65535,6339,59196]),
  buffer : E.toArrayBuffer(atob("AAAAAAC////gDVVVV4JVVVVYJWqqlYJWAAFYJWAAFYJWAAFYJWAAFYJWAAFYJWAAFYJWAAFYJWAAFYAAAAlYAAAA1QAAAAVwAAACVgAAADXAAAAJWAAAANcAAAAlYAAAA1wAAACVgAAADXAAAAJWAAAANcAAAAlYAAAA1wAAACVgAAADVAAAAJXAAAANUAAAAlcAAAA1QAAACVwAAADVAAAAJXqqqoNVVVVcNVVVVcFVVVVcAAAAAAAAAAAA"))
},d3=  {
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette : myPal, //new Uint16Array([0,65535,42292,6339]),
  buffer : E.toArrayBuffer(atob("AAAAAACqqqqwJVVVVcJVVVVYFaqqlYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYAAAAFYAAAAlcAAACVgAAA1WAAACVYAAA5VwAAAlYAAAA1WAAAACVcAAAAlWAAAANVgAAAAlcAAAAFYAAAAFYKoAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFYAAFYFb//1YFVVVVYJVVVVcCVVVVgAAAAAAAAAAAA"))
},d4={
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette :  myPal, //new Uint16Array([0,65535,61277,19017]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAKoAAAAFcAAAA1gAAAAlwAAAAVwAAADWAAAACXAAAABXAAAANYAAAAJcAAAA1cAAAA1gAAAAlwVwADVwVwADWAVwACXAVwANUAVwANYAVwAJcAVwA1QAVwAlgAVwAVwAVwDVAAVwCWAAVwBXAAVwNUAAVwJVVVVVFVVVVVFVVVVVAAAAVwAAAAVwAAAAVwAAAAVwAAAAVwAAAAVwAAAAVwAAAAVwAAAAVwAAAAVwAAAAAAAAAAAA"))
},d5={
    width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette :  myPal, //new Uint16Array([0,65535,6339,33840]),
  buffer : E.toArrayBuffer(atob("AAAAAANVVVVwNVVVVQNVVVVQNX///wNUAAAANUAAAAFUAAAAFUAAAAFUAAAAFUAAAAFcAAAAFcAAAAFcAAAAFcAAAAFeqqqAFVVVVgFVVVVQFVVVVQAAAA1QAAAA1QAAAA1QAAAA1QAAAA1QAAAA1QAAAA1QAAAA1QP8AA1QFcAA1QFcAA1QFcAA1QFcAA1QFcAA1QFcAA1QFcAA1QFcAA1QFeqq1QFVVVVQNVVVVwLVVVXgAAAAAAAAAAAA"))
},d6={
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette :  myPal, //new Uint16Array([0,65535,61277,21162]),
  buffer : E.toArrayBuffer(atob("AAAAAADqqqrANVVVVgJVVVVcJb//1cJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAKsJYAAAAJYAAAAJYAAAAJYAAAAJYAAAAJb///AJVVVVgJVVVVcJaqqlcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJYAAFcJVVVVcNVVVVcClVVWwAAAAAAAAAAAA"))
},d7 ={
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette : myPal, //new Uint16Array([0,65535,23243,52825]),
  buffer : E.toArrayBuffer(atob("AAAAAAL////8JVVVVUJVVVVUJWqqtcJWAAFcJWAAFYJWAAlQJWAAlQJWAA1wAAAAVgAAAAVgAAACVAAAADXAAAABXAAAABWAAAAJUAAAANUAAAANcAAAAFYAAAAlYAAAAlQAAAA1wAAAAVwAAAAVgAAACVAAAADVAAAABXAAAABWAAAAJWAAAAJUAAAANcAAAAFYAAAAFYAAAAlQAAAA1QAAAAVwAAAAVgAAACVAAAADVAAAAAAAAAAAAAAA"))
},d8={
    width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette : myPal, //new Uint16Array([0,65535,6339,33840]),
  buffer : E.toArrayBuffer(atob("AAAAAAD////gNVVVVYFVVVVcFX//1cFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFUAAlcNVgDVYDVclVwAlVVeAADVVwAANVVYAC1X1XAJVYNVwFXAC1cFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFcAAFcFeqqlcFVVVVcNVVVVcLVVVVwAAAAAAAAAAAA"))
}, d9={
  width : 18, height : 42, bpp : 2,
  transparent : -1,
  palette : myPal, //new Uint16Array([0,65535,21130,42292]),
  buffer : E.toArrayBuffer(atob("AAAAAAD////ANVVVVwFVVVVYFeqqlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFYAAlYFeqq1YFVVVVYNVVVVYC///1YAAAAlYAAAAlYAAAAlYAAAAlYAAAAlYKoAAlYFcAAlYFcAAlYFcAAlYFcAAlYFcAAlYFcAAlYFcAAlYFcAAlYFVVVVYNVVVVQDVVVXgAAAAAAAAAAAA"))
};

function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];EMULATOR&&(a+=80),g.drawImage([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
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
let stepCounter = () => {};

function checkClock() {
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  let nm = false;

  if((hr > 20 || hr < 8) && myName == Eebie) {
    nm = true;
  }
  
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);
  xmid = 40;
  if(EMULATOR) xmid=120;

  //nm = true;

  if(nm) {
    if(sec%12 < 10) g.off(); 
    else if(tm == lastTime) g.on();
    else {
      drawNightClock({hr:hr,min:min});
      lastTime = tm;
    }
    return;
  }

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
    showClockTO = setTimeout(drawDayClock, 1000,{hr:hr,min:min,dt:(d[1]+" "+d[2]).toUpperCase()});
  } else {
    // in case it's on too long...
    if(youThere < 7) youThere++;
    else {
      console.log('youThere == 7');
      g.off();
    }
  }
}
function drawDayClock(d) {
  g.on();
  /*
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  d.hr=d[4].substr(0,2);
  d.min=d[4].substr(3,2);
  */
  //console.log("here");
  let tm=d.hr+':'+d.min;
  if (tm == lastTime) return;
  lastTime = tm;

  g.clear();
  g.setFont("Omnigo");

  g.setColor(2+8);
  if(EMULATOR) g.setColor(0,1,0);
  //g.fillCircle(6,6,6);
  //g.fillCircle(73,6,6);
  //g.fillRect(6,0,73,12);
  //g.setColor(0);
  let batt = (battInfo().split(' '))[0];
  g.drawString(batt,79-g.stringWidth(batt),0);
  g.drawString(getSteps(), 0, 0);
  
  rotate = false;
  g.setColor(8+7);
  if(EMULATOR) g.setColor(1,1,1);
  drawDigit(0,Math.floor(d.hr/10), false);
  drawDigit(1,Math.floor(d.hr%10), false);
  drawDigit(2,Math.floor(d.min/10), false);
  drawDigit(3,Math.floor(d.min%10), false);

  //g.setFont("KNXT"); 
  //g.setColor(1);
  if(EMULATOR) g.setColor(0,1,0);
  //g.fillRect(0,140,79,159);
  g.setColor(14);
  g.drawString(d.dt,xmid-g.stringWidth(d.dt)/2,141);
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
  return setInterval(checkClock, 777);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  currscr=-1;
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
    g.setBrightness(256);
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
  if(longpressTO) clearTimeout(longpressTO);
  else setTimeout(()=>{g.setBrightness(32);},10000);
  setWatch(btnDown, BTN1, { repeat:false, edge:'rising', debounce:25});
};

setWatch(btnDown, BTN1, { repeat:false, edge:'rising', debounce:25});

let SCstate = 0;
let SCcnt = 0;
let SCprev, SCcurr;

setInterval(() => { 
  SCcurr = accCoords();
  if(!SCprev) { SCprev=SCcurr; return;}
  if(SCcurr.y > -52 || SCcurr.y < -63) {
    if(!SCstate) SCstate = 1;
    //console.log('up1: v='+Math.abs(prev.y-curr.y));
  } else {
    if(SCstate) {
      //console.log('reset');
      let v = Math.abs(SCprev.y-SCcurr.y);
      if(v > 10) {
        SCcnt++;
        console.log(`STEP:${SCcnt} v=${v}`);
      }
      SCstate = 0;
    }
  }
  SCprev = SCcurr;
}, 100);
let getSteps = () => {return (SCcnt);};

