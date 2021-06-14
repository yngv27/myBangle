const EMULATOR = 0;
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
  if(EMULATOR) {
    return 4.0;
    } else {
    return 4.20/0.18*analogRead(D5);
    }
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

const startX = [ 10,  45,  10,  45 ];
const startY = [ 16,  16,  78,  78 ];
const nmX = [ 4, 42, 88, 126];
const nmY = [ 12, 12, 12, 12];
let rotate = false;

let xS = 0.25;
let yS = 0.25;

function setScale(x, y) {
  xS = x; yS = y;
}

function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] =Math.floor(arr[i+1]*yS) + y;

    if(rotate) {
      let z = newArr[i];
      newArr[i] = 80 - newArr[i+1];
      newArr[i+1] = z;
    }
  }
  //console.log(JSON.stringify(newArr));
  g.fillPoly(newArr, true);
}

/** DIGITS **/

/* zero */
function draw0(xOrig, yOrig) {

  drawScaledPoly([
    1,20 ,
    20,1 ,
    100,1 ,
    119,20 ,
    119,220 ,
    100,239 ,
    20,239 ,
    1,220,
    1,20 ,
	         
    10,22 , 
    10,218 ,
    22,230 ,
    98,230 ,
    110,218, 
    110,22,
    98,10 ,
    22,10 ,
    10,22, 22, 10
    ], xOrig, yOrig);
}

/* one */
function draw1(xOrig, yOrig) {
  drawScaledPoly([
    30,239, 
    90,239, 
    90,230, 
    65,230, 
    65,1, 
    55,1 ,
    35,21, 
    35,31, 
    55,11,   
    55,230, 
    30,230,
    ],xOrig, yOrig);
 
}

/* two */
function draw2(xOrig, yOrig) { 
  drawScaledPoly([1,20, 
                 20,1,
                 100,1,
                 119,20 ,
                 119,100, 
                 100,120, 
                 22,120 ,
                 10,132 ,
                 10,218, 
                 22,230 ,
                 119,230, 
                 119,239,

                 20,239 ,
                 1,220,
                 1,130 ,
                 22,110 ,
                 98,110 ,
                 110,98 ,
                 110,22 ,
                 98,10 ,
                 22,10 ,
                12,20 ,
                 1,20],
                xOrig, yOrig);
}

/* three */

function draw3(xOrig, yOrig) {
   drawScaledPoly([
     1,20 ,
     20,1 ,
     100,1 ,
     119,20 ,
     119,100 ,
     105,115 ,
			
     119,130 ,
     119,220 ,
     100,239 ,
     20,239 ,
     1,220,
			
     1,220 ,
     12,220 ,
     22,230 ,
     98,230 ,
     110,218 ,
     110,132 ,
     99,120   ,
     45,120  ,
     45,110 ,
     98,110 ,
     110,98,
     110,22, 
     98,10 ,
     22,10 ,
     12,20 ,
     1,20],
      xOrig, yOrig);
}

/* four */
function draw4(xOrig, yOrig) {
  drawScaledPoly([
    119,239 , 
    119,1,
    110,1,
	110,110, 
    22,110 ,
    10,98 ,
    10,10 ,
    1,10 ,
    1,102 ,
    20,120 ,
    110,120,
	110,239],
      xOrig, yOrig);
}

function draw5(xOrig, yOrig) {
  drawScaledPoly([
    1,220 ,
    20,239 ,
    100,239 ,
    119,220 ,
    119,130 ,
    100,110 ,
    16,110 ,
    10,104 ,
    10,10 ,
    100,10 ,
    100,1,
			 
    1,1 ,
    1,110, 
    12,120, 
    98,120 ,
    110,132 ,
    110,218 ,
    98,230 ,
    22,230 ,
    10,220 ,
    1,220,
    ],xOrig,yOrig);
}
/* six */
function draw6(xOrig, yOrig) {
  drawScaledPoly([
100,10 ,
    100,1 ,
    20,1 ,
    1,20 ,
    1,220 ,
			
    20,239 ,
    100,239 ,
    119,220 ,
    119,130 ,
    100,110 ,
    12,110,
			
    12,120 ,
    98,120 ,
    110,132 ,
    110,218 ,
    98,230 ,
    22,230 ,
    10,218 ,
			
    10,22 ,
    22,10 ,
    100,10,
  ],xOrig,yOrig);

}

/* seven */
function draw7(xOrig, yOrig) {
  drawScaledPoly([
    65,239, 
    65,155 ,
    100,120 , 
    119,100 ,
    119,1 ,
			
    100,1 ,
    20,1 ,
    1,1 ,
    1,22 , 
			
    10,22 ,
    10,10 ,
    22,10 ,
    98,10 ,
    110,10 ,
    110,22 ,
			
    110,98 ,
    98,110 ,
    55,153 ,
    55,239,
    ], xOrig, yOrig);
}

function draw8(xOrig, yOrig) {
   drawScaledPoly([
      1,20 ,
     20,1 ,
     100,1 ,
     119,20 ,
     119,100 ,
     100,120 ,
     20,120 ,
     1,100 ,
     1,20 ,
	         
     10,22 ,
     10,98 ,
     22,110 ,
     98,110 ,
     110,98 ,
     110,22,  
     98, 10,
     22, 10, 
     10, 22, 22, 10],
     xOrig, yOrig);
  
   drawScaledPoly([
      1,130 ,
     20,111 ,
     100,111 ,
     119,130 ,
     119,220 ,
     100,239 ,
     20,239 ,
     1,220 ,
     1,130 ,
	         
     10,132 ,
     10,218 ,
     22,230 ,
     98,230 ,
     110,218 ,
     110,132  , 
     98,120 ,
     22,120 ,
     10,132, 22, 120],
      xOrig, yOrig);
}
function draw9(xOrig, yOrig) { 
  drawScaledPoly([
    20,230 ,
    20,239, 
    100,239, 
    119,220 ,
    119,20 ,
			
    100,1 ,
    20,1 ,
    1,20 ,
    1,110 ,
    20,130 ,
    108,130,
			
    108,120 ,
    22,120 ,
    10,108 ,
    10,22 ,
    22,10 ,
    98,10 ,
    110,22 ,
			
    110,218 ,
    98,230
    ], xOrig, yOrig);
}

/** END DIGITS **/

function drawDigit(pos, dig, nm) {
  let x = nm ? nmX[pos] : startX[pos];
  let y = nm ? nmY[pos] : startY[pos];

  if(EMULATOR) x+= 80;
  const dFuncs = [ draw0, draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9];
  dFuncs[dig](x,y);
}

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
  xmid = 40;
  if(EMULATOR) xmid=120;
  
  volts= volts ? (volts+battVolts())/2:battVolts(); // average until shown
  g.clear();
  if (lastsec%10==0){
    batt=battInfo(volts);volts=0;
  }

  if(!nm) {
    //g.setFont(myFont,1);g.setColor(15);
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    g.drawString(batt,xmid-g.stringWidth(batt)/2,0);
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
    if(EMULATOR) g.setColor(1,1,1);
    drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);

    //g.setFont(myFont,2); 
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    var dt=/*d[0]+" "+*/d[1]+" "+d[2];//+" "+d[3];
    g.drawString(dt,xmid-g.stringWidth(dt)/2,140);
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
