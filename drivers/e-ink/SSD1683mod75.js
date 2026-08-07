// SSD1683 for WeAct 4.2"
let exports = {};
/*
let spi1=new SPI();

spi1.setup({sck: D29, mosi: D31, baud: 200000});

let opts = {spi: spi1, cs: D2, dc: D43, rst: D10, busy: D9, delay: D12,
  //width: 200, height: 200}; 
  width: 880, height: 528};
  */
var spi1 = new SPI();
spi1.setup({sck: D29, mosi: D31, baud: 400000});

let opts = {spi: spi1, cs: D2, dc: D47, rst: D45, busy: D43, delay:D12,
  //width: 200, height: 200}; 
  width: 880, height: 528};

let logD = print; //()=>{}; //print;

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
function init() { 
  logD("reset");
  if(opts.rst) 
    digitalPulse(opts.rst, 0, [50]);
}
let out = '';
let _writeCommand = function(c) {
  print(out);
  out = `cmd ${c.toString(16)} :`;
  cmd(c);
};
let _writeData = function(d) {
  out += `${d.toString(16)},`;
  data(d);
};
  
function round1() {
  logD("round1");
  let eink_x = Math.floor((opts.width - 1) / 1);
  let eink_y = (opts.height - 1);

  _writeCommand(0x12);//Software reset
  //_waitWhileBusy();
  delay(200);

  _writeCommand(0x74);//Set Analog Block Control
  _writeData(0x54);

  _writeCommand(0x7E);//Set Digital Block Control
  _writeData(0x3B);

  _writeCommand(0x2B);//ACVCOM setting
  _writeData(0x04);
  _writeData(0x63);

  _writeCommand(0x0C); // Softstart Control
  _writeData(0x8F);
  _writeData(0x8F);
  _writeData(0x8F);
  _writeData(0x3F);

  _writeCommand(0x01);//Driver Output control
  _writeData(eink_y % 256);
  _writeData((eink_y >> 8));
  _writeData(0x00);

  _writeCommand(0x11);//Data Entry mode setting
  _writeData(0x01);

  _writeCommand(0x44);//Set RAM X - address Start/End position
  _writeData(0x00);//RAM X Start
  _writeData(0x00);//RAM X Start
  _writeData(eink_x % 256);//RAM X End
  _writeData(eink_x >> 8);//RAM X End

  _writeCommand(0x45);//Set RAM Y - address Start/End position
  _writeData(eink_y % 256);//RAM Y Start
  _writeData((eink_y >> 8));//RAM Y Start
  _writeData(0x00);//RAM Y End
  _writeData(0x00);//RAM Y End

  _writeCommand(0x3C);//Border Waveform Control
  _writeData(1);//0 = black,1 = white,2 = Red

  _writeCommand(0x18);// Temperature sensor control
  _writeData(0x80);// 0x48 = External,0x80 = Internal

  _writeCommand(0x21);//Display Update Control 1
  _writeData(0x8);//inverse or ignore ram content

  _writeCommand(0x22);//Display Update Control 2
  _writeData(0xB1);

  _writeCommand(0x20);//Master Activation
  }

function clearDisplay() {
  let eink_x = ((opts.width - 1) / 8);
  let eink_y = (opts.height - 1);

  _writeCommand(0x4E);//Set RAM X address counter
  _writeData(0x00);
  _writeData(0x00);
  _writeCommand(0x4F);//Set RAM Y address counter
  _writeData(eink_y % 256);
  _writeData((eink_y >> 8));

  cmd(0x24, {data:0 , count: eink_x * eink_y});
/*  
  _writeCommand(0x4E);//Set RAM X address counter
  _writeData(0x00);
  _writeData(0x00);
  _writeCommand(0x4F);//Set RAM Y address counter
  _writeData(eink_y % 256);
  _writeData((eink_y >> 8));
*/
  cmd(0x26, {data:0 , count: eink_x * eink_y});
  
  _writeCommand(0x22);
  _writeData(0xc7);
  _writeCommand(0x20);
}  

setTimeout(()=>{
init();
round1();
clearDisplay();
}, 2000);

