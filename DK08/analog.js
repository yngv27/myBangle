let bgc=15,fgc=0;
var img = {
  width : 176, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([7,7,7,fgc]),
  buffer : require("heatshrink").decompress(atob("ABEBoALK3AZLqArQgeQFa0B8ArQgQSKFZkG6CDR8grWheAWCIfKFZkaZBQAHtorWlwqRgEeH5IrMvIrShYrW2grSg+QFakB8ArSgQUJFZcG6ArSgJsJFZcLwArSgF4FakeFScAlorUCpIALj1AFad5FaiZJFZTFKABcGyArSgXgFagWJFZUDIBAAMNxIrKTBIANvArShQqVgEkFaUFFayNJFZIAhFddQFdQA/AH4A/AH4A/AH4A/AH4A/ACMGoAqogkLyArotMG/IqngQpBt5YnrYoBg3pFUsB3zZBgOubssb8gEHAEJSELgIqjgzZBLonQFcVvbIIyKK0YzIADdb0A0HFcO+bIYADgIIHADNkf8YA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A7gNVAAVAFcsK/4ACyArlg2qAAQrmAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/ABcCyAigsgIHjYrhv1AA4sB3wIGADUb8gHNADcB3RPFt2AacVrU4kG/L/jEotvbMImHgO5bMIADjTVCjfgFUhTB31AAQQrlKgPkgxaCLE25hTZlAAdpgIqogEEFVIA/AH4A/AH4A/AH4A/AH4A/AH4AhlAJIjAJIjIrW3AJIloJIjwqVgO0FaULoArUgXgFaUHyArUCxQrJIBQALheAFaUB8grUjyaJFZLwKABYgKBRVtFahBKFZUeFScB+grUhaZJABLxLFZUHeJIUVFZRCLABEbNhQrKgPkFaUuBZQrKgF4FaVpFawLLAA+4D60eTZSXTFZcLFaMC6ArWg+QFaEDwArWIhI"))
};
var isec = {
  width : 3, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([4,4]),
  buffer : require("heatshrink").decompress(atob("AAMEiFBAX4CDQPQ="))
};
var imin = {
  /*
  width : 5, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([15,15,0,0]),
  buffer : require("heatshrink").decompress(atob("AAcQisFoNQqgE/Als3Wn4AiA"))
  */
  width : 5, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([8,fgc,8,8]),
  buffer : require("heatshrink").decompress(atob("AAMC0VWyultNaAn4Eu6uO4C4/AEA"))

};
var ihr = {
  /*
  width : 7, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([15,15,0,0]),
  buffer : require("heatshrink").decompress(atob("AHMVgNVitVAH4AmstUhtgV/4A/ABIA=="))
  */
  width : 7, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([8,fgc,8,8]),
  buffer : require("heatshrink").decompress(atob("AHMqgVWktWytaqtpqulA34Gg3NYh3wV/4A/ABIA="))
}
;
require("omnigo2.fnt").add(Graphics);

let battAvg = [0,0,0,0,0,0,0,0,0,0,0,0];
function battLevelAvg() {
  battAvg.push(Math.floor(battLevel()));
  battAvg.shift();
  let sum = battAvg.reduce((a, b) => a + b, 0);
  return Math.floor(sum / battAvg.length) || 0;
}

// d contains hours, mins and each digit, nm == night mode (set when BTN1 is pushed)
let drawTime = (d, nm) => {
  let hrRot = Math.PI * 2 * ((d.hour % 12) * 60 + d.min) / 720;
  let minRot = Math.PI* 2 * d.min / 60 ;
  let secRot = Math.PI* 2 * d.sec / 60 ;
  
  g.sc(bgc);
  g.fillCircle(88,118,10);

  g.sc(fgc);
  let s = "SUNMONTUEWEDTHUFRISAT".substr(d.dow*3,3) + ' ' + d.dt;
  //console.log(d.dow, s);
  g.drawString(s, 164-g.stringWidth(s), 84);
  g.drawString(s, 163-g.stringWidth(s), 84);
  s=battLevelAvg();
  let y = (d.hour >= 17 && d.hour <= 19) ? 58 : 118;
  g.drawString(s,88-g.stringWidth(s)/2, y);

  g.drawImage(ihr, 88, 88, { rotate: hrRot } );
  g.drawImage(imin, 88, 88, { rotate: minRot } );
  g.drawImage(isec, 88, 88, { rotate: secRot } );
  g.sc(4);
  g.fillCircle(88,88,6);
  g.sc(bgc);
  g.fillCircle(88,88,3);
  g.flip();
};


eval(require("Storage").read("dk08.js"));


function thing() {
  g.sc(bgc);
  g.fillRect(0,0,175,175);
  g.drawImage(img,0,0);
  //g.flip();
  let dt=new Date();
  let d = { hour:dt.getHours(), min:dt.getMinutes(), dt:dt.getDate(), dow:dt.getDay(), sec:dt.getSeconds() };
  drawTime(d, false);
}
g.setFont("Omnigo",1);

let lpto;
function swapColor() {
  let x=fgc;
  fgc=bgc;
  bgc=x;
  imin.palette[1]=fgc;
  ihr.palette[1]=fgc;
}

function liteOn() {
  g.bl(0.05);
  setTimeout(g.bl, 5000, 0);
  lpto = setTimeout(swapColor,2000);
  setWatch(()=>{
    if(lpto) clearTimeout(lpto);
    setWatch(liteOn, BTN1, {edge: 'rising', debounce: 100, repeat: false});
  }, BTN1, {edge: 'falling', debounce: 100, repeat: false});
}

setWatch(liteOn, BTN1, {edge: 'rising', debounce: 100, repeat: false});
//setTimeout(thing, 1000);
setInterval(thing, 1000);
