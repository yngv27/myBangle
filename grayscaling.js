if(typeof Bangle != 'undefined') { 
  Bangle.setLCDPower(true);
} else {
  //P8
  P8.wake();
}
//g.setBgColor("#ffffff");
g.clear();

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

let red = [0.99, 0.83, 0.2, 0.8];
let green = [0, 0.8, 0.99, 0.2];
let blue = [0.2, 0.2, 0.99, 0.99];
let coords = [ {x:20, y:0}, {x:120, y:0}, {x:20, y:100}, {x:120,y:100}];

eval(require("Storage").read("eurostile.fnt"));
let dt = new Date();
let h1 = dt.getHours();
let h2 = h1 % 10;
h1 = Math.floor(h1/10);
let m1 = dt.getMinutes();
let m2 = m1 % 10;
m1 = Math.floor(m1/10);
let imgs = [eurofont[h1], eurofont[h2], eurofont[m1], eurofont[m2]];

for(let idx=0; idx<4; idx++) {
  let r1=red[idx];
  let g1=green[idx];
  let b1=blue[idx];
  imgs[idx].palette =  new Uint16Array([pct2col(r1,g1,b1,0),pct2col(r1,g1,b1,1), pct2col(r1,g1,b1,0.5), pct2col(r1,g1,b1,0.75)]);
  //g.drawImage(img, 60*idx, 40);
  g.drawImage(imgs[idx],coords[idx].x,coords[idx].y, {scale: 2.75});

}

