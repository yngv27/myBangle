
let LF = {
  xS: 1,
  yS: 2,
  sp: 3,

  drawChar: (arr, xOff, yOff) => {
  if(!arr) return;
  let newArr = new Uint8Array(arr.length*2);
  for(let idx = 0; idx < arr.length; idx++) {
    let x = Math.floor(arr[idx]/10);
    let y = arr[idx]%10;
    //newArr.push(x*LF.xS+xOff, y*LF.yS+yOff);
    newArr[idx*2] = x*LF.xS+xOff;
    newArr[idx*2+1] = y*LF.yS+yOff;
  }
  g.drawPoly(newArr, false);
},

  setScale: (xs, ys) => {
    LF.xS = xs/4;
    LF.yS = ys/4;
  },

  setSpacing: (s) => { LF.sp = s; },

  drawString: (str, x, y) => {
    let _lf_ch = {
      "A":new Uint8Array([4,2,20,42,43,3,43,44]),
      "B":new Uint8Array([4,0,30,41,32,2,32,43,34,4]),
      "C":new Uint8Array([41,30,10,1,3,14,34,43]),
      "D":new Uint8Array([4,0,30,41,43,34,4]),
      "E":new Uint8Array([40,0,2,32,2,4,44]),
      "F":new Uint8Array([40,0,2,32,2,4]),
      "G":new Uint8Array([41,30,10,1,3,14,34,43,42,22]),
      "H":new Uint8Array([0,4,2,42,40,44]),
      "I":new Uint8Array([10,30,20,24,14,34]),
      "J":new Uint8Array([40,43,34,14,3]),
      "K":new Uint8Array([40,2,0,4,2,44]),
      "L":new Uint8Array([0,4,44]),
      "M":new Uint8Array([4,0,22,40,44]),
      "N":new Uint8Array([4,0,44,40]),
      "O":new Uint8Array([14,3,1,10,30,41,43,34,14]),
      "P":new Uint8Array([4,0,30,41,32,2]),
      "Q":new Uint8Array([34,14,3,1,10,30,41,43,34,23]),
      "R":new Uint8Array([4,0,30,41,32,2,22,44]),
      "S":new Uint8Array([41,30,10,1,12,32,43,34,14,3]),
      "T":new Uint8Array([0,40,20,24]),
      "U":new Uint8Array([0,3,14,34,43,40]),
      "V":new Uint8Array([0,24,40]),
      "W":new Uint8Array([0,14,22,34,40]), //0,3,14,24,22,24,34,43,40]),
      "X":new Uint8Array([0,44,22,40,4]),
      "Y":new Uint8Array([0,22,40,22,24]),
      "Z":new Uint8Array([0,40,4,44]),

      "0":new Uint8Array([3,1,10,30,41,43,34,14,3,41]),
      "1":new Uint8Array([11,20,24,14,34]),
      "2":new Uint8Array([0,10,30,41,32,3,4,44]),
      "3":new Uint8Array([0,10,30,41,32,12,32,43,34,14,4]),
      "4":new Uint8Array([34,30,20,3,43]),
      "5":new Uint8Array([30,0,2,32,43,34,4]),
      "6":new Uint8Array([30,10,1,3,14,34,43,32,2]),
      "7":new Uint8Array([0,40,13,14]),
      "8":new Uint8Array([12,1,10,30,41,32,12,32,43,34,14,3,12]),
      "9":new Uint8Array([14,34,43,41,30,10,1,12,42]),
      ",":new Uint8Array([23,24,14]),
      ".":new Uint8Array([24,24]),
      "!":new Uint8Array([11,20,31,24,11]),
      " ":new Uint8Array([]),
      "-":new Uint8Array([12,32]),
      };
    let xOff = x;
    str = str.toUpperCase();
    for(let idx = 0; idx < str.length; idx++ ) {
      //console.log((1+xS)*idx);
      LF.drawChar(_lf_ch[str[idx]], xOff, y);
      xOff += LF.sp +LF.xS*4;
      if(xOff > 239) break;
    }
  },
};

g.clear();
LF.setScale(8,12);
y=10;
LF.drawString("ABCDEF",4,y); y+=20;
LF.drawString("DEFGHI",4,y); y+=20;
LF.drawString("JKLMNO",4,y); y+=20;
LF.drawString("PQRSTU",4,y); y+=20;
LF.drawString("VWXYZ",4,y); y+=20;
LF.drawString("01234",4,y); y+=20;
LF.drawString("56789",4,y); y+=20;
LF.drawString(",.! -",4,y); y+=20;
