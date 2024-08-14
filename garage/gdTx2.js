/*
** I AM TRANSMISSION
*/
var _svc, _chr;
var busy=false;
var gatt;
debug = print;
addr = //"e4:91:54:34:59:67 random";
  // "e2:35:4e:be:ea:3d random"; // GD
"ca:f6:59:bd:e3:5e random"; // little nrfy

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

// put these in storage
let mastKey1 = E.toUint8Array(atob("7XwmpfDcSf8onWkLaAK10g=="));
let mastKey2 = E.toUint8Array(atob("CXDpA6GJFFZJqQzoGxl83A=="));

function sendIt() {
  busy = true;

  NRF.connect(addr, {minInterval:7.5, maxInterval:7.5}).then( function (gt) {
    gatt = gt;
    debug("finding SVC");
    return gatt.getPrimaryService("13152001-face-f00d-d00f-729184728473");
  }).then(function(svc) {
    _svc = svc;
    debug("finding CHR");
    return svc.getCharacteristic("13152002-face-f00d-d00f-729184728473");
  }).then(function(chr) {
    chr.on('characteristicvaluechanged', function(event) {
      challenge(E.toString(event.target.value.buffer));
    });
    return(chr.startNotifications());
  }).then(function () {
    // now the WRITEABLE char
    debug("finding CHW");
    return _svc.getCharacteristic("13152003-face-f00d-d00f-729184728473");
  }).then(function(chr) {
    debug("Got CHW");
    _chr = chr;
    return; 
  }).then(function() {
    debug("READY!");
    _chr.writeValue("STAGE1");
    busy=false;
  }).catch(function (e) {
    if(gatt) { gatt.disconnect(); gatt="";}
    debug("ERROR",e);
    blink(2);
    busy=false;
  }); // end NRF.requestDevice
}

function blink(n, fast) {
  let delay = fast ? 200 : 500;
  while(n--) {
    setTimeout(()=>{LED1.set();}, n*delay*2);
    setTimeout(()=>{LED1.reset();}, n*delay*2+delay);
  }
}
function challenge(str) {
  console.log("CHANGE. -> "+str);

  if(str.length == 24) {
    let tmp = decode(E.toUint8Array(atob(str)), mastKey1);
    debug("TMP: "+btoa(tmp));
    debug("Sending: "+btoa(encode(tmp, mastKey2)));
    _chr.writeValue( btoa(encode(tmp, mastKey2)));
  } else if (str == "STAGE4") {
    // close up shop
    //if(pollInt) clearInterval(pollInt);
    //pollInt=0;
    if(gatt) { gatt.disconnect(); gatt="";}
    blink(3,1); 
    print("Completed");

  }

}

function scan(off) {
  if(off) NRF.setScan();
  else NRF.setScan((d)=>{if(d.name != "undefined") print(d.name);}) ;
}
setWatch(sendIt, BTN1, {repeat: true, edge: "rising"});