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
var g = require("ST7789").connect(spi, D18, D25, D26, function() {
  digitalWrite(23,0);
  g.clear();
  //g.setRotation(1);
 // g.drawString("Hello",0,0);
  //g.setFontVector(20);
  g.setColor(0,1,1);
  g.setFontAlign(0,0);
  //g.drawString("Espruino",120,120);
  g.setPixel(0,0);
  g.setColor(1,0,1);
  g.setPixel(120,120);
  g.setColor(1,1,0);
  g.setPixel(239,239);
  });

const LCD_WIDTH = 240;
const LCD_HEIGHT = 240;
const COLSTART = 26; //52;
const ROWSTART = 20; //40;


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
  
  /* from Python 
  setTimeout(() => {   
        //time.sleep(0.150)               
        cmd(ST7789_MADCTL,0x70);

        cmd(ST7789_FRMCTR2,[0x0C,0x0C,0x00,0x33,0x33]);

        cmd(ST7789_COLMOD,0x05);

        cmd(ST7789_GCTRL,0x14);

        cmd(ST7789_VCOMS,0x37);

        cmd(ST7789_LCMCTRL,0x2C);

        cmd(ST7789_VDVVRHEN,0x01);

        cmd(ST7789_VRHS,0x12);

        cmd(ST7789_VDVS,0x20);

        cmd(0xD0,[0xA4,0xA1]);

        cmd(ST7789_FRCTRL2,0x0F);

        cmd(ST7789_GMCTRP1,
        [0xD0,0x04,0x0D,0x11, 0x13,0x2B,0x3F,0x54,0x4C, 0x18,0x0D,0x0B,0x1F,0x23]);

        cmd.command(ST7789_GMCTRN1,
        [0xD0,0x04, 0x0C, 0x11,0x13,0x2C,0x3F,0x44,0x51, 0x2F,0x1F,0x1F,0x20,0x23]);

        if (_invert)
            cmd.command(ST7789_INVON);
        else
            cmd.command(ST7789_INVOFF);

        cmd(ST7789_SLPOUT);

        cmd(ST7789_DISPON);
        if (callback)  setTimeout(callback, 100);
  }, 150);
*/
        
        
  /* default st7789 */
  const ST7789_INIT_CODE = [
        // CMD, D0,D1,D2...
        [0x11, 0],     //SLPOUT (11h):
        // This is an unrotated screen
        [0x36, 0],     // MADCTL
        // These 2 rotate the screen by 180 degrees
        //0x36,0xC0],     // MADCTL
        //0x37,[0,80]],   // VSCSAD (37h): Vertical Scroll Start Address of RAM

        [0x3A, 0x55],  // COLMOD - interface pixel format - 16bpp
        [0xB2, [0xC, 0xC, 0, 0x33, 0x33]], // PORCTRL (B2h): Porch Setting
        [0xB7, 0],     // GCTRL (B7h): Gate Control
        [0xBB, 0x3E],  // VCOMS (BBh): VCOM Setting 
        [0xC2, 1],     // VDVVRHEN (C2h): VDV and VRH Command Enable
        [0xC3, 0x19],  // VRHS (C3h): VRH Set 
        [0xC4, 0x20],  // VDVS (C4h): VDV Set
        [0xC5, 0xF],   // VCMOFSET (C5h): VCOM Offset Set .
        [0xD0, [0xA4, 0xA1]],   // PWCTRL1 (D0h): Power Control 1 
        [0xe0, [0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]],   // PVGAMCTRL (E0h): Positive Voltage Gamma Control
        [0xe1, [0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]],   // NVGAMCTRL (E1h): Negative Voltage Gamma Contro
        [0x29, 0], // DISPON (29h): Display On 
        [0x21, 0], // INVON (21h): Display Inversion On
        // End
        [0, 0]// 255//DATA_LEN = 255 => END
    ];

    setTimeout(function () {
        cmd(0x11); //Exit Sleep
        setTimeout(function () {
            ST7789_INIT_CODE.forEach(function (e) {
                cmd(e[0], e[1]);
            });
            if (callback) callback();
        }, 20);
    }, 120);
    /**/
/* ATC SN80 specific (SN80-Y??)
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
  [0xF0,[8,0x26,0x45,9,0x2A,8]],
  [0xF1,[0x43,0x70,0x72,0x36,0x37,0x6F]],
  [0xF2,[8,0x26,0x45,9,0x2A,8]],
  [0xF3,[0x43,0x70,0x72,0x36,0x37,0x6F]],
  [0xED,[0x1B,0xB]],
  [0xAC,0x47],
  [0xAE,0x77],
  [0xCB,2],
  [0xCD,0x63],
  [0x70,[7,9,4,0xE,0xF,9,7,8,3]],
  [0xE8,0x34],
  [0x62,[0x18,0xD,0xED,0xF,0x71,0x70,0xEF,0x70,0x71,0x18,0x70,0x70]],
  [0x63,[0x18,0x11,0x13,0xF1,0x71,0x70,0xF3,0x70,0x71,0x18,0x70,0x70]],
  [0x64,[0x28,0x29,1,0xF1,0,7,0xF1]],
  [0x66,[0x3C,0,0xCD,0x67,0x45,0,0x45,0,0x10,0]],
  [0x67,[0,0x3C,0,0,1,0x54,0x10,0x32,0x98,0]],
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
              cmd(0x2A,[0,0,0xEF,0]);
              cmd(0x2B,[0,0,0xEF,0]);
              cmd(0x2C);}, 360);

            if (callback) setTimeout(callback, 500);
        }, 20);
    }, 120);
   */
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


// // this produces skewed output, further investigation needed...
// exports.connectPaletted = function (palette, spi, dc, ce, rst, callback) {
//     var bits;
//     if (palette.length > 16) bits = 8;
//     else if (palette.length > 4) bits = 4;
//     else if (palette.length > 2) bits = 2;
//     else bits = 1;
//     var g = Graphics.createArrayBuffer(LCD_WIDTH, LCD_HEIGHT, bits, { msb: true });
//     g.flip = function () {
//         ce.reset();
//         spi.write(0x2A, dc);
//         spi.write(0, COLSTART, (COLSTART+LCD_WIDTH)>>8, COLSTART+LCD_WIDTH);
//         spi.write(0x2B, dc);
//         spi.write(0, ROWSTART, (ROWSTART+LCD_HEIGHT)>>8, ROWSTART+LCD_HEIGHT);
//         spi.write(0x2C, dc);
//         var lines = 16; // size of buffer to use for un-paletting
//         var a = new Uint16Array(LCD_WIDTH * lines);
//         for (var y = 0; y < LCD_HEIGHT; y += lines) {
//             E.mapInPlace(new Uint8Array(g.buffer, y * LCD_WIDTH * bits / 8, a.length), a, palette, bits);
//             spi.write(a.buffer);
//         }
//         ce.set();
//     };
//     init(spi, dc, ce, rst, callback);
//     return g;
// };