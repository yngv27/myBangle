let exports = {};

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=='), 32, atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc='), 256 + 13);
};

exports.connect = function(/*=SPI*/_spi, /*=PIN*/_cs, /*=PIN*/_vcom, width, height, callback) {
  var g = Graphics.createArrayBuffer(width,height,1);
  var spi = _spi;
  var cs = _cs;
  var vcom = _vcom;
  var vcomstate = false;

  digitalWrite(cs,1); // CS on
  spi.send(0b00000100); // clear display
  digitalWrite(cs,0); // CS off

  setTimeout(function() {
    //digitalWrite(cs,0); // CS on
    spi.send(0b00000000); // all normal
    //digitalWrite(cs,0); // CS off
    if (callback) callback();
  }, 10);  
  /* Note: it's recommended you toggle vcom every second, but doing it every 5
     allows Espruino to properly enter deep sleep modes */
  if (vcom) {
    setInterval(function() {
      digitalWrite(vcom, vcomstate=!vcomstate);
    }, 5000);
  }
  
  g.flip = function () {
    digitalWrite(cs,1); // CS on
    spi.send([0b00000001,1]); // update, 1st row
    var w = g.getWidth()>>3;
    for (var y=0;y<g.getHeight();y++) {
      spi.send(new Uint8Array(g.buffer,y*w,w));
      spi.send([0,y+2]); // pad and do 2nd row
    }
    digitalWrite(cs,0); // CS off
    return g;
  };
  return g;
};

SPI1.setup({ sck:D2, mosi:D44, order: "lsb", baud: 4000000 });

var g = exports.connect(SPI1, D3/*SCS*/, 0/*EXTCOMIN*/, 144/*width*/, 168/*height*/, function() {
  g.clear();
  g.setRotation(2);
  g.setFontOmnigo();
  g.drawString("Hello",0,0);
  g.drawLine(0,10,g.getWidth(),10);
  g.drawString(getTime(), 0, 20);
  g.flip();
  g.setFontAlign(0,-1);
});

_S=require("Storage");

let drawClock = (d) => {
  g.setBgColor(1).setColor(0);
    g.clear(); //.fillRect(0,138,143, 149);
    let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
    let minAngle = d.min / 30 * Math.PI;

    g.drawImage(_S.read("minute.png"), 72, 70, { rotate: minAngle, scale: 0.5625 });
    g.drawImage(_S.read("hour.png"), 72, 70, { rotate: hrAngle, scale: 0.5625 });
    //g.setColor("#FFFFFF").fillCircle(72, 70, 5);
    g.fillCircle(72, 70, 3);
  g.drawCircle(72, 70, 70);
  g.drawCircle(72, 71, 70);
    g.drawString(`The time is ${d.hr}:${d.min}`, 72, 152);
    g.flip();
  };

setInterval(()=> {
  let d = Date();  drawClock({hr: d.getHours(), min: d.getMinutes()});
}, 60000);
