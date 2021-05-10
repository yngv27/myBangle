g.clear();


let points = [ 0, 27,
              6, 17,
              17, 7,
              28, 2,
              40,0,
              50,2,
              62,7,
              74, 15,
              79, 25,
              79, 34,
              70, 48,
              58, 53,
              50, 55,
              40, 58,
              30, 62,
              20, 68,
              10, 80,
              0, 99,
              79, 99
              ];

g.moveTo(points[0], points[1]);
for(let idx=1; idx*2 < points.length; idx ++) {
  let x = points[idx*2];
  let y = points[idx*2+1];
  g.drawEllipse(x-2, y-2, x+2, y+2);
  g.lineTo(x, y);
}