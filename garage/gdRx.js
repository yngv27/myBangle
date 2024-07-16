// we are GD module!
let opts = {
  cs: D29, 
  sck: D3, mosi: D30, miso: D31,
  gd0: D43,
  delay: D47,
};
D45.set(); //power

r=require("~CC1101.js").connect(opts);

r.init();

let debug = print;

debug(`Status: ${r.status()}`);


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
let tempKey = "";

function challenge() {
  let buf = r.recv();
  debug(`GOT: `+buf);
  debug("That's "+buf.length);
  let msg = E.toString(buf.slice(4,61)).trim();
  debug(`GOT [${msg}] pf ${msg.length}`);
  //*
  if(msg == "STAGE1") { 
    tempKey = getRandKey();
    debug("TK: "+btoa(tempKey));
    debug("send: "+ btoa(encode(tempKey, mastKey1))); 
    r.send(btoa(encode(tempKey, mastKey1))); 
  }
  else {
    debug("RECD: "+msg);
    resp = decode(E.toUint8Array(atob(msg)), mastKey2);
    debug("decoded: "+btoa(resp));
    if(resp == tempKey) {
      D13.set();
      D24.reset();
      debug("CLICK");
      setTimeout(E.reboot, 500);
    } else {
      r.listen();
    }
  }
  //*/
  
}

function nextResponse(str) {
    r.send(str); 
}


let gd0Int = 0;
function setInt() { if(!gd0Int) gd0Int = setWatch(challenge, opts.gd0, {edge: "rising", repeat: true});}
function clearInt() { if(gd0Int) {clearWatch(gd0Int); gd0Int=0;}}

setInt();
r.listen();

setInterval(()=>{r.recv();r.listen();}, 2500);


