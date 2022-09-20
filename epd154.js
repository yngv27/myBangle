let DC=D31, SDI=D30, CS=D28, CLK=D27, BUSY=D25;
let HEIGHT = 200, WIDTH=200;

CS.set();
CLK.reset();
BUSY.mode("input");

function delayms(ms) {
  let t = Math.floor(Date().getTime())+ms;
  while(t > Date().getTime()) {
    // something silly
    out3 = ' ';
  }
}

SPI1.setup({
  sck:CLK, 
  mosi:SDI, 
  baud:integer=100000, // ignored on software SPI
  mode:integer=0, // between 0 and 3
});


function sendCmd(c) {
  CS.reset();
  DC.reset();
  SPI1.write(c);
  CS.set();
  print(`sendCmd(${c})`);
}

function sendData(c) {
  CS.reset();
  DC.set();
  SPI1.write(c);
  CS.set();
}

function reset() {
  sendCmd(0x2);
  delayms(100);
  sendCmd(0x4);
  delayms(100);
}

function setWindow(x0, y0, x1, y1) {
  sendCmd(0x44);
  sendData((x0 >> 3) & 0xff);
  sendData((x1 >> 3) & 0xff);
  
  sendCmd(0x45);
  sendData(y0 & 0xff);
  sendData((y0 >> 8) & 0xff);
  sendData(y1 & 0xff);
  sendData((y1 >> 8) & 0xff);
  
}

function setCursor(x0, y0) {
  sendCmd(0x4E);
  sendData((x0 >> 3) & 0xff);
  
  sendCmd(0x4F);
  sendData(y0 & 0xff);
  sendData((y0 >> 8) & 0xff);  
}


function dispOn() {
  sendCmd(0x22);
  sendData(0xc4);
  sendCmd(0x20);
  sendCmd(0xFF);
}

let sc=sendCmd;
let sd=sendData;
let LUT_FULL = new Uint8Array(
  [0x02, 0x02, 0x01, 0x11, 0x12, 0x12, 0x22, 0x22,
   0x66, 0x69, 0x69, 0x59, 0x58, 0x99, 0x99, 0x88,
   0x00, 0x00, 0x00, 0x00, 0xF8, 0xB4, 0x13, 0x51,
   0x35, 0x51, 0x51, 0x19, 0x01, 0x00
   ]);

function init() {
  // RESET
  sc(0x1);
  sd((HEIGHT-1) & 0xff);
  sd(((HEIGHT-1) >> 8) & 0xff);
  sd(0);
  sc(0xC);  sd(0xD7);  sd(0xD6); sd(0x9d);
  sc(0x2c); sd(0xa8);
  sc(0x3a); sd(0x1a);
  sc(0x3b); sd(0x08);
  sc(0x11); sd(0x3);
  // LUTs
  sc(0x32);
  // FULL
  for(let i=0; i<LUT_FULL.length; i++) 
    sd(LUT_FULL[i]);

}

function clear() {
  let W = (WIDTH % 8 == 0) ? (WIDTH / 8) : (WIDTH / 8 + 1);
  let H = HEIGHT;
  setWindow(0,0, WIDTH, HEIGHT);
  for(let y=0; y < H; y++) {
    setCursor(0, y);
    sendCmd(0x24);
    for(let x=0; x < W; x++) {
      sendData(0xff);
    }
  }
  dispOn();
}
