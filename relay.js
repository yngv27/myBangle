Modules.addCached("ble_uart",function(){
  exports.connect = function(device) {
  var gatt, service, rx, tx, rxListener;
  var uart = {
    write : function(text) {
      return new Promise(function sender(resolve, reject) {
        if (text.length) {
          tx.writeValue(text.substr(0,20)).then(function() {
            sender(resolve, reject);
          }).catch(reject);
          text = text.substr(20);
        } else resolve();
      });
    },
    disconnect : function() {
      return gatt.disconnect();
    },
    eval : function(expr) {
      return new Promise(function(resolve,reject) {
        uart.write("\x03\x10Bluetooth.write(JSON.stringify("+expr+")+'\\n')\n").then(function() {          
        });
      });
    }
  };
  return device.gatt.connect().then(function(g) {
    gatt = g;
    return gatt.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
  }).then(function(s) {
    service = s;
    return service.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e");
  }).then(function(c) {
    tx = c;
    return service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
  }).then(function(c) {
    rx = c;
    rx.on('characteristicvaluechanged', function(event) {
      var d = E.toString(event.target.value.buffer);
      uart.emit("data",d);
    });
    return rx.startNotifications();
  }).then(function() {
    return uart;
  });
};
});

E.enableWatchdog(16);
NRF.power=-8;
logD = print;

if(NRF.getAddress() == "dc:b9:53:76:6e:30") NRF.setAdvertising({},{name:"== Relay"});

var CONN = null;

function conn(name) {
  print("Connecting to "+name);
  NRF.setTxPower(NRF.power);
  NRF.requestDevice({ filters: [{ namePrefix: name }] }).then(function(device) {
    return require("ble_uart").connect(device);
  }).then(function(uart) {
    uart.on('data', function(d) { 
      if(typeof(d) == "string") print(d);
      else print("Got:"+JSON.stringify(d)); 
    });
    CONN = uart;
    logD("Connected");
    LED1.reset();
    CONN.to = 5; // min to disconnect
    autoDiscon();
  });
}

function send(cmd) {
  if(!CONN) {
    logD("Not connected");
    return;
  }
  CONN.eval(cmd);
  CONN.to = 5;
}

function discon() {
  try {
  CONN.disconnect(); 
  } catch (err) {}
  CONN = null;
  logD("Disconnected"); 
  NRF.setTxPower(NRF.power);
  LED1.set();
}

function autoDiscon() {
  if(!CONN) return;
  if(CONN.to) {CONN.to--; setTimeout(autoDiscon, 60*1000); return;}
  discon();
}

function free() { send("free()"); }
function over() { send("UI.runningLong = false"); }
function ls() { send("AG.list()"); }
