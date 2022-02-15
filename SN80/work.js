E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(15, false);

const logD = console.log;


//var spi = new SPI();
SPI1.setup({sck:D2,mosi:D3,baud:8000000,mode:0}); //spi.send([0xab],D5); 

const LCD_WIDTH = 240;
const LCD_HEIGHT = 240;
const COLSTART = 0;
const ROWSTART = 0;
const INVERSE = 0;


  /* ATC SN80 specific (SN80-Y??) */
const ST7789_INIT_CODE = [
  [0xFE],
  [0xEF],
  [0xEB,0x14],
  [0x84,0x40],
  [0x85,0xF1],
  [0x86,0x98],
  [0x87,0x28],
  [0x88,0xA],
  [0x8A,0],
  [0x8B,0x80],
  [0x8C,1],
  [0x8D,0],
  [0x8E,0xDF],
  [0x8F,82],
  [0xB6,0x20],
  [0x36,0x48],
  [0x3A,5],
  [0x90,[8,8,8,8]],
  [0xBD,6],
  [0xA6,0x74],
  [0xBF,0x1C],
  [0xA7,0x45],
  [0xA9,0xBB],
  [0xB8,0x63],
  [0xBC,0],
  [0xFF,[0x60,1,4]],
  [0xC3,0x17],
  [0xC4,0x17],
  [0xC9,0x25],
  [0xBE,0x11],
  [0xE1,[0x10,0xE]],
  [0xDF,[0x21,0x10,2]],
  [0xF0,[0x45,9,8,8,0x26,0x2A]],
  [0xF1,[0x43,0x70,0x72,0x36,0x37,0x6F]],
  [0xF2,[0x45,9,8,8,0x26,0x2A]],
  [0xF3,[0x43,0x70,0x72,0x36,0x37,0x6F]],
  [0xED,[0x1B,0xB]],
  [0xAC,0x47],
  [0xAE,0x77],
  [0xCB,2],
  [0xCD,0x63],
  [0x70,[7,9,4,0xE,0xF,9,7,8,3]],
  [0xE8,0x34],
  [0x62,[0x18,0xD,0x71,0xED,0x70,0x70,0x18,0x0F,0x71,0xEF,0x70,0x70]],
  [0x63,[0x18,0x11,0x71,0xF1,0x70,0x70,0x18,0x13,0x71,0xF3,0x70,0x70]],
  [0x64,[0x28,0x29,1,0xF1,0,7,0xF1]],
  [0x66,[0x3C,0,0xCD,0x67,0x45,0x45,0x10,0,0,0]],
  [0x67,[0,0x3C,0,0,0,1,0x54,0x10,0x32,0x98]],
  [0x74,[0x10,0x80,0x80,0,0,0x4E,0]],
  [0x35,0],
  [0x21],
  //[0x29],
    ];

function ST7789() {
    var LCD_WIDTH = 240;
    var LCD_HEIGHT = 240;
    var XOFF = 0;
    var YOFF = 0;
    var INVERSE = 1;
    var cmd = lcd_spi_unbuf.command;
  
    function dispinit(spi, dc, ce, rst, fn) {

      if (rst) {
          digitalPulse(rst,0,10);
      } else {
          cmd(0x01); //ST7789_SWRESET: Software reset, 0 args, w/delay: 150 ms delay
      }
      setTimeout(function() {
        cmd(0x11); //SLPOUT
        setTimeout(function () {
            ST7789_INIT_CODE.forEach(function (e) {
                cmd(e[0], e[1]);
            });
            // delay 120
            setTimeout(function () {
              cmd(0x11);
              // delay 120
              setTimeout(function () {
                cmd(0x29);
                // and yet another 120
                setTimeout(function () {
                  cmd(0x2A);
                  if (fn) setTimeout(fn, 500);  
                }, 120);
              }, 120);
            }, 120);
        }, 20);
      }, 120);
      return cmd;
    }

    function connect(options , callback) {
        var spi=options.spi, dc=options.dc, ce=options.cs, rst=options.rst;
        var g = lcd_spi_unbuf.connect(options.spi, {
            dc: options.dc,
            cs: options.cs,
            height: LCD_HEIGHT,
            width: LCD_WIDTH,
            colstart: XOFF,
            rowstart: YOFF
        });
        g.lcd_sleep = function(){cmd(0x10);cmd(0x28);};
        g.lcd_wake = function(){cmd(0x29);cmd(0x11);};
        dispinit(spi, dc, ce, rst);
        return g;
    }

    //var spi = new SPI();
    SPI1.setup({sck:D2, mosi:D3, baud: 8000000});

    return connect({spi:SPI1, dc:D18, cs:D25, rst:D26});
}

//screen brightness function
function brightness(v) {
  v=v>7?1:v;
  digitalWrite([D23,D22,D14],7-v);
}

