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
let debug=print;

function updateTime() {
  let info = "";
  require("http").get("http://worldclockapi.com/api/json/est/now", (res)=>{
    res.on("data", (data)=>{info+=data;});
    res.on("close", ()=>{
      let curDT = JSON.parse(info).currentDateTime;
      debug(`[[${info}]]`);
      let dt = curDT.substring(0,16);
      let tz = curDT.substring(16,19);
      debug(`Date is ${dt}, TZ = ${tz}`);
      E.setTimeZone(parseInt(tz));
      setTime((new Date(curDT)).getTime()/1000);
    });
  });
}

if((new Date()).getFullYear() < 2024) {
  updateTime();
} else {
  let dz=Date();
  let m = dz.getMonth(), d=dz.getDate(), dow=dz.getDay();
  //if(m<2 || m>10) dz=-5;
  dz=-5;
  if(m>2 && m<10) dz=-4;
  if((m == 2) && (d-dow > 7)) dz=-4;
  if ((m == 10) && (d-dow <= 0)) dz=-4;
  E.setTimeZone(dz);
}

function getPage(url) {
  let data = "";
  require("http").get(url, (res)=>{
    res.on("data", (d)=>{data+=d;});
    res.on("close", ()=> {
      print(data);
    });
  });
}


// rename to ".boot0" to run at startup
E.enableWatchdog(30);

const _S = require("Storage");


E.at = (timeStr, func) => {
  if(timeStr.indexOf("T") < 0) { timeStr = Date().toISOString().substring(0,11)+timeStr;}
  let delay = Math.floor((new Date(timeStr)).getTime() - (new Date()).getTime());
  if (delay < 0) delay += 24*60*60*1000;
  //print("thats in "+delay/1000);
  setTimeout(func, delay);
};
