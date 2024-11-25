// not really, but grabs the time off a predictable server
var wifi = require("Wifi");
wifi.stopAP();

var timeObj = "";
function setRes(v) { 
  if(v.startsWith("{")) {
    print("START");
    timeObj = v;
  } else if (v.endsWith("}")) {
    timeObj += v; 
    timeObj = JSON.parse(timeObj);
    print("DONE");
    wifi.disconnect(()=>{print("Closed");});
    print("NEW TIME: "+timeObj.currentDateTime);
  } else {
    timeObj += v; 
  }
}

function get(url) {
  var http = require("http");
  http.get(url, function(res) {
    res.on('data', function(data) {
      setRes(data);
    });
  });
}

function test() {
  wifi.disconnect();
  let WIFI_NAME="VannHopf";
  let WIFI_OPTIONS={password:"anthro29"};
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
    console.log("Connected!");
    get('http://worldclockapi.com/api/json/est/now');
  });
}

test();
