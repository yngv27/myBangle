const EMULATOR = Bangle;
if(EMULATOR) {
  g.on = () => console.log('g.on()');
  g.off = () => console.log('g.off()');
} else {
  let g = require('F07.min.js').getGraphics();
}
let _Storage = require("Storage");

const logD = (msg) => { console.log(msg); };

var VIB=D25;
function vibon(vib){
  if(EMULATOR) { LED1.set(); } else
  if(vib.i>=1)VIB.set();else analogWrite(VIB,vib.i);
  setTimeout(viboff,vib.on,vib);
}
function viboff(vib){
 if(EMULATOR) { LED1.reset(); } else
   VIB.reset();
 if (vib.c>1){vib.c--;setTimeout(vibon,vib.off,vib);}
}

vibrate=function(intensity,count,onms,offms){
 vibon({i:intensity,c:count,on:onms,off:offms});
};

function battVolts(){
  if(EMULATOR) {
    return 4.0;
    } else {
    return 4.20/0.18*analogRead(D5);
    }
}

function battLevel(v){
  var l=3.23,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return Math.floor(100*(v-l)/(h-l));
}
function battInfo(){v=battVolts();return `${battLevel(v)}% ${v.toFixed(2)}V`;}

/************ ALARMS ***********/
let _Notes = "";
let alarmTOs = [];
let _alarmMsgs = [];


function showAlarm() {
  info(_alarmMsgs.shift());
}

let reloadMsgs = () => {
  _Notes = _Storage.readJSON('v.notes.json');
  if(!_Notes) _Notes = 'No notes...|Not today';
  logD('notes= '+_Notes);

  let _Alarms =  _Storage.readJSON('v.alarms.json');
  if(!_Alarms) _Alarms = [{"msg":"You did it!","time":"2021-06-11T16:03:00"}];
  // schedule
  for(let idx=0; idx < alarmTOs.length; idx++) {
    clearTimeout(alarmTOs[idx]);
  }
  for(let idx=0; idx < _Alarms.length; idx++) {
    logD('idx = '+idx);
    let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
    let msg = _Alarms[idx].msg;
    if(tdiff > 0) {
      logD(`will alarm ${msg} in ${tdiff}`);
      alarmTOs.push(setTimeout(showAlarm, tdiff));
      _alarmMsgs.push(_Alarms[idx].msg);
    } else {
      //expired
      logD('tossing out' + idx);
    }
  }
};
//reloadMsgs();

let ogf = atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==");
let ogw = atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=");
g.setFontCustom(ogf, 32, ogw, 256 + 13);

let to;
function goDark(s) {
  if(to) clearTimeout(to);
  to = setTimeout(sleep, s*1000);
}

/*
** BEGIN WATCH FACE
*/
const startX=[6,43,6,43],startY=[14,14,82,82],nmX=[4,42,88,126],nmY=[12,12,12,12];let xS=1,yS=1,rotate=!1;function drawScaledPoly(l,e,o){let d=[];for(let t=0;t<l.length;t+=2){var a;d[t]=Math.floor(l[t]*xS)+e,d[t+1]=Math.floor(l[t+1]*yS)+o,rotate&&(a=d[t],d[t]=80-d[t+1],d[t+1]=a)}g.fillPoly(d,!0)}let lcdTopSeg=Uint8Array([3,1,5,0,26,0,22,8,10,8]),lcdTopLeftSeg=Uint8Array([1,3,8,10,8,24,3,29,0,29,0,5]),lcdTopRightSeg=Uint8Array([24,11,29,1,30,1,32,3,32,29,29,29,24,24]),lcdMiddleSeg=Uint8Array([9,27,23,27,27,31,23,35,9,35,5,31]),lcdBottomLeftSeg=Uint8Array([1,59,8,52,8,38,3,33,0,33,0,57]),lcdBottomRightSeg=new Uint8Array([24,51,29,61,30,61,32,59,32,33,29,33,24,38]),lcdBottomSeg=new Uint8Array([3,61,5,62,26,62,22,54,10,54]);function drawDigit(t,l,e){let o=(e?nmX:startX)[t];t=(e?nmY:startY)[t];EMULATOR&&(o+=80),1!=l&&4!=l&&drawScaledPoly(lcdTopSeg,o,t),1!=l&&2!=l&&3!=l&&7!=l&&drawScaledPoly(lcdTopLeftSeg,o,t),5!=l&&6!=l&&drawScaledPoly(lcdTopRightSeg,o,t),0!=l&&1!=l&&7!=l&&drawScaledPoly(lcdMiddleSeg,o,t),0!=l&&2!=l&&6!=l&&8!=l||drawScaledPoly(lcdBottomLeftSeg,o,t),2!=l&&drawScaledPoly(lcdBottomRightSeg,o,t),1!=l&&4!=l&&7!=l&&drawScaledPoly(lcdBottomSeg,o,t)}
/*
** END WATCH FACE
*/

//require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x8").add(Graphics);
//require("Font8x16").add(Graphics);

function showNotes() {
  info(_Notes);
}

function info(msg){
  g.clear();
  //g.setFont(myFont,1);
  g.setColor(10);
  g.drawString("Espruino "+process.version, 0,0);
  g.setColor(14);

  let lines = msg.split('|');
  for(let q=0; q < lines.length; q++) {
    g.drawString(lines[q], 0, 20+q*g.getFontHeight());
  }

  g.flip();
  goDark(30);
}

function drawClock(){
  var d=Date();
  d=d.toString().split(' ');
  var sec=d[4].substr(-2);
  //var tm=d[4].substring(0,5);
  var hr=parseInt(d[4].substr(0,2));
  var min=d[4].substr(3,2);
  let nm = false;
  if(hr > 20 || hr < 8) {
    nm = true;
  }
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);
  xmid = 40;
  if(EMULATOR) xmid=120;

  g.clear();
/*
  nm  = true;
  g.setColor(15);
  //g.drawRect(0,0,79,159);
*/
  if(!nm) {
    //g.setFont(myFont,1);g.setColor(15);
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    let batt = battInfo();
    g.drawString(batt,xmid-g.stringWidth(batt)/2,0);
  } else {
    g.setColor(4);
    let b = battLevel();
    for(let c=0; c<5; c++) {
      if(b > c*20) g.fillCircle(24+8*c, 8, 2);
      else g.drawCircle(24+8*c,8,2);
    }
  }
  //g.setFontVector(50);
  if(nm) {
    rotate = true;
    g.setColor(4);
    if(EMULATOR) g.setColor(0.5,0.5,0.5);
    if (hr>9) drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);
    g.fillCircle(40, 80,2);
    g.fillCircle(24, 80,2);
    g.flip();
  } else {
    rotate = false;
    g.setColor(8+7);
    if(EMULATOR) g.setColor(1,1,1);
    drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);

    //g.setFont(myFont,2); 
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    var dt=/*d[0]+" "+*/d[1]+" "+d[2];//+" "+d[3];
    g.drawString(dt,xmid-g.stringWidth(dt)/2,146);
    g.flip();
    vibrate(1,1,100,0);
    goDark(30);
  }
}

function clock(){
  volts=0;
  drawClock();
  return setInterval(function(){
    drawClock();
  },60000);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  currscr=-1;
  if (currint>0) clearInterval(currint);
  return 0;
}

function runScreen(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
  //vibrate(1,1,100,0);

}

var screens=[clock,showNotes,sleep];
var currscr= -1;
var currint=0;
setWatch(runScreen, BTN1,{ repeat:true, edge:'rising',debounce:25 }
);
