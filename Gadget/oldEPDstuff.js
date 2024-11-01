exports = {};

exports.connect = function(opts, callback) {
  let isPartial = false;
  let isBusy = false;
  let partialCount = 0;
  const WF_PARTIAL = new Uint8Array(
    [
    0x0,0x40,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x80,0x80,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x40,0x40,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x80,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0xF,0x0,0x0,0x0,0x0,0x0,0x1,
    0x1,0x1,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x0,0x0,0x0,0x0,0x0,0x0,0x0,
    0x22,0x22,0x22,0x22,0x22,0x22,0x0,0x0,0x0,
    0x02,0x17,0x41,0xB0,0x32,0x28,
    ]);	

  var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  var delays = [500, 900, 200]; // customizable for slower/faster e-inks (in lieu of using BUSY)
  if(opts.delays) delays=opts.delays;
  
  function cmd(c, d) {
      opts.dc.reset();
      opts.spi.write(c, opts.cs);
      if (d !== undefined) {
          opts.dc.set();
          opts.spi.write(d, opts.cs);
      }
  }
  // custom init for BWR 1681: set border color after 50ms
  function init() { 
    isBusy = true;
    if(opts.rst) {
      opts.rst.reset(); setTimeout(()=>{opts.rst.set();},50);
    }
    setTimeout(()=>{
      cmd(0x12); 
      isBusy=false;
    }, 100);
    partialCount = 0;
  }

  function loadLUT1()
  {
    cmd(0x32, WF_PARTIAL.slice(0,153));
  }
  function loadLUT2()
  {
    cmd(0x3F, WF_PARTIAL[153]);
    cmd(0x03, WF_PARTIAL[154]);
    cmd(0x04, WF_PARTIAL.slice(155, 158)); 
    cmd(0x2C, WF_PARTIAL[158]);
    cmd(0x37, [0,0,0,0,0,0x40,0,0,0,0]); 
    cmd(0x3C, 0x80);
  }
  function setPartial () {
    if(partialCount > 0) return;
    let to = 0;
    isBusy = true;
    setTimeout(init, to); to+=delays[0];
    setTimeout(loadLUT1, to); to+=delays[1];
    setTimeout(loadLUT2, to); to+=delays[2];
    setTimeout(()=>{ 
      isPartial = true; 
      partialCount = 60;
      //g.flip(); 
      isBusy=false;
    }, to);
  }

  // legacy
  g.setPartial = setPartial; //()=>{};

  g.flip = function () {
    if(isBusy) return;
    cmd(0x24); //write B/W
    opts.dc.set();
    opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    if(partialCount > 0) {
      cmd(0x22, 0xCF); 
    }
    cmd(0x20); // update
    if(!partialCount) {
      //auto set for next round
      setTimeout(setPartial, 15000); //2500 for BW, 15000 for BWR
    } else {
      partialCount--;
      if(!partialCount) setTimeout(init, 250);
    }
    //print("count is "+partialCount);
    return g;
  };
  
  g.flipR = function (partial) {
    if(isBusy) return;
    cmd(0x26); //write RED
    opts.dc.set();
    opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    opts.dc.reset(); 
    cmd(0x20); 
    isBusy = true;
    setTimeout(()=>{isBusy = false;}, 15000);
    return g;
  };
  g.reset = init;
  g.cmd = cmd;

  g.sleep = function () { cmd(0x10, 1);};
  // debug
  //g.cmd = cmd;
  //g.partialCount = partialCount;
   
  init();
  if(callback) setTimeout(callback, 250);
  return g;
};
////////////// BOOT(())
E.enableWatchdog(10);
var spi1 = new SPI();
spi1.setup({sck: D2, mosi: D29, baud: 2000000});

let opts = {spi: spi1, cs: D47, dc: D45, rst: D43, width: 200, height: 200};

var g = require("~SSD1681.js").connect(opts);
setTimeout(()=>{
  g.setRotation(2,1);
  g.setBgColor(1).setColor(0);
  g.flipR();
  setTimeout(()=>{
    g.clear();
    g.flip();
  }, 15000);
}, 2500);
//var g = exports.connect(opts);
_S=require("Storage");
NRF.setAdvertising({},{name: "Gadget", interval: 750, phy:"both"});

E.at = (timeStr, func) => {
  if(timeStr.indexOf("T") < 0) { timeStr = Date().toISOString().substring(0,11)+timeStr;}
  let delay = Math.floor((new Date(timeStr)).getTime() - (new Date()).getTime());
  if (delay < 0) delay += 24*60*60*1000;
  print("thats in "+delay/1000);
  setTimeout(func, delay);
};

