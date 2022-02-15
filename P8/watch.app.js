require("blocky.fnt").add(Graphics);
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


const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65024,41977,41976,0]),
  buffer : E.toArrayBuffer(atob("AAAEkAAAAAAkkAAAAAEkkAAAAAkkgAAAAEkkgAAAAEkkgAAAEEkkkAAAkEkkkAEgkEkkkAEkkEkkkAkkkkkkkgkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkEkkkkkkkAkkkkkkgAEkkkkkAAAkkkkgAAAEkkkAAAAAkkkAA"))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([0,0,0x0680,0]),
  buffer : E.toArrayBuffer(atob("AAAAAAACSAAAAAAAAASSQAAAAAAACSSSAAAAAAACSSSAAAAAAACSSSAAAAAAACSSSAAAAAAACSSSAAASQAAASSQAACSSAAASSQAASSSQAASSQAASSSQAAAAAAASSSQAASSQAASSSQAASSQAASSSQAASSQAACSSAAASSQAACSSAAAAAAAACSSAAAAAAAAAAAAAAAAAAACSSAAAAAAAACSSAAAAAAAACSSAAAAAAAACSSAAAAAAAA="))
};

const imgPulse = {
  width: 22, height: 21, bpp: 3,
  transparent: 1,
  palette: new Uint16Array([63488,63488]),
  buffer : E.toArrayBuffer(atob("JIAAJJJAABJJAAABJIAAAJIAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAABJAAAAAAAAAJJIAAAAAAABJJIAAAAAAABJJJAAAAAAAJJJJIAAAAABJJJJJAAAAAJJJJJJIAAABJJJJJJIAAABJJJJJJJAAAJJJJJJJJIABJJJJJJJJJAJJJJJJJJJJJJJJJJA"))
};

/*
** BEGIN WATCH FACE
*/

const startX=[10,60,130,180],startY=[70,70,70,70],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=1.25,yS=1.25;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];EMULATOR&&(a+=80),drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
/*
** END WATCH FACE
*/
var volts;
var batt=battInfo();
let lastTime = '    ';
let EMULATOR = false; 
let showClockTO = 0;
let faceAlreadyUp = false;
let bg = "#301830";

function checkClock() {
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  let nm = false;

  if((hr > 20 || hr < 8)) {
   //  nm = true;
  }

  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);

  if(nm) {
    drawNightClock({hr:hr,min:min});
    lastTime = tm;
    return;
  }
  /**/
  if(ACCEL.isFaceUp()) {
    if(!faceAlreadyUp) {
      // delay, in case we're 'passing through'
      showClockTO = setTimeout(()=>{
        ACCEL.emit("faceup");
      }, 1000);
      faceAlreadyUp = true;
    }
  } else {
    // now face down
    if(showClockTO) clearTimeout(showClockTO);
    faceAlreadyUp = false;
    return;
  }
  /**/
  drawDayClock({hr:hr,min:min,dt:d[1]+" "+d[2]});
}

function drawDayClock(d) {
  let tm=('0'+d.hr).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) return;
  //console.log("tm/last= "+tm+" "+lastTime);

  //g.setBgColor(bg); //0.2,0.1,0.2);
  //g.clear();
  //g.setFont("8x16");
  g.setFont("Blocky",1);

  g.setColor(0.9,0.9,0.4);
  let batt = ' '+Math.floor(battLevel())+'%';
  g.drawString(batt,232-g.stringWidth(batt),2,true);
  g.drawString(d.dt+' ',8,2,true);


  rotate = false;
  for(let i=0; i<4; i++) {
    //console.log(tm[i],lastTime[i]);
    if(tm[i] != lastTime[i]) {
      g.setColor(bg);
      g.fillRect(
       startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS
      );
      let c = i > 1 ? '#ffffff' : '#80ffff';
      g.setColor(c);
      drawDigit(i,tm[i], false);
    }
  }
  lastTime = tm;

  g.fillCircle(117, 105, 4);
  g.fillCircle(117, 135, 4);

  //g.setFont("KNXT",2);
  g.setColor(0.4,0.8,0.8);
  if(EMULATOR) g.setColor(0,1,0);

  g.drawImage(imgCalorie, 40, 180);
  g.drawImage(imgStep, 110, 180);
  g.drawImage(imgPulse, 180, 180);
  
  g.drawString('000', 30, 206);
  g.drawString(('00000'+getSteps()).slice(-5), 90, 206, true);
  g.drawString('000', 176, 206);
  
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
  g.clear();
  g.flip();
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

g.setBgColor(bg);
var screens=[clock,sleep];
var currscr= 0;
var currint=screens[currscr]();

let SCstate = 0;
let SCcnt = 0;
let SCprev, SCcurr;
let SCintvl = 0;
let cl = console.log;

let SC = () => { 
  SCcurr = ACCEL.getCoords();
  if(SCcurr.x > 128) SCcurr.x -= 256;
  if(SCcurr.y > 128) SCcurr.y -= 256;
  if(SCcurr.z > 128) SCcurr.z -= 256;
  if(!SCprev) { SCprev=SCcurr; return;}
  let v = {
    x: Math.abs(SCprev.x-SCcurr.x),
    y: Math.abs(SCprev.y-SCcurr.y),
    z: Math.abs(SCprev.z-SCcurr.z),
  };
  cl(`c=${JSON.stringify(SCcurr)} v=${JSON.stringify(v)}`);
  if(SCcurr.x > -24 && SCcurr.y > 10) {
    if(!SCstate) {SCstate = 1;
    cl('up: v='+JSON.stringify(v));}
  } else if(SCcurr.y < -5) {
    if(!SCstate) {SCstate = 1;
    cl('dn: v='+JSON.stringify(v));}
  } else if(SCstate) {
    cl('reset');
    if(v.x > 9) {
      SCcnt++;
      cl(`STEP:${SCcnt} v=${JSON.stringify(v)}`);
    }
    SCstate = 0;
  }
  SCprev = SCcurr;
}; //, 250);

let getSteps = () => {return (SCcnt);};
