/* Copyright (c) 2020 Akos Lukacs, based on code by Gordon Williams and https://github.com/Bodmer/TFT_eSPI. See the file LICENSE for copying permission. */
/*
Module for the ST7789 135x240 LCD controller

Just:
*/

// ST7789 demo code on TTGO T-Display
ST7789_NOP = 0x00;
ST7789_SWRESET = 0x01;
ST7789_RDDID = 0x04;
ST7789_RDDST = 0x09;

ST7789_SLPIN = 0x10;
ST7789_SLPOUT = 0x11;
ST7789_PTLON = 0x12;
ST7789_NORON = 0x13;

ST7789_INVOFF = 0x20;
ST7789_INVON = 0x21;
ST7789_DISPOFF = 0x28;
ST7789_DISPON = 0x29;

ST7789_CASET = 0x2A;
ST7789_RASET = 0x2B;
ST7789_RAMWR = 0x2C;
ST7789_RAMRD = 0x2E;

ST7789_PTLAR = 0x30;
ST7789_MADCTL = 0x36;
ST7789_COLMOD = 0x3A;

ST7789_FRMCTR1 = 0xB1;
ST7789_FRMCTR2 = 0xB2;
ST7789_FRMCTR3 = 0xB3;
ST7789_INVCTR = 0xB4;
ST7789_DISSET5 = 0xB6;

ST7789_GCTRL = 0xB7;
ST7789_GTADJ = 0xB8;
ST7789_VCOMS = 0xBB;

ST7789_LCMCTRL = 0xC0;
ST7789_IDSET = 0xC1;
ST7789_VDVVRHEN = 0xC2;
ST7789_VRHS = 0xC3;
ST7789_VDVS = 0xC4;
ST7789_VMCTR1 = 0xC5;
ST7789_FRCTRL2 = 0xC6;
ST7789_CABCCTRL = 0xC7;

ST7789_RDID1 = 0xDA;
ST7789_RDID2 = 0xDB;
ST7789_RDID3 = 0xDC;
ST7789_RDID4 = 0xDD;

ST7789_GMCTRP1 = 0xE0;
ST7789_GMCTRN1 = 0xE1;

ST7789_PWCTR6 = 0xFC;

var spi = new SPI();
spi.setup({sck:D2,mosi:D3,mode:0}); //spi.send([0xab],D5); 

const LCD_WIDTH = 240;
const LCD_HEIGHT = 240;
const COLSTART = 0;
const ROWSTART = 0;


function init(spi, dc, ce, rst, callback) {
  function cmd(c, d) {
      dc.reset();
      spi.write(c, ce);
      if (d !== undefined) {
          dc.set();
          spi.write(d, ce);
      }
  }

  if (rst) {
      digitalPulse(rst, 0, 10);
  } else {
      cmd(0x01); //Software reset
  }
  
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
    ];

    setTimeout(function () {
        //cmd(0x11); //Exit Sleep
        setTimeout(function () {
            ST7789_INIT_CODE.forEach(function (e) {
                cmd(e[0], e[1]);
            });
            setTimeout(()=>{  //delay_0(120);
              cmd(0x11); }, 120);
            setTimeout(()=>{    //delay_0(120);
              cmd(0x29);}, 240);
            setTimeout(()=>{  //delay_0(120);
              cmd(0x2A,[0,0,0,0xEF]);
              cmd(0x2B,[0,0,0,0xEF]);
              cmd(0x2C);}, 360);

            if (callback) setTimeout(callback, 500);
        }, 20);
    }, 120);
   /**/
}


