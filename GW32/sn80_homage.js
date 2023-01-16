/*
** Implements both a standard 12 hour clock and a 24-hour (one hand) clock, with DOW and date
** Use BTN1 to switch clock types, BTN2 to ShowLauncher()
** Code heavily stolen from BangleApps/aclock
*/

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
  analogWrite(D32, 0.7);
  setTimeout(()=>{
    D32.reset();
  }, 500);
  //vibrate(intns,1,dur?dur:200,25);
};

battLevel = () => { 
  return analogRead(D31).toFixed(6);
};

const logD = print;
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
let font=atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==');
let widths=atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=');

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(font, 32, widths, 256 + 13);
};

const p = Math.PI / 2;
const pRad = Math.PI / 180;
const faceWidth = 110; // watch face radius (240/2 - 24px for widget area)

let timer = null;
let currentDate = new Date();
const centerX = g.getWidth() / 2;
const centerY = (g.getWidth() / 2);

const CLOCK_24 = "24";
let clockType = CLOCK_24;  /* make it "24" for 'Slow' hour-only hand */

//require("Font8x12").add(Graphics);
//g.setFont('8x12', 1);
require("FontDylex7x13").add(Graphics);
//g.setFont('Dylex7x13', 1);
g.setFont("Omnigo", 1);

const drawTics = () => {

  const numTics = (clockType === CLOCK_24 ? 96 : 60);
  //g.setColor(0, 0.5, 0.5);
  g.setFontAlign(0,0);
  for (let i = 0; i < numTics; i++) {
    angle = (360 * i) / numTics;
    const a = angle * pRad;
    const x = centerX + Math.sin(a) * faceWidth;
    const y = centerY - Math.cos(a) * faceWidth;

    //g.drawLine(centerX, centerY, x, y);
    // if ?? degrees, make hour marker larger
    if (i % (clockType === CLOCK_24 ? 4 : 5)) {
      g.setColor(0.5, 0.65, 0.65);
      g.setPixel(x,y);    
    } else {
      if (clockType !== CLOCK_24) {
        g.fillCircle(x, y, 2);
      } else {
        /* put hour at rotated point (0, faceWidth - 5) *
        g.drawString(Math.floor(i/4), 
          120 +  Math.sin(a+Math.PI)*(faceWidth + 4),
          120 - Math.cos(a+Math.PI)*(faceWidth + 4),
          true
        );
        */
        g.setColor(0.8, 0.8, 0.8);
        g.drawString((Math.floor(i/4)+12) % 24, x, y);
      }
    }
  }
 
  clearFace();
};

const clearFace = () => {
  g.setColor(0,0,0);
  g.fillCircle(centerX, centerY, faceWidth - 6);
};
const startX = [  38,  74, 124, 160 ];
const startY = [  32,  32,  32,  32];
let xS = 1;
let yS = 1;

/*
function setScale(x, y) {
  xS = x; yS = y;
}

function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] =Math.floor(arr[i+1]*yS) + y;
    // straighten
    //newArr[i] -= Math.floor((125-newArr[i+1])/8.75);
  }
  g.fillPoly(newArr, true);
}

function drawTopSeg(x, y) {
  drawScaledPoly([
  20, 35, 22, 34, 43, 34, 39, 42, 27, 42
  ], x, y);
}

function drawTopLeftSeg(x, y) {
  drawScaledPoly([
   18, 37, 25, 44, 25, 58, 20, 63, 17, 63, 17, 39
  ], x, y);
}

function drawTopRightSeg(x, y) {
  drawScaledPoly([
    41, 45, 46, 35, 47, 35, 49, 37, 49, 63, 46, 63, 41, 58
  ], x, y);
}


function drawMiddleSeg(x, y) {
  drawScaledPoly([
   26, 61, 40, 61, 44, 65, 40, 69, 26, 69, 22, 65
  ], x, y);
}

function drawBottomLeftSeg(x, y) {
  drawScaledPoly([
    18, 93, 25, 86, 25, 72, 20, 67, 17, 67, 17, 91
  ],  x, y);
}

function drawBottomRightSeg(x, y) {
  drawScaledPoly([
   41, 85, 46, 95, 47, 95, 49, 93, 49, 67, 46, 67, 41, 72
  ],  x, y);
}

function drawBottomSeg(x, y) {
  drawScaledPoly([
    20, 95, 22, 96, 43, 96, 39, 88, 27, 88
   //27, 89, 40, 89, 45, 97, 23, 97, 21, 96 
  ],  x, y);
}

function drawSegments(xOff, yOff, val) {
  logD(`drawSegments xoff = ${xOff} yoff=${yOff}`);
  if (val != 1 && val != 4)
    drawTopSeg(xOff, yOff);
  if (val != 1 && val != 2 && val != 3 && val != 7)
    drawTopLeftSeg(xOff, yOff);
  if (val != 5 && val != 6)
    drawTopRightSeg(xOff, yOff);
  if (val != 0 && val !=1 && val != 7)
    drawMiddleSeg(xOff, yOff);
  if (val == 0 || val == 2 || val == 6 || val == 8)
    drawBottomLeftSeg(xOff, yOff);
  if (val != 2 )
    drawBottomRightSeg(xOff, yOff);
  if (val != 1 && val != 4 && val != 7)
    drawBottomSeg(xOff, yOff);
}

const rotatePoly = (pArr, angle, x0,  y0) => {
  let newArr = [];
  const a = angle * pRad;
  for(let i=0; i<pArr.length ; i+= 2) {
    newArr[i] = x0 + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1];
    newArr[i+1] = y0 + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1];
  }
  return newArr;
};
*/

