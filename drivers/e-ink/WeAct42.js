exports = {};
let debug=print;

exports.connect = function(spi, opts, callback) {
  let isPartial = false;
  let isBusy = false;
  let partialCount = 0;

  var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  opts.spi = spi;
  
  function delay(ms) {
    digitalPulse(opts.delay, 0, ms);
    digitalPulse(opts.delay, 0, 0);
  }

  function cmd(c, d) {
      opts.dc.reset();
      opts.spi.write(c, opts.cs);
      if (d !== undefined) {
          opts.dc.set();
          opts.spi.write(d, opts.cs);
      }
  }
  function init(fast) { 
    isBusy = true;
    digitalPulse(opts.rst, 0, [50]);
    digitalPulse(opts.rst, 0, 0);
    if(fast) {
      cmd(0x3c, 0x80);
      cmd(0x21, [0,0]);
      isBusy=false;
      return;
    } 
    cmd(0x12); 
    delay(20);
    cmd(0x1, [0x2b, 0x1, 0x0]);
    cmd(0x21, [0x40, 0x0]);
    cmd(0x3c, 5);
    /* 1.5 sec "FAST"
    if(fast) {
      debug("FAST");
      cmd(0x1a, 0x63);
      cmd(0x22, 0x91);
      cmd(0x20);
      delay(20);
    }
    */
    cmd(0x11, 1);
    cmd(0x44, [0, 0x31]);
    cmd(0x45, [0x2b, 0x1, 0, 0]);
    cmd(0x4e, 0);
    cmd(0x4f, [0x2b, 1]);
    isBusy=false;
    partialCount = 0;
  }

  g.sleep = function () { cmd(0x10, 1);};

  g.flip = function (fast) {
    if(isBusy) return;
    //init();
    cmd(0x24); //write B/W
    opts.dc.set();
    opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    if(!fast) {
      cmd(0x26); //write RED
      opts.dc.set();
      opts.spi.write(new Uint8Array(g.buffer), opts.cs);
      cmd(0x22, 0xF7); 
    } else cmd(0x22, 0xFF); 
    cmd(0x20); // update
    //setTimeout(g.sleep, 3000);
    return g;
  };

  g.reset = init;
  // debug
  g.cmd = cmd;
  //g.partialCount = partialCount;
   
  init();
  if(callback) setTimeout(callback, 250);
  return g;
};
/*
var spi1 = new SPI();
spi1.setup({sck: D45, mosi: D2, baud: 2000000});
//DC = D44;
//RST=D47;
//D3.reset();  // "CS"

//var g = require("~SSD1681.js")
//var g = exports
let opts = {spi: spi1, cs: D3, dc: D44, rst: D47, width: 200, height: 200};
function test() {
  g.setRotation(3,1);
  g.getHeight = () => {return 122;};
  g.setBgColor(1).setColor(0);
  g.clear();
  g.flip();
}
var g = exports.connect(opts, test);
//*/
var spi1 = new SPI();
spi1.setup({sck: D45, mosi: D2, baud: 2000000});

let opts = {cs: D3, dc: D44, rst: D47, delay: D1, width: 400, height: 300};
//let opts = {cs: 0, busy: D3, dc: D44, rst: D47, width: 400, height: 300};
Graphics.prototype.setFontOmnigo = function() {
  this.setFontCustom(atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=="), 
    32, atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc="), 256 + 13);
};


function test() {
  g.setRotation(1,1);
  g.setBgColor(1).setColor(0);
  g.clear().setFontAlign(0,0);
  g.setFont("Omnigo",1).drawString("Welcome to Espruino", 150, 180);
  g.drawString(Date().toString(), 150, 220);
  //g.flip();
}
//busyW = setWatch(()=>{debug((getTime() % 1000).toFixed(3)+" --- BUSY: "+opts.busy.read());}, opts.busy, {edge: "both", repeat: true});
var g = exports.connect(spi1, opts);
