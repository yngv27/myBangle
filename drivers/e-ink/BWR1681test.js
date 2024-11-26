//*
let exports = {};
let debug = print; //()=>{}; //print;

exports.connect = function(opts, callback) {
  let isPartial = false;
  let isBusy = false;
  let partialCount = 0;
  let funcList = [];

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
  var delays = [150, 90, 20]; // customizable for slower/faster e-inks (in lieu of using BUSY)
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
    debug("init");
    isBusy = true;
    if(opts.rst) {
      opts.rst.reset(); setTimeout(()=>{opts.rst.set();},100);
    }
    setTimeout(()=>{
      cmd(0x12); 
      cmd(0x21, 0x40); // bypass all RED data: use as BW screen
      isBusy=false;
    }, 200);
    partialCount = 0;
  }

  function loadLUT1()
  {
    debug("LUT1");
    cmd(0x32, WF_PARTIAL.slice(0,153));
  }
  function loadLUT2()
  {
    debug("LUT2");
    cmd(0x3F, WF_PARTIAL[153]);
    cmd(0x03, WF_PARTIAL[154]);
    cmd(0x04, WF_PARTIAL.slice(155, 158)); 
    cmd(0x2C, WF_PARTIAL[158]);
    cmd(0x37, [0,0,0,0,0,0x40,0,0,0,0]); 
    cmd(0x3C, 0x80);
  }
  function setPartialOld (yesno) {
    if(!yesno) {
      init();
      partialCount = 0;
      return;
    }
    if(partialCount > 0) return;
    let to = 0;
    isBusy = true;
    setTimeout(init, to); to+=delays[0];
    setTimeout(loadLUT1, to); to+=delays[1];
    setTimeout(loadLUT2, to); to+=delays[2];

    setTimeout(()=>{ 
      debug("LUT3");
      cmd(0x22, 0xCF); 
      isPartial = true; 
      partialCount = 60;
      //g.flip(); 
      isBusy=false;
    }, to);
  }
  
  g.flip = function () {
    if(isBusy) return;
    cmd(0x24, g.buffer); //write B/W
    /*
    opts.dc.set();
    opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    */
    //if(partialCount > 0) {
      //cmd(0x22, 0xCF); 
    //}
    //cmd(0x20); // update
    /*
    if(!partialCount) {
      //auto set for next round
      isBusy= true;
      setTimeout(setPartial, 18000); //2500 for BW, 20000 for BWR
    } else {
      partialCount--;
      if(!partialCount) setTimeout(init, 500);
    }
    //print("count is "+partialCount);
    //*/
    return g;
  };
  
  g.flipR = function (buf) {
    if(isBusy) return;
    cmd(0x26); //write RED
    opts.dc.set();
    if(buf) {
      for(let i=0; i<g.buffer.length; i+= buf.length)
        opts.spi.write(buf, opts.cs);
    } else {
      opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    }
    cmd(0x20); 
    isBusy = true;
    setTimeout(()=>{isBusy = false;}, 18000);
    return g;
  };
  g.update = (X_start,Y_start, gfx, full) => {
    if(g.busy) return;
    isBusy = true;
    //if(full) wake(); else wake2();
    
    X_start = (X_start % 8 == 0)? X_start: (X_start|7)+1;
    let X_end = X_start + Math.floor(gfx.getWidth()/8);
    let Y_end = Y_start + Math.floor(gfx.getHeight()/8);
    print(`XS: ${X_start}; Xe: ${X_end}`);

    cmd(0x44,	[(X_start)/256, 
              (X_start)%256,   //x-start    
              (X_end )/256,		
              (X_end )%256-1]);  //x-end
    cmd(0x45, [(Y_start/256),
              (Y_start%256),   //y-start    
              (Y_end/256),		
              (Y_end%256-1)]);  //y-end
    cmd(0x24, gfx.buffer);
    cmd(0x20);		 //DISPLAY REFRESH
  };
  var flist = [];
  var flistCnt = 0;
  g.queue = function(f, busyPin) {
    debug("Queue: BUSY="+g.isBusy+" "+getTime().toFixed(3));
    // allow function with no args
    if(typeof(f) == "function") f = {func: f};
    if(typeof(f) != "object") {
      f=null; // allow for no argument: when g.isBusy == false
    } else {
      // push this one
      f.order = flistCnt++;
      debug("Q: pushing new one with delay "+f.delay);
      flist.push(f);
    }
    function completed() {
      g.isBusy = false;
      g.queue();
    }
    if(!g.isBusy) {
      if(flist.length) {
        // execute first in list
        g.isBusy = true;
        let o = flist.shift();
        debug("EXEC item "+o.order+" w delay "+o.delay);
        (o.func)(o.parm);
        if(busyPin) { setWatch(completed, busyPin, {edge: "falling"}); }// do not repeat
        else if(o.delay) { setTimeout(completed, o.delay); }
      }
    }
  };
  function setPartial(yesno) {
    if(!yesno) {
      init();
      partialCount = 0;
      return;
    }
    //if(partialCount > 0) return;
    //let to = 0;
    g.queue({func:init, delay: 300});
    g.queue({func:loadLUT1, delay: 10});
    g.queue({func:loadLUT2, delay: 10});

    g.queue({func: ()=>{ 
      debug("LUT3");
      cmd(0x22, 0xCF); 
      isPartial = true; 
      partialCount = 60;
    }, delay: 300});
    g.queue({func:()=>{debug("FLIP");g.clear().flip();}, delay: 500});

  }
  g.clearR = function() {
    g.flipR(new Uint8Array(200));
  };
  g.setup = function() {
    g.setRotation(2,1);
    g.setBgColor(-1).setColor(0).clear();
    g.queue({func:g.clearR, delay: 18000}); // save a few bytes
    g.queue({func:loadLUT1, delay:1});
    g.queue({func:loadLUT2, delay:2});

    g.queue({func:()=>{ 
      debug("LUT3");
      cmd(0x22, 0xCF); 
      isPartial = true; 
      partialCount = 60;
    }, delay: 300});

    g.queue({func:()=>{debug("FLIP");g.clear().flip();}, delay: 5});
  };

  g.reset = init;
  g.cmd = cmd;
  g.isBusy = isBusy;
  g.isPartial = isPartial;
  g.setPartial = setPartial;

  g.sleep = function () { cmd(0x10, 1);};
   
  init();
  if(callback) setTimeout(callback, 250);
  g.on("free", g.queue);

  return g;
};
// END DRIVER
//*/