// battery
function battVolts(){
  return 7.1*analogRead(D31);
}

function battLevel(v){
  var l=3.3,h=4.26;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return Math.floor(100*(v-l)/(h-l));
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}

var VIB=D16;
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

/*
** BUZZ on power connected!
*/

var SN80 = {};
SN80.I2C = new I2C();
SN80.I2C.setup({scl:D7,sda:D6,bitrate:200000});

// we are an SC7A20 
var ACCEL = {
    writeByte:(a,d) => { 
        SN80.I2C.writeTo(0x18,a,d);
    }, 
    readBytes:(a,n) => {
        SN80.I2C.writeTo(0x18, a);
        return SN80.I2C.readFrom(0x18,n); 
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
      pinMode(D8,"input",false);
      setWatch(()=>{
         if (ACCEL.read0()>192) ACCEL.emit("faceup");
      },D8,{repeat:true,edge:"rising",debounce:50});
      return id;
  },
  read0:()=>{
      return ACCEL.readBytes(0x01,1)[0];
  },
  read:()=>{
      function conv(lo,hi) { 
        var i = (hi<<8)+lo;
        return ((i & 0x7FFF) - (i & 0x8000))/16;
      }
      var a = ACCEL.readBytes(0xA8,6);
      return {ax:conv(a[0],a[1]), ay:conv(a[2],a[3]), az:conv(a[4],a[5])};
  },


};


let g = ST7789();

ACCEL.init();

/*
for(let x=60; x>0; x--) {
g.setColor((60-x)/60,(60-x)/60,(60-x)/60);
g.fillCircle(120,120,x);
}

for(let x=0; x < 110; x++) {
g.setColor(0,x/120,0);
g.fillCircle(120,120,x);
}
*/

let Bangle = {};
Bangle.setLCDBrightness = (b) => {
  brightness(Math.ceil(b*7));
};
E.getBattery = () => { return battLevel(); };

Bangle.buzz = (time, strength)=> {
  vibrate(strength?strength:0.5, 1, time?time:200, 20); 
};
// buzz on power applied /
setWatch(() => { Bangle.buzz(); }, D19, 
  {repeat: true, edge:'rising', debounce:10});


/* END OF DRIVERS */

g.clear();

require("Font8x12").add(Graphics);
g.setFont("8x12", 1);
let interval = null;
let stepCounter = 0;


let alarming = false;
let nightMode = false;

let xs = 0.5;
let ys = 0.75;

let prevH1 = -1;
let prevH2 = -1;
let prevM1 = -1;
let prevM2 = -1;


let points0 = [
  0, 40,
  1, 35,
  7, 20, 
  16, 8,
  28, 2,
  40, 0,
  
  51, 2,
  63, 10,
  72, 20,
  77, 35,
  78, 40,
  
  78, 59,
  77, 64,
  72, 79,
  63, 89,
  51, 97,
  
  40, 99,
  28, 97,
  16, 91,
  7, 79,
  1, 64,
  0, 59,
  0, 40
];

let points1 = [ 40, 99, 40, 0];

let points2 = [ 0, 25,
               2, 22,
              6, 13, 
              17, 5,
              28, 2,
              40, 0,
              52, 2,
              63, 5,
              74, 13,
              79, 23,
              79, 28,
              74, 38,
               63, 46,
              51, 54,
              40, 58,
              29, 62,
              17, 68,
              8, 80,
              0, 99,
              79, 99
              ];

let points4 = [ 60, 99, 60, 0, 0, 75, 79, 75 ];

let points8 = [
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  
  52, 39,
  62, 34,
  69, 29,
  72, 23,
  72, 19,
  69, 12,
  62, 6,
  52, 2,
  40, 0,
  
  28, 2,
  18, 6,
  11, 12,
  8, 19,
  8, 23,
  11, 29,
  18, 34,
  28, 39,
  40, 40,
  ];

let points6 = [
  50, 0,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  ];

let points3 = [
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  39, 40,
  79, 0,
  1, 0
  ];

let points7 = [ 0, 0, 79, 0, 30, 99 ];

let points9 = [];
let points5 = [
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  26, 42,
  15, 46,
  27,  0,
  79,  0,
              ];

function drawPoints(points, x0, y0) {
  let x = points[0]*xs+x0, y = points[1]*ys+y0;
   //g.drawEllipse(x-2, y-2, x+2, y+2);
   g.moveTo(x, y);
  for(let idx=1; idx*2 < points.length; idx ++) {
    let x = points[idx*2]*xs+x0;
    let y = points[idx*2+1]*ys+y0;
    //g.drawEllipse(x-2, y-2, x+2, y+2);
    g.lineTo(x, y);
  }
}

