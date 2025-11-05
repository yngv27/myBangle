/*
** waits until specified time, then slowly increases power to LED strip
** requires analog LED(s) on specified GPIO ("SUN")
*/
NRF.setAdvertising({}, {name: "Sunrise"});

const SUN=D31;

let min = 0.0002;
let max = 0.5;

let v=min;
let inc =  1.025;
let ival = 0;

function rise() {
  analogWrite(SUN, v);
  v *= inc;
  //v *= 1.025;
  if(v >= max) { 
    clearInterval(ival);
  }
}

let sanity = 0;
let log=()=>{};
let wake = "06:30";

function blink(n) {
  for(let x=0; n > 0; n--) {
    setTimeout("LED1.toggle()", x);
    x+=250;
    setTimeout("LED1.toggle()", x);
    x+=250;
  }
}

function check() {
  sanity = (new Date()).getFullYear();
  log(sanity);

  if(sanity >= 2025) {
    blink(1);
    ival = E.at(wake, ()=> {
      log("DOING");
      ival = setInterval(rise, 5000);
    });
  } else {
    log("Trying to set time");
    blink(2);
    require("~setTime.js").setDtTz();
    setTimeout(check, 120*1000);
  }
  
}

setTimeout(check, 30*1000);