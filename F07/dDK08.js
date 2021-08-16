const startX = [ 10,  45,  10,  45 ];
const startY = [ 16,  16,  78,  78 ];
const nmX = [ 4, 42, 88, 126];
const nmY = [ 12, 12, 12, 12];
let rotate = false;

let xS = 0.8;
let yS = 0.8;

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
  0,4,
  4,0,
  32,0,
  36,4,
  36,65,
  25,65,
  25,5,
  11,5,
  11,65,
  36,65,
  36,66,
  32,70,
  4,70,
  0,66,
  ]);

/* one */
let d1=new Uint8Array([
  7,4,
  11,0,
  20,0,
  24,4,
  24,70,
  13,70,
  13,5,
  7,5,
  ]);

/* two */
let d2=new Uint8Array([
    0,4,
  4,0,
  32,0,
  36,4,
  36,34,
  32,38,
  11,38,
  11,65,
  36,65,
  36,66,
  32,70,
  0,70,
  0,36,
  4,32,
  25,32,
  25,5,
  0,5,
  
  ]);
/* three */

let d3=new Uint8Array([
    0,4,
  4,0,
  32,0,
  36,4,
    36,66,
  32,70,
  4,70,
  0,66,
  0,65,
  25,65,
  25,38,
  0,38,
  0,32,
  25,32,
  25,5,
  0,5,
]);

/* four */
let d4=new Uint8Array([
  0,4,
  4,0,
  11,0,
  11,32,
  25,32,
  25,0,
  32,0,
  36,4,
  36,70,
  25,70,
  25,38,
  0,38,
]);

let d5= new Uint8Array([
  0,0,
  32,0,
  36,4,
  36,5,
  11,5,
  11,32,
  32,32,
  36,36,
  36,66,
  32,70,
  4,70,
  0,66,
  0,65,
  25,65,
  25,38,
  0,38,
  ]);
               
/* six */
let d6 = new Uint8Array(
[
  0,4,
  4,0,
  32,0,
  36,4,
  36,5,
  11,5,
  11,65,
  25,65,
  25,38,
  11,38,
  11,32,
  32,32,
  36,36,
  36,66,
  32,70,
  4,70,
  0,66,
  
]);

/* seven */
let d7 = new Uint8Array([
  0,4,
  4,0,
  32,0,
  36,4,
  36,70,
  25,70,
  25,5,
  0,5,
  ]);

let d8 = new Uint8Array( [
     0,4,
  4,0,
  32,0,
  36,4,
  36,32,
  33,35,
  36,38,
  36,66,
  32,70,
18,70,
  18,65,
  25,65,
  25,38,
  18,38,
  18,32,
  25,32,
  25,5,
  11,5,
  11,32,
  18,32,
  18,38,
  11,38,
  11,65,
  18,65,
  18,70,
  4,70,
  0,66,
  0,38,
  3,35,
  0,32,
   ]);
                
let d9 = new Uint8Array(
  [ 
     0,4,
  4,0,
  32,0,
  36,4,
    36,66,
    32,70,
    4,70,
    0,65,
    0,65,
    25,65,
    25,5,
    11,5,
    11,32,
    25,32,
    25,38,
    4,38,
    0,34,
  ]);



/** END DIGITS **/

function drawDigit(pos, dig, nm) {
  let x = nm ? nmX[pos] : startX[pos];
  let y = nm ? nmY[pos] : startY[pos];

  if(EMULATOR) x+= 80;
  const digStrs = [ d0,d1,d2,d3,d4,d5,d6,d7,d8,d9];
  drawScaledPoly(digStrs[dig],x,y);

}
