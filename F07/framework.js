/*
** LOAD DRIVERS
**
eval(require("Storage").read("B5.drivers.js"));
*/
let BUTTON = {
  lastUp: 0,
  longpressTO: 0,
  tapTO: 0,
  longTime: 1000,
  tapTime: 250,
  dbltap: false,
  watchUp: false,
  upOpts: { repeat:false, edge:'falling', debounce:25},
  dnOpts: { repeat:false, edge:'rising', debounce:25},
};

  
const btnDown = (b) => {
  //longpress = b.time;
  if(BUTTON.tapTO) {
    clearTimeout(BUTTON.tapTO);
    BUTTON.tapTO = 0;
    BUTTON.dbltap = true;
  }
  BUTTON.longpressTO = setTimeout(function(){
    // long press behaviour
    BUTTON.emit('longpress');
    BUTTON.longpressTO = 0;
    // ignore button up
    BUTTON.watchUp = false;
  }, BUTTON.longTime);
  logD(`lpto=${BUTTON.longpressTO}`);
  BUTTON.watchUp = true;
  setWatch(btnUp, BTN1, BUTTON.upOpts);
};

const btnUp = (b) => {
  if(BUTTON.longpressTO) {
    clearTimeout(BUTTON.longpressTO);
    BUTTON.longpressTO = 0;
  } 
  if(BUTTON.dbltap) {
    BUTTON.emit('dbltap');
    BUTTON.dbltap = false;
  } else if (BUTTON.watchUp) {
    BUTTON.tapTO = setTimeout(function(){
      // long press behaviour
      BUTTON.emit('tap');
      BUTTON.tapTO = 0;
      BUTTON.dbltap = false;
    }, BUTTON.tapTime);
    logD(`lpto=${BUTTON.tapTO}`);
  }
  BUTTON.lastUp = b.time;
  setWatch(btnDown, BTN1, BUTTON.downOpts);
};

setWatch(btnDown, BTN1, BUTTON.downOpts);


require("FontDylex7x13").add(Graphics);

let theFont = "Dylex7x13";
g.setFont(theFont);


g.off = () => {console.log("g.off");};
g.on = () => {console.log("g.on");};
g.sc = g.setColor;

wid = 80;
hgt = 160;
const LONGPRESS = 'lp';
const DBLTAP = 'dt';
const TAP = 'tap';


Bangle.setLCDPower = (onoff) => {
  if(onoff) g.on();
  else g.off();
};

/* 16 bit */
const BLUE = '#0000ff';
const WHITE = '#ffffff';
const BLACK = 0;
const YELLOW = '#ffff00';
const GRAY = '#808080';
const VIOLET = '#ff00ff';
const CYAN = '#00ffff';

/**/
/* paletted 
const BLUE = 1;
const WHITE = 15;
const BLACK = 0;
const YELLOW = 14;
*/


const notify = () => {
  console.log('notify()');
};
const logD = console.log;

/* CLOCK */
let CLOCK = {
    lastTime : '',
    lastTimeSecs : '',

    //logme() {console.log(this);}
    displayFull: (x0, y0, wid, hgt) => {
      CLOCK.update();
      if(CLOCK.currentTimeSecs == CLOCK.lastTimeSecs) return;
      this.lastTimeSecs = this.currentTimeSecs;
      g.clearRect(x0, y0, x0+wid-1, y0+hgt-1);
      let xmid=wid/2+x0, ymid=hgt/2+y0;
      g.drawRect(x0, y0, x0+wid-1, y0+hgt-1);
      //g.drawLine(x0, ymid, wid-1, ymid);
      g.setFontAlign(0,0);
      g.setFont(theFont, 6);
      let hr = ('0'+this.hr).slice(-2);
      let min = ('0'+this.min).slice(-2);
      g.drawString(`${hr}\n${min}`, xmid, ymid);
    },
    displaySmall: (x0, y0, wid, hgt) => {
      //this.getxTime();
      if(this.currentTime == this.lastTime) return;
      this.lastTime = this.currentTime;
      g.clearRect(x0, y0, x0+wid-1, y0+hgt-1);
      let xmid=wid/2+x0, ymid=hgt/2+y0;
      g.drawRect(x0, y0, x0+wid-1, y0+hgt-1);
      //g.drawLine(x0, ymid, wid-1, ymid);
      g.setFontAlign(0,0);
      g.setFont(theFont, 1);
      g.drawString(this.currentTime, xmid, ymid);
    },
    displayDate: (x0, y0, wid, hgt) => {
      let xmid=wid/2+x0, ymid=hgt/2+y0;
      //this.getxTime();
      //console.log(dt.toString());
      g.drawRect(x0, y0, x0+wid-1, y0+hgt-1);
      //g.drawLine(x0, ymid, wid-1, ymid);
      g.setFontAlign(0,0);
      g.setFont(theFont, 1);
      g.drawString(this.niceDate, xmid, ymid);
    },

    update: () => {
      let d=Date();
      //this.sec=d.getSeconds();
      d=d.toString().split(' ');
      CLOCK.niceDate=`${d[0]} ${d[1]} ${d[2]}`;
      CLOCK.currentTime=d[4].substring(0,5);
      CLOCK.currentTimeSecs=d[4].substring(0,8);
      CLOCK.hr=parseInt(d[4].substr(0,2));
      CLOCK.min=parseInt(d[4].substr(3,2));
      CLOCK.sec=parseInt(d[4].substr(6,2));
      CLOCK.nm = false;
      if(CLOCK.hr > 20 || CLOCK.hr < 8) {
        CLOCK.nm = true;
      }
      CLOCK.hr %= 12;
      if (CLOCK.hr === 0) CLOCK.hr = 12;
    },

};

