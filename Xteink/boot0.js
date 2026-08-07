_S=require("Storage");
let SLEEP=()=>{
  g.clear().drawImage(_S.read("ELogo.png"), 140, 300);
  g.setFontAlign(0, -1).drawString("Espruino Xteink", 240, 520).flip(1);
  setTimeout("ESP32.deepSleepExt0(D3,0);", 2000);
};
g.setColor(0).setBgColor(-1);
eval(_S.read("BarlowMed23.js"));
g.setFontBarlowMC23();
g.clear().drawString(`Rebooty...\nBattery: ${E.getBattery()} %`, 4, 8);
g.flip(2);
// set up auto-sleep to save power
Xteink.sleepTime = 5; // minutes
Xteink.sleepTicker = Xteink.sleepTime;

function checkIdle() {
  Xteink.sleepTicker--;
  if(Xteink.sleepTicker <= 0) SLEEP();
}
setInterval(checkIdle, 60000);
/*

Xteink.on("button", function(e) {
  if (e.id === Xteink.BTN_BACK && e.pressed) {
    print("Back pressed");
  }
  if (e.id === Xteink.BTN_POWER && e.released) {
    print("Power released after", Xteink.getPowerHoldTime(), "ms");
  }
});
*/


Xteink.lastButton = 0;
setInterval(() => {
  let btn = Xteink.getState();
  if(btn == Xteink.lastButton) return;
  if(btn) {
    Xteink.lastButton = btn;
    //print("Btn"+btn+" down");
    Xteink.emit('BUTTON',{id: btn, pressed: true});
  } else {
    //print("Btn"+Xteink.lastButton+" up");
    Xteink.emit('BUTTON',{id: Xteink.lastButton, pressed: false});
    Xteink.lastButton = 0;
  }
}, 50);

Xteink.on("BUTTON", function(e) {
  Xteink.sleepTicker = Xteink.sleepTime;
  print(e.id, e.pressed ? "down" : "up");
});

