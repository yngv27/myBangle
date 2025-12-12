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
  this.busy = opts.busy;
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
  if(this.rst) {
    digitalPulse(this.rst, 0, [50]);
    digitalPulse(this.rst, 0, 0);
  }
};
UC8179.prototype.isIdle =function () {
  //this.cmd(0x71);
  this.debug("isIdle = "+this.busy.read());
  return(this.busy.read());
};
UC8179.prototype.wait = function() {
  while(!this.busy.read()) this.delay(50);
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
  this.cmd(0x30 ,[0x3c]); //4.2
  this.cmd(0x61 ,[Math.floor(opts.width/256),opts.width%256,Math.floor(opts.height/256),opts.height%256]);
  this.cmd(0x15, 0);
  this.cmd(0x50, [0x10, 0x7]);
  this.cmd(0x60 ,0x22);
};

UC8179.prototype.round3q =function() {
    // we modify these on the fly below, since the LUTs share most of the data
    let LUT = new Uint8Array([0x0,0x10,0x8,0,0,2]);
    let LUT2 = new Uint8Array([0x0,0x20,0,0,0,2]);
    let Ateen0s = new Uint8Array([0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0]);

    this.debug("round3q");
    this.cmd(0 ,[0xbf,0xd]); //0xb]);
    this.cmd(0x30 ,[0x3c]);
    this.cmd(0x82 ,[0x28]);  //0x12]);
    this.cmd(0x50 ,[0x97]);
    //VCOM
    LUT[0]=0x0;
    LUT2[0]=0x0; 
    this.cmd(0x20 ,LUT);
    this.data(LUT2);
    this.data(Ateen0s);
    this.data(Ateen0s);
    this.data([0,0]);
    // W->W and B->W  0x60 == b01100000, so first 01, then 10 (flash)
    LUT[0]=0x90; //0x60; //a0;
    LUT2[0]=0x50; //0xa0; 
    this.cmd(0x21 ,LUT); 
    this.data(LUT2);
    this.data(Ateen0s);
    this.data(Ateen0s);
  
    this.cmd(0x22 ,LUT); 
    this.data(LUT2);
    this.data(Ateen0s);
    this.data(Ateen0s);
    // W->B, B->B 0x90 == b10010000, first 10, then 01 (flash)
    LUT[0]=0x60; //0x90; //50;
    LUT2[0]=0xa0; //0x50; 
    this.cmd(0x23 ,LUT); 
    this.data(LUT2);
    this.data(Ateen0s);
    this.data(Ateen0s);
    this.cmd(0x24 ,LUT);
    this.data(LUT2);
    this.data(Ateen0s);
    this.data(Ateen0s);
};
UC8179.prototype.wake = function () {
  this.debug("wake");
  this.init();
  //this.delay(100);
  this.wait();
  this.round1();
  //this.delay(100);
  this.wait();
  this.round2(); /*g.flip(0x10);*/
  //this.wait();
  //this.round3q();
  //this.wait();
};
UC8179.prototype.wake2= function() {
  this.debug("wake");
  this.init();
  //this.delay(100);
  this.wait();
  this.round1();
  //this.delay(100);
  this.wait();
  this.round2(); /*g.flip(0x10);*/
  //this.wait();
  this.round3q();
  //this.wait();
};

UC8179.prototype.sleep = function() {
  this.debug("Sleep");
  this.cmd(0x02); // POWER_OFF
  this.delay(100);
  this.cmd(0x07, 0xa5); // DEEP_SLEEP
};
UC8179.prototype.drawGfx = function(gfx, x0, y0, full) {  
  if(full) this.wake();
  else this.wake2();

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
  this.debug("BEGIN");
  this.cmd(0x10, gfx.buffer);
  this.cmd(0x13, gfx.buffer);
  this.debug("BEND");
  this.cmd(0x12);		 //DISPLAY REFRESH 		             
  this.delay(300);
  this.cmd(0x92);
  this.wait();
  this.sleep();
};


//DC = D44;
//RST=D47;
//CS = D3;

/*
// 2.19:  w=128, h=250
// 1.54
var spi1 = new SPI();
var opts = {};

spi1.setup({sck: D29, mosi: D31, baud: 2000000});
opts ={spi: spi1, cs: D2, dc: D47, rst: D45, delay: D31, busy: D43, width: 648, height: 480}; //648, height: 480};


var EPD = new UC8179(opts);
var g = Graphics.createArrayBuffer(/*opts.width, opts.height* / 648, 480, 1,{msb:true});
  
eval(_S.read("Roboto20.js"));
g.setFontRoboto20();
g.clear();

//g.setRotation(2);
g.flip = (full) => {EPD.drawGfx(g, 0, 0, full);};
function test() {
  g.clear();
  g.drawString("HELLO FROM THE UNIVERSE\n\nThis time from "+new Date(), 20, 40);
  g.drawRect(0,0,g.getWidth()-1, g.getHeight()-1);
}
*/

                                           
