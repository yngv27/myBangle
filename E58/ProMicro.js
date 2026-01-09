
/*
** This is for ProMicro C18A running the 5.8 EPD
*/
NRF.setAdvertising({},{name:"E58"});

var ME = {
  spi1: new SPI(),
  opts: {},
};
ME.spi1.setup({sck: D29, mosi: D31, baud: 2000000});
ME.opts ={spi: ME.spi1, cs: D2, dc: D47, rst: D45, delay: D31, busy: D43, width: 648, height: 480}; //648, height: 480};

var EPD = require("~UC8179.js").connect(ME.opts);
//var g = Graphics.createArrayBuffer(/*opts.width, opts.height* / 648, 480, 1,{msb:true});
// */

/*
** CUSTOM LAYOUT
** to save memory, have a header buffer, and one HALF screen for content
** draw 1 content, copy to EPD, draw 2nd, copy, update screen
*/
// header/content
var gH = Graphics.createArrayBuffer(648, 48, 1,{msb:true});
var gC = Graphics.createArrayBuffer(320, 432, 1,{msb:true});
var gD = Graphics.createArrayBuffer(8,432,1,{msb: true}); // our skinny divider
gD.clear();

// default built-in refresh
EPD.full = true;
// separate out drawing f()s so we can update gfx piece-meal
EPD.wakeup = function() {
  if(EPD.full) this.wake();
  else this.wake2();
};

EPD.clear = function(d) {
  if(!d) d=0;
  EPD.wake();
  EPD.wait();
  EPD.cmd(0x13, [{data:d , count:81 * 480}]);
  EPD.wait();
  EPD.cmd(0x12);
  EPD.wait();
  EPD.sleep();
};

EPD.drawPortion = function(gfx, x0, y0) {  
  x0 = (x0 % 8 == 0)? x0: (x0|7)+1;
  let x1 = x0 + gfx.getWidth();
  let y1 = y0 + gfx.getHeight();

  this.cmd(0x91); //This command makes the display enter partial mode
  this.cmd(0x90, [(x0)/256, 
            (x0)%256,   //x-start    
            (x1 )/256,
            (x1 )%256-1,  //x-end
            (y0/256),
            (y0%256),   //y-start    
            (y1/256),
            (y1%256-1),  //y-end
            0x28]); // scan the whole line, prevent shadowing?
  this.debug("BEGIN");
  this.cmd(0x13, gfx.buffer);
  this.wait();
  this.cmd(0x92);
  this.debug("BEND");
};
EPD.flip = function()  {
  this.wakeup();
  EPD.drawPortion(gD, 320,48);
  dC1(); EPD.drawPortion(gC, 0, 48);
  dC2(); EPD.drawPortion(gC, 328, 48);
  dH(); EPD.drawPortion(gH, 0, 0);
  this.cmd(0x12);  //DISPLAY REFRESH
  this.wait();
  setTimeout(()=>{this.sleep();}, 5000);
};


eval(_S.read("BarlowMC23.js"));
gH.setFontBarlowMC23();
gC.setFontBarlowMC23();
gH.clear();
gC.clear();

function dH() {
  gH.clear().drawRect(0,0, gH.getWidth()-1, gH.getHeight()-1).setFontAlign(0,0).drawString("Header", 320, 24);
 
}
function dC1() {
  gC.clear().drawRect(0,0, gC.getWidth()-1, gC.getHeight()-1).drawString("Content 1");
 
}
function dC2() {
  gC.clear().drawRect(0,0, gC.getWidth()-1, gC.getHeight()-1).drawString("Content 2");
 
}