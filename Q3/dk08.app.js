

require("omnigo.fnt").add(Graphics);


let battInfo = () => { return "99"; };
let battLevel = () => { return "98"; };

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([65504,64482,65535,62434]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,23558,23559,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([63488,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

/*
** BEGIN WATCH FACE
*/

const startX=[6,47,95,136],startY=[40,40,40,40],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=1,yS=1;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}
/*
** END WATCH FACE
*/
let lastTime = '    ';
let bgc = 0;
let fgc = 7;

function checkClock() {
  let dt=Date();
  let sec=dt.getSeconds();
  let hr=dt.getHours();
  let min=dt.getMinutes();
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

  drawDayClock({ hr:hr, min:min, mon:dt.getMonth(), dt:dt.getDate(), dow:dt.getDay(), sec:sec });
}

function drawDayClock(d) {
  if(d.sec % 2 ) g.setColor(fgc); else g.setColor(bgc);
  g.fillCircle(88,  74, 3);
  g.fillCircle(88,  98, 3);
  

  let tm=('0'+d.hr).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) return;
  //console.log("tm/last= "+tm+" "+lastTime);
  let s = "SUNMONTUEWEDTHUFRISAT".substr(d.dow*3,3) + ' ' + d.dt;

  g.setFont("Omnigo",1);

  g.setColor(fgc);
  let batt = ' '+Math.floor(E.getBattery())+'%';
  g.drawString(batt,175-g.stringWidth(batt),2,true);
  g.drawString(s,8,2,true);
  g.flip();

  rotate = false;
  for(let i=0; i<4; i++) {
    //console.log(tm[i],lastTime[i]);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      g.setColor(fgc);
      drawDigit(i,tm[i], false);
      g.flip();
    }
  }
  lastTime = tm;

  g.setColor(fgc);

  g.drawImage(imgCalorie, 30, 125);
  g.drawImage(imgStep, 80, 125);
  g.drawImage(imgPulse, 130, 125);
  
  g.drawString(' 000 ', 28, 148, true);
  g.drawString(' '+('00000'+getSteps()).slice(-5)+' ', 74, 148, true);
  g.drawString('000', 131, 148, true);
  
  g.flip();
}

g.setBgColor(bgc);
g.clear();
setInterval(checkClock, 500);

let SCstate = 0;
let SCcnt = 0;
let SCprev, SCcurr;

Bangle.on("step",(s)=>{SCcnt=s;});

let getSteps = () => {return (SCcnt);};

