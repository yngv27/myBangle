/*
** Implements both a standard 12 hour clock and a 24-hour (one hand) clock, with DOW and date
** Use BTN1 to switch clock types, BTN2 to ShowLauncher()
** Code heavily stolen from BangleApps/aclock
*/
const locale = require('locale');
const p = Math.PI / 2;
const pRad = Math.PI / 180;
const faceWidth = 110; // watch face radius (240/2 - 24px for widget area)

let timer = null;
let currentDate = new Date();
const centerX = g.getWidth() / 2;
const centerY = (g.getWidth() / 2);

const CLOCK_24 = "24";
let clockType = CLOCK_24;  /* make it "24" for 'Slow' hour-only hand */

//require("Font8x12").add(Graphics);
require("FontDylex7x13").add(Graphics);
g.setFont('Dylex7x13', 1);

const drawTics = () => {

  const numTics = (clockType === CLOCK_24 ? 96 : 60);
  g.setColor(0, 0.5, 0.5);
  g.setFontAlign(0,0);
  for (let i = 0; i < numTics; i++) {
    angle = (360 * i) / numTics;
    const a = angle * pRad;
    const x = centerX + Math.sin(a) * faceWidth;
    const y = centerY - Math.cos(a) * faceWidth;

    g.drawLine(centerX, centerY, x, y);
    // if ?? degrees, make hour marker larger
    if (i % (clockType === CLOCK_24 ? 4 : 5)) {
      
    } else {
      if (clockType !== CLOCK_24) {
        g.fillCircle(x, y, 2);
      } else {
        /* put hour at rotated point (0, faceWidth - 5) */
        g.drawString(Math.floor(i/4), 
          120 +  Math.sin(a+Math.PI)*(faceWidth + 4),
          120 - Math.cos(a+Math.PI)*(faceWidth + 4),
          true
        );
      }
    }
  }
 
  clearFace();
};

const clearFace = () => {
  g.setColor(0,0,0);
  g.fillCircle(centerX, centerY, faceWidth - 6);
};

const hand = (angle, length, erase) => {
  const CLR_BLACK = "#000000";
  const CLR_HILITE = "#FFFFFF";
  const CLR_SHADOW = "#808080";
  // default to 'erase'
  let c1 = CLR_BLACK;
  let c2 = CLR_BLACK;
  
  if(!erase) {
    if (angle % 360 >= 180) {
      c1 = CLR_SHADOW;
      c2 = CLR_HILITE;
    } else {
      c2 = CLR_SHADOW;
      c1 = CLR_HILITE;
    }
  }
  
  g.setColor(c1);
  let handArr1 = [0, -10, -5, 0, -2, length-2, 0, length];
  g.fillPoly(rotatePoly(handArr1, angle, 120, 120));
  g.setColor(c2);
  let handArr2 = [0, -10, 5, 0, -2, length-2, 0, length];
  g.fillPoly(rotatePoly(handArr2, angle, 120, 120));
};


const rotatePoly = (pArr, angle, x0,  y0) => {
  let newArr = [];
  const a = angle * pRad;
  for(let i=0; i<pArr.length ; i+= 2) {
    newArr[i] = x0 + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1];
    newArr[i+1] = y0 + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1];
  }
  return newArr;
};

const drawAll = () => {
  g.clear();
  currentDate = new Date(2020, 1, 1);
  drawTics();
  onMinute();
};

const drawDate = () => {
  //g.reset();
  g.setColor(0.8, 0.8, 0.6);

  const dayString = locale.dow(currentDate, true);
  month = currentDate.getMonth();
  const dateString =  currentDate.getDate().toString();
  const dateDisplay = `${dayString} ${dateString}`;
  // console.log(`${dayString}|${dateString}`);
  // two date positions
  if(clockType === CLOCK_24 && currentDate.getHours() >= 17 && currentDate.getHours() < 20) {
    g.setFontAlign(0, 0);
    g.drawString(dateDisplay, 120, 180, true);
  } else {
    const y = g.getHeight()  / 2;
    g.setFontAlign(1, 0);
    g.drawString(dateDisplay, g.getWidth() - 25, y, true);
  }
};

const onMinute = () => {
  if(Date.now() - currentDate.getTime() < 60000) return;
  
  if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0) {
   
  }
   clearFace();

  // clear existing hands
 
  // Hour
  if(clockType === CLOCK_24) {
    /* adjust angle so midnight points DOWN */
    let angle = 180 + currentDate.getHours() * 15 + currentDate.getMinutes() / 4;
    hand(angle,  faceWidth - 6, true);
  } else {
    let angle = (360 * ((currentDate.getHours()) + currentDate.getMinutes() / 60) ) / 12;
    hand(angle, faceWidth - 45, true);
    // Minute
    angle =(360 * currentDate.getMinutes()) / 60;
    hand(angle,  faceWidth - 6, true);
  }

  // get new date, then draw new hands
  currentDate = new Date();
  drawDate();
  
  // New hands
  
  // Hour
  if(clockType === CLOCK_24) {
     //hand((360 * (currentDate.getHours() + currentDate.getMinutes() / 60)) / 24,  faceWidth - 10, false);
    let angle = 180 + currentDate.getHours() * 15 + currentDate.getMinutes() / 4;
    hand(angle,  faceWidth - 6, false);
  } else {
    hand((360 * (currentDate.getHours() + currentDate.getMinutes() / 60)) / 12,  faceWidth - 45, false);
    // Minute
    hand((360 * currentDate.getMinutes()) / 60,  faceWidth - 6, false);
  }
  
  if (currentDate.getHours() >= 9 && currentDate.getHours() <= 21 && currentDate.getMinutes() === 0) {
    Bangle.buzz();
  }
 
};

const startTimers = () => {
  timer = setInterval(onMinute, 10000);
};

Bangle.on('lcdPower', (on) => {
  if (on) {
    //drawAll();
    startTimers();
  } else {
    if (timer) {
      clearInterval(timer);
    }
  }
});

startTimers();
drawAll();

function btn1Func() {
  if(clockType === CLOCK_24) clockType = "no";
    else clockType = CLOCK_24; 
  startTimers();
  drawAll();
}

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
// redraw
setWatch(btn1Func, BTN1, {repeat:true,edge:"falling"});
