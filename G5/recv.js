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
    cs: D45, 
    sck: D30, mosi: D3, miso: D43,
    gd0: D29,
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

let pollInt = 0;

debug(`Status: ${r.status()}`);
function start() {
  if(pollInt) clearInterval(pollInt);
  pollInt = setInterval(poll, 1500);
  poll();
}

function poll() {
  r.send("STAGE1");
}

function challenge() {
  let buf = r.recv();
  debug(`GOT: `+buf);
  print("That's "+buf.length);
  let msg = E.toString(buf.slice(4,61)).trim();
  debug(`GOT [${msg}] pf ${msg.length}`);
  // check preamble bytes too
  if(msg.length == 24 && buf[1] == 59) {
    if(pollInt) clearInterval(pollInt);
    pollInt=0;
    let tmp = decode(E.toUint8Array(atob(msg)), mastKey1);
    debug("TMP: "+btoa(tmp));
    debug("Sending: "+btoa(encode(tmp, mastKey2)));
    r.send(btoa(encode(tmp, mastKey2)));
  }
}

let gd0Int = 0;
function setInt() { if(!gd0Int) gd0Int = setWatch(challenge, opts.gd0, {edge: "rising", repeat: true});}
function clearInt() { if(gd0Int) {clearWatch(gd0Int); gd0Int=0;}}

setInt();
