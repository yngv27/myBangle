

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

function flush() {
  // set to IDLE first
  r.cmd(0x36); r.delay(20);
  // flush buffers
  r.cmd(0x3b); r.delay(20);
  r.cmd(0x3a); r.delay(20);
  setTimeout(()=>{
    //r.init();
    r.listen();
  }, 500);
}

let maxErr = 10;
let ival=0;
function challenge() {
  let buf = r.recv();
  debug(`GOT: `+buf);
  if(ival) clearInterval(ival);
  //debug("That's "+buf.length);
  let msg = E.toString(buf.slice(4,61)).trim();
  debug(`GOT [${msg}] len: ${msg.length}`);
  //*
  if(msg == "STAGE1") { 
    tempKey = getRandKey();
    debug("TK: "+btoa(tempKey));
    setTimeout((val)=>{
      debug("send: "+ btoa(encode(tempKey, mastKey1))); 
      r.send(btoa(val));
    }, 50, encode(tempKey, mastKey1)); 
//      r.recv();
    r.listen();
  } else if(msg.length == 24 && buf[1] == 59) {
    debug("RECD: "+msg);
    resp = decode(E.toUint8Array(atob(msg)), mastKey2);
    debug("decoded: "+btoa(resp));
    if(resp == tempKey) {
      //setTimeout(()=>{
        r.send("STAGE4"); //ack
      //}, 50);
      D13.set();
      D24.reset();
      debug("CLICK\n");
      //setTimeout(E.reboot, 500);
      setTimeout(()=>{
        D13.reset();
        D24.set();
        //flush();
      }, 500);
    } else {
      r.recv();
      r.listen();
    }
  } else {
    if(!(maxErr--)) E.reboot(); //panic 
    r.recv();
    r.listen();
  }
  //ival=setInterval(()=>{
  //flush();
  //*/
  
}

function nextResponse(str) {
    r.send(str); 
}


let gd0Int = 0;
//function setInt() { if(!gd0Int) gd0Int = setWatch(challenge, opts.gd0, {edge: "rising", repeat: true});}
function setInt() {
  gd0Int = setInterval(()=>{
    if(r.readReg(0xfb) > 0) challenge();
  }, 50);
}
//function clearInt() { if(gd0Int) {clearWatch(gd0Int); gd0Int=0;}}
function clearInt() { if(gd0Int) {clearInterval(gd0Int); gd0Int=0;}}

setInt();
r.listen();

//ival = setInterval(()=>{r.recv();r.listen();}, 2500);


