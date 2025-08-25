
function sched(cmd) {
  NRF.requestDevice({ filters: [{ namePrefix: 'Schedule' }] }).then(function(device) {
    return require("ble_uart").connect(device);
  }).then(function(uart) {
    uart.on('data', function(d) { print("Got:"+JSON.stringify(d)); });
    uart.eval(cmd).then(function(data) {
      print("Got this "+data);
      if(typeof(data) == "object") print(JSON.stringify(data));
      //uart.write("digitalPulse(LED,1,10);\n"); // .then(...)
    }); 
    setTimeout(function() { 
      uart.disconnect(); 
      console.log("Disconnected"); 
    }, 2000);
  });
}