let opts = {};
if(process.env.BOARD == "QY03") {
  print("must be QY03");
  opts = {
    cs: D2, 
    sck: D3, mosi: D45, miso: D47,
    gd0: D44,
  };
} else if (process.env.BOARD == "DK832") {
  print("must be DK832");
  //*
  opts = {
    cs: D26, 
    sck: D25, mosi: D29, miso: D27,
    gd0: D28,
  };//*/
  /*
  opts = {
    cs: D17, 
    sck: D15, mosi: D20, miso: D19,
    gd0: D22,
  };
  //*/
  pinMode(D24, "input_pullup"); D24.set(); //power!
  pinMode(D23, "input_pulldown"); D23.reset(); //GND

} else {
  print("must be The New Guy");
  opts = {
    cs: D45, 
    sck: D30, mosi: D3, miso: D43,
    gd0: D29,
  };
  pinMode(D31, "output"); D31.set(); //power!
}
r=require("~CC1101.js").connect(opts);

r.init();

print(`Parnum: ${r.readReg(0xf0)}`);
print(`Version: ${r.readReg(0xf1)}`);



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


function challenge() {
  let buf = r.recv();
  print(`GOT: `+buf);
  print("That's "+buf.length);
  let msg = E.toString(buf.slice(4,61)).trim();
  print(`GOT [${msg}] pf ${msg.length}`);
  //*
  if(msg == "STAGE1") { nextResponse("STAGE2"); }
  if(msg == "STAGE2") { nextResponse("STAGE3");  }
  if(msg == "STAGE3") { nextResponse("STAGE4"); }
  if(msg == "STAGE4") { print("YOU WIN!!!"); }
  //*/
  
}

function nextResponse(str) {
    r.send(str); 
}


let gd0Int = 0;
function setInt() { if(!gd0Int) gd0Int = setWatch(challenge, opts.gd0, {edge: "rising", repeat: true});}
function clearInt() { if(gd0Int) {clearWatch(gd0Int); gd0Int=0;}}

//setInt();
//setInterval(()=>{if(dataAvailable()) challenge();}, 250);