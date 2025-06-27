/*
** simple ticks, polygon hands, resizeable 
** for monochrome screens
*/

function clock() {
    g.clear();
    let size=48;
    let cx=48, cy=48;
    let arr = [0,0-size, 0,size];
    let hrhd = [-1,-8, 0,size-20, 1,-8];
    let mnhd = [0,-8, 0,size-8];
  
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
    g.drawPoly(pts,true);
  
    a = d.min / 30 * Math.PI;
    pts = g.rotatePoly(mnhd, a, cx, cy);
    g.drawLine(pts[0],pts[1],pts[2],pts[3]);
    g.setColor(-1).fillCircle(cx,cy,3);
    g.setColor(0).drawCircle(cx,cy,3);
    g.flip();
    if(d.min == 58) setTimeout(()=>{g.init();}, 5000); // full refresh on hour
    if(d.min == 0) setTimeout(()=>{g.setPartial();}, 5000); // back to partial
  
  }
  