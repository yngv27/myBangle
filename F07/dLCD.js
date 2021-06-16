const startX = [ 6,  43,  6,  43 ];
const startY = [ 14,  14,  82,  82 ];
const nmX = [ 4, 42, 88, 126];
const nmY = [ 12, 12, 12, 12];
let xS = 1;
let yS = 1;
let rotate = false;

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
  g.fillPoly(newArr, true);
}

let lcdTopSeg = Uint8Array([3 , 1,5 , 0,26 , 0,22 , 8,10 , 8]);
let lcdTopLeftSeg=Uint8Array([1 , 3,8 , 10,8 , 24,3 , 29,0 , 29,0 , 5]);
let lcdTopRightSeg= Uint8Array([24 , 11,29 , 1,30 , 1,32 , 3,32 , 29,29 , 29,24 , 24]);
let lcdMiddleSeg = Uint8Array([9 , 27,23 , 27,27 , 31,23 , 35,9 , 35,5 , 31]);
let lcdBottomLeftSeg = Uint8Array([1 , 59,8 , 52,8 , 38,3 , 33,0 , 33,0 , 57]);
let lcdBottomRightSeg = new Uint8Array([24 , 51,29 , 61,30 , 61,32 , 59,32 , 33,29 , 33,24 , 38]);
let lcdBottomSeg = new Uint8Array([3 , 61,5 , 62,26 , 62,22 , 54,10 , 54]);

function drawDigit(pos, val, nm) {
  let xOff = nm ? nmX[pos] : startX[pos];
  let yOff = nm ? nmY[pos] : startY[pos];

  if(EMULATOR) xOff += 80;

  //logD("drawSegments");
  if (val != 1 && val != 4)
    drawScaledPoly(lcdTopSeg,xOff, yOff);
  if (val != 1 && val != 2 && val != 3 && val != 7)
    drawScaledPoly(lcdTopLeftSeg,xOff, yOff);
  if (val != 5 && val != 6)
    drawScaledPoly(lcdTopRightSeg,xOff, yOff);
  if (val != 0 && val !=1 && val != 7)
    drawScaledPoly(lcdMiddleSeg,xOff, yOff);
  if (val == 0 || val == 2 || val == 6 || val == 8)
    drawScaledPoly(lcdBottomLeftSeg,xOff, yOff);
  if (val != 2 )
    drawScaledPoly(lcdBottomRightSeg,xOff, yOff);
  if (val != 1 && val != 4 && val != 7)
    drawScaledPoly(lcdBottomSeg,xOff, yOff);
}