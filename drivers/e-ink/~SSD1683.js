// SSD1683 for WeAct 4.2"
let exports = {};

let spi1=new SPI();
/* Dk832
spi1.setup({sck: D23, mosi: D22, baud: 2000000});
let CS=D24, RST=D26, BUSY=D0, DC=D25, DELAY=D31;
*/
// ProMicro
spi1.setup({sck: D45, mosi: D47, baud: 2000000});
let CS=D43, RST=D9, BUSY=D2, DC=D10, DELAY=D31;

opts={
  spi: spi1,
  cs: CS,
  rst: RST,
  dc: DC,
  busy: BUSY,
  width: 400,
  height: 300,
  delay: DELAY,
};

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
  let _writeCommand = cmd;
  let _writeData = data;
  
function round1() {
  logD("round1");
  let eink_x = Math.floor((opts.width - 1) / 8);
  let eink_y = (opts.height - 1);

  _writeCommand(0x12);//Software reset
  //_waitWhileBusy();
  delay(500);

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
  _writeData(eink_y);
  _writeData((eink_y >> 8));
  _writeData(0x00);

  _writeCommand(0x11);//Data Entry mode setting
  _writeData(0x01);

  _writeCommand(0x44);//Set RAM X - address Start/End position
  _writeData(0x00);//RAM X Start
  _writeData(eink_x);//RAM X End

  _writeCommand(0x45);//Set RAM Y - address Start/End position
  _writeData(eink_y);//RAM Y Start
  _writeData((eink_y >> 8));//RAM Y Start
  _writeData(0x00);//RAM Y End
  _writeData(0x00);//RAM Y End

  _writeCommand(0x3C);//Border Waveform Control
  _writeData(0);//0 = black,1 = white,2 = Red

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
  _writeCommand(0x4F);//Set RAM Y address counter
  _writeData(eink_y);
  _writeData((eink_y >> 8));

  _writeCommand(0x24);//WRITE RAM BW

  for (let i = 0; i < (opts.width * opts.height / 8); i++)
  {
    _writeData(0x00);
  }
  _writeCommand(0x4E);//Set RAM X address counter
  _writeData(0x00);
  _writeCommand(0x4F);//Set RAM Y address counter
  _writeData(eink_y);
  _writeData((eink_y >> 8));

  _writeCommand(0x26);//Write RAM RED

  for (let i = 0; i < (opts.width * opts.height / 8); i++)
  {
    _writeData(0x00);
  }
}  
