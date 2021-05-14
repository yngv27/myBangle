
/*
a. b. c.

d. e. f.

g. h. i.

*/
/*
let ax = [0, 0];
let bx = [1, 0];
let cx = [2, 0];
let dx = [0, 1];
let ex = [1, 1];
let fx = [2, 1];
let gx = [0, 2];
let hx = [1, 2];
let ix = [2, 2];

let ch = {};
ch.N = [gx, ax, ix, cx];
ch.O = [ax, cx, ix, gx, ax];
ch.P = [gx, ax, cx, fx, dx];
ch.Q = [ix, gx, ax, cx, ix, ex];
ch.R = [gx, ax, cx, fx, dx, ex, ix];
ch.S = [cx, ax, dx, fx, ix, gx];
ch.T = [ax, cx, bx, hx];
ch.U = [ax, gx, ix, cx];
ch.V = [ax, hx, cx];
ch.W = [ax, gx, ex, ix, cx];
ch.X = [ax, ix, ex, cx, gx];
ch.Y = [ax, ex, cx, ex, hx];
ch.Z = [ax, cx, gx, ix];
ch.A = [gx, dx, bx, fx, dx, fx, ix];
ch.C = [cx, bx, dx, hx, ix];
ch.B = [ax, bx, ex, dx, fx, ix, gx, ax];
ch.D = [ax, bx, fx, hx, gx, ax];
ch.E = [cx, ax, dx, ex, dx, gx, ix];
ch.F = [cx, ax, dx, ex, dx, gx];
ch.G = [fx, ix, gx, ax, cx];
ch.H = [ax, gx, dx, fx, cx, ix];
ch.I = [ax, cx, bx, hx, gx, ix];
ch.J = [cx, ix, gx, dx];
ch.K = [ax, gx, dx, ex, cx, ex, ix];
ch.L = [ax, gx, ix];
ch.M = [gx, ax, ex, cx, ix];
ch['0'] = [gx, ax, cx, ix, gx, cx];
ch['1'] = [bx,hx];
ch['2'] = [ax, cx, fx, dx, gx, ix];
ch['3'] = [ax, cx, fx, dx, fx,ix, gx];
ch['4'] = [ax, dx, fx, cx,ix];
ch['5'] = [cx, ax, dx, fx, ix, gx];
ch['6'] = [cx, ax, dx, fx, ix, gx ,dx];
ch['7'] = [ax, cx, ex, hx];
ch['8'] = [ax, cx, ix, gx, ax, dx, fx];
ch['9'] = [fx, dx, ax, cx, ix, gx];
ch[','] = [ex, hx, gx];
ch['.'] = [ex, hx];
ch['!'] = [ax, bx, gx, ax];


console.log(JSON.stringify(ch));

console.log(btoa(JSON.stringify(ch)));
*/


