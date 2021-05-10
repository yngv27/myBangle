g.clear();

// ok, math boy...
function doIt(x0, y0, rX, rY) {
  g.setColor("#C0C0C0");
  //g.drawEllipse(x0-rX, y0-rY, x0+rX, y0+rY);
  g.setColor("#FFFF00");
  let arr1 = [], arr2 = [], arr3 = [], arr4 =[];
  for(let a = Math.PI; a <= 3*Math.PI/2; a+= Math.PI/18) {
    let x = Math.floor(Math.cos(a)*rX);
    let y = Math.floor(Math.sin(a)*rY);
    //g.drawEllipse(x0+x-2,y0+y-2,x0+x+2,y0+y+2);
    // add to end of Quad1 and 4, to BEG of Quad 2, 3 to maintain clockwise
    arr1.push(x0+x, y0+y);
    arr2.unshift(x0-x, y0+y);
    arr3.unshift(x0+x, y0-y);
    arr4.push(x0-x, y0-y);
  }
  // quadrants in correct order!
  let arr = arr1.concat(arr2).concat(arr4).concat(arr3);
  console.log(arr);
  g.setColor("#FF0000");
  g.drawPoly(arr, true);
  g.setColor("#00FF00");
  //g.drawPoly(arr2, true);
  g.setColor("#0000FF");
  //g.drawPoly(arr3, true);
  g.setColor("#FF00FF");
  //g.drawPoly(arr4, true);
}

doIt(120, 120, 90, 90);