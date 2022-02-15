

var spi = new SPI();
spi.setup({sck:D5,mosi:D11,mode:0}); //spi.send([0xab],D5); 

const LCD_WIDTH = 400;
const LCD_HEIGHT = 400;
const COLSTART = 0;
const ROWSTART = 0;
const HIGH = 1;
const LOW = 0;

function init(spi, dc, ce, rst, callback) {
  function cmd(c, d) {
      dc.reset();
      spi.write(c, ce);
      if (d !== undefined) {
          dc.set();
          spi.write(d, ce);
      }
  }
  function spiCommand(c) {
      dc.reset();
      spi.write(c, ce);
  }
  function spiWrite(d) {
      if (d !== undefined) {
          dc.set();
          spi.write(d, ce);
      }
  }

  
  digitalWrite(D3, HIGH);
  digitalWrite(D26, HIGH);


  if (rst) {
      digitalPulse(rst, 0, 10);
  } else {
      cmd(0x01); //Software reset
  }
  /*
  pinMode(display_mosi, OUTPUT);
  pinMode(display_cmddata, OUTPUT);
  pinMode(display_clk, OUTPUT);
  pinMode(display_cs, OUTPUT);
  pinMode(display_reset, OUTPUT);
  pinMode(display_enable, OUTPUT);
  */


  spiCommand(0xFE);
  spiWrite(1);
  spiCommand(0x6C);
  spiWrite(0xA);
  spiCommand(4);
  spiWrite(0xA0);
  spiCommand(254);
  spiWrite(5);
  spiCommand(5);
  spiWrite(1);
  spiCommand(254);
  spiWrite(0);
  spiCommand(53);
  spiWrite(0);
  spiCommand(54);
  spiWrite(192);
  spiCommand(0x3A);
  spiWrite(0x72);
  //delay(10);
  setTimeout(()=>{
    spiCommand(83);
    spiWrite(32);
    spiCommand(196);
    spiWrite(128);
    spiCommand(17);
    //delay(120);
    setTimeout(()=>{
      spiCommand(0x29);
    }, 120);
  }, 10);


  spiCommand(0x51);
  spiWrite(0xff);//Brigthness 0x90 0xC0 0xFF

  D34.mode('output');
  
  digitalWrite(D34, LOW);

  if(callback) setTimeout(callback, 2500);
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

var img = {
  width : 206, height : 96, bpp : 2,
  transparent : -1,
  palette : new Uint16Array([0,65535,6339,61277]),
  buffer : require("heatshrink").decompress(atob("AE8LqoAD8AyrgXVGQdWM1ktMwlwM2NXwBmxvBm/M34ASgYyEM1s1GYlYGVcLGQlVM1m1GQlcM2XgM2NeM35m/ACUJMwtgGdeVGQlWGVcNM2MC6oyEq+AGdUlMwt4GVUDGQtV4Azq2ouBr/1AYNcGVULZAP+1W/aQPgEzuoBZUC6tf1QFB1X1q+ABgWqAAIGDACUJXJQyBvwlDgQzB3AFBh////+Ga2cZhdeEggzBrqbCagNVvxmhlqSEAAMK6oICg6ZB394M0ELGQwzCrwEBF4WtNoRmdZgIiHhdVuBmBH4W3M0G1RJEtqxmEgXYMz8tR4QAE0A9DMwctdRRmUgXXZg0uBQhzD7xmf2rMGhYHBhpxBMwcJbw5mXhtcBA24HwVwMwmeMzyZIl4HBBYRmDhrNfmtgHYyPCTQRmCgXcMz0LEwKZIbIRmDOARmdTJBqDqxmDhbTBMzsteQYACgaZCBgRmChXeGShmJLISZJOYV61Wq+54DhWu1EC0ABBBoIWD1XqwEqMwkq/+oBwU1LwaZGSgNYgv///1vQyD/tf9G+CgOv//6DYf1/+C+BmDlfVCoKRCrxuGHQm14FfGYP9vwOC746B9fggV9v/9XIUvv//72nMwcLv/r+onCEoKZKhde06LB1W9EwW31Eq+5mBkv+BgIjBhd+0Grv1wMwUC72gCoK3BRgKZGYQanBv4uCIwImBloCBNIJmBr2AgQ4BFIIbBlt3Mwe3BAMK7wfCFYiZGgVVq4ODDQMLHQRzBMwIVBgYJBm4TClpmDJAQVBBAMJK4YAClAFEktVBwcC/BZBAwQhBgQNCk+AhIpCgXXMwQODIAeXMwoyFMwwsBloGDG4IvBCQPYA4RdEMwO3EQYPBhpmFhegMxUA3xQEhZmBFAI/BwDoEm5mChPq1QAB1rUB65mF3RmLgdgEII5DMwJWDVAIZD+BmCy//AAR0BZo0CaYpmGmw0BMx8vMwdVAAbbBZow0B1BmLmwSDnxmGIwZmEzyZC1QnBhdYZouA3/oMy8nMxBhBAAm1Mws4l2qBAUDq/3ZreeGQsLrgGEgeCIQm19RmE3yNEZphEBMwIQBGYs1A4s4DAhABg4GDhvgRohmGgHeDIY9BMwO2GQsDrwGFZoIlDU4LtE/ECEwctMwzEEy5mCgYcDlzzCMw0C3wzCht4Mwm3KoIdChZNBMws3CYUtMwZEBCoVgCQPXEgZmCgG4D4QMBJIetDQOnAQMC6pmGOYcru5mCgCKCBgZZBMwo/BCQJzCMwevCQJJD2/+Mw0LvwCB75mDgQIBgX3EAW1TQkDxWA3jaEr////9SwfX9X19ZmGAQN/1/f05mDhdf1f3FwQmCMwku1Y/CyvAgtVAAP6B4Ur6tV/G+Mw0A3tVr+iMwcAl4cB9AcClqaEgeC34/CBYWqAAQQDlf//UKMwLxDVYf/0A9BhQIC1f/GQcAW4RmDgWoDwVXOQgATgakCABELTQkDHAjZFACk2BhaaFnAKJACCACLIJNLgXVBoZmETK0JEAfeCJYoBFwcoHolgGam+AYUvXQiaIZwjMEMysCvRYCWhu1Bw8tqqyLABMvvWq1aZMSAX4DQ1VJZoAI3v///fTJh1BqvoA4krqpLNKhO9qtX0ASNltXSIkr6trJZoAJlf+DJ7FB/QSBgWvTC4AU2tV/2q1X9qteGVUDqtVr//+oEBTC4ATmouBAAdYGVUCGQtXM1ctGYtwGVUA6oyEqwyrhJmFsAzryoyErwyrhZmF8Azr2pm/M1dcM2WAM2NYGVcDGQlXM1k1GYl4GVcC6pmxlpm/M1dwM2QyrMw1gGdm1GQdeBQg="))
};
/**/
var g = connect(spi, D27, D26, D40, function() {
  digitalWrite(D23,0);
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
  //g.drawImage(img,20,144);
  });



