var img = {
  width : 176, height : 176, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([0,3,11,11]),
  buffer : require("heatshrink").decompress(atob("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"))

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

// d contains hours, mins and each digit, nm == night mode (set when BTN1 is pushed)
let drawTime = (d, nm) => {
  let hrRot = Math.PI * 2 * ((d.hour % 12) * 60 + d.min) / 720;
  let minRot = Math.PI* 2 * d.min / 60 ;
  g.sc(0);
  g.fillCircle(88,118,10);

  g.sc(15);
  g.fillCircle(88,88,6);
  let s = "SUNMONTUEWEDTHUFRISAT".substr(d.dow*3,3) + ' ' + d.dt;
  //console.log(d.dow, s);
  g.drawString(s, 160-g.stringWidth(s), 83);
  s=Math.floor(battLevel());
  g.drawString(s,88-g.stringWidth(s)/2,118);

  g.drawImage(ihr, 88, 88, { rotate: hrRot } );
  g.drawImage(imin, 88, 88, { rotate: minRot } );
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
  let d = { hour:dt.getHours(), min:dt.getMinutes(), dt:dt.getDate(), dow:dt.getDay() };
  drawTime(d, false);
}
g.setFont("Omnigo",1);

setWatch(()=>{
  g.bl(0.1);
  setTimeout(g.bl, 5000, 0);
}, BTN1, {edge: 'rising', debounce: 100, repeat: true});

setTimeout(thing, 1000);
setInterval(thing, 23000);
