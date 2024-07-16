let exports = {};
/*
** UC8179c driver
** used in older 4.2" and 5.83" (but different startup sequences)
*/
function UC8179(opts) {
  this.opts = opts;
  this.width = opts.width;
  this.height = opts.height;
  this.cs = opts.cs;
  this.dc = opts.dc;
  this.spi = opts.spi;
  this.rst = opts.rst;
  this.busy = false;
}

//exports.connect = (opts) => {
//  var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
UC8179.prototype.debug = (s)=>{print((new Date()).getTime().toFixed(3)+": "+s);}; //print;
  
UC8179.prototype.delay = function(ms) {
  digitalPulse(opts.delay, 0, ms);
  digitalPulse(opts.delay, 0, 0);
};
UC8179.prototype.cmd =  function(c, d) {
  this.dc.reset();
  this.spi.write(c, this.opts.cs);
  if (d !== undefined) {
      this.dc.set();
      this.spi.write(d, opts.cs);
  }
};

UC8179.prototype.send=function (c) {
  this.dc.reset();
  this.spi.send(c);
  this.dc.set();
  let val=this.spi.send([0]);
  this.debug(val.toString(2));
};

UC8179.prototype.data=function (d) {
  this.dc.set();
  this.spi.write(d, opts.cs); 
};
UC8179.prototype.init = function () { 
  this.debug("reset");
  if(this.rst) 
    digitalPulse(this.rst, 0, [50]);
};
UC8179.prototype.isIdle =function () {
  this.cmd(0x71);
  return(this.busy.read());
};
UC8179.prototype.round1 =function () {
  print(JSON.stringify(this));
  this.debug("round1");
  //this.cmd(1 ,[7,7,0x3f,0x3f]);  //5.8
  this.cmd(1, [3,0,0x2f,0x2f,0xff]); //4.2
  this.cmd(6 ,[0x17,0x17,0x17]); //4.2
  this.cmd(4); //Wait for idle
};
UC8179.prototype.round2 =  function() {
  this.debug("round2");
  this.cmd(0 ,0x1f); //5.8
  //cmd(0x30 ,[0x3c]); //4.2
  this.cmd(0x61 ,[Math.floor(opts.width/256),opts.width%256,Math.floor(opts.height/256),opts.height%256]);
  this.cmd(0x15, 0);
  this.cmd(0x50, [0x10, 0x7]);
  this.cmd(0x60 ,0x22);
};
UC8179.prototype.wake = function () {
  this.debug("wake");
  this.init();
  this.delay(100);
  this.round1();
  this.delay(100);
  this.round2(); /*g.flip(0x10);*/
};
UC8179.prototype.wake2= function() {
  this.debug("wake2");
  this.init();
  setTimeout(this.round1, 100);
  setTimeout(()=>{this.round2a(); /*g.flip(0x10);*/}, 200);
};
UC8179.prototype.wake2b= function() {
  this.debug("wake2b");
  this.init();
  setTimeout(this.round1, 100);
  setTimeout(()=>{this.round2b();}, 200);
};
UC8179.prototype.sleep = function() {
  this.debug("Sleep");
  this.cmd(0x02); // POWER_OFF
  this.delay(100);
  this.cmd(0x07, 0xa5); // DEEP_SLEEP
};
UC8179.prototype.drawGfx = function(gfx, x0, y0) {  
  if(this.busy) return;
  this.busy = true;
  this.wake();
  setTimeout(()=>{
    //let Width = (opts.width % 8 == 0)? (opts.width / 8 ): (opts.width / 8 + 1);
    //let Height = opts.height;

    x0 = (x0 % 8 == 0)? x0: (x0|7)+1;
    let x1 = x0 + gfx.getWidth();
    let y1 = y0 + gfx.getHeight();

    this.cmd(0x91);		//This command makes the display enter partial mode
    this.cmd(0x90,	[(x0)/256, 
              (x0)%256,   //x-start    
              (x1 )/256,		
              (x1 )%256-1,  //x-end
              (y0/256),
              (y0%256),   //y-start    
              (y1/256),		
              (y1%256-1),  //y-end
              0x28]); // scan the whole line, prevent shadowing?	

    this.cmd(0x10, gfx.buffer);
    this.cmd(0x13, gfx.buffer);
    this.cmd(0x12);		 //DISPLAY REFRESH 		             
    this.delay(100);
    this.cmd(0x92);
    //cmd(0x12);
    setTimeout(()=>{this.busy=false; this.sleep();}, 7000);
  }, 300);
};


//DC = D44;
//RST=D47;
//CS = D3;

// 2.19:  w=128, h=250
// 1.54
var spi1 = new SPI();
var opts = {};
// QY03
if(process.env.BOARD == "QY03") {
  spi1.setup({sck: D45, mosi: D2, baud: 2000000});
  opts ={spi: spi1, cs: D3, dc: D44, rst: D47, delay: D40, width: 400, height: 300}; //648, height: 480};
} else {
  // Deskpal
  spi1.setup({sck: D45, mosi: D47, baud: 2000000});
  opts ={spi: spi1, cs: D43, dc: D10, rst: D9, delay: D31, BUSY: D2, width: 200, height: 100}; //648, height: 480};
}

var EPD = new UC8179(opts);
var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  
//g.setRotation(2);
g.flip = (full) => {EPD.drawGfx(g, 0, 0);};
g.drawString("HELLO FROM THE UNIVERSE", 20, 40);
