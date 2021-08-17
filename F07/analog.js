const EMULATOR = false;
let _Storage = require("Storage");

eval(_Storage.read("F07.js"));
require("omnigo.fnt").add(Graphics);

const logD = (msg) => { console.log(msg); };

let myFont = "Omnigo";

/*
** BEGIN WATCH FACE
*/
function transformVertices(arr, opts) {
  let a = opts.rotate+Math.PI;
  let newarr = [];
  for(let i=0; i<arr.length; i+= 2) {
    //arr[i] = arr[i]*Math.sin(a)+opts.x;
    //arr[i+1] = arr[i+1]*Math.cos(a)+opts.y;
    newarr[i] = opts.x + Math.cos(a)*arr[i] + Math.sin(a)*arr[i+1];
    newarr[i+1] = opts.y+ Math.sin(a)*arr[i] - Math.cos(a)*arr[i+1];
  }
  return newarr;
}
g.transformVertices = transformVertices;
/*
** END WATCH FACE
*/

//require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x8").add(Graphics);
//require("Font8x16").add(Graphics);

let to;
function goDark(s) {
  if(to) clearTimeout(to);
  to = setTimeout(sleep, s*1000);
}


function info(t,msg){
  g.clear();
  g.setFont(myFont,1);
  g.setColor(10);
  g.drawString(t, 0,0);
  g.setColor(14);

  let lines = msg.split('|');
  for(let q=0; q < lines.length; q++) {
    g.drawString(lines[q], 0, 20+q*g.getFontHeight());
  }
  g.flip();
  goDark(30);
}

function HRM(){
  F07.setHRMPower(true);
  g.setFont(myFont,3);
  drawHRM();
  goDark(30);
  return setInterval(function(){
    drawHRM();
  },2000);
}

function drawHRM(){
  g.clear();
  g.setColor(14);
  g.drawString(F07.getHRMValue(), 0, 80);
  g.flip();
}

function drawClock(){
  var d=Date();
  d=d.toString().split(' ');
  var hr=parseInt(d[4].substr(0,2));
  var min=d[4].substr(3,2);

  hr %= 12;
  //if (hr === 0) hr = 12;
  min = parseInt(min);
  
  const mHand = [-1,-2,-1,-40,1,-40,1,-2];
  const hHand = [-2,-2,-2,-30,2,-30,2,-2];
  //const tiks = [-2,80,-2,-80,2,-80,2,80];
  const rnums = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  let tx = [0, 32, 32, 32, 32, 32];
  let ty = [-72, -58, -18, 0, 18, 58, 72];
  xoff = 40; yoff = 80;
  if(EMULATOR) {xoff=120; yoff=120;}

  g.clear();
  g.setColor(EMULATOR?'#FFFFFF':15);
  for(let t=0; t<6; t++) {
    //let t0 = g.transformVertices(tiks, {x:xoff,y:yoff,rotate:Math.PI/6*t});
    //g.fillPoly(t0,true);
    g.drawString(rnums[t], tx[t]+xoff-4, ty[t]+yoff-4);
    g.drawString(rnums[t+6], xoff-tx[t]-4, ty[6-t]+yoff-4);
  }
  //g.clearRect(xoff-36,yoff-76,xoff+36,yoff+76);
  //g.drawRect(xoff-40, yoff-80,xoff+40,yoff+80);

  g.setColor(15);
  let m = g.transformVertices(mHand,{x:xoff,y:yoff,rotate:Math.PI*min/30});
  g.fillPoly(m, true);
  if (!EMULATOR) g.setColor(7);
  let h = g.transformVertices(hHand,{x:xoff,y:yoff,rotate:Math.PI*(hr*60+min)/360});
  g.fillPoly(h, true);
  
  g.flip();
  goDark(30);
  
}

let flipOn = 0; // for accel
function clock(){
  g.setFont(myFont,1);
  drawClock();
  /*
  flipOn = setInterval(function() {
    let xyz = F07.getAccel();
    console.log(JSON.stringify(xyz));
    if(xyz.x > -2 && xyz.x < 32 && xyz.y > -12 && xyz.y <= 20) 
      g.on();
    else
      g.off();
  }, 1200);
  */
  return setInterval(function(){
    drawClock();
  },60000);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  //F07.setHRMPower(false);
  currscr=-1;
  if (currint>0) clearInterval(currint);
  return 0;
}

function runScreen(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  if (flipOn) clearInterval(flipOn);
  currint=screens[currscr]();
  console.log('currint='+currint);
  //vibrate(1,1,100,0);

}

var screens=[clock,sleep];
var currscr= -1;
var currint=0;
setWatch(runScreen, BTN1,{ repeat:true, edge:'rising',debounce:25 }
);
