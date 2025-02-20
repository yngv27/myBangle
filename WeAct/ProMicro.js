// hook uppa WeAct: BK,x,RD,YL,GR,BL,WH,OR,PR (two free at bottom)
let spi1 = new SPI();
spi1.setup({sck: D31, mosi: D47, baud: 2000000});
var g = require("~SSD1681.js").connect({
  spi: spi1,
  dc: D43, 
  cs: D2,
  rst: D29, 
  busy: D45, 
  delay: D46,
  width: 128,
  height: 250,
},()=>{
  g.getWidth = () => {return 122;};
  require("Font8x12").add(Graphics);
  g.setFont("8x12",1); //.setFontAlign(1,-1);
  g.setRotation(3,1);
  g.setBgColor(-1).setColor(0).clear();
  //g.drawString("HELLO\nTHU DEC 5 04:22 PM", 125, 61);
});
//const F=Math.floor;