/*
** Useful for testing, requires atcfont.js and some kind of trigger to display
** Here I use wOS object, defined in many EWatches
*/
eval(require("Storage").read("atcfont.js"));

g2 = Graphics.createArrayBuffer(240, 280, 1, {msb: true});
g2.setFontAlign(0,0);
function clock() {
  g2.clear();
  let dt = new Date();
  let m = Math.floor((dt.getTime()/1000-_uptime)/60);
  let h = Math.floor(m / 60); m = m % 60;
  let dz = Math.floor(h / 24); h = h % 24;
  dt = dt.toString();
  let yr = dt.indexOf("2025")+5;
  //g2.setFont("Default");
  g2.setFont("Knx18");
  g2.drawString(`${process.env.BOARD} - ${E.getBattery()}%`, 120 , 40);
  g2.drawString(dt.substring(0,yr), 120, 88, false);
  g2.drawString(`${dz}d ${h}h ${m}m`, 120, 220);
  //g2.drawString(dt.substring(0,yr), 120, 64, false);
  g2.setFontATC(); //"Agency",5);
  g2.drawString(`  ${dt.substring(yr,yr+5)}  `, 120, 140, false);
  g.drawImage(g2, 0, 0);
}
_uptime = 1735679953.705; // seconds, not ms

wOS.UI.on("tap", wOS.wake);
wOS.on("wake", clock);

