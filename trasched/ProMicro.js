// startup file
NRF.setAdvertising({},{"name":"Trasched"});

spi1 = new SPI();
spi1.setup({sck: D29, mosi: D31, baud:2000000});
g = require("~SSD1681.js").connect({spi: spi1, cs: D2, dc: D47, rst: D45, busy:D43, width: 128, height: 250}, ()=>{
//spi1.setup({sck: D24, mosi: D22, baud:2000000});
//g = require("~SSD1681.js").connect({spi: spi1, cs: D32, dc: D36, rst: D38, busy:D43, width: 128, height: 250}, ()=>{
  g.setRotation(3,1);
  g.getWidth=()=>{return 122;};
  g.setBgColor(1).setColor(0);
  g.clear();
  g.flip();
  
});