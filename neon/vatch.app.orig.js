g.clear();
require("FontDylex7x13").add(Graphics);
g.setFontAlign(0,0); // center font
g.setFont("Dylex7x13", 3); // bitmap font, 8x magnified
// g.setFont("Vector",20);
g.setColor("#FF2020");

let interval = null;
let stepCounter = 0;

function pad0(n) {
  return (n > 9) ? n : ("0"+n);
}

function drawTime() {
  let d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  
  g.clearRect(0, 80, 240, 160);
  g.setFontAlign(0,0);
  
  g.setColor("#FF2020");
  g.setFont("Dylex7x13", 3);
  g.drawString(hour + " : " + pad0(minute) + " : " + pad0(second), g.getWidth()/2, g.getHeight()/2 - 20);
  // steps
  
  g.setColor("#209090");
  g.setFont("Dylex7x13", 2);
  g.drawString(stepCounter, g.getWidth()/2, g.getHeight()/2 + 20);
  // battery
  g.clearRect(160, 0, 240, 20);
  g.setColor("#208020");
  g.setFontAlign(1,-1);
  g.drawString(E.getBattery()+"%", g.getWidth() - 1, 1);
}

function stop () {
  if (interval) {
    clearInterval(interval);
  }
}

function start () {
  if (interval) {
    clearInterval(interval);
  }
  // first time init
  interval = setInterval(drawTime, 1000);
  drawTime();
}

start();
// Bangle.loadWidgets();
// Bangle.drawWidgets();
Bangle.on('lcdPower', function (on) {
  if (on) {
    start();
  } else {
    stop();
  }
});

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});

Bangle.on('step', function(cnt) { 
  stepCounter = cnt;
});
