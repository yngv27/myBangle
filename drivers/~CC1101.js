/*/GB = (msg) => {
  // filter
  if(msg.t != "notify" && msg.t != "call") return;
  // let's get pickier; ignore the annoyances
  if(msg.src === "Gmail") return;
  //if(msg.src === "Google") { saveInfo(msg); return; }
  
  //allMsgs.push(msg);
  showAlarm(`${msg.title} | ${msg.body}`);
  
};
*/


exports = {};

exports.connect = (opts) => {
  var status = "unknown";
  var spi1 = new SPI();
  spi1.setup({sck: opts.sck, mosi: opts.mosi, miso: opts.miso, baud: 2000000});

  function delayms(ms) {
    digitalPulse(D29, 0, ms);
    digitalPulse(D29, 0, 0); // wait for it
  }
  function waitForMISO() {
    for(let x=0; x < 1000; x++) 
      if(!opts.miso.read()) return;
    print("MISO TIMEOUT");
  }

  function cmd(c, d) {
    if (d == undefined) {
      opts.cs.reset();
      waitForMISO();
      status = spi1.send(c);
      opts.cs.set();
      return status >> 4; // return status bits if Strobe
    }
    if(d.length > 1) c |= 0x40; // Write burst (aka "many")
    opts.cs.reset();
    waitForMISO();
    status = spi1.send(c);
    spi1.write(d);
    opts.cs.set();
  }
  
  function readReg(r) {
    r |= 0x80; // read bit
    // if n > 1 r |= 0x40; // Read burst
    opts.cs.reset();
    waitForMISO();
    status = spi1.send(r);
    let val = spi1.send(0);
    opts.cs.set();
    return val;
  }
  function readRegBurst(r, len) {
    r |= 0xC0; // read bit & burst bit
    let res = new Uint8Array(len);
    opts.cs.reset();
    waitForMISO();
    status = spi1.send(r);
    for(let i=0; i<len; i++)
      res[i] = spi1.send(0);
    opts.cs.set();
    return res;
  }
  
  function reset() {
    digitalPulse(opts.cs, 0, [40,40]);
    digitalPulse(opts.cs, 0, 0); // wait for it
    // reset cmd
    cmd(0x30);
    delayms(10);
  }
  
  function configure() {
    /*
      let reg=0;
    cmd(reg++, 0x07); //IOCFG2 - 0
    cmd(reg++, 0x84);
    cmd(reg++, 0x07);
    cmd(reg++, 0x07); //FIFOTHR
    cmd(reg++, 0xD3); //SYNC word
    cmd(reg++, 0x91);
    cmd(reg++, 0x3D); //PKTLEN
    cmd(reg++, 0x07); //PKTCTRL1
    cmd(reg++, 0x44); //PKTCTRL0
    
    cmd(reg++, 0x14); // device address default
    cmd(reg++ ,0x10); // default channel
    // freq synth ctl1
    cmd(reg++ ,0x0f); 
    // freq synth ctrl2
    cmd(reg++ ,0x0);
//    reg=0x0D;
    cmd(reg++ , 0x10); // def freq 2
    cmd(reg++ , 0xA8); // def freq 1
    cmd(reg++ , 0x5E); // def freq 0
    // modem cfg 5x + deviation
    cmd(reg++ , 0x2D); // 
    cmd(reg++ , 0x3B); // 
    cmd(reg++ , 0xB); // 
    cmd(reg++ , 0x62); // 
    cmd(reg++ , 0xF8); // 
    cmd(reg++ , 0x62); // deviation
    //state machine
    //reg=0x16;
    cmd(reg++, 0x07); // SM2: Stay in RX until end of packet
    cmd(reg++, 0x33); // SM1: go to IDLE after RX/TX
    cmd(reg++, 0x18); // SM0: Calibration
    cmd(reg++ , 0x1D); // FOCCFG
    cmd(reg++ , 0x1C); // BSCFG
    cmd(reg++ , 0xC7); // AGCCTL2
    cmd(reg++ , 0x0); // AGCCTL1
    cmd(reg++ , 0xB0); // AGCCTL0

    //reg=0x1E;
    cmd(reg++, 0x87); // WOREVT1
    cmd(reg++, 0x6B); // WOREVT0
    cmd(reg++, 0xFB); // WORCTL
    cmd(reg++, 0xB6); // FREND1
    //reg=0x22;
    cmd(reg++, 0x10); // FREND0
    cmd(reg++, 0xEA); // FSCAL3
    cmd(reg++, 0x1F); // FSCAL2
    cmd(reg++, 0x0); // FSCAL1
    cmd(reg++, 0xd); //FSCAL0
    //reg=0x27;
    cmd(reg++, 0x41); // RCCTL1
    cmd(reg++, 0x0); // RCCTL0
    */
    // consult documentation for values; saving space here:
    cmd(0, atob("B4QHB9ORPQdEFBAPABCoXi07C2L4YgczGB0cxwCwh2v7thDqHwANQQA="));
  }
  
  function init() {
    pinMode(opts.miso, "input");

   // GDO set
    pinMode(opts.gd0, "input");
    
    opts.sck.set();
    opts.mosi.reset();
    
    reset();
    // configure
    configure();
    /*
    let cfg = readRegBurst(0, 0x29);
    print(cfg);
    print(btoa(cfg));
    */
    
    // set to IDLE first
    cmd(0x36); delayms(10);
    // flush buffers
    cmd(0x3b); delayms(10);
    cmd(0x3a); delayms(10);
    
    // send PATable
    cmd(0x3e, [0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60]);
  }
  
  function getStatus() {
    let stStr = "IDLERX  TX  FTX CALISETLRXOFTXUF";
    // parse the status byte
    if(status > 127) return ("Error: Not ready");
    let s = status >> 4;
    return(`State: ${stStr.slice(s*4,s*4+4)} TXBUF: ${status&15} RXBUF:${status&15}`);
  }
    
  function dataAvailable() {
    return readReg(0xfb); //RxBytes
  }
  
  function recv() {
    return readRegBurst(0xff, r.read(0xfb));
  }

  function listen() {
    cmd(0x3a); // flush RX
    delayms(10);
    for(let x=0; x < 10; x++) {
      cmd(0x34); let s = cmd(0x3D);  //SRX, SNOP
      //print(getStatus());
      if(s == 1) break; // 1==SRX
    }
  }
  function send(str) {
    cmd(0x36); // SIDLE
    delayms(10);
    cmd(0x3b); // flush TX
    delayms(10);
    if(str.length > 59) str = str.substring(0,59);
    while(str.length < 59) str += ' ';
    // first 4 are: ADDR, size, pkt #, pkt cnt
    let buf = E.toArrayBuffer("\0\x3b\x01\x01"+str);
    // write it all
    cmd(0x7f, buf); // 59 bytes
    cmd(0x35); // TX
    cmd(0x3d); // NOP, wait...
  }
  
  return {
    cmd: cmd,
    init: init,
    readReg: readReg,
    recv: recv,
    listen: listen,
    send: send,
    status: getStatus,
    delay: delayms,
  };
  
};
/*
let opts = {};
if(process.env.BOARD == "QY03") {
  print("must be QY03");
  opts = {
    cs: D2, 
    sck: D3, mosi: D45, miso: D47,
    gd0: D44,
  };
} else {
  print("must be DK832");
  opts = {
    cs: D26, 
    sck: D25, mosi: D29, miso: D27,
    gd0: D28,
  };
}
r=exports.connect(opts);

r.init();

print(`Parnum: ${r.read(0xf0)}`);
print(`Version: ${r.read(0xf1)}`);
*/



