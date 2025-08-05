E.enableWatchdog(16);
NRF.setAdvertising({}, {name:"== Relay"});
NRF.setTxPower(8);
NRF.power=8;

// dedicate my life to relaying to schedule!!
function sched(cmd) {
  NRF.setTxPower(8);
  NRF.requestDevice({ filters: [{ namePrefix: 'Schedule' }] }).then(function(device) {
    return require("ble_uart").connect(device);
  }).then(function(uart) {
    uart.on('data', function(d) { 
      if(typeof(d) == "string") print(d);
      else print("Got:"+JSON.stringify(d)); 
    });
    uart.eval(cmd).then(function(data) {
      print("RECEIVED\n"+data);
      if(typeof(data) == "object") print(JSON.stringify(data));
      //uart.write("digitalPulse(LED,1,10);\n"); // .then(...)
    }); 
    setTimeout(function() { 
      uart.disconnect(); 
      console.log("Disconnected"); 
      NRF.setTxPower(NRF.power);
    }, 2000);
  });
}

function free() { sched("free()"); }
function over() { sched("UI.runningLong = false"); }
