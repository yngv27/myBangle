debug=print;
/*
version of APW for EPDs
*/
Graphics.prototype.setFontKnx18 = function () {
this.setFontCustom(atob("AAAAAAAAAAAAAAAAAAP8gAAAAAAMAAAAAMAAAAAAAAGAQJBgGGAAYABhgGCQIBgAAAAAAEAAIAAAAAB+AOBgQAQAAAAAAQAQOBgB+AAAAAAAAIABJAAqAAUAAqABJAAIAAAAAAAAIAAIAAIAB/AAIAAIAAIAAAAAAAAAIAAwAAAAAAAIAAIAAIAAIAAIAAIAAAAAAAAAwAAAAAAABwAGAAIABwAOAAAAAAAAD/AEAgIAQIQQIAQEAgD/AAAAAAACAAEAAP/wAAAAAACBwECQIEQIIQEQQDgQAAAAAACBAEAgIQQIQQEogDHAAAAAAAAHAAZABhAOBAAfwABAAAAAAAPhAIggIgQIgQIQgIPAAAAAAAB/ACQgEgQIgQIQgAPAAAAAAAIAAIAAIBwIOAJwAOAAAAAAAADHAEogIQQIQQIQQEogDHAAAAAAADgAEQAIIQIIQIIgETAD8AAAAAAAAxgAAAAAACAAEAAIAAIMwIQAEgADAAAAAAAAADwA+ADCAMCADCAA+AADwAAAAAAP/wIQQIQQIQQEogDHAAAAAAAD/AEAgIAQIAQEAgCBAAAAAAAP/wIAQIAQIAQEAgD/AAAAAAAP/wIQQIQQIQQIQQIAQAAAAAAP/wIQAIQAIQAIQAIAAAAAAAAD/AEAgIAQIAQIIQEIgAPgAAAAAAP/wAQAAQAAQAAQAAQAP/wAAAAAAIAQP/wIAQAAAAAAABAAAgAAQAAQAAgP/AAAAAAAP/wAQAAoABEACCAMBwAAAAAAP/wAAQAAQAAQAAQAAQAAAAAAP/wGAABgAAYABgAGAAP/wAAAAAAP/wGAABgAAYAAGAABgP/wAAAAAAD/AEAgIAQIAQIAQEAgD/AAAAAAAP/wIIAIIAIIAEQADgAAAAAAAD/AEAgIAQIBQEAgD/QAAAAAAP/wIIAIIAIMAETADgwAAAAAADBAEggIQQIQQEIgCHAAAAAAAIAAIAAP/wIAAIAAAAAAAAP/AAAgAAQAAQAAgP/AAAAAAAOAAB4AAHAAAwAHAB4AOAAAAAAAAPAAA8AADwA8APAAA8AADwA8APAAAAAAAAIAwGDABsAAQABsAGDAIAwAAAAAAIAAGAABgAAfwBgAGAAIAAAAAAAAIBwIGQIIQIQQJgQOAQAAAAAAADAAkgBIQBIQBIQA/gAAAAAAP/gAggBAQBAQAggAfAAAAAAAAfAAggBAQBAQBAQAggAAAAAAAfAAggBAQBAQAggP/gAAAAAAAfAAkgBEQBEQAkQAcgAAAAAABAAH/wJAAIAAAAAAAAAfAAgiBASBASBASAgkA/4AAAAAAP/wAgABAABAABAAAgAAfwAAAAAAF/wAAAAAAAAIAAEAAEE/4AAAAAAP/wAEAAEAAKAARAAggBAQAAAAAAP/AAAgAAQAAAAAAB/wAgABAAA/wBAAAgAAfwAAAAAAB/wAgABAABAAAgAAfwAAAAAAAfAAggBAQBAQAggAfAAAAAAAA/8AggBAQBAQBAQAggAfAAAAAAAAfAAggBAQBAQBAQAggA/8AAAAAAA/wAQAAgABAABAAAAAAAAARAAogBIQBEQBEQAigARAAAAAAABAAH/ABAgBAQAAAAAAB/AAAgAAQAAQAAgB/wAAAAAABwAAMAADAAAwADAAMABwAAAAAAAB+AABwAGAAYAAGAABwB+AAAAAAABgwARAAKAAEAAKAARABgwAAAAAABwEAMEADYAAgADAAMABwAAAAAAABAwBBQBCQBEQBIQBwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"), 32,atob("BgMFAAAJAAMFBQgJBAgDBwkFCAgICAgICQkDAAAAAAkACQgICAgICQgFCAgICQkJCAgICAcICQsJCQgAAAAAAAAICAgICAYJCQMGCQUJCAgJCQcJBggJCQkJCA=="), 256 | 18);
};
g.setFontKnx18();
g.setFontAlign(0,-1);
let lastTime = '';
let lastDate = '';

//let myName = NRF.getAddress().slice(-5);
//console.log(myName);

function alarm() {
    [400,800,1200,2000,2400].forEach((t) => {setTimeout(wOS.buzz, t);}); //, 175);});
}
function notify() {
    [300,800].forEach((t) => {setTimeout(wOS.buzz, t);}); //, 250, 0.5);});
}


// to be overridden
let showMsg = (msgobj) => {};

/**** BEGIN ALARMS *******/
let _tidBits = ["tb1","tb2","tb3"];
let inAlarm = false;

// if you want to wear out your flash by keeping them on SPI flash...
/*
let loadAlarms = () => {
  als =  _Storage.readJSON('alarms.json');
  if(als) 
    scheduleAlarms(als);
};
*/
let alarmTOs = [];

