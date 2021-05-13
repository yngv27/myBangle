const locale = require('locale');
const v = require('m_vatch');

const p = Math.PI / 2;
const pRad = Math.PI / 180;
const faceWidth = 222; // watch face radius (240/2 - 24px for widget area)

var img = {
  width : 16, height : 480, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("/wA/AH4A/AH4A/AH4AUlYACB5ms1gPN6/XB/usB/xvuqwPRqwP/B/4P/B/4P/B/4PrwIPBwIP/B/4P/B7UrB4crB/4P/B/4P/B/4P/B5WsB6OsB/4P/B/4P/B/4P/B93XB5YOCB9dWF9w/fJ/4/EqwP/B/4P/B/4P/B/4PpwIPDwIP/B/4P/B78rBw8rB/4P/B/4PP1gP/B/4P/B4esB/4P/B/4P71gCCB5NWAAgPHlcrwIeBAAOBCAwdBHwhACCAgOICAwOJCAYeBwIOJAAOBJYIeKQYYPwJ5zMGN5CPCDxivLBwjPQCIgADBo4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AcA"))
}
;

let timer = null;
let currentDate = new Date();
let centerX = 0;
let centerY = 0;
let quadrant = -1; // 0 = 00-05, 1 = 06-11, 2 = 12-17, 3 = 18-23
let faceColours = [
  '#808080','#408080','#404080','#400040'
  ];

const CLOCK_24 = "24";
let clockType = CLOCK_24;  /* make it "24" for 'Slow' hour-only hand */

require("m_knxt").add(Graphics);
g.setFont('KNXT', 1);

function drawPoints(points, x0, y0) {
  let xs = 0.5;
  let ys = 0.625;
  let x = points[0]*xs+x0, y = points[1]*ys+y0;
  g.moveTo(x, y);
  for(let idx=1; idx*2 < points.length; idx ++) {
    let x = points[idx*2]*xs+x0;
    let y = points[idx*2+1]*ys+y0;
    g.lineTo(x, y);
  }
}
function drawBtyIcon(x, y) {
  const btyPoints = [
    2,24,
    2,4,
    6,4,
    6,0,
    14,0,
    14,4,
    18,4,
    18,24,
    2,24
    ];
  drawPoints(btyPoints, x, y);
}

function drawStepIcon(x, y) {
   const stepPoints2 = [
    11, 8,
     12,7,
     13,8,
     12, 9
    ];
  const stepPoints = [
    12, 21,
    1, 11,
    1, 6,
    7, 1,
    16, 1,
    21, 6,
    21, 11,
    12, 21
    ];
  drawPoints(stepPoints, x, y);
  drawPoints(stepPoints2, x, y);
}

const drawTics = () => {
  const numTics =  96;
  
  g.setFontAlign(0,0);
  for (let i = 0; i < numTics; i++) {
    angle = (360 * i) / numTics;
    const a = angle * pRad;
    const x = centerX + Math.sin(a) * faceWidth;
    const y = centerY - Math.cos(a) * faceWidth;
    g.setColor('#cccccc');
    g.drawLine(centerX, centerY, x, y);
    // if ?? degrees, make hour marker larger
    if ( i % 4 === 0) {
      g.setColor('#ffffff');
      g.drawLine(centerX, centerY, x, y);

      /* put hour at rotated point (0, faceWidth - n) */
      g.drawString(Math.floor(i/4), 
        centerX +  Math.sin(a+Math.PI)*(faceWidth + 8),
        centerY - Math.cos(a+Math.PI)*(faceWidth + 8),
        true
      );
    }
  }
  clearFace();
};

const clearFace = () => {
  //if(quadrant >= 0) g.setColor(faceColours[quadrant]);
  g.setColor('#000000');
  g.fillCircle(centerX, centerY, faceWidth - 7);
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
  g.fillPoly(rotatePoly(handArr1, angle, centerX, centerY));
  g.setColor(c2);
  let handArr2 = [0, -10, 5, 0, -2, length-2, 0, length];
  g.fillPoly(rotatePoly(handArr2, angle, centerX, centerY));
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

const setQuadrant = (hNow) => {
  let oldQuadrant = quadrant;
  if(hNow < 6) {
    quadrant = 0; centerX = 239; centerY = 0;
    //g.setBgColor('#000000');
  } else if (hNow < 12) {
    quadrant = 1; centerX = 239; centerY = 239;
    //g.setBgColor('#200080');
  } else if (hNow < 18) {
    quadrant = 2; centerX = 0; centerY = 239;
    //g.setBgColor('#404080');
  } else  {
    quadrant = 3; centerX = 0; centerY = 0;
    //g.setBgColor('#000040');
  }
};



const drawBkgd = () => {
  g.setBgColor('#000000');
  g.clear();
  drawTics();
  g.setColor(faceColours[quadrant]);
  g.drawCircle(centerX, centerY, faceWidth);
  g.drawCircle(centerX, centerY, faceWidth - 6);
};

const drawData = (data) => {
  g.setColor(0.8, 0.8, 0.6);

  //const dayString = locale.dow(currentDate, true);
  //month = currentDate.getMonth();
  //const dateString =  currentDate.getDate().toString();
  const dateDisplay = `${data.dow} ${data.date}`;
  // console.log(`${dayString}|${dateString}`);
  // four date positions
  g.setFontAlign(quadrant < 2 ? -1 : 1, (quadrant == 0 || quadrant == 3) ? 1 : -1);
  let y = Math.abs(centerY-220);
  g.drawString(dateDisplay, Math.abs(centerX-220), y, true);
  y += 20;
  drawStepIcon(Math.abs(centerX-220), y);
  g.drawString(data.steps, Math.abs(centerX-220), y, true);
  y += 20;
  drawBtyIcon(Math.abs(centerX-220), y);
  g.drawString(data.batt, Math.abs(centerX-220), y, true);

};

const onMinute = (data) => {
  //if(Date.now() - currentDate.getTime() < 60000) return;

  clearFace();

  // get new date, then draw new hands
  currentDate = new Date();
  //currentDate = new Date(2021,2,14,0,1,0);
  let oldQ = quadrant;
  setQuadrant(currentDate.getHours());
  if(oldQ != quadrant) {
    drawBkgd();
  }

  // Hour
  let angle = 180 + data.hour * 15 + data.min / 4;
  //hand(angle,  faceWidth - 6, false);

  let hrRot = Math.PI * 2 * angle / 360;
  //console.log('a:r::'+angle+':'+hrRot);
  g.drawImage(img, centerX, centerY, { rotate: hrRot } );
  

  if (currentDate.getHours() >= 9 && currentDate.getHours() <= 21 && currentDate.getMinutes() === 0) {
    Bangle.buzz();
  }

};


v.setDrawBackground(drawBkgd);
v.setDrawTime(onMinute);
v.setDrawData(drawData);
//v.setOrientationChange(function() { return;});

currentDate = new Date();
setQuadrant(currentDate.getHours());

v.begin();
