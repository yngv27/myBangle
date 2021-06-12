
//let g = require('F07.js').getGraphics();
g.setColor('#FF80FF');
g.drawRect(0,0,80,160);
g.on = () => {console.log('g.on');};
g.off = () => {console.log('g.off');};
//BTN = BTN1;
let _Storage = require("Storage");

const logD = (msg) => { console.log(msg); };

var VIB=D25;
function vibon(vib){
 if(vib.i>=1)VIB.set();else analogWrite(VIB,vib.i);
 setTimeout(viboff,vib.on,vib);
}
function viboff(vib){
 VIB.reset();
 if (vib.c>1){vib.c--;setTimeout(vibon,vib.off,vib);}
}

vibrate=function(intensity,count,onms,offms){
 vibon({i:intensity,c:count,on:onms,off:offms});
};

function battVolts(){
return 4.20/0.18*analogRead(D5);
}

function battLevel(v){
  var l=3.5,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}

/************ ALARMS ***********/
let _Alarms = [];
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
reloadMsgs();

let ogf = atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==");
let ogw = atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=");
g.setFontCustom(ogf, 32, ogw, 256 + 13);

let to;
function goDark(s) {
  if(to) clearTimeout(to);
  to = setTimeout(sleep, s*1000);
}

let drawDigit = require('dWire.js').drawDigit;

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

  //g.drawString("ST7735 12 bit mode\n8Mbps SPI with DMA",4,40);
  let lines = msg.split('|');
  for(let q=0; q < lines.length; q++) {
    g.drawString(lines[q], 0, 20+q*g.getFontHeight());
  }

  g.flip();
  goDark(30);
}

var lastsec=-1;
var volts;
var batt=battInfo();

function drawClock(){
  var d=Date();
  lastsec=d.getSeconds();
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

  volts= volts ? (volts+battVolts())/2:battVolts(); // average until shown
  g.clear();
  if (lastsec%10==0){
    batt=battInfo(volts);volts=0;
  }

  if(!nm) {
    //g.setFont(myFont,1);g.setColor(15);
    g.drawString(batt,40-g.stringWidth(batt)/2,0);
  }
  //g.setFontVector(50);
  if(nm) {
    rotate = true;
    g.setColor(4);
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
    drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);

    //g.setFont(myFont,2); 
    g.setColor(8+2);
    var dt=/*d[0]+" "+*/d[1]+" "+d[2];//+" "+d[3];
    g.drawString(dt,40-g.stringWidth(dt)/2,140);
    g.flip();
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
  vibrate(1,1,100,0);

}

var screens=[clock,showNotes,sleep];
var currscr= -1;
var currint=0;
setWatch(runScreen, BTN1,{ repeat:true, edge:'rising',debounce:25 }
);
