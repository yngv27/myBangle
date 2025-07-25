global.wOS = {
  CHG: D13,
  BAT: D5,
  BUZ: D25,
  BKL: D11,
  isAwake : true,
  time_left:10,
  ticker:undefined,
  buzz: function(v, i){
    analogWrite(wOS.BUZ,0.6);
    setTimeout(()=>{wOS.BUZ.reset();},100);
  },
  isCharging:()=>{return wOS.CHG.read();},

  sleep:() => {
      wOS.isAwake = false;
      g.flip(); //make sure finished with SPI before stopping it.
  },
  wake:()=> {
      wOS.isAwake = true;
      wOS.time_left = wOS.ON_TIME;
      if(wOS.ticker) 
        wOS.time_left += 5;
      else 
        wOS.ticker = setInterval(wOS.tick,1000);
  },
  setLCDPower:(b)=>{
      if (b){
          if (wOS.isAwake) wOS.time_left = wOS.ON_TIME; else wOS.wake();
      } else 
          wOS.sleep();
  },
  isLCDOn:()=>{ return wOS.isAwake;},
  tick:()=>{
      wOS.time_left--;
      if (wOS.time_left<=0){
         if (wOS.ticker) wOS.ticker=clearInterval(wOS.ticker);
         wOS.emit("sleep",true);
         wOS.sleep();
      }
  }
};

/*
var fc=new SPI(); // font chip - 2MB SPI flash
D12.write(1);
fc.setup({sck:D14,miso:D11,mosi:D13,mode:0});
fc.send([0xb9],D12); //put to deep sleep
*/
/*
//print(fc.send([0xab],D23)); // wake from deep sleep
//print(fc.send([0x90,0,0,1,0,0],D23));
//print(fc.send([0x9f,0,0,0],D23));
//print(fc.send([0xb9],D23)); // put to deep sleep
var w25 = require("W25");
var fc = new w25(fc, D23 );
*/

// we're "special"
NRF.setAdvertising({},{name:"F07X "+NRF.getAddress().split(':').slice(-2).join('')});

setWatch(()=>{
  if(!wOS.isAwake) wOS.wake();
  wOS.buzz();
  wOS.emit("charging",wOS.isCharging());
},wOS.CHG,{edge:"both",repeat:true,debounce:500});

 
eval(_S.read("~BMA222.js"));
ACCEL.init();

// D8 is our power pin for the display
pinMode(D8, "output");
D8.set();
// and D28 is our new button
pinMode(D28, "input_pullup");

eval(_S.read("~ST7571.js"));

E.getBattery = function (){
  let l=3.5,h=4.19;
  let v=4.20/0.18*analogRead(wOS.BAT);
  if(v>=h)return 100;
  if(v<=l)return 0;
  return Math.floor(100*(v-l)/(h-l));
};

NRF.setAdvertising({},{name : ["Eebie"] });

ACCEL.on("FACEUP", wOS.wake);
wOS.showLauncher = function(){
  //load("launch.js");
};
wOS.UI = {};
var UI = { "y": 0, "lf": 10,
  "add": function (t) {g.drawString("[ ] "+t,0,UI.y).flip(); UI.y+=UI.lf;},
  "done": function (n) {g.drawString("///////////////////////",0,n*10).flip();}
 };
Graphics.prototype.setFont6x8=function(scale){this.setFontCustom(
    atob("AAAAAAB6AA4AAOAAAkH4JB+CQAAkFI/xSAwADCMwEBmIYAAMFIshMBIADgAAfiBAAgR+AACAqBwKgIAACAID4CAIAAAQGAACAIAgCAAAYAADAwMDAAAfCKJIoh8AAQj+AIABGIokiSGIABEIIkiSGwAAcCQRD+AQADkKIoiiJwAB8KIoiiBwACAIYiCQOAABsJIkiSGwABwIoiiKHwAA2AAAQ2AACAUCIQQABQFAUBQABBCIFAIAAQCAIokBgAAfiBJkpR9AABg4MgOAGAA/iSJIkhsAAfCCIIghEAA/iCIIRA4AA/iSJIggAP4kCQIAAB8IIkiSBwAD+BAED+AAgj+IIAAEAIAj8AA/gQCgRCCAA/gCAIAgAP4QAgEA/gAP4IAQAg/gAHwgiCIIfAAP4iCIIgcAAHwgiCIQewAP4kCYJQYgAGQkiSJITAAIAgD+IAgAAPwAgCAI/AAPADACAw8AAPgBgcAY+AAMYKAQCgxgAOAEAOBA4AAIYiiSKIwgAP8gQAMAMAMAMACBP8AAwMAMAAAEAQBAEACAEAAAcCIIg+AA/giCIHAABwIgiBQAAcCIIj+AAHAqCoGAACAfigAAHAiiKPwAP4IAgB4AC+AAIS+AA/gIBQIgAPwAgAD4IAeCAHgAD4IAgB4AAcCIIgcAAP4iCIHAABwIgiD+AA+BAIAABoKgqAwAAgPwIgADwAgCD4AA4AYBA4AAOAGAgBg4AAJgYBgJgADwAoCj8AAiCYKgyAAaycgA/wAJyawADAQAgBAYAAP///8="), 32, 
    atob("AwMEBQcGBgIDAwYGAwUCBQYEBgYGBgYGBgYCAwUFBQYGBgYGBgUFBgUEBQYFBgYGBgYGBgYGBgYGBgYDBQMEBQMFBQUFBQQFBQIDBQMGBQUFBQQFBAUFBgUFBQMCAwY="),
     10+(scale << 8)+(1 << 16));};
g.setFont6x8();
