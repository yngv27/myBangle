let _S = require("Storage");
let battLevel = () => {return 0;};

eval(_S.read("lcd.js"));
g = GC9A01();

E.setTimeZone(-4);
// Bangle up
let batLo = 0.542, batHi = 0.721;
E.getBattery = () => {
  let pct = Math.floor((analogRead(D31) - batLo) * 100 / (batHi-batLo));
  return (pct > 100) ? 100 : pct;
};
if(typeof Bangle == 'undefined') var Bangle = {};
Bangle.buzz = (dur,intns) => {
  //vibrate(intns,1,dur?dur:200,25);
};
battLevel = () => { 
  return analogRead(D31).toFixed(6);
};

let lastTime = '9999';
E.stepCount = () => {};

wOS = {
  awake: false,
  bl: 0.75,
  wake: () => {
    g.lcd_wake();
    analogWrite(D24, bl);
    wOS.awake = true;
  },
  sleep: () => {
    g.lcd_sleep();
    D24.reset();
    wOS.awake = false;
  },
  brightness: (v) => {
    bl = v;
  },
};

function drawClock(d) {
  let h = d.hour;
  let m = d.min;
  let r = 115;
  g.setColor('#888888');
  for(let a=0; a<60; a++) {
    let th = a * Math.PI  / 30;
    let x = 120 + r * Math.sin(th);
    let y = 120 - r * Math.cos(th);
    //print (`x:y ${x}:${y}`);
    //g.fillCircle(x,y, (a % 5) ? 1 : 3);
    g.drawCircleAA(x,y, (a % 5) ? 2 : 4);
    if(a == m) g.setColor('#000000');
  }
  let th = h * Math.PI  / 6;
  g.setColor('#dddddd');  
  g.fillCircle( 120 + r * Math.sin(th), 120 - r * Math.cos(th), 4);
  setTimeout(wOS.sleep, 8000);
}

function clock() {
  let dt = new Date();
  let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
  if(d.hour >= 20 || d.hour < 8) {
    g.setBgColor('#000000');
    wOS.brightness(0.2);
  } else {
    g.setBgColor('#403330');
    wOS.brightness(0.8);
  }
  g.clear();
  wOS.wake();
  drawClock(d);
}

//SC7!

var ACCELPIN = D19;
let ACCELADDR = 0x19;
let wOSI2C = new I2C();
var ACCEL = {};

wOSI2C.setup({scl:D4,sda:D27,bitrate:200000});

var ACCEL = {
  wasFaceUp: false,
  writeByte:(a,d) => { 
    wOSI2C.writeTo(ACCELADDR,a,d);
  }, 
  readBytes:(a,n) => {
    wOSI2C.writeTo(ACCELADDR, a);
    return wOSI2C.readFrom(ACCELADDR,n); 
  },
  init:() => {
      var id = ACCEL.readBytes(0x0F,1)[0];
      ACCEL.writeByte(0x20,0x47);
      ACCEL.writeByte(0x21,0x00); //highpass filter disabled
      ACCEL.writeByte(0x22,0x40); //interrupt to INT1
      ACCEL.writeByte(0x23,0x88); //BDU,MSB at high addr, HR
      ACCEL.writeByte(0x24,0x00); //latched interrupt off
      ACCEL.writeByte(0x32,0x10); //threshold = 250 milli g's
      ACCEL.writeByte(0x33,0x01); //duration = 1 * 20ms
      ACCEL.writeByte(0x30,0x02); //XH interrupt 
      pinMode(ACCELPIN,"input",false);
      setWatch(()=>{
         //var  v = ACCEL.read0();
         //if (v>192) 
        ACCEL.isFaceUp();
      },ACCELPIN,{repeat:true,edge:"rising",debounce:50});
      return id;
  },
  read0:()=>{
    return ACCEL.readBytes(0x0F,1)[0];
  },
  read:()=>{
    var a = ACCEL.readBytes(0xA8,6);
    // just return MSB
    return {x:a[1], y:a[3], z:a[5]};
  },
  isFaceUp:()=>{
    console.log('FUP');
    let a = ACCEL.read();
    print(`${ACCEL.wasFaceUp}, ${JSON.stringify(a)}`);
    if((a.x < 25 || a.x > 220) && a.y > 10 && a.y < 45 && a.z < 100) {
      print("GOOD");
      if(!ACCEL.wasFaceUp) ACCEL.emit('faceup');
      ACCEL.wasFaceUp = true;
      return true;
    }
    ACCEL.wasFaceUp = false;
    return false;
  }
};
ACCEL.init();


//setWatch(wOS.wake, BTN1,{ repeat:true, edge:'rising',debounce:25 });


wOS.ON_TIME=12;

ACCEL.removeAllListeners('faceup');
ACCEL.on('faceup',()=>{
  if(!wOS.awake) clock();
});

clock();
