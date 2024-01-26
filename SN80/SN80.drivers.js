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


/* ATC SN80 specific */
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

function battLevel(){
  var l=3.3,h=4.26;
  let v=battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return Math.floor(100*(v-l)/(h-l));
}
function battInfo(){let v=battVolts();return `${battLevel()}% ${v.toFixed(2)}V`;}

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
let Bangle = {};
Bangle.setLCDBrightness = (b) => {
  brightness(Math.ceil(b*7));
};
Bangle.setLCDPower = (on) => {
  if(on) {brightness(5); g.lcd_wake();}
  else {brightness(0); g.lcd_sleep();}
};
Bangle.buzz = (time, strength)=> {
  vibrate(strength?strength:0.5, 1, time?time:200, 20); 
};
E.getBattery = () => { return battLevel(); };


// buzz on power applied /
setWatch(() => { Bangle.buzz(); }, D19, 
  {repeat: true, edge:'rising', debounce:10});


SN80.isAwake = false;

ACCEL.on('faceup', ()=>{
  if (SN80.isAwake) return;
  SN80.isAwake = true;
  Bangle.setLCDPower(true);
  setTimeout(()=>{
    Bangle.setLCDPower(false);
    SN80.isAwake = false;
  }, 8000);
});
