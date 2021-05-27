let _lf_xS = 4;
let _lf_yS = 6;
let _lf_sp = 2;
let _lf_ch = {
"N":[2,0,22,20],"O":[0,20,22,2,0],"P":[2,0,20,21,1],"Q":[22,2,0,20,22,11],"R":[2,0,20,21,1,11,22],"S":[20,0,1,21,22,02],"T":[0,20,10,12],"U":[0,2,22,20],"V":[0,12,20],"W":[0,2,11,22,20],"X":[0,22,11,20,2],"Y":[0,11,20,11,12],"Z":[0,20,02,22],"A":[2,01,10,21,1,21,22],"C":[20,10,1,12,22],"B":[0,10,11,1,21,22,02,0],"D":[0,10,21,12,2,0],"E":[20,0,1,11,1,2,22],"F":[20,0,1,11,1,2],"G":[21,22,2,0,20],"H":[0,2,1,21,20,22],"I":[0,20,10,12,02,22],"J":[20,22,2,1],"K":[0,2,1,11,20,11,22],"L":[0,2,22],"M":[2,0,11,20,22],"0":[2,0,20,22,02,20],"1":[10,12],"2":[0,20,21,1,2,22],"3":[0,20,21,01,21,22,02],"4":[0,1,21,20,22],"5":[20,0,1,21,22,2],"6":[20,0,1,21,22,2,1],"7":[0,20,11,12],"8":[0,20,22,2,0,1,21],"9":[21,1,0,20,22,2],",":[11,12,2],".":[11,12],"!":[0,10,2,0]
};

function drawChar(arr, xOff, yOff) {
  if(!arr) return;
  let newArr = [];
  for(let idx = 0; idx < arr.length; idx++) {
    let x = Math.floor(arr[idx]/10);
    let y = arr[idx]%10;
    newArr.push(x*_lf_xS+xOff, y*_lf_yS+yOff);
  }
  g.drawPoly(newArr, false);
}

exports.setScale = function (xs, ys) {
  _lf_xS = xs/2;
  _lf_yS = ys/2;
};

exports.setSpacing = function (s) { _lf_sp = s; };

exports.drawString = function (str, x, y) {
  let xOff = x;
  str = str.toUpperCase();
  for(let idx = 0; idx < str.length; idx++ ) {
    //console.log((1+xS)*idx);
    drawChar(_lf_ch[str[idx]], xOff, y);
    xOff += _lf_sp +_lf_xS*2;
    if(xOff > 239) break;
  }
};