// BEGIN BOOT0
LED2=D8;
var spi1 = new SPI();
spi1.setup({sck: D2, mosi: D29, baud: 400000});

let opts = {spi: spi1, cs: D47, dc: D45, rst: D43, busy: D6, width: 200, height: 200};

//var g = require("~IL3829.js").connect(opts);
var g = exports.connect(opts);
_S=require("Storage");
NRF.setAdvertising({},{name: "Gadget", interval: 750, phy:"both"});

Graphics.prototype.setFontOmnigo = function(scale) {
  this.setFontCustom(atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=="), 32, atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc="), (scale << 8)+(1 << 16) + 13);
};
Graphics.prototype.setFontAgency=function(scale){this.setFontCustom(atob("AAAAAAAAAAD/kAAAAADwAAAA8AAAAAAAEIB/4BCAEIB/4BCAAAB4cIQQ//iCEOHgAAD8AIQw/EABgAYAGAAj8MIQA/AAAPHwihCEEIAQ5/AEEAAAAADwAAAAB4A4cMAMAAAAAMAMOHAHgAAAUAAgAPgAIABQAAAAAgACAA+AAgACAAAAAAAAOAAAAQABAAEAAQAAAAAwAAAAAABwAYAGABgA4AAAAP/wgBCAEIAQ//AAAP/wAADx8IIQhBCIEPAQAADw8IAQhBCKEPHwAAD/gACAAIAf8ACAAAD48IgQiBCIEI/wAAD/8IQQhBCEEOfwAADAAIAAh/CIAPAAAAD78IQQhBCEEPvwAAD+cIIQghCCEP/wAAAGMAAAAAAGOAAAAAAGABmAYGAAAASABIAEgASABIAAAGBgGYAGAAAA8ACAAIewiADwAAAA//CAEL+QoJCgkL+QgJD/kAAA//CEAIQAhAD/8AAA//CEEIQQhBD78AAA//CAEIAQgBDg8AAA//CAEIAQgBB/4AAA//CEEIQQhBCAEAAA//CEAIQAhACAAAAA//CAEIQQhBDn8AAA//AEAAQABAD/8AAA//AAAADwABAAEAAQ//AAAP/wCAAUACIAwfAAAP/wABAAEAAQAAD/8DAADAAwAP/wAAD/8DAADAADAP/wAAB/4IAQgBCAEH/gAAD/8IIAggCCAP4AAAB/4IAQgFCAMH/wAAD/8IIAgwCCgP5wAADw8IgQhBCCEPHwAACAAIAA//CAAIAAAAD/8AAQABAAEP/wAAD/AADAADAAwP8AAAD/AADwBwAA8P8AAADg8BsABAAbAODwAADgABgAB/AYAOAAAACAcIGQhhCYEOAQAAD//IAEgAQAAOAAGAAGAAGAAHAAAIAEgAT//AAAMADAADAAAAAAAgACAAIAAgAAwABgAAAADfAJEAkQD/AAAP/wCBAIEA/wAAAP8AgQCBAOcAAAD/AIEAgQ//AAAA/wCRAJEA8wAAAIAP/wiAAAAA/2CBIIEg/+AAD/8AgACAAP8AAAb/AAAAACb/4AAP/wAYAGYAgQAAD/8AAAD/AIAA/wCAAP8AAAD/AIAAgAD/AAAA/wCBAIEA/wAAAP/ggQCBAP8AAAD/AIEAgQD/4AAA/wCAAIAA4AAAAOcAkQCJAMcAAACAB/8AgQAAAP8AAQABAP8AAADAADwAAwA8AMAAAAD8AAcAHAAHAPwAAADnABgAGADnAAAA/gACIAIg/+AAAMcAiQCRAOMAAAAgB9+IAEgAQAAP/+AACABIAEffgCAAAAAAAAAAAAgAD/8AAAAAA="), 32, atob("AwMFCAYKBwMFBAYGAwUDBgYCBgYGBgYGBgYDAwQGBAYJBgYGBgYGBgYCBgYFBgYGBgYGBgYGBgYGBgYEBgQEBQMFBQUFBQQFBQIDBQIGBQUFBQUFBAUGBgUFBQUCBQYB"), 16+(scale << 8)+(1 << 16));};

