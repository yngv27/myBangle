let _lFont_xS = 4;
let _lFont_yS = 6;
let _lFont_ch = 
JSON.parse(atob('eyJOIjpbWzAsMl0sWzAsMF0sWzIsMl0sWzIsMF1dLCJPIjpbWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl0sWzAsMF1dLCJQIjpbWzAsMl0sWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV1dLCJRIjpbWzIsMl0sWzAsMl0sWzAsMF0sWzIsMF0sWzIsMl0sWzEsMV1dLCJSIjpbWzAsMl0sWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV0sWzEsMV0sWzIsMl1dLCJTIjpbWzIsMF0sWzAsMF0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl1dLCJUIjpbWzAsMF0sWzIsMF0sWzEsMF0sWzEsMl1dLCJVIjpbWzAsMF0sWzAsMl0sWzIsMl0sWzIsMF1dLCJWIjpbWzAsMF0sWzEsMl0sWzIsMF1dLCJXIjpbWzAsMF0sWzAsMl0sWzEsMV0sWzIsMl0sWzIsMF1dLCJYIjpbWzAsMF0sWzIsMl0sWzEsMV0sWzIsMF0sWzAsMl1dLCJZIjpbWzAsMF0sWzEsMV0sWzIsMF0sWzEsMV0sWzEsMl1dLCJaIjpbWzAsMF0sWzIsMF0sWzAsMl0sWzIsMl1dLCJBIjpbWzAsMl0sWzAsMV0sWzEsMF0sWzIsMV0sWzAsMV0sWzIsMV0sWzIsMl1dLCJDIjpbWzIsMF0sWzEsMF0sWzAsMV0sWzEsMl0sWzIsMl1dLCJCIjpbWzAsMF0sWzEsMF0sWzEsMV0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl0sWzAsMF1dLCJEIjpbWzAsMF0sWzEsMF0sWzIsMV0sWzEsMl0sWzAsMl0sWzAsMF1dLCJFIjpbWzIsMF0sWzAsMF0sWzAsMV0sWzEsMV0sWzAsMV0sWzAsMl0sWzIsMl1dLCJGIjpbWzIsMF0sWzAsMF0sWzAsMV0sWzEsMV0sWzAsMV0sWzAsMl1dLCJHIjpbWzIsMV0sWzIsMl0sWzAsMl0sWzAsMF0sWzIsMF1dLCJIIjpbWzAsMF0sWzAsMl0sWzAsMV0sWzIsMV0sWzIsMF0sWzIsMl1dLCJJIjpbWzAsMF0sWzIsMF0sWzEsMF0sWzEsMl0sWzAsMl0sWzIsMl1dLCJKIjpbWzIsMF0sWzIsMl0sWzAsMl0sWzAsMV1dLCJLIjpbWzAsMF0sWzAsMl0sWzAsMV0sWzEsMV0sWzIsMF0sWzEsMV0sWzIsMl1dLCJMIjpbWzAsMF0sWzAsMl0sWzIsMl1dLCJNIjpbWzAsMl0sWzAsMF0sWzEsMV0sWzIsMF0sWzIsMl1dLCIwIjpbWzAsMl0sWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl0sWzIsMF1dLCIxIjpbWzEsMF0sWzEsMl1dLCIyIjpbWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV0sWzAsMl0sWzIsMl1dLCIzIjpbWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl1dLCI0IjpbWzAsMF0sWzAsMV0sWzIsMV0sWzIsMF0sWzIsMl1dLCI1IjpbWzIsMF0sWzAsMF0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl1dLCI2IjpbWzIsMF0sWzAsMF0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl0sWzAsMV1dLCI3IjpbWzAsMF0sWzIsMF0sWzEsMV0sWzEsMl1dLCI4IjpbWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl0sWzAsMF0sWzAsMV0sWzIsMV1dLCI5IjpbWzIsMV0sWzAsMV0sWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl1dLCIsIjpbWzEsMV0sWzEsMl0sWzAsMl1dLCIuIjpbWzEsMV0sWzEsMl1dLCIhIjpbWzAsMF0sWzEsMF0sWzAsMl0sWzAsMF1dfQ=='));


exports.setScale = function (xs, ys) {
  _lFont_xS = xs/2;
  _lFont_yS = ys/2;
}

function drawThatChar(arr, xOff, yOff) {
  if(!arr) return;
  let newArr = [];
  for(let idx = 0; idx < arr.length; idx++) {
    newArr.push(arr[idx][0]*_lFont_xS+xOff, arr[idx][1]*_lFont_yS+yOff);
  }
  g.drawPoly(newArr, false);
}

exports.drawString = function (str, x, y) {
  let xOff = x;
  str = str.toUpperCase();
  for(let idx = 0; idx < str.length; idx++ ) {
    //console.log((1+xS)*idx);
    drawThatChar(_lFont_ch[str[idx]], xOff, y);
    xOff += 2+_lFont_xS*2;
    if(xOff > 239) break;
  }
}
