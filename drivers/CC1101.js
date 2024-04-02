
var exports = { };

exports.connect = function (opts) {
  var status = 0;
  var spi1 = new SPI();
  spi1.setup({sck: opts.sck, mosi: opts.mosi, miso: opts.miso, baud: 2000000});

  function cmd(c, d) {
    if (d == undefined) {
      spi1.write(c, opts.cs);
      return;
    }
    if(d.length > 1) c |= 0x40; // Write burst (aka "many")
    spi1.write(c, opts.cs);
    spi1.write(d, opts.cs);
  }

  function readReg(r) {
    r |= 0x80; // read bit
    // if n > 1 r |= 0x40; // Read burst
    status = spi1.send(r, opts.cs);
    print(`Status: ${status.toString(16)}`);
    return spi1.send(0, opts.cs);
  }

  function reset() {
    digitalPulse(opts.cs, 0, [10,10]);
    digitalPulse(opts.cs, 0, 0); // wait for it
    // reset cmd
    cmd(0x30);
  }

  function init() {
    pinMode(opts.miso, "input");

   // GDO set
    pinMode(opts.gd0, "input");

    opts.sck.set();
    opts.mosi.reset();

    reset();

    // config

    // send PATable
    //cmd(0x3e, [0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60]);
  }

  return {
    cmd: cmd,
    init: init,
    read: readReg,
    status: status,
  };

};
var opts = { "cs": D45, "sck": D3, "mosi": D47, "miso": D2, 
  "gd0": D44 };

