let _S = require("Storage");
let battLevel = wOS.batV;


/**********************************************/

let font=atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==');
let widths=atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=');

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(font, 32, widths, 256 + 13);
};
let h = require("heatshrink");
let font2 = h.decompress(atob('ABEP8kf5AFBuEA8AEBgeAg4EBkECvEH+F/gHz4E/wf4g+QgIhCjkQskh//hiGCj4JBD4IEBkUQvlgueAhkAsEDzkMvkQxEB+EB4AjB98D/8EoUI4kf7Ec+EA4ED4EEwEAgkAhw7Cj/gv/hwFigFAgEIgMYg0f/AOBCQNsNgMD/AzBgw1CAAMCE4U+gF8OoIiCAAILBnBWBAwMQBwhCBAAMwBwaYCgEeMwMPwF4LQILBgP/g//hECiEEkEIv6mBB4JABBwMP/wkE8GPUgNCkGEoMPwR5DoCaBkIOCw4uBLoKGBwE/NQkIFgpxCDouEdAIdDJAPwBxR8E8MP4V8g/AJAcdDo5KGgF/iGCkLsCBwX8BwMMsEYSgVi4HHOQbVDBwMgXIVIgGQgMggVAggKCBwNjeYbgDbALOBw1BjmD8EDC4UH8Ef8FgsOeoV+wmFhP6iPkmFomHAUgIAB/+D/8EiEIkEQoE/+E/8DtCBwRrBwkRhAOBnZoC/8DBwMChAgCmEwkBQBDogOEFgQdBFhIoBv/g//BiECkEEOoUPDYPwoCFBoMIwcfgT5BYAP4BwMEgAiBiBKBg/+Bwp2CwEBAIMAgUAggOCOoJmB4P/wF4gOYg0YAAKJBBwodEGwRZD4DGBZ4LEBHYwdCwI+DwAOFv+B/+CgKVDBwLgBDomCQwUIDoMAjhnCDo8cj/8j/oDpf4jo7CuOB+eCkLCDjv4jI7COgSkDVYQ5D4B3BCIcCh45BFQV+HYMAg+AQYMebwMfwAOHg8H+gOBgF4gEwFgQTBgcDg+egfwS4MP4F58HAHYMD4EHAgP8gP4nwgCgEBg+Cj8EsRoBicInkQuEgMwXH/+ILYMAjEAnjVBgEPK4PAGwJ1BgU//l//AUD+EDwEMgEOC4MAgyICgAuBoCIEgEEBYNwgFgCIUmgHegMkgVIg/wg61BgP/wZ7BcYUD/EDYQRKBn+AoIODRwXgh/giFAkAdBaIJ/CFQPwhMgiVAnmAnAMCEwP4n/wpBICPYN/kGCoMEEYX8BgP/4P/wBpDWYQMBp/gz69BPYdJ/+TH4V/8H/4EIgE4gPegccBgI7BBwIFCwF/FgZ3BNYJoBeYIjCgH+UoaVELIaVJj5uCSoZZB+AMBg/Aj/AkCkCNwYsCUgRlCaoJ5BS4OQg+wUgc3wDgBUgQbC+EIDQJoBJQT8CJQIQBK4YOBgcAgyiBdosfQIKGCXgMMDoSCCjHAneAUAKmB7kDjAdCFgQqBgUgNAQMBgkwhHgidAlmAuMA4TWCQQP4vn4wB4Bg//97XBgEQgU+vigBgwXCwAvBZoMMAITrBmCRDAA4='));
let widths2 = h.decompress(atob('gcEg0IhENhUDgsFg0HgkFgkHhEFBwIAFgcDgwAChkIhIKBAwIOCAQMHBQQADEgMIhYECFgMEAoMDg8HHAMHgoCBIIICBhIGBAAYNCBIcFCQMJA=='));
Graphics.prototype.setFontBlocky = function() {
    this.setFontCustom(E.toString(font2), 32, E.toString(widths2), 256 + 15);
};

let EMULATOR = false;
// which Bangle?
const isB2 = (process.env.BOARD == 'BANGLEJS2');

const MY_HEIGHT = 70;  // in inches..  divide by 2.54 if cm
const MY_WEIGHT = 170; // in pounds.. multipley by 2.2 if kg
// calories / step == 0.57 * weight(lb) * height(in) / 126720
const MY_BURN_RATE = 0.57 * MY_WEIGHT * MY_HEIGHT / 126720;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

