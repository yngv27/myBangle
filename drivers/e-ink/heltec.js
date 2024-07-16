
var spi1 = new SPI();
spi1.setup({sck: D19, mosi: D23, baud: 2000000});
DC = D22;
//CS = D16; // tied to GND, always "selected" -- save a pin
//BUSY=D27; // we use timings... save another pin
RST=D26; // using this pin for power! reset 'reboots' it

//CS=D27;
//D16.reset();
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

function delay(ms) {
  let t = Math.floor(Date().getTime())+ms;
  while(t > Date().getTime()) {
    // something silly
    out3 = ' ';
  }
}


var g = Graphics.createArrayBuffer(200,200,1,{msb:true});
g.setRotation(2,1);
//var g = Graphics.createArrayBuffer(128,250,1,{msb:true});
//g.setRotation(0,1);

g.setColor(0).setBgColor(1);
g.clear();

function cmd(c, d) {
    DC.reset();
    spi1.write(c);//, CS);
    if (d !== undefined) {
        DC.set();
        spi1.write(d);//, CS);
    }
}

g.flip = function (partial) {
  cmd(0x24); //write B/W
  DC.set();
  var w = g.getWidth()>>3;
  for (var y=0;y<g.getHeight();y++) {
    spi1.write(new Uint8Array(g.buffer,y*w,w));//, CS);
  }
  digitalWrite(DC,0); // CS off
  if(partial) cmd(0x22, 0xCF); 
  cmd(0x20); 
  return g;
  
};
g.flipR = function (partial) {
  cmd(0x26); //write RED
  DC.set();
  var w = g.getWidth()>>3;
  for (var y=0;y<g.getHeight();y++) {
    //for( var x=0; x < g.getWidth()>>3; x++)
    spi1.write(new Uint8Array(g.buffer,y*w,w));//, CS);
  }
  digitalWrite(DC,0); // CS off
  if(partial) cmd(0x22, 0xCF); 
  cmd(0x20); 
  return g;
  
};


function init() { 
  if(RST) {
    //digitalPulse(RST, 0, [100,100]);
    RST.reset(); setTimeout(()=>{RST.set();},100);
  }
  setTimeout(()=>{cmd(0x12);}, 200);
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


function partialpartial()
{
	init();
	waitUntilIdle();
	loadLUT();//外加局刷波形
  //waitUntilIdle();
  cmd(0x37, [0,0,0,0,0,0x40,0,0,0,0]);
  //waitUntilIdle();
  cmd(0x3C, 0x80);  //  border设定
}

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
}
a = () => {init();};
b= () => {loadLUT1();};
c= () => {loadLUT2(); cmd(0x37, [0,0,0,0,0,0x40,0,0,0,0]); cmd(0x3C, 0x80);};

function partial() {
  let to = 0;
  setTimeout(init, to); to+=200;
  setTimeout(loadLUT1, to); to+=500;
  setTimeout(c, to); to+=20;
  setTimeout(()=>{g.flip(true);}, to);
}

function HalLcd_Partial_Update()
{
  cmd(0x22, 0xCF);    // 外加局刷， 非OTP调用
  cmd(0x20); 
  waitUntilIdle(); 	
}

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
  g.flip(true);
};
/*
setInterval(()=> {
  let d = Date();
  drawClock({hr: d.getHours(), min: d.getMinutes()});
}, 60000);

*/
var font = atob("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");
var widths = atob("AwIEBgYIBwIEBAYGAwYCBgYGBgYHBgYGBgYCAwUGBQYIBwcHBwcGBwcEBgcGBwcHBgcHBwgHBwgHCAcEBgQGCAMGBgYGBgYGBgMFBgMIBgYGBgYGBgYGCAYGBgYCBggABwADBgQGBgYGBwcECAAHAAADAwUFBgYIBQgGBAgABggAAgYGCAgCBgQIBQYFAAgIBQYFBQMIBwQDBAUGBwcIBgcHBwcHBwgHBgYGBgQEBAQIBwcHBwcHBgcHBwcHCAYIBgYGBgYGCAYGBgYGAwMEBAYGBgYGBgYGBgYGBgYGBgY=");

g.setFontAlign(0,-1);
g.setFontCustom(font, 32, widths, (256<<0)+13);

/*
g.clear().drawString("Just need a", 120, 10).drawString("To end the day", 120, 110);
//g.setFontCustom(font, 32, widths, 512+13);
g.setFontCustom(font, 32, widths, (256<<1)+13);

g.drawString("LITTLE", 120, 40).drawString("SUCCESS", 120, 60).flip();

*/

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
