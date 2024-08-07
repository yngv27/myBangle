
/* WATCH BEGINS */
/* 52832 stick
spi1.setup({sck: D19, mosi: D23, baud: 2000000});
DC = D22;
//CS = D16;
//BUSY=D27;
RST=D26;

//CS=D27;
//D16.reset();
*/


var spi1 = new SPI();
// 52832 stick
spi1.setup({sck: D19, mosi: D23, baud: 2000000});
DC = D22;
CS = D16;
BUSY=D27;
RST=D26;
//


function delay(ms) {
  let t = Math.floor(Date().getTime())+ms;
  while(t > Date().getTime()) {
    // something silly
    out3 = ' ';
  }
}
lut_full_mono = new Uint8Array(
[
    0x02, 0x02, 0x01, 0x11, 0x12, 0x12, 0x22, 0x22, 
    0x66, 0x69, 0x69, 0x59, 0x58, 0x99, 0x99, 0x88, 
    0x00, 0x00, 0x00, 0x00, 0xF8, 0xB4, 0x13, 0x51, 
    0x35, 0x51, 0x51, 0x19, 0x01, 0x00
]);


var g = Graphics.createArrayBuffer(200,200,1,{msb:true});
g.setRotation(2,1);
g.setColor(0).setBgColor(1);
g.clear();

function cmd(c, d) {
    DC.reset();
    spi1.write(c, CS);
    if (d !== undefined) {
        DC.set();
        spi1.write(d, CS);
    }
}

g.flip = function (partial) {
  cmd(0x10); //write B/W
  DC.set();
  var w = g.getWidth()>>3;
  for (var y=0;y<g.getHeight();y++) {
    spi1.write(new Uint8Array(g.buffer,y*w,w), CS);
  }
  digitalWrite(DC,0); // CS off
  cmd(0x13); 
  return g;
  
};


function init() { 
  if(RST) {
    //digitalPulse(RST, 0, [100,100]);
    RST.reset(); setTimeout(()=>{RST.set();},100);
  }
  //setTimeout(()=>{cmd(0x12);}, 200);
}

/*
function full(val) {
  cmd(0x24);
//while(BUSY.read()) delay(100);
  DC.set();
  for(let y=0; y< 200; y+= 2) {
    for(let x=0; x < 25; x+=2) {
      //let d = g.buffer[y*25+x];
      spi1.write(y*25 ,  CS);
    }
  }
}
*/
function update() {cmd(0x20);}

function waitUntilIdle() {
  //while(BUSY.read()) 
  delay(1999);
  print("not idle");
}

