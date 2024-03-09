exports.connect = (spi1, opts) => {

  let lut_full_mono = new Uint8Array(
  [
    0x50, 0xAA, 0x55, 0xAA, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x1F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  let lut_partial = new Uint8Array(
  [
    0x10, 0x18, 0x18, 0x08, 0x18, 0x18, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x13, 0x14, 0x44, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);

  function cmd(c, d) {
      opts.dc.reset();
      spi1.write(c, opts.cs);
      if (d !== undefined) {
          opts.dc.set();
          spi1.write(d, opts.cs);
      }
  }
  
  var g = Graphics.createArrayBuffer(opts.width, opts.height ,1,{msb:true});

  g.flip = function (partial) {
    //setRefreshArea();
    cmd(0x24); //write B/W
    opts.dc.set();
    /*
    var w = g.getWidth()>>3;
    for (var y=0;y<g.getHeight();y++) {
      spi1.write(new Uint8Array(g.buffer,y*w,w), opts.cs);
    }
    digitalWrite(opts.dc,0); 
    */
    spi1.write(new Uint8Array(g.buffer), opts.cs);
    cmd(0x22, 0xc4);
    cmd(0x20);
    cmd(0xff);
    setTimeout(powerOff, 150);
    return g;
  };

  function update() {cmd(0x20);}
  function sleep() { cmd(0x10, 1);}

  function setRefreshArea() {
    let a={ x1:0, y1:0, x2:199, y2:199};
    if(g) g.getModified(true);
    // not "true" widths/heights: one less is what we use
    a.w=a.x2-a.x1; a.h=a.y2-a.y1;
    print(`mod area: ${JSON.stringify(a)}`);
    cmd(0x44, [(a.x1 >> 3), (a.w >> 3)]);//SET_RAM_X_ADDRESS_START_END_POSITION: LO(x >> 3), LO((w-1) >> 3)
    // cheat: we're less than 256
    cmd(0x45, [a.y1, 0, a.h, 0]);//SET_RAM_Y_ADDRESS_START_END_POSITION: LO(y), HI(y), LO(h - 1), HI(h - 1)
    cmd(0x4E, (a.x1 >> 3));//LO(x >> 3)
    cmd(0x4F, [a.y1, 0]);//LO(y), HI(y >> 8)
/*
    cmd(0x44, [0, 24]);//SET_RAM_X_ADDRESS_START_END_POSITION: LO(x >> 3), LO((w-1) >> 3)
    cmd(0x45, [0, 0, 199, 0]);//SET_RAM_Y_ADDRESS_START_END_POSITION: LO(y), HI(y), LO(h - 1), HI(h - 1)
    cmd(0x4E, 0);//LO(x >> 3)
    cmd(0x4F, [0, 0]);//LO(y), HI(y >> 8)
*/
  }

  function powerOn() { cmd(0x22); cmd(0xc0); cmd(0x20); }
  function powerOff() { cmd(0x22); cmd(0xc3); cmd(0x20); }
  
  function init() {
    opts.rst.reset(); 
    setTimeout(()=>{opts.rst.set();},200);
    setTimeout(() => {

    cmd(0x01, [199, 0, 0]); //DRIVER_OUTPUT_CONTROL: LO(EPD_HEIGHT-1), HI(EPD_HEIGHT-1). GD = 0; SM = 0; 
    cmd(0x0C, [0xD7, 0xD6, 0x9D]);//BOOSTER_SOFT_START_CONTROL
    cmd(0x2C, 0x9B); //A8);//WRITE_VCOM_REGISTER: VCOM 7C
    cmd(0x3A, 0x1A);//SET_DUMMY_LINE_PERIOD: 4 dummy lines per gate
    cmd(0x3B, 0x08);//SET_GATE_TIME: 2us per line
    cmd(0x11, 0x03);//DATA_ENTRY_MODE_SETTING: X increment; Y increment

    cmd(0x32, lut_full_mono);

    setRefreshArea();
    }, 400);
  }
  
  init();
  g.cmd = cmd;
  g.reset = init;
  g.powerOff = powerOff;
  g.powerOn = powerOn;
  return g;
  
}; // end module

/* USAGE:
var spi1 = new SPI();
spi1.setup({sck: D18, mosi: D19, baud: 2000000});
opts = {
  cs: D9, //dummy
  dc: D28,
  rst: D11,
};
g=exports.connect(spi1, opts);
*/