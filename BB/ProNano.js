Modules.addCached("ST7565",function(){exports.connect=function(b,h){if("object"!==typeof b)throw"Expecting an object as first arg";var g=b.width||128,e=Graphics.createArrayBuffer(g,64,1,{vertical_byte:!0,msb:!1}),c=b.spi,d=b.cs,f=b.dc;d.reset();void 0!==b.rst&&b.rst.reset();setTimeout(function(){void 0!==b.rst&&b.rst.set();c.write([163,160,200,64,47,34,175,129,31],f);h&&h(e)},100);e.setContrast=function(a,k){0>a&&(a=0);1<a&&(a=1);d.reset();c.write([129,0|63*a],f);void 0!==k&&c.write(32|k,f);d.set()};e.flip=function(){d.reset();
for(var a=0;8>a;a++)c.write([176|a,0,16],f),c.write(new Uint8Array(this.buffer,g*a,g));d.set()};return e}});
// PROMICRO 9847

let spi1 = new SPI();
spi1.setup({sck: D30, mosi: D31});
opts = {
  cs: D40,
  dc: D33,
  lite: D29,
  rst: D34,
  spi: spi1,
 
};
var g=require("ST7565").connect(opts, function() {
  g.motd = "GREETINGS FROM ONTARIO";
  g.setContrast(0.8);
  g.drawString(g.motd).flip();
});

const BTN2 = D11;
pinMode(BTN2, "input_pullup");
setWatch(()=>{print("BTN");}, BTN2, {repeat: true, edge: "falling", debounce: 25});
