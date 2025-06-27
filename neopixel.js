let n = require("neopixel");

let numPixels = 10;
var rgb = new Uint8ClampedArray(numPixels*3);
var pos = 0;
var ival = 0;

function Color(r0,g0,b0) {
  this.r0=r0;
  this.g0=g0;
  this.b0=b0;
}

OFF = new Color(0,0,0);
GREEN = new Color(0,255,0);
WHITE = new Color(255,255,255);

function Program(opts) {
  this.delay = opts.delay;
  this.color = opts.color;
  this.ival = 0;
}
Program.prototype.f = function() {};
Program.prototype.stop = function () { clearInterval(this.ival); this.ival = 0; };
Program.prototype.start =   function () { this.ival = setInterval(()=>{this.f();}, this.delay);};

function setPixel(idx, col) {
  let id2 = idx*3;
  rgb[id2++] = col.g0;//(1 + Math.sin((i+pos)*0.1324)) * 127; //G
  rgb[id2++] = col.r0;//(1 + Math.sin((i+pos)*0.1654)) * 127; //R
  rgb[id2++] = col.b0;//(1 + Math.sin((i+pos)*0.1)) * 127; //B
  //return rgb;
}

function setAll(col) {
  for(let x=0; x<numPixels; x++)
    setPixel(x,col);
}
function clearAll() { setAll(OFF);}

function push() {
  n.write(D2, rgb);
}

let BLINK = new Program({delay: 500, color: WHITE});
BLINK.state = true;
BLINK.f = function () { // needs to be f()! not ()=>{}
  if(this.state) setAll(this.color); else clearAll();
  this.state = !this.state;
  push();
};

function nextOne(r0,g0,b0) {
  if(pos >= numPixels) {
    clearAll();
    pos = pos % numPixels;
  } else {
    setPixel(pos++, r0, g0, b0);
  }
  push();
}

function toggle(r0, g0, b0, ms) {
  if(ival) clearInterval(ival);
  setAll(r0,g0,b0);
  push();
  setTimeout(()=>{clearAll();push();}, ms);
}

let lit = 0;
function fadein(r0,g0,b0, ms) {
  let br = lit;
  if(br > 63) br = 126 - lit;
  setAll(0,br,br);
  push();
  lit++;
  if(lit > 126) lit=0;
}

