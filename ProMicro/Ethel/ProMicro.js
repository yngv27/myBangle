NRF.setAdvertising({},{name:"Ethel "});

/*
Need to delay things, in case ETH fails and hangs, we want a good window
to jump in and kill the proc!
*/

var Ethel = {};
var Eth;

Ethel.startUp = setTimeout(()=>{
  SPI1.setup({mosi: D2, miso: D47, sck:D29});
  Eth=require("WIZnet").connect(SPI1, D31);
  Eth.setIP();
}, 60*1000);

Ethel.halt = () => {clearTimeout(Ethel.startUp);};

function getTime() {
  let info = "";
  require("http").get("http://worldclockapi.com/api/json/est/now", (res)=>{
    res.on("data", (data)=>{info+=data;});
    res.on("close", ()=>{print(`[[${JSON.parse(info).currentDateTime}]]`);});
  });
}
