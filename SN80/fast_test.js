

D17.mode('output');
D17.set();
D9.mode('input');

const logD = console.log;

let batV=() => {
  return 7.1 * analogRead(D31);
};

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
  [0x29],
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

            if (fn) setTimeout(fn, 500);
            
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
        //g.cmd = cmd;
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

let g = ST7789();
brightness(7);



var img = {
  width : 206, height : 96, bpp : 2,
  transparent : -1,
  palette : new Uint16Array([0,65535,6339,61277]),
  buffer : require("heatshrink").decompress(atob("AE8LqoAD8AyrgXVGQdWM1ktMwlwM2NXwBmxvBm/M34ASgYyEM1s1GYlYGVcLGQlVM1m1GQlcM2XgM2NeM35m/ACUJMwtgGdeVGQlWGVcNM2MC6oyEq+AGdUlMwt4GVUDGQtV4Azq2ouBr/1AYNcGVULZAP+1W/aQPgEzuoBZUC6tf1QFB1X1q+ABgWqAAIGDACUJXJQyBvwlDgQzB3AFBh////+Ga2cZhdeEggzBrqbCagNVvxmhlqSEAAMK6oICg6ZB394M0ELGQwzCrwEBF4WtNoRmdZgIiHhdVuBmBH4W3M0G1RJEtqxmEgXYMz8tR4QAE0A9DMwctdRRmUgXXZg0uBQhzD7xmf2rMGhYHBhpxBMwcJbw5mXhtcBA24HwVwMwmeMzyZIl4HBBYRmDhrNfmtgHYyPCTQRmCgXcMz0LEwKZIbIRmDOARmdTJBqDqxmDhbTBMzsteQYACgaZCBgRmChXeGShmJLISZJOYV61Wq+54DhWu1EC0ABBBoIWD1XqwEqMwkq/+oBwU1LwaZGSgNYgv///1vQyD/tf9G+CgOv//6DYf1/+C+BmDlfVCoKRCrxuGHQm14FfGYP9vwOC746B9fggV9v/9XIUvv//72nMwcLv/r+onCEoKZKhde06LB1W9EwW31Eq+5mBkv+BgIjBhd+0Grv1wMwUC72gCoK3BRgKZGYQanBv4uCIwImBloCBNIJmBr2AgQ4BFIIbBlt3Mwe3BAMK7wfCFYiZGgVVq4ODDQMLHQRzBMwIVBgYJBm4TClpmDJAQVBBAMJK4YAClAFEktVBwcC/BZBAwQhBgQNCk+AhIpCgXXMwQODIAeXMwoyFMwwsBloGDG4IvBCQPYA4RdEMwO3EQYPBhpmFhegMxUA3xQEhZmBFAI/BwDoEm5mChPq1QAB1rUB65mF3RmLgdgEII5DMwJWDVAIZD+BmCy//AAR0BZo0CaYpmGmw0BMx8vMwdVAAbbBZow0B1BmLmwSDnxmGIwZmEzyZC1QnBhdYZouA3/oMy8nMxBhBAAm1Mws4l2qBAUDq/3ZreeGQsLrgGEgeCIQm19RmE3yNEZphEBMwIQBGYs1A4s4DAhABg4GDhvgRohmGgHeDIY9BMwO2GQsDrwGFZoIlDU4LtE/ECEwctMwzEEy5mCgYcDlzzCMw0C3wzCht4Mwm3KoIdChZNBMws3CYUtMwZEBCoVgCQPXEgZmCgG4D4QMBJIetDQOnAQMC6pmGOYcru5mCgCKCBgZZBMwo/BCQJzCMwevCQJJD2/+Mw0LvwCB75mDgQIBgX3EAW1TQkDxWA3jaEr////9SwfX9X19ZmGAQN/1/f05mDhdf1f3FwQmCMwku1Y/CyvAgtVAAP6B4Ur6tV/G+Mw0A3tVr+iMwcAl4cB9AcClqaEgeC34/CBYWqAAQQDlf//UKMwLxDVYf/0A9BhQIC1f/GQcAW4RmDgWoDwVXOQgATgakCABELTQkDHAjZFACk2BhaaFnAKJACCACLIJNLgXVBoZmETK0JEAfeCJYoBFwcoHolgGam+AYUvXQiaIZwjMEMysCvRYCWhu1Bw8tqqyLABMvvWq1aZMSAX4DQ1VJZoAI3v///fTJh1BqvoA4krqpLNKhO9qtX0ASNltXSIkr6trJZoAJlf+DJ7FB/QSBgWvTC4AU2tV/2q1X9qteGVUDqtVr//+oEBTC4ATmouBAAdYGVUCGQtXM1ctGYtwGVUA6oyEqwyrhJmFsAzryoyErwyrhZmF8Azr2pm/M1dcM2WAM2NYGVcDGQlXM1k1GYl4GVcC6pmxlpm/M1dwM2QyrMw1gGdm1GQdeBQg="))
};
/**/

setTimeout(()=>{
  g.clear();
  g.setColor(0.5,1,1);
  g.setFont("6x8",1);
  
  g.setFontAlign(0,0);
  g.drawString("Espruino",120,20);
  g.setFontVector(12);
  g.drawString("Espruino",120,40);
  
  g.drawCircle(60,40,20);
  g.fillCircle(180,40,20);
  g.setColor(1,0,1);
  g.drawRect(40,75,80,100);
  g.fillRect(160,75,200,100);
  g.setColor(1,1,0);
  g.drawPoly([70,130,80,110,90,130,100,110,110,130, 110,140,70,140], true);
  g.fillPoly([130,130,140,110,150,130,160,110,170,130, 170,140,130,140], true);
  g.setColor(0.5,0.5,1);
  for(let x = 90; x < 120; x+=5) {
    g.drawLine(x, 60, x, 90);
  }
  for(let y = 60; y < 90; y+=5) {
    g.drawLine(125, y, 155, y);
  }
  g.drawImage(img,20,144);

 },500);


