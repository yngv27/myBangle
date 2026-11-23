/*
** Sunrise clock in a cheap dome light
** Uses a ProMicro NRF52840 board with a cheap warm LED soldered to D31 (for analog control)
** Takes advantage of D13 turning on/off the 3.3V breakout line to save juice
** AND.. can set the time of a nearby ID115 smart band inconveniently hard to find anymore (but
** super easy to hack)
*/
const POWER=D13;
const BULB=D31;

POWER.reset();
BULB.reset();
// we now are at low power

//NRF.setConnectionInterval(1000);
NRF.setAdvertising({}, {name: "Sunrise"});

log=print;

const FILE="opts.json";

let opts = _S.readJSON(FILE);
if(!opts) {
  opts = {
    wakeup: "05:50",
    ramp: 20,
    duration: 30,
    led: false
  };
}

function getStatus() { opts.led = LITE.ival ? true : false; return opts; }
function update(o) {
  if(o.wakeup) opts.wakeup = o.wakeup;
  if(o.ramp) opts.ramp = o.ramp;
  if(o.duration) opts.duration = o.duration;
  _S.writeJSON(FILE, opts);
  blink(1);
}

function blink(n) {
  for(let x=0; n > 0; n--) {
    setTimeout("POWER.set();BULB.reset()", x);
    x+=250;
    setTimeout("BULB.set();POWER.reset()", x);
    x+=250;
  }
}
function delay(ms) {
  digitalPulse(D47, 0, ms);
  digitalPulse(D47, 0, 0);
}

let LITE = {
  cnt: 0,
  rate: 1.05,
  val: 0.9999,
  ival: 0,
  step: function () {
    this.oldVal = this.val;
    this.val = 0.99 - Math.pow(this.cnt/opts.ramp,4);
    if(this.val < 0) this.val = 0;
    log(this.oldVal, this.val);
    //analogWrite(BULB, this.val);
    LITE.smooth(this.oldVal, this.val);
    /*
    this.val -= this.inc;
    this.inc *= this.rate;
    if(++this.cnt % 5 == 0) this.rate += 0.05;
    */
    this.cnt++;
    if(this.cnt >= opts.duration) {
      LITE.off();
    }
  },
  begin: function() {
    this.cnt = 0;
    this.val = 0.99;
    /*
    this.inc = 0.0002;
    this.rate = 1.025;
    */
    BULB.set(); POWER.set();
  },
  off: function() {
    clearInterval(LITE.ival);
    LITE.ival = 0;
    POWER.reset();
    BULB.set();
  },
  smooth: function(a,b) {
    let diff = Math.abs(b-a);
    for(let i=0; i<20; i++) {
      let val = a-diff*Math.pow(i/20, 4);
      print("VAL: "+val);
      analogWrite(BULB, val);
      delay(20);
    }
  }
};

function check() {
  sanity = (new Date()).getFullYear();
  log(sanity);

  if(sanity >= 2025) {
    blink(1);
    ival = E.at(opts.wakeup, ()=> {
      log("DOING");
      LITE.begin();
      LITE.ival = setInterval(()=>{LITE.step();}, 60*1000);
    });
  } else {
    log("Trying to set time");
    blink(2);
    require("~setTime.js").setDtTz();
    setTimeout(check, 30*1000);
  }
  
}

setTimeout(check, 30*1000);


// for setting ID115
function setID115Clock() {
  var gatt;
  let log=print;
  function id115TimePacket(d) {
    d = d || new Date();
    var y = d.getFullYear();
    return [
      0x03, 0x01,
      y & 0xff, (y >> 8) & 0xff,  // year, little-endian
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      (d.getDay() + 6) % 7        // Mon=0 … Sun=6
    ];
  }

  NRF.requestDevice({ filters: [{ services: ['0af0'] }]})
    .then(function(device) { 
      log(device);
      return device.gatt.connect(); })
    .then(function(g) {
      gatt = g;
      return gatt.getPrimaryService("0af0");
    })
    .then(function(service) {
      return service.getCharacteristic("0af6");
    })
    .then(function(characteristic) {
      return characteristic.writeValue(id115TimePacket());
    })
    .then(function() {
      gatt.disconnect();
      log("clock set");
    })
    .catch(function(e) {
      if (gatt) gatt.disconnect();
      log("error", e);
    });
}
