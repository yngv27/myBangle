let spi1=new SPI();
NRF.setAdvertising({},{name: "Deskpal"})
//* ProMicro 493a
spi1.setup({sck: D29, mosi: D45, baud: 2000000});
let CS=D43, RST=D2, BUSY=D31, DC=D47, DELAY=D5;

opts={
  spi: spi1,
  cs: CS,
  rst: RST,
  dc: DC,
  busy: BUSY,
  width: 400,
  height: 300,
  delay: DELAY,
};
g = require("~WFT0420CZ15.js").connect(opts);
let debug = print; //()=>{}; //print;
