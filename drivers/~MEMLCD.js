//exports = {};
/*
**
** Fast MemLCD update driver
** Based upon the cycle saving techniques described by Larry Bank
** https://bitbanksoftware.blogspot.com/2023/09/fast-updates-on-sharp-memory-lcds.html
**
** The secret sauce is here is to create the backing buffer with 2 extra bytes at the end,
** one for the zero terminator (needed to allow the LCD to update the line) and the line number
** of the NEXT line to be updated. This means to update the whole screen, we just need to
** write the CMD, then number "1" for the first line (yes, line numbers are 1-based, not 0-based)
** then dump the preformmatted buffer.
*/
exports.connect = function(opts, callback) {
  // create buffer with 2 extra bytes (0 terminator, NEXT row #)
  var g = Graphics.createArrayBuffer(opts.width+16,opts.height,1);
  // prep each row's end with terminator 0, and the next row
  let realWid= opts.width/8+2;
  for(let y=1; y<=opts.height; y++) {
    g.buffer[y*realWid-2] = 0;
    g.buffer[y*realWid-1] = y+1;
  }
  // tweak the last entry to be a zero; to terminate the entire command
  g.buffer[g.buffer.length-1]=0; // end of multiline cmd
  // protect those "pixels" from being written to
  g.setClipRect(0,0,opts.width,opts.height);
  // consider overriding setClipRect to prevent ding dongs like me from breaking things
  var spi = opts.spi;
  var cs = opts.cs;
  var vcom = opts.vcom;
  var vcomstate = false;

  digitalWrite(cs,1); // CS on
  spi.send(0b00000100); // clear display
  digitalWrite(cs,0); // CS off

  setTimeout(function() {
    //digitalWrite(cs,0); // CS on
    spi.send(0b00000000); // all normal
    //digitalWrite(cs,0); // CS off
    if (callback) callback();
  }, 10);  
  /* Note: it's recommended you toggle vcom every second, but doing it every 5
     allows Espruino to properly enter deep sleep modes */
  if (vcom) {
    setInterval(function() {
      digitalWrite(vcom, vcomstate=!vcomstate);
    }, 5000);
  }
  /*
  g.flipOld = function () {
    digitalWrite(cs,1); // CS on
    spi.send([0b00000001,1]); // update, 1st row
    var w = g.getWidth()>>3;
    for (var y=0;y<g.getHeight();y++) {
      spi.send(new Uint8Array(g.buffer,y*w,w));
      spi.send([0,y+2]); // pad and do 2nd row
    }
    digitalWrite(cs,0); // CS off
    return g;
  };
  //*/
  g.flip = function () {
    digitalWrite(cs,1); // CS on
    spi.send([0b00000001,1]); // update, row #1
    // shoot the works
    //print(`writing ${g.buffer.length} bytes`);
    opts.spi.write(new Uint8Array(g.buffer));
    digitalWrite(cs,0); // CS off
    return g;
  };
    return g;
};

/* set up your own SPI; make sure you have order: "lsb"
let spi1 = new SPI();
spi1.setup( {mosi: D1, sck: D1, order: "lsb", baud: 2000000})
let opts = {
  cs: D1,
  vcom: D1,  // optional; for flipping the bias
  spi: spi1,
  width: 144,
  height: 168,
};
var g = exports.connect(opts);
function test() {
  g1.clear();
  g1.setRotation(2);
  g1.setFontOmnigo();
  g1.drawString("Hello",0,0);
  g1.drawLine(0,10,g.getWidth(),10);
  g1.drawString(getTime(), 0, 20);
  g1.superflip();
  g1.setFontAlign(0,-1);
}
//*/