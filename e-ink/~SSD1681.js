/* 
waste of space
*/
exports.connect = function(opts, callback) {
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

  g.partial = false;
  
  function cmd(c, d) {
      opts.dc.reset();
      opts.spi.write(c);//, CS);
      if (d !== undefined) {
          opts.dc.set();
          opts.spi.write(d);//, CS);
      }
  }
  function init() { 
    if(opts.rst) {
      //digitalPulse(RST, 0, [100,100]);
      opts.rst.reset(); setTimeout(()=>{opts.rst.set();},100);
    }
    setTimeout(()=>{cmd(0x12);}, 200);
    g.partial = false;
  }
    /*
  function oldpartial()
  {
    init();
    waitUntilIdle();
    loadLUT();//外加局刷波形
    //waitUntilIdle();
    cmd(0x37, [0,0,0,0,0,0x40,0,0,0,0]);
    //waitUntilIdle();
    cmd(0x3C, 0x80);  //  border设定
  }
  */

  function loadLUT1()
  {
    //Epaper_LUT((unsigned char*)wave_data);      // 送入波形   give the waveform
    cmd(0x32, WF_PARTIAL.slice(0,153));
    //for(let count=0;count<153;count++) SendData(*wave_data++); 
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
  a = () => {init();};
  b= () => {loadLUT1();};
  c= () => {loadLUT2(); };

  function partial1() {
    let to = 0;
    setTimeout(init, to); to+=200;
    setTimeout(loadLUT1, to); to+=500;
    setTimeout(c, to); to+=20;
    setTimeout(()=>{g.flip();}, to);
    g.partial = true;
  }
  function partial2() {
    let to = 0;
    setTimeout(init, to); to+=500;
    setTimeout(loadLUT1, to); to+=900;
    setTimeout(c, to); to+=200;
    setTimeout(()=>{g.flip();}, to);
    g.partial = true;
  }
  g.setPartial = function () {
    let to = 0;
    setTimeout(init, to); to+=delays[0];
    setTimeout(loadLUT1, to); to+=delays[0];
    setTimeout(c, to); to+=delays[0];
    setTimeout(()=>{ g.partial = true; g.flip();}, to);
  }
  g.flip = function () {
    cmd(0x24); //write B/W
    opts.dc.set();
    // why loop?
    /*
    var w = g.getWidth()>>3;
    for (var y=0;y<g.getHeight();y++) {
      spi1.write(new Uint8Array(g.buffer,y*w,w));//, opts.CS);
    }
    digitalWrite(DC,0); // CS off
    */
    opts.spi.write(new Uint8Array(g.buffer));
    if(g.partial) cmd(0x22, 0xCF); 
    cmd(0x20); // update
    return g;

  };
  g.flipR = function (partial) {
    cmd(0x26); //write RED
    opts.dc.set();
    var w = g.getWidth()>>3;
    for (var y=0;y<g.getHeight();y++) {
      //for( var x=0; x < g.getWidth()>>3; x++)
      opts.spi.write(new Uint8Array(g.buffer,y*w,w));//, opts.cs);
    }
    opts.dc.reset(); 
    if(g.partial) cmd(0x22, 0xCF); 
    cmd(0x20); 
    return g;

  };
  g.reset = init;

  function sleep() { cmd(0x10, 1);}
  init();
  if(callback) setTimeout(callback, 250);
  return g;
};

/*
const WIDTH=200, HEIGHT=200;
const LUTDefault_full = new Uint8Array(
[
  // 0x32,  // command
  0x50, 0xAA, 0x55, 0xAA, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x1F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);
_power_is_on = false;
function PowerOn()
{
  if (!_power_is_on)
  {
    cmd(0x22, 0xc0);
    cmd(0x20);
    _waitWhileBusy("_PowerOn", power_on_time);
  }
  _power_is_on = true;
}

function setPartialRamArea( x,  y,  w,  h)
{
  cmd(0x11, 0x03);    // x increase, y increase : normal mode
  cmd(0x44,[x / 8,(x + w - 1) / 8]);
  cmd(0x45,[y % 256, y / 256,(y + h - 1) % 256,(y + h - 1) / 256]);
  cmd(0x4e,x / 8);
  cmd(0x4f, [y % 256, y / 256]);
}
function Init_full() 
  {
  if (_hibernating) _reset();
  cmd(0x01, [ // Panel configuration, Gate selection
  (HEIGHT - 1) % 256,
  (HEIGHT - 1) / 256,
  0x00]);
  cmd(0x0c,[0xd7,0xd6,0x9d]);
  cmd(0x2c,0x9b);
  cmd(0x3a,0x1a);    // 4 dummy line per gate
  cmd(0x3b,0x08);    // 2us per line
  _setPartialRamArea(0, 0, WIDTH, HEIGHT);
    
   // write_LUT();
    cmd(0x32, LUTDefault_full);
    
    PowerOn();
    
}

function Update_Full()
{
  cmd(0x22,0xc4);
  cmd(0x20);
  delay(500); //_waitWhileBusy("_Update_Full", full_refresh_time);
  cmd(0xff);
}
*/
