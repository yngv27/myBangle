var gatt;
const BLE_PR = "180d";
const BLE_WEIGHT = "181d";
const BLE_NIBP = "1810";
const BLE_TEMP = "1809";
const BLE_SPO2 = "1822";
const BLE_GENERIC = "1801";

const BLE_PR_VALUE = "0x2a37";
const BLE_NIBP_VALUE = "0x2a35";
const BLE_SPO2_VALUE = "0x2a5e";
const BLE_TEMP_VALUE = "0x2a1c";

const device_address = "00:16:a4:57:c8:96";

var device;
/*
NRF.connect(device_address).then(function(d) {
  device = d;
  return d.getPrimaryService(BLE_PR);
}).then(function(s) {
  console.log("Service ",s);
  return s.getCharacteristic(BLE_PR_FOO);
}).then(function(c) {
  c.on('characteristicvaluechanged', function(event) {
    console.log("-> "+event.target.value);
  });
  return c.startNotifications();
}).then(function(d) {
  console.log("Waiting for notifications");
}).catch(function() {
  console.log("Something's broken.");
});

*/
let step = 0;
let spo2 = 0;
let nibp_sys = 0;
let nibp_dia = 0;
let temp = 0;
let pulse = 0;

require("Font8x12").add(Graphics);
g.setFont("8x12",2);

let display = () => {
  g.clear();
  g.setColor("#D06000");
  g.drawString("NIBP: ", 0, 40);
  g.drawString(nibp_sys + "/" + nibp_dia, 160, 40);
  g.setColor("#00C000");
  g.drawString("PULS: ", 0, 80);
  g.drawString(pulse, 160, 80);
  g.setColor("#0060C0");
  g.drawString("SPO2: ", 0, 120);
  g.drawString(spo2, 160, 120);
  g.setColor("#FFFFFF");
  g.drawString("TEMP: ", 0, 160);
  g.drawString(temp, 160, 160);
  //console.log("================");
};

let disconnect = () => {
  if(gatt) gatt.disconnect();
};

let vitals = setInterval(display, 2000);

NRF.requestDevice({ timeout:9000, filters: [{ "id": "00:16:a4:57:c8:96 public" }] }).then(function(device) {
  step = 1;
  return device.gatt.connect();
}).then(function(g) {
  step = 2;
  gatt = g;
  console.log("connected"); //, gatt);
  return gatt.startBonding();
}).then(function() {
  step = 3;
  console.log("bonded"); //, gatt.getSecurityStatus());
  gatt.device.on('gattserverdisconnected', function(reason) {
    console.log("Disconnected ",reason);
    clearInterval(vitals);
  });
  // Begin PR pulling
  
  return gatt.getPrimaryService(BLE_PR);
}).then(function(ps) {
  step = 4;
  return(ps.getCharacteristic(BLE_PR_VALUE));
}).then(function(c) {
  step = 5;
  //console.log(c);
  c.on('characteristicvaluechanged', function(event) {
    let o = event.target.value;
    pulse = o.buffer[1];
    //console.log("PULS-> ", pulse);
  });
  return c.startNotifications();
}).then(function() {
  step = 6;
  // begin SpO2 pulling
   return gatt.getPrimaryService(BLE_SPO2);
}).then(function(ps) {
  step = 7;
  return(ps.getCharacteristic(BLE_SPO2_VALUE));
}).then(function(c) {
  step = 8;
  //console.log(c);
  c.on('characteristicvaluechanged', function(event) {
    let o = event.target.value;
    spo2 = o.buffer[1];
    //console.log("SPO2 -> ", spo2);
  });
  return c.startNotifications();
}).then(function() {
  step = 9;
    // begin SpO2 pulling
   return gatt.getPrimaryService(BLE_TEMP);
}).then(function(ps) {
  step = 10;
  return(ps.getCharacteristic(BLE_TEMP_VALUE));
}).then(function(c) {
  step = 11;
  console.log(c);
  
  c.on('characteristicvaluechanged', function(event) {
    let o = event.target.value;
    temp = (o.buffer[1] + 256 * o.buffer[2]) / 10;
    console.log("TEMP -> ",o.buffer);
  });
  return c.startNotifications();
}).then(function() {  
  step = 12;
    // begin NIBP pulling
   return gatt.getPrimaryService(BLE_NIBP);
}).then(function(ps) {
  step = 13;
  return(ps.getCharacteristic(BLE_NIBP_VALUE));
}).then(function(c) {
  step = 14;
  console.log(c);
  
  c.on('characteristicvaluechanged', function(event) {
    let o = event.target.value;
    nibp_sys = o.buffer[1];
    nibp_dia = o.buffer[3];
    console.log("NIBP -> ",o.buffer);
  });
  return c.startNotifications();
  
}).catch(function(e) {
  console.log(step,e);
});

setWatch(disconnect, BTN1, {repeat:true,edge:"falling"});

