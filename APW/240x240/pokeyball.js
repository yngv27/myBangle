
let logD = console.log;

function init() {
  const _C = {
  CYAN: "#80FFFF",
  WHITE: "#FFFFFF",
    FRGD: "#E0E0FF",
    BKGD: "#000000",
    DATA_BRIGHT: "#F0F080",
  YHT: g.getHeight(),
  XWID: g.getWidth(),
  XMID: g.getWidth()/2, 
  YMID: g.getHeight()/2,
  };


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

FONT = {
  init: (f) => { 
    return( {
      fname: f, 
      offs: new Uint16Array(E.toArrayBuffer(_S.read(f, 0, 20))),
      wids: new Uint16Array(E.toArrayBuffer(_S.read(f, 20, 20))),
    });
  },

  getDigit: (o, d) => { 
      return(_S.read(o.fname, o.offs[d], o.wids[d]));
  },
};
  
   function drawRoundRect(x1,y1,x2,y2,r) {
      g.fillRect(x1,y1+r,x2,y2-r).fillRect(x1+r,y1,x2-r,y2);
      g.fillCircle(x1+r,y1+r,r).fillCircle(x2-r,y1+r,r).fillCircle(x1+r,y2-r,r).fillCircle(x2-r,y2-r,r);
    }
  
function imgCalorie() {
  return {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([65504,65504,15,9]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
  };
}

function imgStep() {
  return {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,50956,50956,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
  };
}

function imgPulse() {
  return {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([0xf000,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
  };
}

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

let startX=[38,68,124,162],startY=[24,24,24,24];

let f72 = FONT.init("AdventPro72.fnt");

function drawDigit(idx,dig,n) {
  //let getDig = [ d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];
  //let x=(n?nmX:;y=(n?nmY:startY)[idx];
  if(idx==0 && dig==0) return;
  g.drawImage(FONT.getDigit(f72, dig), startX[idx],startY[idx]);
}
/*
** END WATCH FACE
*/

let lastTime = '9999';
const WHITE = '#ffffff';
const BLACK = 0;
let bgc = BLACK;
let fgc = WHITE;
const bgc2 = '#c0c0c0';
const bgc3 = '#008020';

function start() {

  bgc = BLACK; fgc = WHITE; 
  g.setBgColor(bgc);
  g.clear();
  g.setColor(bgc2);
  drawRoundRect(0,120,239,239,12);
  g.setColor(bgc3);
  g.fillRect(80,100,159,140);
  g.fillCircle(80,120,20);
  g.fillCircle(159,120,20);
  
  g.drawImage(imgCalorie(), relX(0.17), relY(0.6));
  g.drawImage(imgStep(), relX(0.454),  relY(0.6));
  g.drawImage(imgPulse(), relX(0.739),  relY(0.6));

  lastTime = '    ';
  g.flip();
}


function drawClock(d) {

  
  let tm=('0'+d.hr).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) {
    //logD(`no change: last time = [${lastTime}]`);
    return;
  }
  logD("tm/last= "+tm+"/"+lastTime);

  //drawBkgd(nm);
  for(let i=0; i<4; i++) {
    logD(`${tm[i]}:${lastTime[i]}`);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+37,startY[i]+62);
      logD(`calling dD: ${i} ${tm[i]}`);
      drawDigit(i, tm[i], false);
    } else {
      logD('skipping digit '+i);
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

function drawData(d) {
  //logD(d);
  let dy = 100;

  g.setColor(fgc);
  g.setBgColor(bgc);
  g.setFontAlign(1,-1);
  g.drawString(' '+Math.floor(E.getBattery())+'% ', wX-1, dy, true);
   g.setBgColor(bgc3);
  g.setFontAlign(0,0);
  g.drawString(' '+d.niceDate+' ', 120, 120, true);


  g.setFontAlign(0,-1); // center X, top Y
  g.setBgColor(bgc2);
  g.setColor('#303030');
  g.drawString(' '+('0000'+calcCalories(d.steps)).slice(-4)+' ', relX(0.21), relY(0.8), true);
  //g.drawString(' '+('00000'+d.steps).slice(-5)+' ', relX(0.5), relY(0.9), true);
  g.drawString(' '+d.batt+' ', relX(0.5), relY(0.9), true);
  //g.setColor(fgc);
  g.drawString(' '+('000'+d.hrm).slice(-3)+' ', relX(0.8), relY(0.8), true);
  g.setBgColor(bgc);
  
}
  let showMsg = (msgobj) => {  
  // g.setFont("Omnigo");
    g.setBgColor("#c0c0c0");
    let y = 164;
    g.clearRect(0, y,_C.XWID-1,_C.YHT-1).flip();
    g.setColor("#040404");
    g.setFontAlign(0,-1);
    let mstr = ''; 
    y+= 8;
    msgobj.text.split(' ').forEach((w)=>{
      if(g.stringWidth(mstr+w) > _C.XWID || w == '|') {
        g.drawString(mstr, _C.XMID, y);
        mstr='';
        y+=g.getFontHeight();
      }
      if(w != '|') mstr += w + ' ';
    });
    g.drawString(mstr, _C.XMID, y);
  };

 let stop = () => {
  };
  
  return { 
    drawClock: drawClock,
    start: start,
    drawData: drawData,
    showMsg: showMsg,
    stop: stop,
  };
}

  exports = init();
/*

  Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=='), 32, atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc='), 256 + 13);
};
g.setFontOmnigo();
  wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  exports.drawData(dt);
  exports.showMsg({text:"This would be message 1"});
  
  */