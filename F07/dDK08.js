const startX = [ 10,  45,  10,  45 ];
const startY = [ 16,  16,  78,  78 ];
const nmX = [ 4, 42, 88, 126];
const nmY = [ 12, 12, 12, 12];
let rotate = false;

let xS = .6;
let yS = .6;

function setScale(x, y) {
  xS = x; yS = y;
}

function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] =Math.floor(arr[i+1]*yS) + y;

    if(rotate) {
      let z = newArr[i];
      newArr[i] = 80 - newArr[i+1];
      newArr[i+1] = z;
    }
  }
  //console.log(JSON.stringify(newArr));
  g.fillPoly(newArr, false);
}

/** DIGITS **/

/* zero */
let d0=new Uint8Array([
  40,86,
  35,91,
  5,91,
  0,86,
  0,5,
  5,0,
  35,0,
  40,5,
  40,86,
  30,86,
  30,5,
  10,5,
  10,86,
  ]);

/* one */
let d1=new Uint8Array([
  7,5,
  12,0,
  22,0,
  27,5,
  27,91,
  15,91,
  15,5,
  ]);

/* two */
let d2=new Uint8Array([
  0,5,
   5,0,
   35,0,
  40,5,
  40,43,
  35,48,
  10,48,
  10,86,
  40,86,
  35,91,
  5,91,
  0,86,
  0,48,
  5,43,
  30,43,
  30,5,
  
  ]);
/* three */

let d3=new Uint8Array([
  0,5,
  5,0,
  35,0,
  40,5,
  40,86,
  35,91,
  5,91,
  0,86,
  28,86,
  28,48,
  0,48,
  0,43,
  28,43,
  28,5
]);

/* four */
let d4=new Uint8Array([
 0,5,
  5,0,
  10,0,
  10,43,
  30,43,
  30,0,
  35,0,
  40,5,
  40,91,
  30,91,
  30,48,
  0,48,
  
]);

let d5= new Uint8Array([
  0,5,
  5,0,
  35,0,
  40,5,
  10,5,
  10,43,
  35,43,
  40,48,
  40,85,
  35,90,
  5,90,
  0,85,
  30,85,
  30,48,
  5,48,
  0,43,
  ]);
               
/* six */
let d6 = new Uint8Array(
[
  0,5,
  5,0,
  35,0,
  40,5,
  12,5,
  12,86,
  28,86,
  28,48,
  12,48,
  12,43,
  35,43,
  40,48,
  40,86,
  35,91,
  5,91,
  0,86,
]);

/* seven */
let d7 = new Uint8Array([
   0,5,
  5,0,
  35,0,
  40,5,
  40,90,
  30,90,
  30,5
  ]);

let d8 = new Uint8Array( [
     0,5,
  5,0,
  35,0,
  40,5,
  40,43,
  37,46,
  12,46,
  12,86,
  28,86,
  28,47,
  37,47,
  40,50,
  40,85,
  35,90,
  5,90,
  0,85,
  0,47,
  4,43,
  28,43,
  28,5,
  12,5,
  12,42,
  6,42,
  0,39,
  
   ]);
                
let d9 = new Uint8Array(
  [ 
   0,5,
  5,0,
  35,0,
  40,5,
    40,85,
    35,90,
    5,90,
    0,85,
    30,85,
  30,5,
    10,5,
    10,43,
    30,43,
    30,48,
    5,48,
    0,43,
    
  ]);



/** END DIGITS **/

function drawDigit(pos, dig, nm) {
  let x = nm ? nmX[pos] : startX[pos];
  let y = nm ? nmY[pos] : startY[pos];

  if(EMULATOR) x+= 80;
  const digStrs = [ d0,d1,d2,d3,d4,d5,d6,d7,d8,d9];
  drawScaledPoly(digStrs[dig],x,y);

}
