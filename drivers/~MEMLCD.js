
exports.connect = function(opts, callback) {
  var g = Graphics.createArrayBuffer(opts.width,opts.height,1);
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
  
  g.flip = function () {
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
  return g;
};

/*

SPI1.setup({ sck:D2, mosi:D44, order: "lsb", baud: 4000000 });

var g = exports.connect(SPI1, D3/*SCS* /, 0/*EXTCOMIN* /, 144/*width* /, 168/*height* /, function() {
  g.clear();
  g.setRotation(2);
  g.setFontOmnigo();
  g.drawString("Hello",0,0);
  g.drawLine(0,10,g.getWidth(),10);
  g.drawString(getTime(), 0, 20);
  g.flip();
  g.setFontAlign(0,-1);
});
*/