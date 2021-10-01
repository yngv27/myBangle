Bangle.setLCDPower(true);
g.clear();


let gdata;
let img;

function pct2col(r,g,b,p) {
  let r1 = Math.floor(r*32*p);
  if(r1 > 31) r1 = 31;
    let g1 = Math.floor(g*32*p);
  if(g1 > 31) g1 = 31;
    let b1 = Math.floor(b*32*p);
  if(b1 > 31) b1 = 31;
  //r1 *= p; g1 *= p; b1 *= p;
  return (r1 << 11) + (g1 << 6) + b1;
}

let r = 0.83, gr = 0.2, b = 0.66;

img = {
  width : 32, height : 32, bpp : 2,
  transparent : -1,
  palette : new Uint16Array([0,pct2col(r,gr,b,1),pct2col(r,gr,b,0.625), pct2col(r,gr,b,0.325)]),
  _palette : new Uint16Array([65535,32,23275,40179]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFVVVQAOVsAAVVVVACVVXABVVVUAlVVUAFVVVQBVaVYAVaqqAlXCVQBVAAABVQNrA1UpsA1WDwADVVVYDVaVbANVVVYNVVVXA1VVVYlVVVUDpcJViVW5VcAAA1VNVQFVg+sAVU1WA1WBVQJVgVYCVcJVVVWDVblVA1VVVgBVVVcA1VVYACVVWAAJVXAADVWwAAAwAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="))

};

gdata = img.buffer;

g.drawImage(img, 0, 40);
g.drawImage(img, 0, 120, {scale: 4});

let output='';
for(let idx=0; idx < gdata.length; idx++) {
  if(idx % 8 == 0) {
    console.log(output);
    output = '';
  }
  output += `0x${gdata[idx].toString(2)} `;
}
console.log(output);
