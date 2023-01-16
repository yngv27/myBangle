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
const rotatePoly = (pArr, angle, x0,  y0) => {
    let newArr = [];
    const a = Math.PI + angle; // * Math.PI / 180;;
    for(let i=0; i<pArr.length ; i+= 2) {
      newArr[i] = x0 + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1];
      newArr[i+1] = y0 + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1];
    }
    return newArr;
  };

function drawHands(dt) {
    //let dt = new Date();
    let hrAngle = (dt.hour * 60 + dt.min) * Math.PI / 360;
    let minAngle = dt.min  / 30 * Math.PI;
    let centerX = 120, centerY = 120;
  
    g.setColor(0);
    //g.fillCircle(120,120,85);
    g.setColor('#c0c0c0'); //'#D8AF8F');
    
    g.drawPolyAA(rotatePoly([
      -4, -4, -4, -65, 0, -70, 4, -65, 4, -4
      ], hrAngle, centerX, centerY), true);
  
    g.drawPolyAA(rotatePoly([
      -3, -4, -3, -90, 0, -95, 3, -90, 3, -4
      ], minAngle, centerX, centerY), true);
  
    g.setColor('#a0a0a0'); //'#8C6541');
    g.fillCircle(120,120,8);
    g.setFontAlign(0,0);
    g.drawString(`${E.getBattery()}%`, 120, 220);
    g.setColor(0);
    g.drawCircleAA(120,120,8);
    
  }
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
  drawHands(d);
  setTimeout(()=>{
    wOS.sleep();
    wOS.wasFaceUp = false;
  }, 8000);
}

function clock() {
  let dt = new Date();
  let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
  if(d.hour >= 20 || d.hour < 8) {
    g.setBgColor('#000000');
    wOS.brightness(0.2);
  } else {
    g.setBgColor('#001040'); //'#403330');
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

/*

spif = new SPI();
spif.setup({sck: D4, miso: D6, mosi: D27, mode:0});
spif.send([0xab], D5);
print(spif.send([0x90,0,0,1,0,0], D5));
print(spif.send([0x9f,0,0,0], D5));
let hex = (d) => { return ('0'+d.toString(16)).slice(-2);};
let buf = new Uint8Array(256);
// 3 byte address: 0x7f 0xff 0xff (8M)
for(let b1=96; b1 < 128; b1++) {
  for(let b2=0; b2 < 256; b2++) {
    for(let b3 = 0; b3 < 256; b3++) {
      res = spif.send([0x03, b1, b2, b3,0], D5);
      buf[b3] = res[4];
    }
    print(`${hex(b1)} ${hex(b2)} ${hex(b3)}: ${btoa(buf)}`);

  }
}
*/