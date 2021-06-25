
const EMULATOR = Bangle;
if(EMULATOR) {
  g.on = () => console.log('g.on()');
  g.off = () => console.log('g.off()');
} else {
  let F07 = require('F07.min.js');
  let g = F07.getGraphics();
}
let _Storage = require("Storage");

const logD = (msg) => { console.log(msg); };

let battVolts = ()=> { return EMULATOR?4.0:F07.battVolts();};
let battLevel = ()=> { return EMULATOR?90:F07.battLevel();};
function battInfo(v){v=v?v:F07.battVolts();return `${F07.battLevel(v)|0}% ${v.toFixed(2)}V`;}

require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
//require("Font8x16").add(Graphics);

function info(){
  g.clear();
  g.setFont("4x6",1/*2*/);g.setColor(10);
  g.drawString("Espruino "+process.version,5,10);
  if (bpp==1) g.flip();
  g.setFont("4x6",1);g.setColor(14);
  g.drawString("ST7735 12 bit mode\n8Mbps SPI with DMA",4,22);
  if (bpp==1) g.flip();
  for (var c=0;c<8;c++){
    g.setColor(c+8);g.fillRect(8+8*c,130,16+8*c,138);
    if (bpp==1) g.flip();
  }
  for ( c=0;c<8;c++) {g.setColor(c);g.fillRect(8+8*c,142,16+8*c,150);
    if (bpp==1) g.flip();
  }
  g.flip();
  return setInterval(function(){
    stepCube();
  },5);
}

/*
** BEGIN WATCH FACE
*/
const startX=[6,43,6,43],startY=[14,14,82,82],nmX=[4,42,88,126],nmY=[12,12,12,12];let xS=1,yS=1,rotate=!1;function drawScaledPoly(l,e,o){let d=[];for(let t=0;t<l.length;t+=2){var a;d[t]=Math.floor(l[t]*xS)+e,d[t+1]=Math.floor(l[t+1]*yS)+o,rotate&&(a=d[t],d[t]=80-d[t+1],d[t+1]=a)}g.fillPoly(d,!0)}
let lcdTopSeg=Uint8Array([0,0,29,0,29,7,0,7]);
let lcdTopLeftSeg=Uint8Array([0,0,7,0,7,29,0,29]);
let    lcdTopRightSeg=Uint8Array([22,0,29,0,29,29,22,29]);
let    lcdMiddleSeg=Uint8Array([0,26,29,26,29,33,0,33]);
let    lcdBottomLeftSeg=Uint8Array([0,30,7,30,7,59,0,59]);
let    lcdBottomRightSeg=new Uint8Array([22,30,29,30,29,59,22,59]);
let    lcdBottomSeg=new Uint8Array([0,52,29,52,29,59,0,59]);
function drawDigit(t,l,e){let o=(e?nmX:startX)[t];t=(e?nmY:startY)[t];EMULATOR&&(o+=80),1!=l&&4!=l&&drawScaledPoly(lcdTopSeg,o,t),1!=l&&2!=l&&3!=l&&7!=l&&drawScaledPoly(lcdTopLeftSeg,o,t),5!=l&&6!=l&&drawScaledPoly(lcdTopRightSeg,o,t),0!=l&&1!=l&&7!=l&&drawScaledPoly(lcdMiddleSeg,o,t),0!=l&&2!=l&&6!=l&&8!=l||drawScaledPoly(lcdBottomLeftSeg,o,t),2!=l&&drawScaledPoly(lcdBottomRightSeg,o,t),1!=l&&4!=l&&7!=l&&drawScaledPoly(lcdBottomSeg,o,t);}
/*
** END WATCH FACE
*/
var volts;
var batt=battInfo();
let lastTime = '';

