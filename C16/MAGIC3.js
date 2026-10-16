NRF.setAdvertising({},{name: "DerStein "+NRF.getAddress().split(':').slice(-2).join('')});

// setup Buttons
// BTN1 is already D26
D7.write(1); // turns off HR red led
//C16 BTN2
D46.mode('input_pulldown');
const BTN2=D46;

wOS = {
  BUZ: D6,
  CHG: D8,
  BAT: D30,
  BKL: D12,
//  buzz: (ms) => {      if(ms == undefined) ms = 200;    analogWrite(wOS.BUZ, 0.5); setTimeout(()=>{wOS.BUZ.reset();}, ms); },
  buzz: (ms) => {}, // if(wOS.isAwake) return; wOS.BKL.reset(); wOS.BUZ.set(); setTimeout(()=>{wOS.BUZ.reset();}, ms?ms:100);  },
 
  isCharging: ()=>{return !(wOS.CHG.read());},
  sleep: ()=> {
      g.lcd_sleep();
      TC.stop();
      wOS.setLCDBrightness(0);
      wOS.emit("sleep");
      wOS.isAwake = false;
  },
  wake: ()=>{
      wOS.ticker = 7;
      if(wOS.isAwake) return;
      TC.start();
      g.lcd_wake();
      wOS.setLCDBrightness(wOS.brightLevel());
      if(!wOS.tikint) wOS.tikint = setInterval(wOS.tick, 1000);
      wOS.emit("wake");
      wOS.isAwake = true;
    },
    tick: ()=>{
      wOS.ticker--;
      wOS.emit("tick");
      if(wOS.ticker <= 0){
        clearInterval(wOS.tikint);
        wOS.tikint = 0;
        wOS.sleep();
      }
    },
    brightLevel: ()=> { 
      let c=Math.floor(Date().getHours()/3);
      return [0.1,0.5,0.7,0.99][c > 3 ? 7-c : c]; 
    },
    setLCDBrightness: (lvl)=>{analogWrite(wOS.BKL, lvl, {freq:60});},
    setLCDPower:(b)=>{
      if(b){
        if(wOS.isAwake) wOS.time_left=wOS.ON_TIME;
        else wOS.wake();
      }else wOS.sleep();
    },
    isLCDOn:()=>{
      return wOS.isAwake;
    }
};

// load em up
eval(require(STOR).read("display.C16.js"));
eval(require(STOR).read("battery.C16.js"));
eval(require(STOR).read("accel.C16.js"));
ACCEL.faceupThreshold = 192;

// Go for watch!
g.lcd_wake = g.on;
g.lcd_sleep = g.off;

function vibrat(lvl, cnt, onms, offms) {
  let tout = 0;
  digitalWrite(wOS.BAT, 0);
  for(let x=0; x < cnt; x++) {
    setTimeout(analogWrite, tout, wOS.BAT, lvl);
    tout += onms;
    setTimeout(digitalWrite, tout, wOS.BAT, 1);
    tout += offms;
  }
}
function notify() {vibrat(0.8, 5, 600, 200);}
let wOS = {
  buzz: ()=> {vibrat(0.8, 1, 800, 200);},
  setLCDBrightness: (b)=>{g.setBrightness(b);},
};
Bangle = wOS;

Date.prototype.toLocalISOString = function() {
  function pad0(s) { return ('0'+s).slice(-2); }
  let d=this;
  let ds = `${d.getFullYear()}-${pad0(d.getMonth()+1)}-${pad0(d.getDate())}T${pad0(d.getHours())}:${pad0(d.getMinutes())}`;
  return ds;
};
