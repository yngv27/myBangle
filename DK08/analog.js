var img = {
  width : 176, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([0,8,8,8]),
  buffer : require("heatshrink").decompress(atob("ABEBoALK3AZLqArQgeQFa0B8ArQgQSKFZkG6CDR8grWheAWCIfKFZkaZBQAHtorWlwqRgEeH5IrMvIrShYrW2grSg+QFakB8ArSgQUJFZcG6ArSgJsJFZcLwArSgF4FakeFScAlorUCpIALj1AFad5FaiZJFZTFKABcGyArSgXgFagWJFZUDIBAAMNxIrKTBIANvArShQqVgEkFaUFFayNJFZIAhFddQFdQA/AH4A/AH4A/AH4A/AH4A/ACMGoAqogkLyArotMG/IqngQpBt5YnrYoBg3pFUsB3zZBgOubssb8gEHAEJSELgIqjgzZBLonQFcVvbIIyKK0YzIADdb0A0HFcO+bIYADgIIHADNkf8YA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A7gNVAAVAFcsK/4ACyArlg2qAAQrmAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/ABcCyAigsgIHjYrhv1AA4sB3wIGADUb8gHNADcB3RPFt2AacVrU4kG/L/jEotvbMImHgO5bMIADjTVCjfgFUhTB31AAQQrlKgPkgxaCLE25hTZlAAdpgIqogEEFVIA/AH4A/AH4A/AH4A/AH4A/AH4AhlAJIjAJIjIrW3AJIloJIjwqVgO0FaULoArUgXgFaUHyArUCxQrJIBQALheAFaUB8grUjyaJFZLwKABYgKBRVtFahBKFZUeFScB+grUhaZJABLxLFZUHeJIUVFZRCLABEbNhQrKgPkFaUuBZQrKgF4FaVpFawLLAA+4D60eTZSXTFZcLFaMC6ArWg+QFaEDwArWIhI"))
};
var isec = {
  width : 3, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([12,12]),
  buffer : require("heatshrink").decompress(atob("AAMEiFBAX4CDQPQ="))
};
var imin = {
  width : 5, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([15,15,0,0]),
  buffer : require("heatshrink").decompress(atob("AAcQisFoNQqgE/Als3Wn4AiA"))
};
var ihr = {
  width : 7, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([15,15,0,0]),
  buffer : require("heatshrink").decompress(atob("AHMVgNVitVAH4AmstUhtgV/4A/ABIA=="))
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
  
  g.sc(0);
  g.fillCircle(88,118,10);

  g.sc(12);
  g.fillCircle(88,88,6);
  g.sc(15);
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
  g.sc(0);
  g.fillCircle(88,88,3);
  g.flip();
};


eval(require("Storage").read("dk08.js"));


function thing() {
  g.clear();
  g.drawImage(img,0,0);
  //g.flip();
  let dt=new Date();
  let d = { hour:dt.getHours(), min:dt.getMinutes(), dt:dt.getDate(), dow:dt.getDay(), sec:dt.getSeconds() };
  drawTime(d, false);
}
g.setFont("Omnigo",1);

setWatch(()=>{
  g.bl(0.1);
  setTimeout(g.bl, 5000, 0);
}, BTN1, {edge: 'rising', debounce: 100, repeat: true});

//setTimeout(thing, 1000);
setInterval(thing, 1000);