let buzzLock = 0;  // 0b10 = lockout, 0b01 = cancel
let vibrate=function(intensity,count,onms,offms){
  const VIB = D25;
  analogWrite(VIB, 0.1);
  function von(i) { analogWrite(VIB, i); }
  function voff() { analogWrite(VIB, 0); }
  while(count--) {
    analogWrite(VIB, intensity);
    let d=Date.now()+onms; 
    while(d > Date.now() ) { let x =0; }
    analogWrite(VIB, 0);
    d=Date.now()+offms; 
    while(d > Date.now() ) { let x =0; }
  }
};
function buzzClock (h,m) {
  // skip if either lockout or canceled: 10 or 01 (i.e. not 0)
  if(buzzLock) {
    buzzLock &= 0b10;
    console.log('no buzz..resetting');
    return;
  }
  console.log('buzzing');
  // vibrate: long = 5, short = 1
  const lvl = 0.8, LONGBZ = 600, SHORTBZ = 150;
  // hours
  let n = Math.floor(h/5);
  if(n) vibrate(lvl, n, LONGBZ, 100);
  vibrate(lvl, h%5, SHORTBZ, 200);
  // delay
  vibrate(0.0, 1, 500, 500);
  // 10 mins - always single pulses
  n = Math.floor(m/10);
  if(n) vibrate(lvl, n, SHORTBZ, 200);
  vibrate(0.0, 1, 500, 500);
  // 1 mins
  if(m % 10 >= 5){ vibrate(lvl, 1, LONGBZ, 100); m -= 5; }
  vibrate(lvl, m%5, SHORTBZ, 200);
  // lockout for one minute
  buzzLock |= 0b10;
  setTimeout(function() { buzzLock &= 0b01; }, 60000);
}

function drawClock(){
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  let nm = false;
  if(hr > 20 || hr < 8) {
    nm = true;
  }
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);
  xmid = 40;
  if(EMULATOR) xmid=120;

  if(!nm) {
    let xyz = F07.accCoords();
    //console.log(JSON.stringify(xyz));
    if(xyz.x < -2 || xyz.x > 58 || xyz.y < -12 || xyz.y > 20) {
      g.off();
      buzzLock |= 1;
      //console.log('Canceling buzz');
      return;
    }
  }
  g.on();

  if (tm == lastTime) return;
  lastTime = tm;
  
  g.clear();
  g.setFont("6x8");
  if(!nm) {
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    let batt = battInfo();
    g.drawString(batt,xmid-g.stringWidth(batt)/2,0);
  } else {
    g.setColor(4);
    let b = battLevel();
    for(let c=0; c<5; c++) {
      if(b > c*20) g.fillCircle(8+16*c, 8, 6);
      else g.drawCircle(8+16*c,8,6);
    }
  }

  if(nm) {
    rotate = true;
    g.setColor(4);
    if(EMULATOR) g.setColor(0.5,0.5,0.5);
    if (hr>9) drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);
    g.fillCircle(40, 80,2);
    g.fillCircle(24, 80,2);
    g.flip();
  } else {
    rotate = false;
    g.setColor(8+7);
    if(EMULATOR) g.setColor(1,1,1);
    drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);

    g.setFont("6x8",2); 
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    var dt=d[1]+" "+d[2];
    g.drawString(dt,xmid-g.stringWidth(dt)/2,146);
    g.flip();
    console.log('buzing in 3...');
    buzzLock &= 0b10;
    setTimeout(buzzClock, 3000, hr, min);
  }
}

function clock(){
  volts=0;
  drawClock();
  return setInterval(function(){
    drawClock();
  },777);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  currscr=-1;
  return 0;
}

var screens=[clock,info,sleep];
var currscr= -1;
var currint=0;//screens[currscr]();
let longpress = 0;

const btnDown = (b) => {
  longpress = b.time;
  setWatch(btnUp, BTN1, { repeat:false, edge:'falling', debounce:25});
};
const btnUp = (b) => {
  if(b.time - longpress > 1.0) {
    currscr++;if (currscr>=screens.length) currscr=0;
    if (currint>0) clearInterval(currint);
    currint=screens[currscr]();
  }
  setWatch(btnDown, BTN1, { repeat:false, edge:'rising', debounce:25});
};

setWatch(btnDown, BTN1, { repeat:false, edge:'rising', debounce:25});



// auto launch
currscr = 0;
currint=screens[currscr]();

/* try tap detection feature
D17.mode("input_pulldown"); // irq2 pin
accWriteReg(0x21,0x0E); // //latch irq for 50ms
accSetBit(0x16,5); // single tap enable
accSetBit(0x1b,5); // map it to int2
accLowPowerMode(1);
accWriteReg(0x2b,(3<<6)|4) //tap sensitivity  

// values are 4=face tap, 2=side tap, 1=bottom or top side tap
setWatch(()=>{
      var rv = accRegRead(0x0b);
      var v = (rv&0x7f)>>4;
      v  = rv&0x80?-v:v;
      print("tap ",v);
},D17,{ repeat:true, debounce:false, edge:'rising' });
*/
