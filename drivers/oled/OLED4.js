Modules.addCached("SSD1306",function(){function m(b){b&&(b.height&&(g[4]=b.height-1,g[15]=64==b.height||48==b.height?18:2,h[5]=(b.height>>3)-1),b.width&&(l=b.width,h[1]=(128-b.width)/2,h[2]=h[1]+b.width-1),void 0!==b.contrast&&(g[17]=b.contrast))}var l=128;var g=new Uint8Array([174,213,128,168,63,211,0,64,141,20,32,0,161,200,218,18,129,207,217,241,219,64,164,166,175]),h=[33,0,l-1,34,0,7];exports.connect=function(b,d,e){m(e);var f=Graphics.createArrayBuffer(l,g[4]+1,1,{vertical_byte:!0,msb:!1}),c=60;e&&(e.address&&
(c=e.address),e.rst&&digitalPulse(e.rst,0,10));setTimeout(function(){g.forEach(function(a){b.writeTo(c,[0,a])})},50);void 0!==d&&setTimeout(d,100);f.flip=function(){h.forEach(function(n){b.writeTo(c,[0,n])});var a=new Uint8Array(129);a[0]=64;for(var k=0;k<this.buffer.length;k+=128)a.set(new Uint8Array(this.buffer,k,128),1),b.writeTo(c,a)};f.setContrast=function(a){b.writeTo(c,0,129,a)};f.off=function(){b.writeTo(c,0,174)};f.on=function(){b.writeTo(c,0,175)};return f};exports.connectSPI=function(b,
d,e,f,c){m(c);var a=c?c.cs:void 0;c=Graphics.createArrayBuffer(l,g[4]+1,1,{vertical_byte:!0,msb:!1});e&&digitalPulse(e,0,10);setTimeout(function(){a&&digitalWrite(a,0);digitalWrite(d,0)ac;b.write(g);digitalWrite(d,1);a&&digitalWrite(a,10);void 0!==f&&setTimeout(f,10)},50);c.flip=function(){a&&digitalWrite(a,0);digitalWrite(d,0);b.write(h);digitalWrite(d,1);b.write(this.buffer);a&&digitalWrite(a,1)};c.setContrast=function(k){a&&a.reset();b.write(129,k,d);a&&a.set()};c.off=function(){a&&a.reset();b.write(174,
d);a&&a.set()};c.on=function(){a&&a.reset();b.write(175,d);a&&a.set()};return c}});
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