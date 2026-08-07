//*
let exports = {};
let debug = print; //()=>{}; //print;

exports.connect = function(opts, callback) {
  let isPartial = false;
  let isBusy = false;
  let partialCount = 0;
  let funcList = [];

  var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  
  function delayms(ms) {
    digitalPulse(D12, 0, ms);
    digitalPulse(D12, 0, 0);
  }
  function wait() {
    delayms(100);
  }
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
      digitalPulse(opts.rst, 0, [50]);
      //digitalPulse(opts.rst, 1, 0);
    }
    cmd(0x12);
    wait();
    cmd(0x46, 0xf7); // clear RAM 
    cmd(0x47, 0xf7); // clear RAM 
    cmd(0x7e, 0x3b);
    cmd(0x2b, [0x4, 0x63]);
    cmd(0xc, [0xae,0xc7,0xc3,0xc0,0x40]);
    cmd(0x1, [0xf, 2, 0]);
    cmd(0x11, 0x3); //0x1);
    cmd(0x44, [0, 0, 0x6f, 3]);
    cmd(0x45, [0, 0, 0xf, 2]);//, 0,0]);
    cmd(0x3c, 0x1);
    cmd(0x18, 0x80);
    cmd(0x22, 0xb1);
    cmd(0x21, 0x40); // bypass all RED data: use as BW screen
    cmd(0x20);
    isBusy=false;

    partialCount = 0;
  }

  g.flip = function () {
    if(isBusy) return;
    cmd(0x4e, [0,0]);
    cmd(0x4f, [0,0]); //0xf, 2]);
    cmd(0x24); //write B/W
    opts.dc.set();
    opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    cmd(0x22, 0xC7); 
    cmd(0x20); // update
    return g;
  };
  
  g.flipR = function (buf) {
    if(isBusy) return;
    cmd(0x26); //write RED
    opts.dc.set();
    opts.spi.write({data: 0, count: 880 * 528 / 8}, opts.cs);
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

  g.clearR = function() {
    g.flipR(new Uint8Array(200));
  };


  g.reset = init;
  g.cmd = cmd;
  g.isBusy = isBusy;
  g.isPartial = isPartial;
  g.delay = delayms;

  g.sleep = function () { cmd(0x10, 0x3);};

  return g;
};
// END DRIVER
//*/


var spi1 = new SPI();
spi1.setup({sck: D29, mosi: D31, baud: 400000});

let opts = {spi: spi1, cs: D2, dc: D47, rst: D45, busy: D43, 
  //width: 200, height: 200}; 
  width: 880, height: 528};

require("omnigo2.js").add(Graphics);
var g = exports.connect(opts);
//_S=require("Storage");

var motd = "I'll fix this screen yet!";
let cycle = 0;
let BG=-1, FG=0;

function clock() {
  //g.reset();
  //g.delay(250);
  g.setBgColor(BG).setColor(FG);
  
  let dt = Date().toString();
  let offset = 14;
  if(dt[offset] != ' ') offset++;
  g.clear();
  g.setFont("Blocky",3);
  g.setFontAlign(0,0);
  let x = cycle % 4, y = Math.floor(cycle / 4);
  g.drawString(dt.substring(offset, offset+6),100+x*200,60+y*200);
  g.setFont("Blocky", 1);
  g.drawString(motd, 100+x*200, 110+y*200);
  g.drawString(upTime(), 100+x*200, 10+y*200, true);
  //upTime();
  g.flip();
  
  //g.flip();
  setTimeout(g.sleep, 10*1000);
  cycle++;
  if(cycle >= 12) cycle=0;
}


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
  return( ` ${r}d ${h}h ${m}m `);
  //g.drawString(up,g.getWidth()/2+1, 30, false);
  //g.setFont("Blocky",1);
};

// Wtach BUSY
//setWatch(()=>{print("BUSY HI");}, D43,{ edge: "rising", repeat: true, debounce: 50});
//setWatch(()=>{print("BUSY LO");}, D43,{ edge: "falling", repeat: true, debounce: 50});
// BEGIN BOOT0