/* ALARM */
let ALARM = {
  currentAlarm : {msg:'test|of stuff', time:'2021-12-06T16:00:00'},
  title : "ALARM",
  
  displayFull: (x0, y0, wid, hgt) => {
    let xmid=wid/2+x0, ymid=hgt/2+y0;
    g.setColor(BLUE);
    g.fillRect(x0, y0, x0+wid-1, y0+hgt-1);
    g.setColor(WHITE);
    g.setFontAlign(0,-1);
    g.setFont(theFont, 1);
    let y = y0+4;
  
    g.drawString('* '+this.title+' *', xmid, y);
    g.drawString('* '+this.title+' *', xmid+1, y);
    y += g.getFontHeight();
    
    let lines = this.currentAlarm.msg.split("|");
    for(let l = 0; l < lines.length; l++) {
      g.drawString(lines[l], xmid, y);
      logD(`l:${lines[l]}`);
      y += g.getFontHeight();
    }


  }
};

/* COUNTDOWN */

/* TIMER */


let alarm = () => {
  logD('showMsg END');
};
  
function SleepScr(){
  g.clear(); g.flip();
  g.off();
  currscr=-1;
  return 0;
}




/************************************** */
const MENU = 'Menu';
const ALARMS = 'Alarms';
const TIMER = 'Timer';

let ClockScr = {
  interval: 0,
  display: () => {
    g.clear();
    g.sc(CYAN);
    g.drawRect(0,0,wid-1,hgt-1);
    g.setFontAlign(0,0);
    //g.drawString(CLOCK, wid/2, hgt/2);
    g.flip();
    
    CLOCK.displayFull(0, 20, wid-1, hgt-20); 
    /*
    clk.displaySmall(0,0,80,20);
    clk.displayDate(0,140,80,20);
    */
  },
  event: (ev) => {
    if(ev === TAP) {
      // clear interval
      logD('Clock TAP');
    }
  },
  exit: LONGPRESS,
  shutdown: () => {if(ClockScr.interval) clearInterval(ClockScr.interval);}
};

let AlarmsScr = {
  interval: 0,
  display: () => {
    g.clear();
    g.sc(VIOLET);
    g.drawRect(0,0,wid-1,hgt-1);
    g.setFontAlign(0,0);
    g.setFont(theFont, 1);
    g.drawString(ALARMS, wid/2, hgt/2);
    g.flip();
  },
  event: (ev) => {
    if(ev === TAP) {
      logD('Alarms TAP');
    }
  },
  exit: DBLTAP,
  shutdown: () => {}
};

let TimerScr = {
  interval: 0,
  display: () => {
    g.clear();
    g.sc(GRAY);
    g.drawRect(0,0,wid-1,hgt-1);
    g.setFontAlign(0,0);
    g.setFont(theFont, 1);
    g.drawString(TIMER, wid/2, hgt/2);
    g.flip();
  },
  event: (ev) => {
    if(ev === TAP) {
      logD('Timer TAP');
    }
  },
  exit: DBLTAP,
  shutdown: () => {}
};

let MenuScr = {
  items: ["Alarms","Timer", "Exit"],
  tgts: [AlarmsScr, TimerScr, ClockScr],
  curritem: 0,
  display: () => {
    g.clear();
    g.sc(YELLOW);
    g.drawRect(0,0,wid-1,hgt-1);
    g.setFontAlign(0,0);
    g.setFont(theFont, 1);
    g.drawString(MENU+": "+MenuScr.items[MenuScr.curritem], wid/2, hgt/2);
    g.flip();
  },
  event: (ev) => {
    if(ev === TAP) {
      if(++MenuScr.curritem >= MenuScr.items.length) MenuScr.curritem = 0;
      MenuScr.display();
    }
  },
  exit: LONGPRESS,
  next: () => { return MenuScr.tgts[MenuScr.curritem]; },
  shutdown: () => {}
};



// our navigation
AlarmsScr.next = () => { return ClockScr; };
TimerScr.next = () => { return ClockScr;};
ClockScr.next = () => { return MenuScr; };

function go(newScr) {
  // shutdown old
  CurrScreen.shutdown();
  // new
  CurrScreen = newScr;
  // init
  CurrScreen.display();
}
  
function eventHandler(ev) {
  if(ev === CurrScreen.exit) {
    // figure out next screen
    let next = CurrScreen.next();
    go(next);
  } else {
    CurrScreen.event(ev);
  }
}

g.on();
CurrScreen = ClockScr;
go(CurrScreen);
let ev=eventHandler;

BUTTON.on('tap',()=>{ev(TAP);});
BUTTON.on('longpress',()=>{ev(LONGPRESS);});
BUTTON.on('dbltap',()=>{ev(DBLTAP);});

