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

const hand = (angle, length, erase) => {
  const CLR_BLACK = "#000000";
  const CLR_HILITE = "#FFFFFF";
  const CLR_SHADOW = "#808080";
  // default to 'erase'
  let c1 = CLR_BLACK;
  let c2 = CLR_BLACK;
  
  if(!erase) {
    if (angle % 360 >= 180) {
      c1 = CLR_SHADOW;
      c2 = CLR_HILITE;
    } else {
      c2 = CLR_SHADOW;
      c1 = CLR_HILITE;
    }
  }
  
  g.setColor(c1);
  let handArr1 = [0, -10, -5, 0, -2, length-2, 0, length];
  g.fillPolyAA(rotatePoly(handArr1, angle, 120, 120));
  g.setColor(c2);
  let handArr2 = [0, -10, 5, 0, -2, length-2, 0, length];
  g.fillPolyAA(rotatePoly(handArr2, angle, 120, 120));
};


const rotatePoly = (pArr, angle, x0,  y0) => {
  let newArr = [];
  const a = angle * pRad;
  for(let i=0; i<pArr.length ; i+= 2) {
    newArr[i] = x0 + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1];
    newArr[i+1] = y0 + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1];
  }
  return newArr;
};

const drawAll = () => {
  g.clear();
  currentDate = new Date(2020, 1, 1);
  drawTics();
  onMinute();
};

const drawDate = () => {
  //g.reset();
  g.setColor(0.8, 0.8, 0.6);

  let dow = currentDate.getDay();
  const dayString = "SunMonTueWedThuFriSat".substring(dow*3, dow*3+3);
  month = currentDate.getMonth();
  const dateString =  currentDate.getDate().toString();
  const dateDisplay = `${dayString} ${dateString}`;
  // console.log(`${dayString}|${dateString}`);
  // two date positions
  if(clockType === CLOCK_24 && currentDate.getHours() >= 17 && currentDate.getHours() < 20) {
    g.setFontAlign(0, 0);
    g.drawString(dateDisplay, 120, 180, true);
  } else {
    const y = g.getHeight()  / 2;
    g.setFontAlign(1, 0);
    g.drawString(dateDisplay, g.getWidth() - 25, y, true);
  }
  g.setFontAlign(-1,0);
  g.drawString(E.getBattery()+' '+battLevel(), 25, 120);
};

g.off = () => {g.lcd_sleep(); D24.reset(); g.isOn = false;};

function sleep(){
  //g.clear();//g.flip();
  g.off();
  currscr=-1;
  needData = true;
  return 0;
}

const clock = () => {

   clearFace();

  // clear existing hands
 
  // Hour
  if(clockType === CLOCK_24) {
    /* adjust angle so midnight points DOWN */
    let angle = 180 + currentDate.getHours() * 15 + currentDate.getMinutes() / 4;
    hand(angle,  faceWidth - 6, true);
  } else {
    let angle = (360 * ((currentDate.getHours()) + currentDate.getMinutes() / 60) ) / 12;
    hand(angle, faceWidth - 45, true);
    // Minute
    angle =(360 * currentDate.getMinutes()) / 60;
    hand(angle,  faceWidth - 6, true);
  }

  // get new date, then draw new hands
  currentDate = new Date();
  drawDate();
  
  // New hands
  
  // Hour
  if(clockType === CLOCK_24) {
     //hand((360 * (currentDate.getHours() + currentDate.getMinutes() / 60)) / 24,  faceWidth - 10, false);
    let angle = 180 + currentDate.getHours() * 15 + currentDate.getMinutes() / 4;
    hand(angle,  faceWidth - 6, false);
  } else {
    hand((360 * (currentDate.getHours() + currentDate.getMinutes() / 60)) / 12,  faceWidth - 45, false);
    // Minute
    hand((360 * currentDate.getMinutes()) / 60,  faceWidth - 6, false);
  }
  
  if (currentDate.getHours() >= 9 && currentDate.getHours() <= 21 && currentDate.getMinutes() === 0) {
    Bangle.buzz();
  }
 
};

function timeOn(){
  if (g.isOn) return;
  g.lcd_wake(); 
  g.isOn =true;
  analogWrite(D24, 0.75);
  clock();
  setTimeout(()=>{sleep();}, 9900);
}

setWatch(timeOn,BTN1,{ repeat:true, edge:'rising',debounce:25 });

drawTics();
timeOn();

/*
 function delay(ms) {
    let t = Math.floor(Date().getTime())+ms;
    while(t > Date().getTime()) {
      // something silly
      out3 = ' ';
    }
  }
let pins = [
    D1, D2, D3, D4, D5, D6, D9,
    D10, D11, D12, D13, D17, D18, D19,
    D20, D21, D23, D26, D27, D28, D29,
    D30, D33, D34, D35, D39,
    D40, D41, D42, D43, D45, D46, D47
    ];

function r() {
    delay(3000);
    for(let p=0; p < pins.length; p++) {
      let pin = pins[p].toString();
      for(c=0; c<1; c++) {
        pins[p].set();
        print(`${pin} is SET`);
        delay(999);
        pins[p].reset();
        print(`${pin} is RESET`);
        delay(999);
      }
    }
  }
 function t(p) {
    for(let c=0; c < 100; c++) {
      let pin = p.toString();
      p.set();
      print(`${pin} is SET`);
      delay(999);
      p.reset();
      print(`${pin} is RESET`);
      delay(999);
    }
  }

*/