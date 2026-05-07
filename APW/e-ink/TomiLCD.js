wOS.isLCDOn = () => {return true;};

function init() {
  eval(_S.read("TomiLCD.js"));
  
  function start() {
    g.setBgColor(-1).setColor(0);
    // load up nifty small font
    Graphics.prototype.setFontEuro = function(scale) {
  return(this.setFontCustom(atob("AAAAAAAAAAMAYAAAABgeHg4AAAAB+H+IEQIgRAj/D8AAAAgB/j/AAAAAAAAgjDEOI0TI8QwgAAAIIQYkRYj7GeIYAAAAGAcBoGQYgnwPgEAAAAeQ8xIiRE2I4AgAAAA+D+NESIkRPgOAAAAYAwBBiPF4PAYAAAABuH+JESIkR/huAAAAOA+REiJEWP4PgAAAAzBmAAAAQBgCLE2PAMAAABgeD4MQYgfAPADAAAAf4/xIiREiNsf4ZgAAAB4H4YYgRAiBGGEIAAAB/j/ECIEQYxg/A4AAAAf4/xIiREiJEQIAAAD/H+JASAkBACAAADgPwxxBiBECM8JwAAAD/H+BACAEAID/H+AAAA/x/gAAAIMQIgR/j+AAAAf4/wGAYB4G4YYgQAAAH+P8AIAQAgBAAP8f4MAOAOA4DAf4/wAAAH+P8MAMAMAMH+P8AAAAeB+GGIEQIgRhh+B4AAAA/x/iIEQIgfAcAAAAB4H4YYgRAyBmHn7HAAAAD/H+IgRgjh9hxAAAAMQ8xIiZESM8IwAAACAEAIAf4/xACAEAAAfg/gBgBACAMfw/AAAAGAPADgBwDgcHgMAAA4A+APAOD4eA4AeAHAeHwcAAAACBGGG4HgPA7DDECAAAAwBwAwA+B8GA4BgAAEGIcRomRYjhGCAAAB//AIAf"), 32, atob("BQAAAAAAAAAAAAAAAAAEBgoHCQkKCQkJCQkEAAAAAAcACgoKCgkICgoEBwoHCwoLCQsJCQkKCQ4KCQoAAg=="), 11 + (scale << 8)));
};
    g.setFontEuro();
    g.setFontAlign(0, -1);
    g.drawString("SU MO TU WE TH FR SA", 100, 6);
    g.drawString("ALM\n\nDAT", 30, 160);
    g.drawString("MSG\n\nEXA", 68, 160);
    g.setFontTomiLCD();
    g.setFontAlign(1,-1);
  }
  

  let drawData = (i) => {
    d = new Date().getDay();
    //if(i) d=i;
    g.clearRect(0,18,199,21);
    g.fillRect(16+d*25, 18, 34+d*25, 21);
  };
  let drawClock = (d) => {
    let tm=('0'+d.hr).slice(-2)+':'+('0'+d.min).slice(-2);
    g.setFontTomiLCD();
    g.drawString('.'+tm, 199, 32, true); // a trick.. our '.' is blank

    d.nicedate = Date().toString().substring(0, 15);
    let nd =` ${d.nicedate} `;
    //g.drawString(nd, g.getWidth()/2, 4, true);
    // this will bold it
    //g.drawString(nd, g.getWidth()/2+1, 4, false);

    //if(typeof(bootTime) != "undefined")    upTime();
    drawData(d);
    g.flip();
    
  if(d.min >= 57) setTimeout(()=>{g.init();}, 5000); // full refresh on hour
  if(d.min == 0) setTimeout(()=>{g.setPartial();}, 5000); // back to partial

  };
  
    let showMsg = (msgobj) => {
    };
  
  return {
    start: start,
    drawClock: drawClock,
    drawData: drawData,
    showMsg: showMsg,
    //log: log,
  };
}
//g.setPartial=()=>{};
exports = init();

//wOS.wake = () => {};
// *
//g.setFontOmnigo();
let bootTime = Math.floor(new Date('Wed, 24 Jan 2024 17:00').getTime()/1000);
  //wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  //exports.drawData(dt);
  //exports.showMsg({text:"This would be message 1"});

//  */
  