// boards that deviate from our program outline
_C = {
    alwaysOn: ["CV16", "QY03X", "F07X", "DT28X", "MagicX","TK78G"]
};

/*
// Blocky font (Chicago)
Graphics.prototype.setFontBlocky = function() {
    this.setFontCustom(atob("AAAAAAAAAAAAD+QfyAAAcADgAAADgAcAACACeAfwfwDzwD+D+AeQAQAAABwQZCH/4RCCHwAcBwAfACIQfGBzgAwAYAOcDHwQiAHwAcAAAO8D/wRCCMQf2BzwAMADwASAAAQADgAAAB/gf+GAYgBAAAgBGAYf+B/gAABsAHAD+AHABsAAAAAAAgAEAD4AfAAgAEAAAAAEADgAYAAAEAAgAEAAgAAAADAAYAAAAAADAB4B8A+AeADAAAAB/wf/CAIQBCAIf/B/wAACAAf/D/4AAAAAA+CP4RBCIIRBD4IOAAAAQBCIIRBCIIf/B3wAAB+APwACAAQACAf/D/4AAD4AfBCIIRBCIIR/AHwAAB/wf/CIIRBCIIR/AHwAACAAQACA4Q/CfAfADgAAAB3wf/CIIRBCIIf/B3wAAB8AfxCCIQRCCIf/B/wAAAxgGMAAAGLAxwAAAEABwAbAGMAggAAASACQASACQASAAAAggGMAbABwAEAAABAAYACGQRyD4AOAAAAH4B/gYGGeQn6EhQn6EeQwaDDAPwAAAP+D/wQQCCAQQD/wP+AAAf+D/wRCCIQRCD/wO8AAAP8D/wQCCAQQCDAwIEAAAf+D/wQCCAQQCD/wP8AAAf+D/wRCCIQRCAAAf+D/wRACIARAAAAP8D/wQCCAQQiDHwI+AAAf+D/wBAAIABAD/wf+AAAf+D/wAAAAgAGAAQACAAQf+D/gAAD/wf+AeAGYBhgYGCAQAAD/wf+AAQACAAQACAAAf+D/wGAAcADgAwAf+D/wAAD/wf+BgAGAAYAf+D/wAAB/gf+CAQQCCAQf+B/gAAD/wf+CIARACIAfABwAAAB/gf+CAQQCCBwf/B/oAAD/wf+CIARACIAf+B3wAABxgfOCIQRCCIQd+BngAACAAQAD/wf+CAAQAAAAf8D/wACAAQACD/wf8AAAfgD/AAeAAwAeD/AfgAAAfgD/AAeABwf0D/AAeAAwf8D/AAADAweeA/ABgA/AeeDAwAADwAfAAPwB+D4AeAAAAQeCHwRiCIQTCDwQcCAAA//H/4gBAAAYADwAHwAPgAPAAYAAEAI//H/4AAAYAPADgAwADgAPAAYAAAAAIABAAIABAAIABAAAcABgAAAAJgDeASQCSAfwB+AAAf+D/wCCAQQD+APgAAAPgD+AQQCCAQQAAAPgD+AQQCCD/wf+AAAB8AfwCSASQDyAOAAAAQAP+D/wSAAAAB8AfyCCQQSD/wf8AAD/wf+AQACAAfwB+AAAT+CfwAAAACAASf+T/gAAf+D/wAgAOAHeAxwAAD/wf+AAAD+AfwCAAfwD+AQAD+APwAAAfwD+AQACAAfwB+AAAB8AfwCCAQQD+APgAAAf+D/wQQCCAfwB8AAAB8AfwCCAQQD/wf+AAAfwD+AQACAAYABAAAABkAewCSASQDeAJgAAAQAH8A/wCCAAAD8AfwACAAQD+AfwAAAfAD8AAwAGAfgD4AAAD4AfgAGAfwD8AAwD+AfAAAAYwDuAHAA4AdwDGAAADwAfAAMAAiD/wf8AAAQwCOATQCyAcQDCAAAAwB/4fPiAEAAH/+//wAAQAj58P/AGAAAAgAMABAAMAAwACAAwAEAAAAAAAAAAAAAA"), 32, atob("AwQGCAgNCgMFBQYHBAUEBwgFCAgICAgICAgDAwYGBgYMCAkICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 256 + 15);
};
g.setFontBlocky();
*/
// Omnigo font
Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=='), 32, atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc='), 256 + 13);
};
g.setFontOmnigo();
g.setFontAlign(0,-1);

let logD = (msg) => { console.log(msg); };

let lastTime = '';
let lastDate = '';

//let myName = NRF.getAddress().slice(-5);
//console.log(myName);

function alarm() {
    [400,800,1200,2000,2400].forEach((t) => {setTimeout(Bangle.buzz, t, 175);});
}
function notify() {
    [300,800].forEach((t) => {setTimeout(Bangle.buzz, t, 250, 0.5);});
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
        logD('idx = '+idx);
        let tdiff = Date.parse(als[idx].time) - Date.now();
        let msg = als[idx].msg;
        if(tdiff > 0) {
            logD(`will alarm ${msg} in ${tdiff}`);
            alarmTOs.push(setTimeout(showAlarm, tdiff,als[idx].msg));
        } else {
            //expired
            logD('tossing out' + idx);
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
    //logD('checkClock START');
    let d=Date().toString().split(' ');

    let dt= {
        niceDate: Date().toString().substring(0,10),
        tm: d[4].substring(0,5),
        hr: d[4].substring(0,2) ,
        hr24: d[4].substring(0,2),
        min: parseInt(d[4].substring(3,5)),
        sec: d[4].substring(6,8),
    }
    //logD(`tm = ${dt.tm}; lastTime = ${lastTime}`);
    if (dt.tm == lastTime) {
        logD(`clock unchanged - returning`);
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

// for always-on, pull the name from current advertising
let dv = E.toString(NRF.getAdvertisingData());
dv=dv.slice(5,dv.indexOf(' '))
if(_C.alwaysOn.includes(dv))
    ival1 = setInterval(()=>{clock(); g.flip();}, 60000);
// for regular LCD
else
    wOS.on("wake", clock);

// show tidbits / notes every "once in a while"
ival2 = setInterval(()=> {
  // what to show down below - if hours > 9pm & < 7am
  if(!inAlarm && (Date().getHours()+3)%24 >= 10) {
    if(!showNotes()) {
      // need a delay; OK to show bit...
      showBits();
    }
  }
}, 51*60*1000);

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
  logD('longpress');
  if(wOS.isLCDOn()) {
    showMsg({text:''}); // clear until next tidbit
    if(inAlarm) {
      inAlarm = false; 
      showNotes();
    } else {
      //inNotes = !inNotes;
    }
    Bangle.buzz();
  }
});

wOS.UI.on("tap", () => {
    wOS.wake();
    // CV16: clear the message area
    //LCD.setEverything('?????');
});

// NOT CV16
wOS.UI.on("dbltap", nextScreen);
