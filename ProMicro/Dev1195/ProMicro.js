// * SSD1306 on 1195 (OLED + 4 buttons)

var i2c1 = new I2C();
i2c1.setup({scl:D20, sda:D22, bitrate:100000});
//pinMode(D20, "input_pullup");
//D20.set();
//*/
require("omnigo2.js").add(Graphics);

function test(){
 // write some text
  g.setFont("Omnigo",1);
  g.setFontAlign(-1,-1);
  g.clear();
  let dt=(new Date()).toString().substring(16,24);
  g.drawString(dt,0,0);
  g.drawLine(0,15,127,15);
  g.drawString("Welcome to Espurino\nDev Kit 1195",0,18);
  // write to the screen
  g.flip(); 
  setTimeout(()=>{g.off();}, 7*1000);
}
//setWatch(go, D36, {edge:"falling",repeat: true});

//I2C1.setup({scl:D45, sda:D43, bitrate:100000});
var g = require("SSD1306").connect(i2c1, test, { address: 0x3C });
g.setFont("Omnigo",2);
g.setFontAlign(0,0);

const BTNA=D36;
const BTNB=D11;
const BTNC=D32;
const BTND=D24;

