
g.clear();

let fnt = {};
fnt[' '] = 'M0,0';
fnt.A = 'M0,4 L0,2 L1,0 L2,2 L2,4 M0,2 L2,2';
fnt.P = 'M0,4 L0,0 L1,0 L2,1 L1,2 L0,2';
fnt.B = fnt.P + ' L1,2 L2,3 L1,4 L0,4'; 
fnt.C = 'M2,0 L1,0 L0,1 L0,3 L1,4 L2,4';
fnt.D = 'M0,0 L0,4 L1,4 L2,3 L2,1 L1,0 L0,0';
fnt.O = 'M0,1 L1,0 L2,1 L2,3 L1,4 L0,3 L0,1';
fnt.Q = fnt.O + ' M2,4 L1,3';
fnt.a = 'M0,1 L1,1 L2,2 L2,4 L0,4 L0,3 L1,2 L2,2';
fnt.e = 'M0,2 L2,2 L1,1 L0,1 L0,3 L1,4 L2,4';
fnt.l = 'M1,0 L1,4';
fnt.m = 'M0,4 L0,1 L1,1 L1,4 M1,1 L2,2 L2,4';
fnt.n = 'M0,4 L0,1 L1,1 L2,2 L2,4';
fnt.r = 'M0,4 L0,2 L1,1 L2,1';
fnt.s = 'M2,1 L1,1 L0,2 L2,2 L2,3 L1,4 L0,4';
fnt.t = fnt.l + ' M0,1 L2,1';

fnt.u = 'M0,1 L0,3 L1,4 L2,4 L2,1';
fnt.v = 'M0,1 L0,3 L1,4 L2,3 L2,1';
fnt.w = 'M0,1 L0,3 L1,4 L1,1 M1,4 L2,3 L2,1';

let xS = 4;
let yS = 6;

function drawLtr(c, xOrig, yOrig) {
  //g.moveTo(xOrig, yOrig);
  let points = fnt[c].split(' ');
  for(let i = 0; i < points.length; i++) {
    //console.log(c + '::' + points[i]);
    let action = points[i][0];
    let x = points[i][1];
    let y = points[i][3];
    if(action === 'M') {
      g.moveTo(x * xS + xOrig, y*yS + yOrig);
    } else {
      g.lineTo(x * xS + xOrig, y*yS + yOrig);
    }
  }
}

function drawString(str, xOrig, yOrig) {
  let x = xOrig;
  while(str) {
    drawLtr(str[0], x+xOrig, yOrig);
    x += xS * 2 + 2;
    str = str.slice(1);
  }
}

drawString('Pvue DOB wrestlne', 10, 10);
