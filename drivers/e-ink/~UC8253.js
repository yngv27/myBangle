/*
** UC8253 EPD driver
** used in my gadget with a 2.1 EPD
** reverse engineered init and LUTs
*/
function UC8253(opts) {
  //this.opts = opts;
  this.width = opts.width;
  this.height = opts.height;
  this.cs = opts.cs;
  this.dc = opts.dc;
  this.spi = opts.spi;
  this.rst = opts.rst;
  this.busy = opts.busy;
  this.delayPin = opts.delay;
}

UC8253.prototype.debug = (s)=>{print((new Date()).getTime().toFixed(3)+": "+s);}; //print;
  
UC8253.prototype.delay = function(ms) {
  digitalPulse(this.delayPin, 0, ms);
  digitalPulse(this.delayPin, 0, 0);
};
UC8253.prototype.cmd =  function(c, d) {
  this.dc.reset();
  this.spi.write(c, this.cs);
  if (d !== undefined) {
      this.dc.set();
      this.spi.write(d, this.cs);
  }
};

UC8253.prototype.send=function (c) {
  this.dc.reset();
  this.spi.send(c);
  this.dc.set();
  let val=this.spi.send([0]);
  this.debug(val.toString(2));
};

UC8253.prototype.data=function (d) {
  this.dc.set();
  this.spi.write(d, this.cs); 
};
UC8253.prototype.init = function () { 
  this.debug("reset");
  if(this.rst) {
    digitalPulse(this.rst, 0, [25]); 
    digitalPulse(this.rst, 0, 0);
  }
};
UC8253.prototype.wait = function() {
  while(!this.busy.read()) this.delay(50);
};
UC8253.prototype.round1 =function () {
  this.debug(JSON.stringify(this));
  this.debug("round1");
  this.cmd(0 ,[0xff,0x9]);  
  this.cmd(1, [3,0,0x3f,0x3f,0x3]);
  this.cmd(3, 0);
  this.cmd(6 ,[0x27,0x27,0x2f]);
  //this.cmd(4); //Wait for idle
};
UC8253.prototype.round2 =  function() {
  this.debug("round2");
  this.cmd(0x30 ,0x9); 
  this.cmd(0x60 ,0x22);
  this.cmd(0x82 ,0x0);
  this.cmd(0xe3 ,0x0);
  this.cmd(0x41 ,0x0);
  this.cmd(0x61 ,[0x80, 0x00, 0xfa]);
//  this.cmd(0x61 ,[Math.floor(this.width/256),this.width%256,Math.floor(this.height/256),this.height%256]);
  this.cmd(0x65 ,[0x0, 0x00, 0x00]);

  this.cmd(0x50, 0xb7);
  //this.wait();

};

UC8253.prototype.round3 =function() {
  // we modify these on the fly below, since the LUTs share most of the data
  let LUT1 = new Uint8Array([0x0,8,8,8,8, 1]); // loosen the balls
  let LUT2 = new Uint8Array([0x0,0x40,0x40,0x10,0x10,1]); // stretch them out
  let LUT3 = new Uint8Array([0, 0x8, 0x10, 0x8, 0x10, 5]); // fine tune
  let LUT4 = new Uint8Array([0, 0x40, 0, 0, 0, 1]); // discharge ITO

  // translates easier to read mnemonics into voltage levels for first byte of each sequence
  // each position of the letters corresponds to the 2-bit voltage representation (G=0, B=\b01, etc)
  function seq(str) {
    let Vstr = "GBWR";
    let Vval = 0;
    for(let i=0; i<4; i++) {
      Vval *= 4;
      Vval += Vstr.indexOf(str.charAt(i));
    }
    return (Vval);
  }
  // convenient for padding the end of the LUTs
  let Seven0s = new Uint8Array([0,0,0,0,0,0,0]);

  this.debug("round3");
  //this.cmd(0 ,[0x3f]); // Use LUTs from registers

//VCOM
  this.cmd(0x20);
  this.data(new Uint8Array([1,0xf,0xf,0xf,1,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

// W->W and B->W  0x60 == b01100000, so first 01, then 10 (flash)
  this.cmd(0x21);
  this.data(new Uint8Array([1,0x4f,0x8f,0xf,1,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

  this.cmd(0x24);
  this.data(new Uint8Array([1,0xf,0x8f,0x4f,1,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

// W->B, B->B 0x90 == b10010000, first 10, then 01 (flash)
  this.cmd(0x22);
  this.data(new Uint8Array([1,0xf,0x8f,0xf,1,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

  this.cmd(0x23);
  this.data(new Uint8Array([1,0xf,0x8f,0x4f,1,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
};

UC8253.prototype.sendQuickLUT =function(count) {
  // convenient for padding the end of the LUTs
  let Seven0s = new Uint8Array([0,0,0,0,0,0,0]);

  this.debug("quickLUT");
  //this.cmd(0 ,[0x3f]); // Use LUTs from registers

//VCOM
  this.cmd(0x20);
  this.data(new Uint8Array([1,0xf,1,0,0,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

// W->W and B->W  0x60 == b01100000, so first 01, then 10 (flash)
  this.cmd(0x21);
  this.data(new Uint8Array([1,0xf,1,0,0,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

  this.cmd(0x24);
  this.data(new Uint8Array([1,0xf,1,0,0,1,1]));
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

// W->B, B->B 0x90 == b10010000, first 10, then 01 (flash)
  this.cmd(0x22);
  if(count % 2) {
    this.data(new Uint8Array([1,0x8f,1,0,0,1,1]));
  } else {
    this.data(new Uint8Array([1,0x4f,1,0,0,1,1]));
  }
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);

  this.cmd(0x23);
  if(count % 2) {
    this.data(new Uint8Array([1,0x4f,1,0,0,1,1]));
  } else {
    this.data(new Uint8Array([1,0x8f,1,0,0,1,1]));
  }
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
  this.data(Seven0s);
};
UC8253.prototype.wake = function () {
  this.debug("wake");
  this.init();
  //this.wait();
  this.round1();
  //this.wait();
  this.round2(); 
  //this makes full refersh a bit faster;
  //this.cmd(0xe0, 2); this.cmd(0xe5, 0x6e);
};
UC8253.prototype.wake2= function() {
  this.debug("wake2");
  //this.init();
  this.cmd(0x50,0xd7);
};

UC8253.prototype.sleep = function() {
  this.debug("Sleep");
  this.cmd(0x17, 0xa5); // DEEP_SLEEP

};
UC8253.prototype.drawGfx = function(gfx, x0, y0, full) {  
  //if(full) this.wake();
  //else this.wake2();
  let cnt=0;
  x0 = (x0 % 8 == 0)? x0: (x0|7)+1;
  let x1 = x0 + gfx.getWidth();
  let y1 = y0 + gfx.getHeight();
/*
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
            */
  this.debug("BEGIN");
//  this.cmd(0x10, gfx.buffer);
  this.cmd(0x13, gfx.buffer);
  this.debug("BEND");

  //this.cmd(0x12);		 //DISPLAY REFRESH 		             
  //this.wait();
//  setTimeout(()=>{this.sleep();}, 5000);
};