eval(require("Storage").read("dk08.js"));

require("Font8x16").add(Graphics);
let p82dk = 11/15;

//let battInfo = () => { return ""; };

const imgCalorie = {
  width : 16, height : 22, bpp : 2,
  transparent : 1,
  palette : new Uint16Array([8,0]),
  buffer : E.toArrayBuffer(atob("VVQFVVVQBVVVQAVVVQAVVVQAFVVUABVVRAAFVQQABUEEAAVABAAFAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABQAAABVAAABVUAABVVQABVVVAAVQ=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 2,
  transparent : 0,
  palette : new Uint16Array([12,9,9,0]),
  buffer : E.toArrayBuffer(atob("AAAAAqAAAAAAqoAAAAAqqgAAAAKqoAAAACqqAAAAAqqgAAAAKqoACoAAqoACqgAKqACqqACqgAqqgAAAAKqoAKqACqqACqgAqqgAqoACqgAKqAAqoAAAAAKqAAAAAAAAAAAAAqoAAAAAKqAAAAACqgAAAAAqoAAAAA=="))
};

const imgPulse = {
  width : 22, height : 22, bpp : 2,
  transparent : 1,
  palette : new Uint16Array([4, 15]),
  buffer : E.toArrayBuffer(atob("VABVUAFVAAFUAAVAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAABUAAAAABVQAAAABVUAAAAAVVQAAAAVVVAAAAVVVUAAAVVVVQAAVVVVUAAFVVVVQAFVVVVVAFVVVVVUFVVVVVVVVVVVVVVVVVQ=="))
};

/*
** BEGIN WATCH FACE
*/

const startX=[6,47,95,136],startY=[40,40,40,40],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=1,yS=1;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];EMULATOR&&(a+=80),drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
/*
** END WATCH FACE
*/
var volts;
var batt=battInfo();
let lastTime = '    ';
let EMULATOR = false; 
let showClockTO = 0;
let faceAlreadyUp = false;
let bg = 0;

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
  /*
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
  */
  drawDayClock({hr:hr,min:min,dt:d[1]+" "+d[2]});
}

function drawDayClock(d) {
  let tm=('0'+d.hr).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) return;
  console.log("tm/last= "+tm+" "+lastTime);

  //g.setBgColor(bg); //0.2,0.1,0.2);
  //g.clear();
  g.setFont("8x16");
  //g.setFont("KNXT",1);

  g.setColor(0);
  let batt = ' '+Math.floor(battLevel())+'%';
  g.drawString(batt,175-g.stringWidth(batt),2,true);
  g.drawString(d.dt,8,2,true);


  rotate = false;
  for(let i=0; i<4; i++) {
    console.log(tm[i],lastTime[i]);
    if(tm[i] != lastTime[i]) {
      g.setColor(15);
   g.fillRect(startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      g.setColor(0);
      drawDigit(i,tm[i], false);
    }
  }
  lastTime = tm;

  g.fillCircle(88,  74, 3);
  g.fillCircle(88,  98, 3);

  //g.setFont("KNXT",2);
  
  g.setColor(0);

  g.drawImage(imgCalorie, 30, 125);
  g.drawImage(imgStep, 80, 125);
  g.drawImage(imgPulse, 130, 125);
  
  g.drawString('000', 26, 148, true);
  g.drawString(('00000'+getSteps()).slice(-5), 70, 148, true);
  g.drawString('000', 130, 148, true);
  
  /*
  console.log('buzing in 3...');
  buzzLock &= 0b10;
  setTimeout(buzzClock, 3000, hr, min);
  */
  g.flip();
}

function clock(){
  volts=0;
  return setInterval(function(){
    checkClock();
  },500);
}

function sleep(){
  g.clear();
  currscr=-1;
  return 0;
}

var screens=[clock,sleep];
var currscr= 0,currint;

let SCstate = 0;
let SCcnt = 0;
let SCprev, SCcurr;

let getSteps = () => {return (SCcnt);};

function waitForDisplay() {
  g.setBgColor(15);
  g.clear();
  g.setColor(0);
  currint=screens[currscr]();
}

setTimeout(waitForDisplay, 500);
//setTimeout(otherThing, 500);

function otherThing() {
  g.setBgColor(0);
  g.clear();
  for(let x=0; x < 8; x++) {
    for(let y =0; y<8; y++) {
      g.setColor(y+8*x);
      g.fillRect(4+x*10, 4+y*10, x*10+12, y*10+12);
    }
  }
  g.flip();
}