function showAlarm(msg) {
    console.log(`alarming w ${msg}`);
    inAlarm = true;
    showMsg({title: "ALARM", text:msg});
    alarm();
}

let scheduleAlarms = (als) => {
    for(let idx=0; idx < alarmTOs.length; idx++) {
        clearTimeout(alarmTOs[idx]);
    }
    alarmTOs = [];
    for(let idx=0; idx < als.length; idx++) {
        debug('idx = '+idx);
        let tdiff = Date.parse(als[idx].time) - Date.now();
        let msg = als[idx].msg;
        if(tdiff > 0) {
            debug(`will alarm ${msg} in ${tdiff}`);
            alarmTOs.push(setTimeout(showAlarm, tdiff,als[idx].msg));
        } else {
            //expired
            debug('tossing out' + idx);
        }
    }
};

let showNotes = () => {
    if((_tidBits.length > 0) && (_tidBits[0].length > 0)) {
      showMsg({title: "Note", text:_tidBits[0]});
      return true;
    }
    return false;
  };
  
  let showBits = () => {
      // if only 1, it's a note/memo; do not disturb
      if(_tidBits.length < 2) return;
      showMsg({text:_tidBits[Math.floor(Math.random()*((_tidBits.length)-1)+1)]});
      notify();
  }

let schAls = scheduleAlarms;

/*
********************************************* END ALARMS *******************************
*/

function clock() {
  debug('checkClock START');
  let d=Date().toString().split(' ');

  let dt= {
      niceDate: Date().toString().substring(0,10),
      tm: d[4].substring(0,5),
      hr: d[4].substring(0,2) ,
      hr24: d[4].substring(0,2),
      min: parseInt(d[4].substring(3,5)),
      sec: d[4].substring(6,8),
  }
  //debug(`tm = ${dt.tm}; lastTime = ${lastTime}`);
  if (dt.tm == lastTime) {
      debug(`clock unchanged - returning`);
      return;
  }
  lastTime = dt.tm;

  if(d[2] != lastDate) {
      wOS.setStepCount(0);
      lastDate = d[2];
  }

  dt.isPM = dt.hr24 > 11;
  if (!(dt.hr %= 12)) dt.hr = 12;
//    if (dt.hr === 0) dt.hr = 12;
  //dt.min = parseInt(dt.min);

  W.drawClock(dt);
  W.drawData(dt);
  g.flip();
  //*
  if(dt.min > 55) setTimeout(()=>{g.init();}, 5000); // full refresh on hour
  if(dt.min == 0) setTimeout(()=>{g.setPartial();}, 5000); // back to partial
  //*/
  // adjust between night and day
  //debug(JSON.stringify(dt));
  if(dt.hr24 == 21 && dt.min == 0) {
    clearInterval(ival1);
    debug("Night time");
    showMsg({text:"NIGHT WATCH"});
    alarm();
    g.flip();
    ival1 = setInterval(clock, 30*60*1000);
  } else if(dt.hr24 == 7 && dt.min == 0) {
    clearInterval(ival1);
    debug("Day time");
    showBits();
    ival1 = setInterval(clock, 150*1000);
  }

}

const scrs=[ "watch1.js"]; //, "watch2.js", "night.js", "analog1.js"];
let scridx = -1;
let W={};

let nextScreen = () => {
    if(typeof(W) != "undefined" && typeof(W.stop) != "undefined") W.stop();
    // fancy round robin increment ;-)
    ++scridx >= scrs.length ? scridx = 0 : scridx;
    g.clear(); lastTime = "";
    W=require(scrs[scridx]);
    W.start();
    showMsg = W.showMsg;
    // shutdown the other intervals, restart the new ones
    clock();
    showNotes();
};
// make sure it's ready
setTimeout(nextScreen, 500);

let ival1 = 0; 
let ival2 = 0;

// fancy for watches with refresh >1 minute.. lock it onto 2.5 min chunks
ival2 = new Date();
ival2 = (ival2.getMinutes()*60+ival2.getSeconds()) % 150;
setTimeout(()=>{
  ival1 = setInterval(clock, 150*1000);
},  (150-ival2) * 1000);//2.2*60*1000);
// for regular LCD

//*
// show tidbits / notes every "once in a while"
ival2 = setInterval(()=> {
  // what to show down below - if hours > 9pm & < 7am
  if(!inAlarm && (Date().getHours()+3)%24 >= 10) {
    if(!showNotes()) {
      // need a delay; OK to show bit...
      showBits();
      //g.flip();
    }
  }
}, 47*60*1000);
//* /

/* use for CV16: BTN1 doesn't need double tap

setWatch(() => {
  if(!wOS.isLCDOn()) wOS.wake();
  else nextScreen();
}, BTN1, {"edge":"rising", "repeat":true});

*/

stop = () => {
    alarmTOs.forEach((to)=>{clearInterval(to);});
    clearInterval(ival1);
    //clearInterval(ival2);
};

wOS.UI.on("longpress", () => {
  //debug('longpress');
  if(true) { //wOS.isLCDOn()) {
    showMsg({text:''}); // clear until next tidbit
    if(inAlarm) {
      inAlarm = false; 
      showNotes();
    } else {
      //inNotes = !inNotes;
    }
    wOS.buzz();
    g.flip();
  }
});

wOS.UI.on("tap", () => {
  clock();
  showBits();
  g.flip();
});

// NOT CV16
wOS.UI.on("dbltap", nextScreen);

_tidBits = 
 [
    "",
    "Envelope someone in\nwhite light",
    "SO MANY beings are grateful for our endurance",
    "Slow down 50%",
    "Stop thinking, feel your body",
    "That ego... ignore it.."
   ];   