var orangeDot = {
  width : 17, height : 17, bpp : 16,
  transparent : 0,
  buffer : require("heatshrink").decompress(atob("/gBJgP8oX8sYBCAoMhCpQBJsf9hH91v+iH+mP99/9tf80olOBoPGC4P/jH/3v/73/74DCvf+uf9pRLCEJPG/1S/+c/4ALEoMYJIRHHL4I/BD5ojE/3W/nnEIp/BL4QATzn9+BpEkP9xh/CACZFDwghCoZjCOoIAVjBnEsbhBEL1C/vOEK/++/80qHElP/rQgU3v+qSpEAIOFBIJFUnP9pX8gIhEIoRPBEaF7YIKjBD4gBDRYNK/21CYIlIfoMYD4TpDAJMh/nGWIIlBJYP+/H+6x1BL4Q/JEpY1B4zfCX4KfBP4oBmA="))
};

g.setFont("Omnigo");
g.setFontAlign(0,0);

g.off = () => {g.lcd_sleep(); D24.reset(); g.isOn = false;};

function sleep(){
  //g.clear();//g.flip();
  g.off();
  currscr=-1;
  needData = true;
  return 0;
}

eval(_S.read("sn80nums.js"));
function getDigit(n) {
  return [d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][n]();
}

const clock = () => {
  let orange = "#ff8000";
  let brown = "#502810";
  let white = '#ffffff';
  let black = '#000000';
  let dt = Date().toString().split(' ');
  let tstr = dt[4]; //substring(16,20);
  
  g.clear();
  g.setColor(orange);
  g.fillRect(0,0,239,119);
  
  g.setColor(brown);
  g.fillRect(30,150,210,170);
  g.drawCircleAA(210,160, 10);
  g.fillCircle(210,160, 10);

  
  let x = 30 +  Math.floor(E.getBattery() * 1.8), y=160;
  //g.setColor(black);
  //g.drawCircleAA(x,y, 13);
  g.setColor(orange);
  g.fillRect(30,150,x,170);
  g.drawCircleAA(30,160, 9);
  g.fillCircle(30,160, 9);
  
  
  g.fillCircle(x,y, 10);
  g.setColor(white);
  //g.fillCircle(x,y, 6);
    g.drawImage(orangeDot, x, y, {"rotate":"0"});

  
  
  g.drawString(`${dt[0]} ${dt[1]} ${dt[2]}`, 120, 138);
  g.drawString(`GW32`, 120, 215);
  g.drawString(`fanoush jeffmer yngv27`, 120, 200);
 
  /*
  setScale(1,1.25);
  drawSegments(startX[0], startY[0], tstr.charAt(0)*1);
  drawSegments(startX[1], startY[1], tstr.charAt(1)*1);
  drawSegments(startX[2], startY[2], tstr.charAt(3)*1);
  drawSegments(startX[3], startY[3], tstr.charAt(4)*1);
  */
  let h1 = tstr.charAt(0)*1;
  // squitch the '1' closer...
  if(h1 == 1)
    g.drawImage(getDigit(h1), startX[0]+4, startY[0]);
  else
    g.drawImage(getDigit(h1), startX[0], startY[0]);
  g.drawImage(getDigit(tstr.charAt(1)*1), startX[1], startY[1]);
  g.drawImage(getDigit(tstr.charAt(3)*1), startX[2], startY[2]);
  g.drawImage(getDigit(tstr.charAt(4)*1), startX[3], startY[3]);
};

function timeOn(){
  if (g.isOn) return;
  g.lcd_wake(); 
  g.isOn =true;
  analogWrite(D24, 0.75);
  clock();
  setTimeout(()=>{sleep();}, 9900);
}


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

setWatch(timeOn,BTN1,{ repeat:true, edge:'rising',debounce:25 });
ACCEL.on('faceup',()=>{
  if(!wOS.awake) timeOn();
});
timeOn();

