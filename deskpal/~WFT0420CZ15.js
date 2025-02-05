
let exports = {};

/*
** THANKS:
** github.com/jfm92/e-Paper42lib
*/

exports.connect = (opts) => {
  var g = {}; //Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  
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
  function send(c) {
    opts.dc.reset();
    opts.spi.send(c);
    opts.dc.set();
    let val=opts.spi.send([0]);
    print(val.toString(2));
  }
  function data(d) {
    opts.dc.set();
    opts.spi.write(d, opts.cs); 
  }
  function reset() { 
    debug("reset");
    if(opts.rst) 
      digitalPulse(opts.rst, 0, [50]);
  }
  function isIdle() {
    cmd(0x71);
    return(opts.busy.read());
  }
  function round1() {
    debug("round1");
    cmd(1 ,[3,0,0x2f,0x2f,0]); // trying low power for R pixel : 0xff]);
    cmd(6 ,[0x17,0x17,0x17]);
    cmd(4); //Wait for idle
  }
  function round2() {
    let LUT = new Uint8Array([0,0x8,0,0,0,2, 0,0x8,0x8,0,0,2, 0,0xa,1,0,0,1, 0,0xe,0xe,0,0,2, 0,0,0,0,0,0]);
    debug("round2");
    cmd(0 ,0x3f); //[0xf,0xd]); //0xb]);
    cmd(0x30 ,[0x3c]);
    cmd(0x61 ,[1,0x90,1,0x2c]);
    cmd(0x82 ,[0x28]);  //0x12]);
    cmd(0x50 ,[0x97]);
    //* pure evil...
    //LUT[5]=8; LUT[11]=8; LUT[17]=8; LUT[23]=8;
    //LUT[0]=0; LUT[6]=0; LUT[12]=0; LUT[18]=0;
    
    cmd(0x20 ,LUT);
    data([0,0]);
    //[0x40,0x17,0,0,0,2, 0x90,0x17,0x17,0,0,2, 0x40,0xa,1,0,0,1, 0xa0,0xe,0xe,0,0,2, 0,0,0,0,0,0,0,0]);
    LUT[0]=0x40; LUT[6]=0x90; LUT[12]=0x40; LUT[18]=0xa0;
    cmd(0x21 ,LUT); 
    cmd(0x22 ,LUT); 
    //[0x80,0x17,0,0,0,2, 0x90,0x17,0x17,0,0,2, 0x80,0xa,1,0,0,1, 0x50,0xe,0xe,0,0,2, 0,0,0,0,0,0,0,0]);
    LUT[0]=0x80; LUT[6]=0x90; LUT[12]=0x80; LUT[18]=0x50;
    cmd(0x23 ,LUT); 
    cmd(0x24 ,LUT);
    //*/
  }

  /* quick version: does a flashy thing for fun (LUT) then the fast update (LUT2)
  */
  function round2q() {
    // we modify these on the fly below, since the LUTs share most of the data
    let LUT = new Uint8Array([0x0,0x4,0x4,0,0,4]);
    let LUT2 = new Uint8Array([0x0,0xa,0,0,0,5]);
    let Ateen0s = new Uint8Array([0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0]);

    debug("round2");
    cmd(0 ,[0xbf,0xd]); //0xb]);
    cmd(0x30 ,[0x3c]);
    cmd(0x61 ,[1,0x90,1,0x2c]);
    cmd(0x82 ,[0x28]);  //0x12]);
    cmd(0x50 ,[0x97]);
    //VCOM
    LUT[0]=0x0;
    LUT2[0]=0x0; 
    cmd(0x20 ,LUT);
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    data([0,0]);
    // W->W and W->B  0x60 == b01100000, so first 01, then 10 (flash)
    LUT[0]=0x60; //a0;
    LUT2[0]=0xa0; 
    cmd(0x21 ,LUT); 
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    cmd(0x22 ,LUT); 
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    // B->W, B->B 0x90 == b10010000, first 10, then 10 (flash)
    LUT[0]=0x90; //50;
    LUT2[0]=0x50; 
    cmd(0x23 ,LUT); 
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    cmd(0x24 ,LUT);
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
  }
  // full refresh, slow but thorough
  function wake() {
    debug("wake");
    reset();
    setTimeout(round1, 100);
    setTimeout(()=>{round2(); }, 200);
  }
  // fast refresh, but *some* ghosting
  function wake2() {
    debug("wake2");
    reset();
    setTimeout(round1, 100);
    setTimeout(()=>{round2q();}, 200);
  }

  function sleep() {
    debug("Sleep");
    cmd(0x02); // POWER_OFF
    delay(100);
    cmd(0x07, 0xa5); // DEEP_SLEEP
    //j fix this to the object!
    //setTimeout(()=>{
    g.emit("free");
    //}, 100);
  }

  g.flip = function (addr) {
    g.update(0,0,g);
  };
  
  g.update = (x0, y0, gfx, full) => {
    if(g.busy) return;
    g.busy = true;
    if(full) wake(); else wake2();
    setTimeout(()=>{
      x0 = (x0 % 8 == 0)? x0: (x0|7)+1;
      let x1 = x0 + gfx.getWidth();
      let y1 = y0 + gfx.getHeight();
      //print(`XS: ${x0}; Xe: ${x1}`);

      cmd(0x91);		//This command makes the display enter partial mode
      cmd(0x90,	[x0 / 256, 
                (x0) % 256,   //x-start    
                (x1 )/256,		
                (x1 )%256-1,  //x-end
                (y0 / 256),
                (y0 % 256),   //y-start    
                (y1/256),		
                (y1%256-1),  //y-end
                0x28]); // scan the whole line, prevent shadowing?	

      cmd(0x10, gfx.buffer);
      cmd(0x13, gfx.buffer);
      cmd(0x12);		 //DISPLAY REFRESH
      delay(100);
      cmd(0x92);
      setWatch(()=>{g.busy=false; sleep();} ,opts.busy, {edge: "rising"});
    }, 300);
  };
  g.cls = (c) => {
    if(g.busy) return;
    g.busy = true;
    if(typeof(c) === "undefined") c=-1;
    wake(); // full
    setTimeout(()=>{
      let buf = new Uint8Array(opts.width>>3);
      for(let x=0; x<buf.length; x++) buf[x] = c;
      cmd(0x10); //write old
      opts.dc.set();
      for (let y=0;y<opts.height;y++) {
        opts.spi.write(buf, opts.cs);
      }
      cmd(0x13); //write NEW
      opts.dc.set();
      for (let y=0;y<opts.height;y++) {
        opts.spi.write(buf, opts.cs);
      }
      cmd(0x12);
      setWatch(()=>{g.busy=false; sleep();} ,opts.busy, {edge: "rising"});   
    }, 300);
  };
  
  g.wake=wake;
  g.delay=delay;
  g.round1=round1;
  g.round2=round2;
  g.init=reset;
  g.cmd=cmd;
  return g;
};
