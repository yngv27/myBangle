/* EPD setup for ProMicro
let spi1 = new SPI();
spi1.setup({sck:D29, mosi:D31, baud: 100000});
opts={cs:D2 ,dc:D47, rst:D45, spi:spi1, width:200, height:200};
var g = require("~SSD1681.js").connect(opts);
g.setBgColor(-1).setColor(0).clear().setRotation(0,1);
//* /
let nf = ()=>{};
wOS = { 
  UI: {},
  setStepCount: (n)=>{},
  buzz: nf,
  };

_S = require("Storage");
//*
begin = () => {
eval(_S.read("apw.js"));
setTimeout(()=>{ scrs[0]="handy.js"; nextScreen(); }, 2000);
setTimeout(()=>{g.reset(true); }, 4000);

};
setTimeout(begin, 2000);
//*/