let connect = function (spi, dc, ce, rst, callback) {
    var g = Graphics.createCallback(LCD_WIDTH, LCD_HEIGHT, 16, {
        setPixel: function (x, y, c) {
            ce.reset();
            spi.write(0x2A, dc);
            spi.write((COLSTART + x) >> 8, COLSTART + x, (COLSTART + x) >> 8, COLSTART + x);
            spi.write(0x2B, dc);
            spi.write((ROWSTART + y) >> 8, ROWSTART + y, (ROWSTART + y) >> 8, (ROWSTART + y));
            spi.write(0x2C, dc);
            spi.write(c >> 8, c);
            ce.set();
        },
        fillRect: function (x1, y1, x2, y2, c) {
            ce.reset();
            spi.write(0x2A, dc);
            spi.write((COLSTART + x1) >> 8, COLSTART + x1, (COLSTART + x2) >> 8, COLSTART + x2);
            spi.write(0x2B, dc);
            spi.write((ROWSTART + y1) >> 8, ROWSTART + y1, (ROWSTART + y2) >> 8, (ROWSTART + y2));
            spi.write(0x2C, dc);
            spi.write({ data: String.fromCharCode(c >> 8, c), count: (x2 - x1 + 1) * (y2 - y1 + 1) });
            ce.set();
        }
    });
    init(spi, dc, ce, rst, callback);
    return g;
};
/*
var img = {
  width : 103, height : 48, bpp : 1,
  transparent : 0,
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAH/wAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAB/+AAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAf/gAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAP/4AAAAAAAAAAAAAAH/+AAAAAAAAAAAAAAD//AAAAAAAAAAAAAAB//gAAAAAAAAAAAAAA//wAAAAAAAAAAAAAA+B8AAAAAAAAABAAAA4AHgf4AAAAAAAgAAAwAB4IGAAAAAAAQAAAwAAOEBAAAAAAAIAAAwAADCAgAAAAAAEAAAwAABxAQAAAAAACAAAYAAgYgIAAAAAABAAAYAAgGQMAAAAAAAgAAMAAADP8AeAvAPEQHgEAAABn/gZ8cwMaIMcGAAQAaAYQOIMIHEMDDAAAAPAEQDECMBiEAhgAAAHgDIBiBEARGAQwAAADwAkARAiAIj/4YAAAB4ASAIgRAERAAMAAAA0ARAMQIgCIwACAAIAyAIwGIEYDEIBBgABAZAYMHECGDiCDAwAAAM/4D8iBB/RA/AMABQMAAAAAAAAIAAAGAAAGAAAAAAAAEAAABgCAGAAAAAAAwEAAAAYAAHAAAAAAAMGAAAAGAAHAAAAAAAD8AAAABwAPAAAAAAAAAAAAAAeAeAAAAAAAAAAAAAAH/+AAAAAAAAAAAAAAD//AAAAAAAAAAAAAAB//gAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAf/wAAAAAAAAAAAAAAH/4AAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAB/+AAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAf/gAAAAAAAAAAAAAAP/gA"))
};
*/
var img = {
  width : 206, height : 96, bpp : 2,
  transparent : -1,
  palette : new Uint16Array([0,65535,6339,61277]),
  buffer : require("heatshrink").decompress(atob("AE8LqoAD8AyrgXVGQdWM1ktMwlwM2NXwBmxvBm/M34ASgYyEM1s1GYlYGVcLGQlVM1m1GQlcM2XgM2NeM35m/ACUJMwtgGdeVGQlWGVcNM2MC6oyEq+AGdUlMwt4GVUDGQtV4Azq2ouBr/1AYNcGVULZAP+1W/aQPgEzuoBZUC6tf1QFB1X1q+ABgWqAAIGDACUJXJQyBvwlDgQzB3AFBh////+Ga2cZhdeEggzBrqbCagNVvxmhlqSEAAMK6oICg6ZB394M0ELGQwzCrwEBF4WtNoRmdZgIiHhdVuBmBH4W3M0G1RJEtqxmEgXYMz8tR4QAE0A9DMwctdRRmUgXXZg0uBQhzD7xmf2rMGhYHBhpxBMwcJbw5mXhtcBA24HwVwMwmeMzyZIl4HBBYRmDhrNfmtgHYyPCTQRmCgXcMz0LEwKZIbIRmDOARmdTJBqDqxmDhbTBMzsteQYACgaZCBgRmChXeGShmJLISZJOYV61Wq+54DhWu1EC0ABBBoIWD1XqwEqMwkq/+oBwU1LwaZGSgNYgv///1vQyD/tf9G+CgOv//6DYf1/+C+BmDlfVCoKRCrxuGHQm14FfGYP9vwOC746B9fggV9v/9XIUvv//72nMwcLv/r+onCEoKZKhde06LB1W9EwW31Eq+5mBkv+BgIjBhd+0Grv1wMwUC72gCoK3BRgKZGYQanBv4uCIwImBloCBNIJmBr2AgQ4BFIIbBlt3Mwe3BAMK7wfCFYiZGgVVq4ODDQMLHQRzBMwIVBgYJBm4TClpmDJAQVBBAMJK4YAClAFEktVBwcC/BZBAwQhBgQNCk+AhIpCgXXMwQODIAeXMwoyFMwwsBloGDG4IvBCQPYA4RdEMwO3EQYPBhpmFhegMxUA3xQEhZmBFAI/BwDoEm5mChPq1QAB1rUB65mF3RmLgdgEII5DMwJWDVAIZD+BmCy//AAR0BZo0CaYpmGmw0BMx8vMwdVAAbbBZow0B1BmLmwSDnxmGIwZmEzyZC1QnBhdYZouA3/oMy8nMxBhBAAm1Mws4l2qBAUDq/3ZreeGQsLrgGEgeCIQm19RmE3yNEZphEBMwIQBGYs1A4s4DAhABg4GDhvgRohmGgHeDIY9BMwO2GQsDrwGFZoIlDU4LtE/ECEwctMwzEEy5mCgYcDlzzCMw0C3wzCht4Mwm3KoIdChZNBMws3CYUtMwZEBCoVgCQPXEgZmCgG4D4QMBJIetDQOnAQMC6pmGOYcru5mCgCKCBgZZBMwo/BCQJzCMwevCQJJD2/+Mw0LvwCB75mDgQIBgX3EAW1TQkDxWA3jaEr////9SwfX9X19ZmGAQN/1/f05mDhdf1f3FwQmCMwku1Y/CyvAgtVAAP6B4Ur6tV/G+Mw0A3tVr+iMwcAl4cB9AcClqaEgeC34/CBYWqAAQQDlf//UKMwLxDVYf/0A9BhQIC1f/GQcAW4RmDgWoDwVXOQgATgakCABELTQkDHAjZFACk2BhaaFnAKJACCACLIJNLgXVBoZmETK0JEAfeCJYoBFwcoHolgGam+AYUvXQiaIZwjMEMysCvRYCWhu1Bw8tqqyLABMvvWq1aZMSAX4DQ1VJZoAI3v///fTJh1BqvoA4krqpLNKhO9qtX0ASNltXSIkr6trJZoAJlf+DJ7FB/QSBgWvTC4AU2tV/2q1X9qteGVUDqtVr//+oEBTC4ATmouBAAdYGVUCGQtXM1ctGYtwGVUA6oyEqwyrhJmFsAzryoyErwyrhZmF8Azr2pm/M1dcM2WAM2NYGVcDGQlXM1k1GYl4GVcC6pmxlpm/M1dwM2QyrMw1gGdm1GQdeBQg="))
};
/**/
var g = connect(spi, D18, D25, D26, function() {
  digitalWrite(D23,0);
  g.clear();
  //g.setRotation(1);
 // g.drawString("Hello",0,0);
  //g.setFontVector(20);
  
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
  });



