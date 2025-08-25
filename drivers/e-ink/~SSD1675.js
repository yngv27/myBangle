// SSD1675
/*
debug=print;

var epdQ = {
  init: () => {
    epdQ.flist = [];
    epdQ.busy = false;
    epdQ.on("free", epdQ.whenFree);
  },
  whenFree: (f) => {
    debug("BUSY: "+epdQ.busy+" "+getTime().toFixed(3));
    if(typeof(f) != "object") f=null;
    if(!epdQ.busy) {
      if(epdQ.flist.length) {
        // execute first in list
        let o = epdQ.flist.shift();
        (o.func)(o.parm);
        // push the latest one
        if(f) epdQ.flist.push(f);
      } else {
        // execute this one
        if(f) (f.func)(f.parm);
      }
    } else {
      if(f) epdQ.flist.push(f);
      //setWatch(ifFree, BUSY, {edge: "rising"});
    }
  },
};

*/
exports.connect = function(opts, callback) {
  eink_x = ((opts.width - 1) / 8);
  eink_y = (opts.height - 1);
  if(!opts.dmy) opts.dmy = D1;

  var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  
  delay = (ms) => {
    digitalPulse(opts.dmy,0,ms); // just to wait <100ms
    digitalPulse(opts.dmy,0,0);
  };
  stamp = (m) =>{print(m+(new Date()).getTime());};
  //setWatch(()=>{stamp("FREE: ");}, D45, {edge: "falling", repeat: true});
  
  function cmd(c, d) {
      opts.dc.reset();
      opts.spi.write(c, opts.cs);
      if (d !== undefined) {
          opts.dc.set();
          opts.spi.write(d, opts.cs);
      }
  }

  function init() {
    delay(20);
    digitalWrite(opts.rst, 0);
    delay(20);
    digitalWrite(opts.rst, true);
    delay(130);

    cmd(0x12);//Software reset
    delay(20);

    cmd(0x74, 0x54);//Set Analog Block Control
    cmd(0x7E, 0x3B);//Set Digital Block Control
    cmd(0x2B, [0x04, 0x63]);//ACVCOM setting
    cmd(0x0C, [0x8f,0x8f,0x8f,0x3f]); // Softstart Control
    cmd(0x01, [eink_y,(eink_y >> 8),0x00]);//Driver Output control
    cmd(0x11,1);//Data Entry mode setting


    //cmd(0x44, [0, 99]); //eink_x]);//Set RAM X - address Start/End position
    //cmd(0x45,[0x00,0x00, 0,1]);//Set RAM Y - address Start/End position
    cmd(0x44, [0, eink_x]);//Set RAM X - address Start/End position
    cmd(0x45,[eink_y,(eink_y >> 8),0x00,0x00]);//Set RAM Y - address Start/End position
    //*/
    cmd (0x3C, 1);//Border Waveform Control; 0 = black,1 = white,2 = Red
    cmd (0x18, 0x80);// Temperature sensor control;  0x48 = External,0x80 = Internal
    cmd (0x21, 8);//Display Update Control 1 ; inverse or ignore ram content
    cmd (0x22,0xB1);//Display Update Control 2
    //*/

    cmd(0x20);//Master Activation
    //stamp("POST x20: ");
    //setWatch(()=>{stamp("FREE: ");}, opts.busy, {edge: "falling", repeat: false});
    delay(50);

    cmd (0x4E, 0);//Set RAM X address counter
    cmd (0x4F,[0,0]); //eink_y,(eink_y >> 8)]);
    
  }
  g.sleep = function () { cmd(0x10, 1);};

  g.flip = function (redToo) {
    init();
    cmd (0x4E, 0);//Set RAM X address counter
    cmd (0x4F,[eink_y,(eink_y >> 8)]);//Set RAM Y address counter

    cmd(0x24); //write B/W
    opts.dc.set();
    opts.spi.write(new Uint8Array(g.buffer), opts.cs);
    if(redToo) g.flipR();
    cmd(0x22, 0xC7); 
    cmd(0x20); // update
    setTimeout(g.sleep, 30*1000);
    //setWatch(()=>{stamp("FREE1: ");}, opts.busy, {edge: "falling", repeat: false});

    return g;
  };
  
  g.flipR = function () {
    /*
    //init();
    cmd (0x4E, 0);//Set RAM X address counter
    cmd (0x4F,[eink_y,(eink_y >> 8)]);//Set RAM Y address counter
//*    cmd (0x4E);//Set RAM X address counter
    _writeData (0x00);

    cmd (0x4F);//Set RAM Y address counter
    _writeData (eink_y);
    _writeData ((eink_y >> 8));
//* /
    cmd(0x26); //write RED
    opts.dc.set();
    for(let y= Math.floor(opts.height/g.redbuf.getHeight())-1; y>=0; y--) {
      //print(`y = ${y} and banner is ${g.bannerMsg}`);
      if(y == 0 && g.bannerMsg) {
        g.drawBanner();
      } else {
        g.redbuf.clear(); 
      }
      opts.spi.write(new Uint8Array(g.redbuf.buffer), opts.cs);
    }
    g.bannerFlag = false;
   // cmd(0x22, 0xC7); 
    //cmd(0x20); // update
    //setTimeout(g.sleep, 30*1000);
    //setWatch(()=>{stamp("FREER: ");}, opts.busy, {edge: "falling", repeat: false});
    return g;
    */
   /* write a buffer at 0, clear the rest
    let zero = new Uint8Array(opts.width / 8); // blank line
    //init();
    g.cmd (0x4E, 0);//Set RAM X address counter
    g.cmd (0x4F,[eink_y,(eink_y >> 8)]);//Set RAM Y address counter
    g.cmd(0x26); //write RED
    opts.dc.set();
    for(let y= Math.floor(opts.height/g.redbuf.getHeight())-1; y>=0; y--) {
      //print(`y = ${y} and banner is ${g.bannerMsg}`);
      if(y == 0)
        opts.spi.write(new Uint8Array(g.redbuf.buffer), opts.cs);
      else
        for(let y=0; y<g.redbuf.getHeight(); y++)  opts.spi.write(zero, opts.cs);
    }
  // cmd(0x22, 0xC7); 
    //cmd(0x20); // update
    //setTimeout(g.sleep, 30*1000);
    //setWatch(()=>{stamp("FREER: ");}, opts.busy, {edge: "falling", repeat: false});
    return g;
  };


  if(callback) setTimeout(callback, 250);
  g.cmd = cmd;
  g.init = init;
  return g;
  */
  };


  if(callback) setTimeout(callback, 250);
  g.cmd = cmd;
  g.init = init;
  return g;
};
