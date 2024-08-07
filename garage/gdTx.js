
debug=print;
let opts = {};
if(process.env.BOARD == "QY03") {
  print("must be QY03");
  opts = {
    //cs: D2,   sck: D3, mosi: D45, miso: D47, gd0: D44,
    cs: D3,   sck: D44, mosi: D45, miso: D2, gd0: D47,
    delay: D25
  };
} else if (process.env.BOARD == "DK832") {
  print("must be DK832");
  opts = {
    cs: D26, 
    sck: D25, mosi: D29, miso: D27,
    gd0: D28,
  };
} else {
  print("must be The New Guy");
  opts = {
    cs: D2, 
    sck: D47, mosi: D45, miso: D43,
    gd0: D42,
    delay: D33
  };
  pinMode(D31, "output"); D31.set(); //power!
}
function getRandKey() {
  let key = new Uint8Array(16);
  for(let n=0; n < 16; n++) {
    key[n] = Math.floor(Math.random()*256);
  }
  return key;
}

function encode(tgt, key) {
  let len=tgt.length;
  let klen=key.length;
  let res = new Uint8Array(len);
  for(let n=0; n < len; n++) {
    res[n] = tgt[n] ^ key[n % klen];
  }
  return res;
}
let decode=encode;

let mastKey1 = E.toUint8Array(atob("7XwmpfDcSf8onWkLaAK10g=="));
let mastKey2 = E.toUint8Array(atob("CXDpA6GJFFZJqQzoGxl83A=="));

r=require("~CC1101.js").connect(opts);

r.init();

function flush() {
  // set to IDLE first
  r.cmd(0x36); r.delay(20);
  // flush buffers
  r.cmd(0x3b); r.delay(20);
  r.cmd(0x3a); r.delay(20);
  setTimeout(()=>{
    //r.init();
    r.listen();
  }, 100);
}


let pollInt = 0;

debug(`Status: ${r.status()}`);

function start() {
  D8.set();
  D41.set();
  if(pollInt) clearInterval(pollInt);
  pollInt = setInterval(poll, 2000);
  // no more than 10 sec please!
  setTimeout((i)=>{if(i) clearInterval(i);}, 10000, pollInt);
  poll();
}

function poll() {
  print("polling..");
  r.send("STAGE1");
  D8.reset(); setTimeout(()=>{D8.set();}, 250);
}

function challenge() {
  let buf = r.recv();
  debug(`GOT: `+buf);
  print("That's "+buf.length);
  let msg = E.toString(buf.slice(4,61)).trim();
  debug(`GOT [${msg}] pf ${msg.length}`);
  // check preamble bytes too
  if(msg.length == 24 && buf[1] == 59) {
    let tmp = decode(E.toUint8Array(atob(msg)), mastKey1);
    debug("TMP: "+btoa(tmp));
    debug("Sending: "+btoa(encode(tmp, mastKey2)));
    r.send( btoa(encode(tmp, mastKey2)));
    // another check? feedback?
  } else if (msg == "STAGE4") {
    // close up shop
    if(pollInt) clearInterval(pollInt);
    pollInt=0;
  }
  flush();
}

let gd0Int = 0;
/*
function setInt() { if(!gd0Int) gd0Int = setWatch(challenge, opts.gd0, {edge: "rising", repeat: true});}
function clearInt() { if(gd0Int) {clearWatch(gd0Int); gd0Int=0;}}
*/
function setInt() {
  gd0Int = setInterval(()=>{
    if(r.readReg(0xfb) > 0) challenge();
  }, 50);
}
//function clearInt() { if(gd0Int) {clearWatch(gd0Int); gd0Int=0;}}
function clearInt() { if(gd0Int) {clearInterval(gd0Int); gd0Int=0;}}

setInt();

setWatch(start, BTN1, {edge:"rising", repeat:true});
