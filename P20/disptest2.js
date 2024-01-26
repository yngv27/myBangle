/*
** D3   battery charging (charging = LOW)
** D4   backlight (analog)
** D15  I2C SDA (SC7A20)
** D16  I2C SCK (SC7A20)
** D17  SPI Flash MOSI
** D18  SPI Flash SCLK
** D19  SPI FLash MISO
** D20  SPI Flash CS
** D22  buzzer
** D25  BTN1 (input_pullup)
** D26  BTN2 (input_pullup)
** D28  I2C SDA (0x48 - HRM??)
** D29  I2C SCK (???)
** D30  analog battery voltage (low = 2.555, high = 3.17)
*/
pinMode(D25, "input_pulldown");
pinMode(D26, "input_pullup");

// all pins on a 52840; remove D32+ for a 52832
let pins = [
    D0, D1, D2, D5, D6, D7, D8, D9,
    D10, D11, D12, D13, D14, D21,  D23, D24, D27, //D28, D29,
    D31, 
    ];

// pins stayed down: D4, D12, D19, D21, D23, D24, D27
// pins stayed set: D0, D1, D2, D7, D8, D9, D14
let uppins = [
  D11,D12,D13,D15,D16,,D21,D23,D24,,D31
  ];

let plbl = '';
function makeLabels() {
  plbl = '';
  for(let p=0; p<pins.length; p++) {
    plbl += (' '+pins[p].toString()).slice(-3);
  }
}

// outputs a header for each pin (in groups of four for legibility) to console
function h() {
  makeLabels();
  out1 = '';
  out2 = '';
  out3 = '';
  for(let p=0; p < pins.length; p++) {
    if(p%4 == 0) {
      out1 += ' ';
      out2 += ' ';
      out3 += ' ';
    }
    out1 += plbl.charAt(p*3);
    out2 += plbl.charAt(p*3+1);
    out3 += plbl.charAt(p*3+2);

  }
  print (out1); print(out2); print(out3);
}

let out1 = '';
let out2 = '';
let out3 = '';

// shows the state of each pin in pin list (1/0 for high/low)
function d() {
  out1 = '';
  for(let p=0; p < pins.length; p++) {
    if(p%4 == 0) {
      out1 += ' ';
    }
    out1 += pins[p].read() ? '1' : '0';

  }
  print (out1);
}

// handy f() for quick delays that block
function delay(ms) {
  let t = Math.floor(Date().getTime())+ms;
  while(t > Date().getTime()) {
    // something silly
    out3 = ' ';
  }
}

// used to track if in a series of nested loops a pin is being used
let pinBusy = [];

function resetBusy() {
  for(let i = 0; i< pins.length; i++) {
    pinBusy[i] = false;
  }
}
   
// loops through each pin, toggling it high/low at for 1 sec; useful for testing
// a single pin with a multimeter
function r() {
  delay(3000);
  for(let p=0; p < pins.length; p++) {
    let pin = pins[p].toString();
    for(c=0; c<1; c++) {
      pins[p].reset();
      print(`${pin} is SET`);
      delay(99);
      pins[p].set();
      print(`${pin} is RESET`);
      delay(99);
    }
  }
}

// repeatedly toggles a single pin high/low for 1 sec pulses; useful for testing
// multiple leads quickly (such as a ribbon connector)
function t(p) {
  for(let c=0; c < 100; c++) {
    let pin = p.toString();
    p.set();
    print(`${pin} is SET`);
    delay(999);
    p.reset();
    print(`${pin} is RESET`);
    delay(999);
  }
}

/* Copyright (c) 2020 Akos Lukacs, based on code by Gordon Williams and https://github.com/Bodmer/TFT_eSPI. See the file LICENSE for copying permission. */
/*
Module for the ST7789 135x240 LCD controller

Just:
*/
E.kickWatchdog();
function KickWd(){
  E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(15, false);

/* SN80 
SCK=D2;
IO= D3;
DC=D18;
CS=D25; 
RST=D26;
*/

SCK=D8;
IO= D9;
DC=D6;
CS=D14; 
RST=D7;


function delayms(ms) {
  //digitalPulse(D18,0,ms);digitalPulse(D18,0,0);
  var t = getTime()+ms/1000; while(getTime()<t);
}


function on() {
  // P20
  D4.set();
  //D11.reset();
  //pinMode(D13, 'opendrain');
  // SN80
  //digitalWrite([D23,D22,D14],0);
}

var spi = new SPI();
spi.setup({sck:SCK,mosi:IO,baud:8000000, mode:0}); //spi.send([0xab],D5); 

const LCD_WIDTH = 240;
const LCD_HEIGHT = 240;
const COLSTART = 0;
const ROWSTART = 0;

nrf_wait_us = delayms;

function init(spi, dc, ce, rst, callback) {
  function cmd(c, d) {
      dc.reset();
      spi.write(c, ce);
      if (d !== undefined) {
          dc.set();
          spi.write(d, ce);
      }
  }
  function spi_tx(cord, b) {
    if(cord) dc.set(); else dc.reset();
    spi.write(b, ce);
  }

  pinMode(rst, 'output');
  pinMode(dc, 'output');
  pinMode(ce, 'output');

  digitalWrite(rst, 1);
  nrf_wait_us(50);
  digitalWrite(rst, 0);
  nrf_wait_us(50);
  digitalWrite(rst, 1);
  nrf_wait_us(120);
 

  //if (callback) setTimeout(callback, 500);

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

/**/
var g="";
function go() {
on();
g = connect(spi, DC, CS, RST); /*, function() {
  //on();
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
  //g.drawImage(img,20,144);
  });
  */
}
