eval(require("Storage").read("F07.js"));

//require("m_knxt").add(Graphics);
//require("Font8x12").add(Graphics);
require("omnigo.fnt").add(Graphics);

E.getBattery = () => {return 99;};

// funky!  16bit to 12bit conv
function to12(c) {
  let r = (c & 0xf000) >> 4;
  let g = (c & 0x0780) >> 3;
  let b = (c & 0x001e) >> 1;
  //console.log((c).toString(2)+" to "+(r).toString(2)+':'+(g).toString(2)+':'+(b).toString(2));
  return r+g+b;
}
/*
** BEGIN WATCH FACE
*/
const startX=[-4,11,34,56],startY=[60,60,60,60],nmX=[4,42,88,126],nmY=[12,12,12,12];
let rotate=!1;
let imgDig = [
  {
  width : 26, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,50712,23275]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7wAAAAADWpcAAAAAnADrAAAAGAAAnAAACgAAAoAAAoAAAAoAANwAAAAcAAoAAAADgANAAAAABwA4AAAAAKABwAAAAA0AEAAAAAAcDQAAAAACwKAAAAAAOAsAAAAAA4CwAAAAADQLAAAAAANAsAAAAAA0CwAAAAADQLAAAAAAOAoAAAAAA4DgAAAAACwNAAAAAALAHAAAAAAQAoAAAAAOADQAAAAAsABwAAAANAANAAAAAoAAKAAAANAAA3AAADcAAA3AAA3AAAA2AANwAAAA5/9cAAAAAOmsAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="))
},{
  width : 19, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,59164,19017]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAMAAAAA5wAAADncAAADYHAAAOsBwAADwAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAAHAAAAABwAAAAAcAAAAALAAAAAAAAAAAAAAAAAAAAAA=="))
},{
  width : 25, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,12678,33840]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAv+AAAAALV9XgAAANcAC3AAANwAADcAANgAAAJwABgAAAAmAAAAAAADQAAAAAAAmAAAAAAABwAAAAAAA8AAAAAAANAAAAAAADQAAAAAAA8AAAAAAAPAAAAAAABgAAAAAADQAAAAAACcAAAAAAAcAAAAAAA8AAAAAAAcAAAAAACcAAAAAACcAAAAAACcAAAAAADcAAAAAADcAAAAAADcAAAAAADcAAAAAADYAAAAAABYAAAAAAJQAAAAAAJQAAAAAAJQAAAAAANaqqqqqgBVVVVVVUAAAAAAAAAAAAAAAAAAAAAAAAAA=="))
},{
  width : 25, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,42292,12710]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAOqqqqqgADqqqqVYAAAAAADYAAAAAADYAAAAAAAUAAAAAAAUAAAAAAAUAAAAAAAXAAAAAAAnAAAAAAAnAAAAAAAnAAAAAAAmwAAAAAAJWgAAAAAADlwAAAAAAAnAAAAAAACcAAAAAAAJwAAAAAAAoAAAAAAANwAAAAAAAYAAAAAAAKAAAAAAADQAAAAAAA0AAAAAAANAAAAAAACQAAAAAAAoAAAAAAAHAAAAAAAJAAAAAAANwADAAAANgADYAAANgAANsAAJgAAAJa+lwAAAA6VrAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="))
 },{
   width : 30, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,23243,27469]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAANgAAAAAAAAlgAAAAAAAAVgAAAAAAABRgAAAAAAANhgAAAAAAA3BgAAAAAACcBgAAAAAABQBgAAAAAAFABgAAAAAA0ABgAAAAADYABgAAAAAJwABgAAAAAFAABgAAAAAUAABgAAAADQAABgAAAANgAABgAAAAnAAABgAAACcAAABgAAABQAAABgAAANAAAABgAAA2AAAABgAACcAAAABgAAJwAAAABgAAFAAAAABgAAX/////96gAVVVVVVVVQAAAAAAABgAAAAAAAABgAAAAAAAABgAAAAAAAABgAAAAAAAABgAAAAAAAABgAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"))
},{
   width : 25, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,50712,50744]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAKqqqqqAAB/+qqqoAAQAAAAAAAEAAAAAAAJAAAAAAACQAAAAAAAsAAAAAAAKAAAAAAADgAAAAAAAYAAAAAAAEAAAAAAABAAgAAAAAQlVWAAAAmYACmAAAJwAAAcAACgAAACwAAAAAAAOAAAAAAAAQAAAAAAALAAAAAAAAQAAAAAAAEAAAAAAACgAAAAAAAoAAAAAAAKAAAAAAADgAAAAAAAQAAAAAAAkAAAAAAAOAAAAAAAJAAAAAAABAACQAAAJgAAJgAAJgAAANoC2AAAAALVoAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="))
},{
  width : 26, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,23275,44405]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArAAAAAACV8AAAAACWAAAAAAA2AAAAAAANgAAAAAADwAAAAAAAmAAAAAAABgAAAAAAA8AAAAAAABgAAAAAAA8AAAAAAABgAAAAAAAkAK/4AAACwJXtWAAAOJYAAlgAAacAAANgABmAAAAJAAlwAAAAPACUAAAAAGAJwAAAAA8AmAAAAACQCQAAAAABgJAAAAAAGAkAAAAAAYCQAAAAABgBgAAAAAEAGAAAAACwAkAAAAAGAAcAAAADQACYAAAAmAACYAAAJgAACcAADYAAAC3qreAAAAAtV6AAAAAAAAAAAAAAAAAAAAAAAAAAAAA="))
}, {
    width : 25, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,35953,50712]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAACqqqqqqgAv///9VcAAAAAAAGAAAAAAAJAAAAAAABgAAAAAAAQAAAAAAA8AAAAAAAGAAAAAAAJAAAAAAABgAAAAAACQAAAAAAA8AAAAAAAGAAAAAAALAAAAAAABgAAAAAACQAAAAAAA4AAAAAAAEAAAAAAAPAAAAAAABgAAAAAACwAAAAAAAYAAAAAAAkAAAAAAAOAAAAAAABAAAAAAACwAAAAAAAYAAAAAAAkAAAAAAAOAAAAAAAJAAAAAAADwAAAAAAAYAAAAAAAsAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="))
},{
    width : 26, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,4258,4226]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAKWgAAAAACVVgAAAAAWAJQAAAAJgABQAAACYAAJgAAAJAAAGAAAAUAAAUAAABQAABQAAAJAAAGAAAAmAACYAAAAXAAFAAAAAWAJcAAAADVVWAAAAAJVVYAAAAJWAKWAAACWAAAWAAAlAAAAmAABQAAAAnAAkAAAAAUABgAAAACYAnAAAAABgCQAAAAAFAFAAAAAAkAUAAAAACQCQAAAAAJAJAAAAAAUAmAAAAABgAUAAAAAkACYAAAAJgABYAAAAUAABYAAA1gAABYAAJYAAACVqpYAAAAAlVaAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="))
},{
  width : 26, height : 40, bpp : 2,
  transparent : 0,
  f7palette : new Uint16Array([0,65535,61277,21130]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/8AAAAAOapbAAAADbAA6wAAArAAANwAAOAAAANwADcAAAAOAALAAAAALADgAAAAA4ALAAAAAAsAsAAAAACwBwAAAAAOAEAAAAAA4AcAAAAACgCwAAAAAKAOAAAAAAYA3AAAAANgAoAAAAAaAAsAAAAKsADcAAACiwADbAADoHAADm8PnDQAAA+VrAOAAAAAAAAsAAAAAAANAAAAAAAAoAAAAAAANwAAAAAAAoAAAAAAAOAAAAAAADcAAAAAAA3AAAAAAANwAAAAAAOsAAAAAD6sAAAAAAqsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="))
}
  ];
function drawDigit(t,r,n){
  pal[1]=0xfff; pal[2]=0xccc; pal[3]=0xaaa;
  imgDig[r]
  let a=(n?nmX:startX)[t];y=(n?nmY:startY)[t];
  /*
  for(let i=1;i<4;i++) {
    pal[i]=to12(imgDig[r].palette[i]);
    //console.log(pal);
  }
  //console.log('---');
  */
  if(r || t) g.drawImage(imgDig[r],a,y);
}
/*
** END WATCH FACE
*/
let lastTime = '';
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
  let tm=d.hr+':'+d.min;
  if (tm == lastTime) return;
  lastTime = tm;

  g.clear();
  g.setFont("Omnigo");

  g.setColor(2+8);
  let batt = E.getBattery()+'%';
  g.drawString(batt,79-g.stringWidth(batt),0);
  g.drawString(getSteps(), 0, 0);
  
  rotate = false;
  g.setColor(8+7);
  drawDigit(0,Math.floor(d.hr/10), false);
  drawDigit(1,Math.floor(d.hr%10), false);
  drawDigit(2,Math.floor(d.min/10), false);
  drawDigit(3,Math.floor(d.min%10), false);

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