let _lFont_xS = 4;
let _lFont_yS = 6;
//*
let _lFont_ch = 
JSON.parse(atob('eyJOIjpbWzAsMl0sWzAsMF0sWzIsMl0sWzIsMF1dLCJPIjpbWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl0sWzAsMF1dLCJQIjpbWzAsMl0sWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV1dLCJRIjpbWzIsMl0sWzAsMl0sWzAsMF0sWzIsMF0sWzIsMl0sWzEsMV1dLCJSIjpbWzAsMl0sWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV0sWzEsMV0sWzIsMl1dLCJTIjpbWzIsMF0sWzAsMF0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl1dLCJUIjpbWzAsMF0sWzIsMF0sWzEsMF0sWzEsMl1dLCJVIjpbWzAsMF0sWzAsMl0sWzIsMl0sWzIsMF1dLCJWIjpbWzAsMF0sWzEsMl0sWzIsMF1dLCJXIjpbWzAsMF0sWzAsMl0sWzEsMV0sWzIsMl0sWzIsMF1dLCJYIjpbWzAsMF0sWzIsMl0sWzEsMV0sWzIsMF0sWzAsMl1dLCJZIjpbWzAsMF0sWzEsMV0sWzIsMF0sWzEsMV0sWzEsMl1dLCJaIjpbWzAsMF0sWzIsMF0sWzAsMl0sWzIsMl1dLCJBIjpbWzAsMl0sWzAsMV0sWzEsMF0sWzIsMV0sWzAsMV0sWzIsMV0sWzIsMl1dLCJDIjpbWzIsMF0sWzEsMF0sWzAsMV0sWzEsMl0sWzIsMl1dLCJCIjpbWzAsMF0sWzEsMF0sWzEsMV0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl0sWzAsMF1dLCJEIjpbWzAsMF0sWzEsMF0sWzIsMV0sWzEsMl0sWzAsMl0sWzAsMF1dLCJFIjpbWzIsMF0sWzAsMF0sWzAsMV0sWzEsMV0sWzAsMV0sWzAsMl0sWzIsMl1dLCJGIjpbWzIsMF0sWzAsMF0sWzAsMV0sWzEsMV0sWzAsMV0sWzAsMl1dLCJHIjpbWzIsMV0sWzIsMl0sWzAsMl0sWzAsMF0sWzIsMF1dLCJIIjpbWzAsMF0sWzAsMl0sWzAsMV0sWzIsMV0sWzIsMF0sWzIsMl1dLCJJIjpbWzAsMF0sWzIsMF0sWzEsMF0sWzEsMl0sWzAsMl0sWzIsMl1dLCJKIjpbWzIsMF0sWzIsMl0sWzAsMl0sWzAsMV1dLCJLIjpbWzAsMF0sWzAsMl0sWzAsMV0sWzEsMV0sWzIsMF0sWzEsMV0sWzIsMl1dLCJMIjpbWzAsMF0sWzAsMl0sWzIsMl1dLCJNIjpbWzAsMl0sWzAsMF0sWzEsMV0sWzIsMF0sWzIsMl1dLCIwIjpbWzAsMl0sWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl0sWzIsMF1dLCIxIjpbWzEsMF0sWzEsMl1dLCIyIjpbWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV0sWzAsMl0sWzIsMl1dLCIzIjpbWzAsMF0sWzIsMF0sWzIsMV0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl1dLCI0IjpbWzAsMF0sWzAsMV0sWzIsMV0sWzIsMF0sWzIsMl1dLCI1IjpbWzIsMF0sWzAsMF0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl1dLCI2IjpbWzIsMF0sWzAsMF0sWzAsMV0sWzIsMV0sWzIsMl0sWzAsMl0sWzAsMV1dLCI3IjpbWzAsMF0sWzIsMF0sWzEsMV0sWzEsMl1dLCI4IjpbWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl0sWzAsMF0sWzAsMV0sWzIsMV1dLCI5IjpbWzIsMV0sWzAsMV0sWzAsMF0sWzIsMF0sWzIsMl0sWzAsMl1dLCIsIjpbWzEsMV0sWzEsMl0sWzAsMl1dLCIuIjpbWzEsMV0sWzEsMl1dLCIhIjpbWzAsMF0sWzEsMF0sWzAsMl0sWzAsMF1dfQ=='));


//*/
function setScale(xs, ys) {
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

function drawString(str, x, y) {
  let xOff = x;
  str = str.toUpperCase();
  for(let idx = 0; idx < str.length; idx++ ) {
    //console.log((1+xS)*idx);
    drawThatChar(_lFont_ch[str[idx]], xOff, y);
    xOff += 2+_lFont_xS*2;
    if(xOff > 239) break;
  }
}
  
  /*
g.setColor(1,1,1);
setScale(6,8);
drawThatString('0314286795', 30, 20);
drawThatString('find a niche', 20, 40);
drawThatString('I AM A SICK PUP', 0, 60);
drawThatString('WALTZ NYMPH! FOR', 0, 80);
drawThatString('QUICK JIGS,', 0, 100);
drawThatString('VEX BUD.', 4, 120);
drawThatString('And for everyone else, please go away', 2, 140);
*/