var motd = "Another lovely day";
function clock() {
  g.queue({func:g.reset, delay:250});
  //g.setPartial(true);
  g.queue({func:()=>{
    let dt = Date().toString();
    let offset = 14;
    if(dt[offset] != ' ') offset++;
    g.clear();
    g.setFont("Omnigo",3);
    g.setFontAlign(0,0);
    g.drawString(dt.substring(offset, offset+6),100,100);
    g.setFontOmnigo();
    g.drawString(motd, 100, 150);
    upTime();
  }, delay: 10});
  g.queue({func:g.flip, delay: 18500});
  //g.flip();
  g.queue({func:g.sleep, delay: 10});
}
function blink(n) {
  while(n--) {
    setTimeout(()=>{LED2.set();}, n*500);
    setTimeout(()=>{LED2.reset();}, n*500+250);
  }
}
E.at = (timeStr, func) => {
    if(timeStr.indexOf("T") < 0) { timeStr = Date().toISOString().substring(0,11)+timeStr;}
    let delay = Math.floor((new Date(timeStr)).getTime() - (new Date()).getTime());
    if (delay < 0) delay += 24*60*60*1000;
    print("thats in "+delay/1000);
    setTimeout(func, delay);
  };
/*
setWatch(()=>{
  print(`${getTime().toFixed(3)} BUSY=${+D6.read()}`);
}, D6, {edge: "both", repeat: true});
//*/
setWatch(()=>{
  blink(1);
  clock();
}, BTN1, {edge: "rising", repeat: true});
//setup();
//*/

let bootTime = 1727021711;
let upTime = () => {
  let r = Math.floor(Date().getTime()/1000 - bootTime);
  //let s = r % 60;
  r = Math.floor(r / 60);
  let m = r % 60;
  r = Math.floor(r / 60);
  let h = r % 24;
  r = Math.floor(r / 24);

  //g.setFont("Blocky",1);
  let up = ` ${r}d ${h}h ${m}m `;
  g.drawString(up, 100, 48, true);
  //g.drawString(up,g.getWidth()/2+1, 30, false);
  //g.setFont("Blocky",1);
};