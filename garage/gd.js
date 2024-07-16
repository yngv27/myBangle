// watch for specific IP address

const SilverCV16 = "db:98:55:ac:21:a7 random";
const Bangle2 = "c3:77:1f:e2:bc:e6 random";
const BlackCV16 = "d9:a8:b3:56:94:08 random";
const SN80_1 = "f7:6f:02:0a:e2:1a random";


let scanIntvl = 0;
let timeout = 3 * 60 * 1000;

function openGarageDoor(dev) {
  print("OPEN GARAGE DOOR");
  D11.set(); setTimeout(function(){D11.reset();}, 250);
  if(scanIntvl) clearInterval(scanIntvl);
  buzzit(dev);
  NRF.setTxPower(0);
}

function startScan(mac) {
  NRF.setTxPower(4);
  scanIntvl = setInterval(scanFor, 5000, mac);
}

function watchFor(mac) {
  setTimeout(startScan, timeout, mac);
}

function scanFor(mac) {
  print("Scanning");
  NRF.findDevices(function(arr) {
    arr.forEach(function(b) {
      print(b.id+" =?= "+mac);
      if(b.id == mac) openGarageDoor(b);
    });
  });
}

function buzzit(device) {
    require("ble_simple_uart").write(
          device,
          "Bangle.buzz(400)\n",
          function() {
            print('Done!');
          });
}