/* create 5 from 2  */
/* uncomment if you want the 5 to look more authentic (but uglier)
for (let idx=0; idx*2 < points2.length; idx++) {
   points5[idx*2] = points2[idx*2];
   points5[idx*2+1] = 99-points2[idx*2+1];
}
*/
/* create 9 from 6 */
for (let idx=0; idx*2 < points6.length; idx++) {
   points9[idx*2] = 79-points6[idx*2];
   points9[idx*2+1] = 99-points6[idx*2+1];
}

pointsArray = [points0, points1, points2, points3, points4, points5, points6, points7, points8, points9];

function eraseDigit(d, x, y) {
  if(d < 0) return;
  g.setColor("#000000");
  if(nightMode) {
    drawPoints(pointsArray[d], x, y);
    return;
  }
  drawPoints(pointsArray[d], x-2, y-2);
  drawPoints(pointsArray[d], x+2, y-2);
  drawPoints(pointsArray[d], x-2, y+2);
  drawPoints(pointsArray[d], x+2, y+2);
  drawPoints(pointsArray[d], x-1, y-1);
  drawPoints(pointsArray[d], x+1, y-1);
  drawPoints(pointsArray[d], x-1, y+1);
  drawPoints(pointsArray[d], x+1, y+1);
}

function drawDigit(d, x, y) {
  if(nightMode) {
    g.setColor("#206040");
    drawPoints(pointsArray[d], x, y);
    return;
  }
  g.setColor("#202020");
  for (let idx = pointsArray.length - 1; idx >= 0 ; idx--) {
    if(idx == d)  {
      g.setColor("#FF0000");
      drawPoints(pointsArray[d], x-2, y-2);
      drawPoints(pointsArray[d], x+2, y-2);
      drawPoints(pointsArray[d], x-2, y+2);
      drawPoints(pointsArray[d], x+2, y+2);
      g.setColor("#FF6000");
      drawPoints(pointsArray[d], x-1, y-1);
      drawPoints(pointsArray[d], x+1, y-1);
      drawPoints(pointsArray[d], x-1, y+1);
      drawPoints(pointsArray[d], x+1, y+1);

      g.setColor("#FFC000");
      drawPoints(pointsArray[d], x, y);

      g.setColor("#202020");
    } else {
      drawPoints(pointsArray[idx], x, y);
    }
  }
}

function drawTime() {
  //const mstr="JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC";

  let d = new Date().toString().split(' ');
  let hour = d[4].substr(0,2);
  let minute = d[4].substr(3,2);
  let date = `${d[0]} ${d[1]} ${d[2]}`;

  let h1 = Math.floor(hour / 10);
  let h2 = hour % 10;
  let m1 = Math.floor(minute / 10);
  let m2 = minute % 10;

  if(h1 == prevH1 && h2 == prevH2 && m1 == prevM1 && m2 == prevM2) {
    return;
  }

  if(h1 != prevH1) {
    eraseDigit(prevH1, 10, 80);
    drawDigit(h1, 10, 80);
  }
  if(h2 != prevH2) {
    eraseDigit(prevH2, 65, 80);
    drawDigit(h2, 65, 80);
  }
  if(m1 != prevM1) {
    eraseDigit(prevM1, 135, 80);
    drawDigit(m1, 135, 80);
  }
  if(m2 != prevM2) {
    eraseDigit(prevM2, 190, 80);
    drawDigit(m2, 190, 80);
  }
  if(!nightMode) {
    g.setColor("#000000");
    g.fillRect(0, 10, 240, 24);
    g.fillRect(0, 222, 240, 240);
    g.setColor("#202020");
    g.drawLine(0, 24, 239, 24);
    g.drawLine(0, 216, 239, 216);
    g.setColor("#C06000");
    g.setFontAlign(0, -1);
    g.drawString(date, 120, 10);
    //g.setFontAlign(-1,-1);
    //g.drawString("STEP " + stepCounter, 0, 230);
    g.setFontAlign(0,-1);
    g.drawString("BTY "+battInfo(), 120, 220);
  }

  prevH1 = h1;
  prevH2 = h2;
  prevM1 = m1;
  prevM2 = m2;

}

function btn1Func() {
  if(alarming) {
    alarming = false;
  } else {
    nightMode = !nightMode;
    g.setRotation(nightMode ? 1 : 0, 0);
  }
    g.clear();
    prevH1 = -1;
    prevH2 = -1;
    prevM1 = -1;
    prevM2 = -1;
    drawTime();
}


function btn3Func() {
  showMsg("This is a test message");
}

// Show launcher when middle button pressed
// redraw
setWatch(btn1Func, BTN1, {repeat:true,edge:"falling"});

SN80.isAwake = false;

ACCEL.on('faceup', ()=>{
  if (SN80.isAwake) return;
  SN80.isAwake = true;
  g.lcd_wake();
  brightness(5);
  drawTime();
  setTimeout(()=>{
    g.lcd_sleep();
    brightness(0);
    SN80.isAwake = false;
  }, 8000);
});