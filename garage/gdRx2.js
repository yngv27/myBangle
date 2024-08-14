/*
** I AM RECEIVER
*/
//const _svc =  "13152001-face-f00d-d00f-729184728473";
//const _chr =  "13152002-face-f00d-d00f-729184728473";
let konsole = "";
debug = (msg) => { konsole += msg + "\n";};

NRF.setServices({
  "13152001-face-f00d-d00f-729184728473": {
    "13152002-face-f00d-d00f-729184728473": {
      value : "First",
      maxLen : 32,
      readable: true,
      notify: true,
     },
    "13152003-face-f00d-d00f-729184728473": {
      value : "writeme",
      maxLen : 32,
      writable : true,
      onWrite : function(evt) {
        // When the characteristic is written, raise flag
        challenge(evt);
      }
    }
  }
}, {});

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

function blink(n) {
  while(n--) {
    //setTimeout(()=>{LED1.reset();}, n*500);
    //setTimeout(()=>{LED1.set();}, n*500 + 250);
  }
}


function challenge(evt) {
  var sendMe = "";
  blink(1);
  let str = E.toString(evt.data);
  debug("RECD: "+str);
  if(str == "STAGE1") {
    tempKey = getRandKey();
    debug("TK: "+btoa(tempKey));
    debug("send: "+ btoa(encode(tempKey, mastKey1))); 
    sendMe = btoa(encode(tempKey, mastKey1));

  } else if (str.length == 24) {
    debug("It's 24");
    resp = decode(E.toUint8Array(atob(str)), mastKey2);
    debug("decoded: "+btoa(resp));
    if(resp == tempKey) {
      debug("STAGE 4 confirmed: "+str);
      sendMe = "STAGE4"; //ack
      // open the door DELAY?
      blink(4);
      setTimeout(()=>{
        //D13.set();
        //D24.reset();
        debug("CLICK\n");
      }, 450);
      setTimeout(()=>{
        //D13.reset();
        //D24.set();
      }, 900);

    }
  } else {
    debug("Not S1 or 24");
    return;
  }
  NRF.updateServices({
    "13152001-face-f00d-d00f-729184728473": {
      "13152002-face-f00d-d00f-729184728473": {
        value: sendMe,
        notify: true,
      }
    }
  });
}

var connectee = [];
NRF.on("connect",(addr)=>{connectee.push(addr);});

const whitelist = [
      "c5:1a:13:66:27:a3 random",  //puck
    "dc:71:96:ea:a0:46 public" // Dell
  ];