function sleep() { cmd(0x10, 1);}
init();


  lut_dc_4in2 = new Uint8Array( 
[
    0x00, 0x17, 0x00, 0x00, 0x00, 0x02, 0x00, 0x17, 0x17, 0x00, 0x00, 
    0x02, 0x00, 0x0A, 0x01, 0x00, 0x00, 0x01, 0x00, 0x0E, 0x0E, 0x00, 
    0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

//R21H
lut_ww_4in2 = new Uint8Array(
[
    0x40, 0x17, 0x00, 0x00, 0x00, 0x02, 0x90, 0x17, 0x17, 0x00, 0x00, 0x02, 0x40, 0x0A, 
    0x01, 0x00, 0x00, 0x01, 0xA0, 0x0E, 0x0E, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

//R22H    r
 lut_bw_4in2 =new Uint8Array(
[
    0x40, 0x17, 0x00, 0x00, 0x00, 0x02, 0x90, 0x17, 0x17, 0x00, 0x00, 0x02, 0x40, 0x0A, 
    0x01, 0x00, 0x00, 0x01, 0xA0, 0x0E, 0x0E, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

//R24H    b
lut_bb_4in2 =new Uint8Array(
  [
    0x80, 0x17, 0x00, 0x00, 0x00, 0x02, 0x90, 0x17, 0x17, 0x00, 0x00, 0x02, 0x80, 0x0A, 
    0x01, 0x00, 0x00, 0x01, 0x50, 0x0E, 0x0E, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

//R23H    w
lut_wb_4in2 =new Uint8Array(
[
    0x80, 0x17, 0x00, 0x00, 0x00, 0x02, 0x90, 0x17, 0x17, 0x00, 0x00, 0x02, 0x80, 0x0A, 
    0x01, 0x00, 0x00, 0x01, 0x50, 0x0E, 0x0E, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

cmd(0x01,//POWER_SETTING
[0x03,   // VDS_EN, VDG_EN
0x00,   // VCOM_HV, VGHL_LV[1], VGHL_LV[0]
0x2F,   // VDH
0x2F,   // VDL
0xFF]);   // VDHR

cmd(0x06, [0x17, 0x17, 0x17]);//BOOSTER_SOFT_START
cmd(0x04);//POWER_ON
//EPD_WaitUntilIdle();

cmd(0x00, [0xBF, 0x0B]);//PANEL_SETTING: // KW-BF   KWR-AF  BWROTP 0f
cmd(0x30, 0x3C);//PLL_CONTROL: 3A 100HZ, 29 150Hz, 39 200HZ, 31 171HZ

cmd(0x61,[ 1, 144, 1, 44]);// RESOLUTION_SETTING: HI(W), LO(W), HI(H), LO(H)  
cmd(0x82, 0x12);// VCM_DC_SETTING                   
cmd(0x50, 0x97);// VCOM_AND_DATA_INTERVAL_SETTING: VBDF 17|D7 VBDW 97  VBDB 57  VBDF F7  VBDW 77  VBDB 37  VBDR B7

cmd(0x20,lut_dc_4in2);// LUT_FOR_VCOM
cmd(0x21,lut_ww_4in2);// LUT_WHITE_TO_WHITE   
cmd(0x22,lut_bw_4in2);// LUT_BLACK_TO_WHITE
cmd(0x23,lut_wb_4in2);// LUT_WHITE_TO_BLACK
cmd(0x24,lut_bb_4in2);// LUT_BLACK_TO_BLACK
/*
cmd(0x10);//DATA_START_TRANSMISSION_1  
delay(2);
for(int i = 0; i < 400*300; i++)EPD_SendData(0xFF);//Red channel

EPD_SendCommand(0x13);//DATA_START_TRANSMISSION_2
*/
/*
cmd(0x01, [199, 0, 0]); //DRIVER_OUTPUT_CONTROL: LO(EPD_HEIGHT-1), HI(EPD_HEIGHT-1). GD = 0; SM = 0; 
cmd(0x0C, [0xD7, 0xD6, 0x9D]);//BOOSTER_SOFT_START_CONTROL
cmd(0x2C, 0xA8);//WRITE_VCOM_REGISTER: VCOM 7C
cmd(0x3A, 0x1A);//SET_DUMMY_LINE_PERIOD: 4 dummy lines per gate
cmd(0x3B, 0x08);//SET_GATE_TIME: 2us per line
cmd(0x11, 0x03);//DATA_ENTRY_MODE_SETTING: X increment; Y increment

cmd(0x32, lut_full_mono);

cmd(0x44, [0, 24]);//SET_RAM_X_ADDRESS_START_END_POSITION: LO(x >> 3), LO((w-1) >> 3)
cmd(0x45, [0, 0, 200, 0]);//SET_RAM_Y_ADDRESS_START_END_POSITION: LO(y), HI(y), LO(h - 1), HI(h - 1)
cmd(0x4E, 0);//LO(x >> 3)
cmd(0x4F, [0, 0]);//LO(y), HI(y >> 8)

cmd(0x24);//WRITE_RAM
*/

_S = require("Storage");

init();
g.setBgColor(1).setColor(0);
g.clear();
setTimeout(g.flip, 500);

let drawClock = (d) => {
  g.setBgColor(1).setColor(0);
  g.clear();//.fillRect(0,138,143, 149);
  let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
  let minAngle = d.min / 30 * Math.PI;

  g.drawImage(_S.read("minute.png"), 100, 70, { rotate: minAngle, scale: 0.5625 });
  g.drawImage(_S.read("hour.png"), 100, 70, { rotate: hrAngle, scale: 0.5625 });
  //g.setColor("#FFFFFF").fillCircle(72, 70, 5);
  g.fillCircle(100, 70, 3);
  g.drawCircle(100,70,70);
  g.drawString(`The time is ${d.hr}:${d.min}`, 100, 152);
  g.flip();
};
/*
setInterval(()=> {
  let d = Date();
  drawClock({hr: d.getHours(), min: d.getMinutes()});
}, 150000);

*/


