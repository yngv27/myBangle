

function battVolts(){
  return P8.batV();
}

function battLevel(v){
  var l=3.3,h=4.1;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}



//require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
require("Font8x16").add(Graphics);


/*
** BEGIN WATCH FACE
*/

const startX=[10,60,130,180],startY=[70,70,70,70],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=1.25,yS=1.25;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];EMULATOR&&(a+=80),drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
/*
** END WATCH FACE
*/
var volts;
var batt=battInfo();
let lastTime = '';
let EMULATOR = false; 
let Sixay = "e6:a5";
let Eebie = "eb:7b";
let showClockTO = 0;


function checkClock() {
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  let nm = false;
  
  if((hr > 20 || hr < 8)) {
    nm = true;
  }
  nm=false;
  
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);
  xmid = 40;
  if(EMULATOR) xmid=120;

  //nm = true;

  if(nm) {
    drawNightClock({hr:hr,min:min});
    lastTime = tm;
    
    return;
  }
  drawDayClock({hr:hr,min:min,dt:d[1]+" "+d[2]});
  
}
function drawDayClock(d) {
  let tm=d.hr+':'+d.min;
  if (tm == lastTime) return;
  lastTime = tm;
  //console.log("here");
  let xmid=120;

  g.clear();
  g.setFont("8x16");

  g.setColor(0.8,0.8,0.4);
  let batt = battInfo();
  g.drawString(batt,xmid-g.stringWidth(batt)/2,0);

  rotate = false;
  g.setColor(0.7,0.7,0.7);
  drawDigit(0,Math.floor(d.hr/10), false);
  drawDigit(1,Math.floor(d.hr%10), false);
  g.setColor(0.8,0.8,0.8);
  drawDigit(2,Math.floor(d.min/10), false);
  drawDigit(3,Math.floor(d.min%10), false);
  g.fillCircle(120, 105, 3);
  g.fillCircle(120, 135, 3);

  g.setFont("8x16",2); 
  g.setColor(0.4,0.8,0.8);
  if(EMULATOR) g.setColor(0,1,0);
  
  g.drawString(d.dt,xmid-g.stringWidth(d.dt)/2,200);
  

  g.flip();
  /*
  console.log('buzing in 3...');
  buzzLock &= 0b10;
  setTimeout(buzzClock, 3000, hr, min);
  */
}

function drawNightClock(d) {
    g.clear();
    rotate = false;
    g.setColor(0.5,0,0);
    if(EMULATOR) g.setColor(0.5,0.5,0.5);
    if (d.hr>9) drawDigit(0,Math.floor(hr/10), true);
    drawDigit(1,Math.floor(d.hr%10), true);
    drawDigit(2,Math.floor(d.min/10), true);
    drawDigit(3,Math.floor(d.min%10), true);
    g.fillCircle(40, 80,2);
    g.fillCircle(24, 80,2);
    let b = battLevel();
    for(let c=0; c<5; c++) {
      if(b > c*20) g.drawCircle(16+12*c, 8, 4);
      //else g.drawCircle(14+12*c,8,4);
    }
    g.flip();
}

function clock(){
  volts=0;
  return setInterval(function(){
    checkClock();
},777);
}

function sleep(){
  g.clear();
  currscr=-1;
  return 0;
}

var screens=[clock,sleep];
var currscr= 0;
var currint=screens[currscr]();