//require("knxt.fnt").add(Graphics);
//g.setFont("Omnigo",isB2 ? 1 : 2);
g.setFont("Blocky",isB2 ? 1 : 1);

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([65504,65504,15,9]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,50956,50956,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([0xf000,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

function drawBattery(x,y) {
  // x,y is top/left
  g.setColor(fgc);
  let segX = isB2 ? 2 : 3;
  let segY = isB2 ? 12 : 18;
  let yinc = segY / 4;
  let xinc = (segX + 3) * 4;
  g.drawPoly([
    x,y,
    x+xinc,y,
    x+xinc,y+yinc,
    x+xinc+segX,y+yinc,
    x+xinc+segX,y+yinc*3,
    x+xinc,y+yinc*3,
    x+xinc, y+yinc*4,
    x, y+yinc*4
    ], true);
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
}
/*
** BEGIN WATCH FACE
*/

let startX=[14,62,124,172],startY=[60,60,60,60],nmX=[16,42,88,126],nmY=[12,12,12,12];
let xS=0.5,yS=0.5;
function setScale(t,r){xS=t;yS=r;}

eval(_S.read("gnums.js"));

function drawDigit(idx,dig,n){
  let getDig = [ d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];
  let x=(n?nmX:startX)[idx];y=(n?nmY:startY)[idx];
  g.drawImage(getDig[dig](), x,y,{scale: 0.5});
}
/*
** END WATCH FACE
*/

let lastTime = '9999';
let WHITE = '#ffffff';
let BLACK = 0;
let bgc = BLACK;
let fgc = WHITE;
// set to true for some playful color blocks
let MONDRIAN = false;

// adjust coords by Bangle

xS = 1; yS = 1;
for(let i=0; i<4; i++) {
  startX[i] *= xS;
  startY[i] *= yS;
}




function drawBkgd(nm) {
  // Bangle1 and B2 if night mode
  print(`dBkgd ${nm}`);
  bgc = BLACK; fgc = WHITE; 
  if(!nm && isB2)  { bgc = WHITE; fgc = BLACK; }
  g.setBgColor(bgc);
  g.clear();
  g.drawImage(imgCalorie, relX(0.17), relY(0.68));
  g.drawImage(imgStep, relX(0.454),  relY(0.78));
  g.drawImage(imgPulse, relX(0.739),  relY(0.68));

  lastTime = '    ';
  g.flip();
}

let b2NightMode = false;

function drawClock(d, nm) {
  // ignore the watch position nightmode for B2
  if(isB2) {
    if(d.hour > 17 || d.hour < 7) { 
      if(!b2NightMode) {
        b2NightMode = true;
        drawBkgd(b2NightMode);
      }
    } else {
      if(b2NightMode) {
        b2NightMode = false;
        drawBkgd(b2NightMode);
      }
    }
  }

  // console.log("colon time");
  if(d.sec % 2 ) g.setColor(fgc); else g.setColor(bgc);
  g.fillCircle(midX,  relY(0.42), 3);
  g.fillCircle(midX,  relY(0.54), 3);
  g.flip();
  
  //console.log(d);
  d.hour %= 12;
  if (d.hour === 0) d.hour = 12;
  
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) {
    //console.log(`no change: last time = [${lastTime}]`);
    return;
  }
  console.log("tm/last= "+tm+"/"+lastTime);

  //drawBkgd(nm);
  for(let i=0; i<4; i++) {
    console.log(`${tm[i]}:${lastTime[i]}`);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+52*xS,startY[i]+80*yS);
      g.setColor(i > 1 ? fgc : '#80ffff');
      console.log(`calling dD: ${i} ${tm[i]}`);
      drawDigit(i,tm[i], false);
      //g.flip();
    } else {
      console.log('skipping digit '+i);
    }
  }
  lastTime = tm;
  g.flip();
}

// uses constants from top; set to your own
function calcCalories(steps) {
  // calories / step == 0.57 * weight(lb) * height(in) / 126720
  return Math.floor(MY_BURN_RATE * steps);
}

function drawData(d, nm) {
  //console.log(d);
  let dy = isB2 ? 2 : 20;

  g.setColor('#ffff80');
  g.setFontAlign(1,-1);
  g.drawString(' '+E.getBattery()+'% ', wX-48, dy, true);
  g.setFontAlign(-1,-1);
  g.drawString(' '+d.dateStr+' ', 48, dy, true);


  g.setFontAlign(0,-1); // center X, top Y
  g.setColor(fgc);
  g.drawString(' '+('0000'+calcCalories(d.steps)).slice(-4)+' ', relX(0.21), relY(0.8), true);
  //g.drawString(' '+('00000'+d.steps).slice(-5)+' ', relX(0.5), relY(0.9), true);
  g.drawString(' '+d.batt+' ', relX(0.5), relY(0.9), true);
  //g.setColor(fgc);
  g.drawString(' '+('000'+d.hrm).slice(-3)+' ', relX(0.8), relY(0.8), true);
  g.setBgColor(bgc);
  
  g.flip();
}

let needData = true;

function clock() {
  //lastmin=-1;
  //drawBkgd(false);
  function drawThatClock() {
    let dt = new Date();
    let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
    drawClock(d, false);
    if(d.sec == 0 || needData) {
      d.dateStr = dt.toString().substr(0,10);
      d.batt = battLevel();
      d.steps = 0;
      d.hrm = 0;
      drawData(d, false);
      needData = false;
    }
  }
  drawThatClock();
  return setInterval(drawThatClock, 1000);
}

g.off = () => {g.lcd_sleep(); g.isOn = false;};

function sleep(){
  //g.clear();//g.flip();
  if(currint) clearInterval(currint);
  currint = 0;
  g.off();
  currscr=-1;
  needData = true;
  return 0;
}

//var screens=[clock,sleep];
var currscr= -1;
var currint=0;

function timeOn(){
  if (g.isOn) return;
  g.lcd_wake(); 
  g.isOn =true;
  //currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=clock();
  setTimeout(()=>{sleep();}, 9900);
}

setWatch(timeOn,BTN1,{ repeat:true, edge:'rising',debounce:25 });

ACCEL.on('faceup',()=>{
  print('FACE UP');
  timeOn();
});
/*
setInterval(ACCEL.isFaceUp, 1300);
*/

drawBkgd(false);
timeOn();


