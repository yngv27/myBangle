const startX = [ 6,  43,  6,  43 ];
const startY = [ 14,  14,  82,  82 ];
const nmX = [ 4, 42, 88, 126];
const nmY = [ 12, 12, 12, 12];
let xS = 0.4;
let yS = 0.6;
let rotate = false;

function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] = Math.floor(arr[i+1]*yS) + y;
    if(rotate) {
      let z = newArr[i];
      newArr[i] = 80 - newArr[i+1];
      newArr[i+1] = z;
    }
  }
  g.drawPoly(newArr, false);
}


let points0 = Uint8Array([
  0, 40,
  1, 35,
  7, 20, 
  16, 8,
  28, 2,
  40, 0,
  
  51, 2,
  63, 10,
  72, 20,
  77, 35,
  78, 40,
  
  78, 59,
  77, 64,
  72, 79,
  63, 89,
  51, 97,
  
  40, 99,
  28, 97,
  16, 91,
  7, 79,
  1, 64,
  0, 59,
  0, 40
]);

let points1 = Uint8Array([ 40, 99, 40, 0]);

let points2 = Uint8Array([ 0, 25,
               2, 22,
              6, 13, 
              17, 5,
              28, 2,
              40, 0,
              52, 2,
              63, 5,
              74, 13,
              79, 23,
              79, 28,
              74, 38,
               63, 46,
              51, 54,
              40, 58,
              29, 62,
              17, 68,
              8, 80,
              0, 99,
              79, 99
              ]);

let points4 = Uint8Array([ 60, 99, 60, 0, 0, 75, 79, 75 ]);

let points8 = Uint8Array([
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  
  52, 39,
  62, 34,
  69, 29,
  72, 23,
  72, 19,
  69, 12,
  62, 6,
  52, 2,
  40, 0,
  
  28, 2,
  18, 6,
  11, 12,
  8, 19,
  8, 23,
  11, 29,
  18, 34,
  28, 39,
  40, 40,
  ]);

let points6 = Uint8Array([
  50, 0,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  ]);

let points3 = Uint8Array([
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  39, 40,
  79, 0,
  1, 0
  ]);

let points7 = Uint8Array([ 0, 0, 79, 0, 30, 99 ]);

let points9 = Uint8Array(40);
let points5 = Uint8Array([
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  26, 42,
  15, 46,
  27,  0,
  79,  0,
              ]);

/* create 9 from 6 */
for (let idx=0; idx*2 < points6.length; idx++) {
   points9[idx*2] = 79-points6[idx*2];
   points9[idx*2+1] = 99-points6[idx*2+1];
}

pointsArray = [points0, points1, points2, points3, points4, points5, points6, points7, points8, points9];

function drawDigit(pos, val, nm) {
  let xOff = nm ? nmX[pos] : startX[pos];
  let yOff = nm ? nmY[pos] : startY[pos];

  if(EMULATOR) xOff += 80;
  drawScaledPoly(pointsArray[val], xOff, yOff);
  drawScaledPoly(pointsArray[val], xOff+1, yOff);
  drawScaledPoly(pointsArray[val], xOff, yOff+1);
  drawScaledPoly(pointsArray[val], xOff+1, yOff+1);

}