////////////////// the clock
eval(_S.read("atcfont.js"));
Graphics.prototype.setFontOmnigo = function(scale) {
  this.setFontCustom(atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=="), 32, atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc="), (scale << 8)+(1 << 16) + 13);
};
Graphics.prototype.setFontAgency=function(scale){this.setFontCustom(atob("AAAAAAAAAAD/kAAAAADwAAAA8AAAAAAAEIB/4BCAEIB/4BCAAAB4cIQQ//iCEOHgAAD8AIQw/EABgAYAGAAj8MIQA/AAAPHwihCEEIAQ5/AEEAAAAADwAAAAB4A4cMAMAAAAAMAMOHAHgAAAUAAgAPgAIABQAAAAAgACAA+AAgACAAAAAAAAOAAAAQABAAEAAQAAAAAwAAAAAABwAYAGABgA4AAAAP/wgBCAEIAQ//AAAP/wAADx8IIQhBCIEPAQAADw8IAQhBCKEPHwAAD/gACAAIAf8ACAAAD48IgQiBCIEI/wAAD/8IQQhBCEEOfwAADAAIAAh/CIAPAAAAD78IQQhBCEEPvwAAD+cIIQghCCEP/wAAAGMAAAAAAGOAAAAAAGABmAYGAAAASABIAEgASABIAAAGBgGYAGAAAA8ACAAIewiADwAAAA//CAEL+QoJCgkL+QgJD/kAAA//CEAIQAhAD/8AAA//CEEIQQhBD78AAA//CAEIAQgBDg8AAA//CAEIAQgBB/4AAA//CEEIQQhBCAEAAA//CEAIQAhACAAAAA//CAEIQQhBDn8AAA//AEAAQABAD/8AAA//AAAADwABAAEAAQ//AAAP/wCAAUACIAwfAAAP/wABAAEAAQAAD/8DAADAAwAP/wAAD/8DAADAADAP/wAAB/4IAQgBCAEH/gAAD/8IIAggCCAP4AAAB/4IAQgFCAMH/wAAD/8IIAgwCCgP5wAADw8IgQhBCCEPHwAACAAIAA//CAAIAAAAD/8AAQABAAEP/wAAD/AADAADAAwP8AAAD/AADwBwAA8P8AAADg8BsABAAbAODwAADgABgAB/AYAOAAAACAcIGQhhCYEOAQAAD//IAEgAQAAOAAGAAGAAGAAHAAAIAEgAT//AAAMADAADAAAAAAAgACAAIAAgAAwABgAAAADfAJEAkQD/AAAP/wCBAIEA/wAAAP8AgQCBAOcAAAD/AIEAgQ//AAAA/wCRAJEA8wAAAIAP/wiAAAAA/2CBIIEg/+AAD/8AgACAAP8AAAb/AAAAACb/4AAP/wAYAGYAgQAAD/8AAAD/AIAA/wCAAP8AAAD/AIAAgAD/AAAA/wCBAIEA/wAAAP/ggQCBAP8AAAD/AIEAgQD/4AAA/wCAAIAA4AAAAOcAkQCJAMcAAACAB/8AgQAAAP8AAQABAP8AAADAADwAAwA8AMAAAAD8AAcAHAAHAPwAAADnABgAGADnAAAA/gACIAIg/+AAAMcAiQCRAOMAAAAgB9+IAEgAQAAP/+AACABIAEffgCAAAAAAAAAAAAgAD/8AAAAAA="), 32, atob("AwMFCAYKBwMFBAYGAwUDBgYCBgYGBgYGBgYDAwQGBAYJBgYGBgYGBgYCBgYFBgYGBgYGBgYGBgYGBgYEBgQEBQMFBQUFBQQFBQIDBQIGBQUFBQUFBAUGBgUFBQUCBQYB"), 16+(scale << 8)+(1 << 16));};

function clock() {
  let dt = Date().toString();
  let offset = 14;
  if(dt[offset] != ' ') offset++;
  g.clear();
  g.setFontATC();
  g.setFontAlign(0,0);
  g.drawString(dt.substring(offset, offset+6),100,100);
  g.setFontOmnigo();
  g.drawString("A lovely day indeed", 100, 150);
  g.flip();
}

E.at = (timeStr, func) => {
    if(timeStr.indexOf("T") < 0) { timeStr = Date().toISOString().substring(0,11)+timeStr;}
    let delay = Math.floor((new Date(timeStr)).getTime() - (new Date()).getTime());
    if (delay < 0) delay += 24*60*60*1000;
    print("thats in "+delay/1000);
    setTimeout(func, delay);
  };
  