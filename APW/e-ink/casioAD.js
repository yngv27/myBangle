/*
g1=g;
g=Graphics.createArrayBuffer(200,200,1,{msb:true});
g.flip = ()=>{g1.drawImage(g,0,0);}
*/
g.clear().setBgColor(-1).setColor(0).clearRect(0,0,199,199);
g.setBgColor(-1).setColor(0).clear();

function drawRoundRect(x0, y0, x1, y1, r, f) {
  g.C = g.drawCircle;
  g.R = g.drawRect;
  if(f) {g.C=g.fillCircle; g.R=g.fillRect;}
  //g.setColor(1,0,0).drawRect(x0,y0,x1,y1);
 // g.setColor(0,1,0);
  print("here");
  // two rectangles
  g.R(x0,y0+r,x1,y1-r);
  g.R(x0+r,y0,x1-r,y1);
  // four circles
  g.C(x0+r,y0+r,r);
  g.C(x0+r,y1-r,r);
  g.C(x1-r,y0+r,r);
  g.C(x1-r,y1-r,r);
  // erase your mistakes
  if(!f) {
    g.clearRect(x0+1,y0+r,x1-1,y1-r);
    g.clearRect(x0+r,y0+1,x1-r,y1-1);
  }
  print('there');
}
g.setColor(0);
drawRoundRect(8,8,192,192, 8, true);
g.setColor(-1);
drawRoundRect(16,16,112,112, 5, true);
drawRoundRect(16,120,184,184, 5, true);
drawRoundRect(120,64,184,112, 5, true);
// *

//_S=require("Storage");

//g.flip();
Graphics.prototype.rotatePoly = (pArr, angle, xoff, yoff) => {
      let newArr = [];
      let a = angle;// * pRad;
      for(let i=0; i<pArr.length ; i+= 2) {
        newArr[i] = Math.round(xoff + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1]);
        newArr[i+1] =  Math.round(yoff + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1]);
      }
      return newArr;
    };
    
function clock() {
  //g.clear();
  let size=48;
  let cx=64, cy=64;
  let arr = [0,0-size, 0,size];
  let hrhd = [-2,-12, 0,size-20, 2,-12];
  //let mnhd = [0,-8, 0,size-8];
  let mnhd = [-2,-12, 0,size-3, 2,-12];

  //g.setPixel(x,y);
  ToRad = Math.PI/180;
  for(let a=0; a < 180; a+= 30) {
    let pts = g.rotatePoly(arr, a*ToRad, cx, cy);
    g.drawLine(pts[0],pts[1],pts[2],pts[3]);
  }
  g.setColor(-1).fillCircle(cx,cy, size-8).setColor(0);
  for(let a=0; a < 180; a+= 90) {
    let pts = g.rotatePoly(arr, a*ToRad, cx, cy);
    g.drawLine(pts[0],pts[1],pts[2],pts[3]);
  }
  g.setColor(-1).fillCircle(cx,cy, size-12).setColor(0);

  d = new Date();
  d = {hr: d.getHours(), min: d.getMinutes() };
  let a = (d.hr * 60 + d.min) * Math.PI / 360;
  let pts = g.rotatePoly(hrhd, a, cx, cy);
  g.fillPoly(pts,true);

  a = d.min / 30 * Math.PI;
  pts = g.rotatePoly(mnhd, a, cx, cy);
  //g.drawLine(pts[0],pts[1],pts[2],pts[3]);
  g.fillPoly(pts,true);
  
  g.setColor(-1).fillCircle(cx,cy,4);
  g.setColor(0).drawCircle(cx,cy,4);
  g.flip();
  if(d.min >= 57) setTimeout(()=>{g.init();}, 5000); // full refresh on hour
  if(d.min == 0) setTimeout(()=>{g.setPartial();}, 5000); // back to partial

}

