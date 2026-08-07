//Synoke
SPI1.setup({ sck:D46, mosi:D47, order: "lsb", baud: 4000000 });
//SPI1.setup({ sck:D31, mosi:D29, order: "lsb", baud: 4000000 });

  
let opts = {
  cs: D45, // for synoke
  vcom: 0,  // optional; for flipping the bias
  spi: SPI1,
  width: 240,
  height: 240,
};
var g = require("~MEMLCD.js").connect(opts, function() {
//var g = require("MemoryLCD").connect(opts.spi, opts.cs, opts.vcom, opts.width, opts.height, function() {
  g.setColor(0).setBgColor(-1).clear();
});
/*
function test() {
  g.clear();
  g.drawLine(0,120,239,120).drawLine(120,0,120,239).flip();
  y=100;
  g.setFontVector(32);
  h=32;
  g.drawString("Hello",0,y);
  g.drawLine(0,y+h,g.getWidth(),y+h);
  g.drawString(getTime(), 0, y+2*h);
  g.flip();
}
*/