g.clear();

/*
let segTop =  new Uint8Array([
  5,3,8,0,40,0,43,3,36,10,12,10
]);

let segTopLeft = new Uint8Array([
  0,8,3,5,10,12,10,41,4,47,0,43
  ]);

let segMiddle =  new Uint8Array([
  7,48,12,43,36,43,41,48,36,53,12,53
]);
segTopRight = () => {
  let arr = new Uint8Array(12);
  for(let i=0; i<segTopLeft.length; i+=2) {
    arr[i] = 48-segTopLeft[i];
    arr[i+1] = segTopLeft[i+1];
  }
  return arr;
};
segBottomRight = () => {
  let arr = new Uint8Array(12);
  for(let i=0; i<segTopLeft.length; i+=2) {
    arr[i] = 48-segTopLeft[i];
    arr[i+1] = 96-segTopLeft[i+1];
  }
  return arr;
};
segBottomLeft = () => {
  let arr = new Uint8Array(12);
  for(let i=0; i<segTopLeft.length; i+=2) {
    arr[i] = segTopLeft[i];
    arr[i+1] = 96-segTopLeft[i+1];
  }
  return arr;
};
segBottom = () => {
  let arr = new Uint8Array(12);
  for(let i=0; i<segTopLeft.length; i+=2) {
    arr[i] = segTop[i];
    arr[i+1] = 96-segTop[i+1];
  }
  return arr;
};
*/
g.clear().drawImage(
  {
    width : 240, height : 240, bpp : 1,
    buffer : require("heatshrink").decompress(atob("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"))
  }, 0,0);
  
  // segments are 12 bytes each; ordered top,topL,topR,mid,botL,botR,bottom
  const segdata = new Uint8Array([5, 3, 8, 0, 40, 0, 43, 3, 36, 10, 12, 10,
    0, 8, 3, 5, 10, 12, 10, 41, 4, 47, 0, 43,
    48, 8, 45, 5, 38, 12, 38, 41, 44, 47, 48, 43,
    7, 48, 12, 43, 36, 43, 41, 48, 36, 53, 12, 53,
    0, 88, 3, 91, 10, 84, 10, 55, 4, 49, 0, 53,
    48, 88, 45, 91, 38, 84, 38, 55, 44, 49, 48, 53,
    5, 93, 8, 96, 40, 96, 43, 93, 36, 86, 12, 86
  ]);
  /*
  const segdata = new Uint8Array(E.toArrayBuffer(atob('BQMIACgAKwMkCgwKAAgDBQoMCikELwArMAgtBSYMJiksLzArBzAMKyQrKTAkNQw1AFgDWwpUCjcEMQA1MFgtWyZUJjcsMTA1BV0IYChgK10kVgxW')));
  */
  
  
  function drawSegment(foo, xoff, yoff, xscale, yscale) {
    let arrTmp = new Uint8Array(12);
    let beg = foo * 12;
    for(let i=0; i<12; i+=2) {
      arrTmp[i] = segdata[beg+i]*xscale+xoff;
      arrTmp[i+1] = segdata[beg+i+1]*yscale+yoff;
    }
    g.fillPoly(arrTmp,true);
  }
  
  function drawDigit(d, x, y, xscale, yscale) {
    let mask = [0x77,0x24,0x5d,0x6d,0x2e,0x6b,0x7b,0x25,0x7f,0x6f][d];
    for(let s=0; s<7; s++) {
      if(mask & 1)  g.setColor(1,1,1);
      else g.setColor(0,0,0);
      drawSegment(s, x,y,xscale,yscale);
      mask >>= 1;
    }
  }
  
  
  let lastTime = '';
  g.setColor(0,0,0);
  g.fillRect(26,72,168,170);
  g.fillRect(50,176,200,232);
  g.setColor(1,1,1);
  g.fillCircle(87,120,2);
  g.fillCircle(87,152,2);
  g.drawLine(116,235,124,179);
  
  (() => {
    let dt = new Date();
    let m = dt.getMonth()+1;
    let d = dt.getDate();
    let digs = [Math.floor(m / 10), m % 10, Math.floor(d / 10), d % 10];
    for(let d = 0; d < digs.length; d++) {
      if(!d && !digs[d]) continue;
      drawDigit(digs[d], [30,74,130,164][d], 178, 0.625, 0.625);
    }
  })();
  
  
  
  function clock() {
    let dt = new Date();
    let dtstr = dt.toString().substring(0,16);
    let tm = dt.toString().substring(16,21);
    let hr = dt.getHours();
    if(hr >= 12) {
      ampm = 'pm';
      hr -= 12;
    }
    if(!hr) hr=12;
    if(tm != lastTime) {
      lastTime = tm;
      let digs = [Math.floor(hr / 10), hr % 10, Math.floor(dt.getMinutes() / 10), dt.getMinutes() % 10];
      for(let d = 0; d < digs.length; d++) {
        if(!d && !digs[d]) continue;
        drawDigit(digs[d], [0,44,90,130][d], 72, 0.8, 1);
      }
    }
  
  }
  
  ACCEL.on("faceup", clock);
  wOS.wake();
  
  