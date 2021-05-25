
g.clear();
/*
require("Font7x11Numeric7Seg").add(Graphics);
g.setFont("7x11Numeric7Seg", 1); // bitmap font, 8x magnified
*/
require("FontHaxorNarrow7x17").add(Graphics);
g.setFont("HaxorNarrow7x17", 1); // bitmap font, 8x magnified

g.setFontAlign(0,0); // center font

let interval = null;
let stepCounter = 0;

const optWireframe = 0;
const optWireframe2 = 1;
const optFilled = 2;
const optRandColor = 4;
const maxStyles = 6;

let vOption = 4;

const startX = [ 54, 130,  54, 130 ];
const startY = [ 34,  34, 130, 130 ];
var d = 5;
const hht = 60;
const vht = 40;

let lastHour = 99;
let lastMinute = 99;

function Poly(arr, fill) {
  if (fill) g.fillPoly(arr, true);
  else g.drawPoly(arr, true);
}

function drawVertSeg(x, y) {
  Poly([x, y, x+d, y+d, x+d, y+vht-d, x, y+vht, x-d, y+vht-d, x-d, y+d], vOption & optFilled);
  /* extra! */
  if(vOption == optWireframe2) {
     Poly([x+d, y+d, 
                 x+d, y+vht-d, 
                x-d, y+d, 
                 x-d, y+vht-d,
                 x+d, y+d
                ], false);
  }
  g.drawLine(x, y, x, y+vht);
}

function drawHorizSeg(x, y) {
  Poly([x, y, x+d, y-d, x+hht-d, y-d, x+hht, y, x+hht-d, y+d, x+d, y+d], vOption & optFilled);
  if(vOption == optWireframe2) {
    Poly([x+d, y-d, 
        x+d, y+d, 
        x+hht-d, y-d, 
        x+hht-d, y+d, 
        x+d, y-d
        ], false);
  }
  g.drawLine(x, y, x+hht, y);
}

function drawSegments(slot, val) {
  let xOff = startX[slot];
  let yOff = startY[slot];
  if (val != 1 && val != 4)
    drawHorizSeg(xOff, yOff);
  if (val != 1 && val != 2 && val != 3 && val != 7)
    drawVertSeg(xOff, yOff);
  if (val != 5 && val != 6)
    drawVertSeg(xOff+hht, yOff);
  if (val != 0 && val !=1 && val != 7)
    drawHorizSeg(xOff, yOff+vht);
  if (val == 0 || val == 2 || val == 6 || val == 8)
    drawVertSeg(xOff, yOff+vht);
  if (val != 2 )
    drawVertSeg(xOff+hht, yOff+vht);
  if (val != 1 && val != 4 && val != 7)
    drawHorizSeg(xOff, yOff+vht*2);
}

function pad0(n) {
  return (n > 9) ? n : ("0"+n);
}

function setRandomColor() {
    g.setColor(Math.random(), Math.random(), Math.random());   
}


function drawBasicTime() {
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
  g.clearRect(160, 0, 240, 20);
  g.setFont("Dylex7x13", 1);
  g.setColor("#209090");
  g.drawString(stepCounter, g.getWidth()/2, 228);
  // battery
  g.setColor("#208020");
  g.setFontAlign(-1,0);
  g.drawString(E.getBattery()+"%", g.getWidth() - 1, 228);
}

function drawTime() {
  let d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();

  // 'blank' segments
  if(vOption & optRandColor) {
    setRandomColor();
  } else { 
    g.setColor("#202020");
  }
  if(hour != lastHour) {
    drawSegments(0, 8);
    drawSegments(1, 8);
  }
  if(minute != lastMinute) {
    drawSegments(2, 8);
    drawSegments(3, 8);
  }  
  
  if(vOption & optRandColor) {
    setRandomColor();
  } else { 
    g.setColor("#FFFF00");
  }
  if(hour != lastHour) {
    drawSegments(0, Math.floor(hour / 10));
    drawSegments(1, hour % 10);
  }
  
  if(vOption & optRandColor) {
    setRandomColor();
  } else { 
    g.setColor("#FF00FF");
  }
  
  if(minute != lastMinute) {
    drawSegments(2, Math.floor(minute / 10));
    drawSegments(3, minute % 10);
  }  
  lastHour = hour;
  lastMinute = minute;

  g.clearRect(0, 228, 240, 240);
  g.setColor("#C0C0C0");
  g.setFontAlign(0,1);
  g.drawString(stepCounter, g.getWidth()/2, 240);
  g.setColor("#208020");
  g.setFontAlign(0,1);
  g.drawString(E.getBattery(), g.getWidth()-16, 240);

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
  interval = setInterval(drawTime, 10000);
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

function setWFace() {
  vOption++;
  console.log(vOption);
  if(vOption > maxStyles) vOption = 0;
  g.clear();
  lastHour = 99;
  lastMinute = 99;
  drawTime();
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});

setWatch(setWFace, BTN1, {repeat:true});

Bangle.on('step', function(cnt) { 
  stepCounter = cnt;
});

Bangle.on('swipe', function(dir) { 
  if(dir == 1 && d < 10) {
    d++;
  } else if (dir == -1 && d > 0) {
    d--;
  }
  /* Bangle.buzz(); */
  g.clear();
  lastHour = 99;
  lastMinute = 99;
  drawTime();
});
