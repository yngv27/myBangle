let exports = {};

exports.connect = (spi1, opts) => {

  let lut_full_mono = new Uint8Array(
  [
    0x50, 0xAA, 0x55, 0xAA, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x1F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);

  function cmd(c, d) {
      opts.dc.reset();
      spi1.write(c, opts.cs);
      if (d !== undefined) {
          opts.dc.set();
          spi1.write(d, opts.cs);
      }
  }
  
  var g = Graphics.createArrayBuffer(200,200,1,{msb:true});

  g.flip = function (partial) {
    cmd(0x24); //write B/W
    opts.dc.set();
    /*
    var w = g.getWidth()>>3;
    for (var y=0;y<g.getHeight();y++) {
      spi1.write(new Uint8Array(g.buffer,y*w,w), opts.cs);
    }
    digitalWrite(opts.dc,0); 
    */
    spi1.write(new Uint8Array(g.buffer), opts.cs);
    cmd(0x22, 0xc4);
    cmd(0x20);
    cmd(0xff);
    return g;
  };

  /*
  function full(val) {
    cmd(0x24);
  //while(BUSY.read()) delay(100);
    DC.set();
    for(let y=0; y< 200; y+= 2) {
      for(let x=0; x < 25; x+=2) {
        //let d = g.buffer[y*25+x];
        spi1.write(y*25 ,  CS);
      }
    }
  }
  */
  function update() {cmd(0x20);}

  function sleep() { cmd(0x10, 1);}


  function init() {
    opts.rst.reset(); 
    setTimeout(()=>{opts.rst.set();},200);
    setTimeout(() => {

    cmd(0x01, [199, 0, 0]); //DRIVER_OUTPUT_CONTROL: LO(EPD_HEIGHT-1), HI(EPD_HEIGHT-1). GD = 0; SM = 0; 
    cmd(0x0C, [0xD7, 0xD6, 0x9D]);//BOOSTER_SOFT_START_CONTROL
    cmd(0x2C, 0x9B); //A8);//WRITE_VCOM_REGISTER: VCOM 7C
    cmd(0x3A, 0x1A);//SET_DUMMY_LINE_PERIOD: 4 dummy lines per gate
    cmd(0x3B, 0x08);//SET_GATE_TIME: 2us per line
    cmd(0x11, 0x03);//DATA_ENTRY_MODE_SETTING: X increment; Y increment

    cmd(0x32, lut_full_mono);

    cmd(0x44, [0, 24]);//SET_RAM_X_ADDRESS_START_END_POSITION: LO(x >> 3), LO((w-1) >> 3)
    cmd(0x45, [0, 0, 199, 0]);//SET_RAM_Y_ADDRESS_START_END_POSITION: LO(y), HI(y), LO(h - 1), HI(h - 1)
    cmd(0x4E, 0);//LO(x >> 3)
    cmd(0x4F, [0, 0]);//LO(y), HI(y >> 8)
    }, 400);
  }
  
  init();
  return g;
  
}; // end module

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=='), 32, atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc='), 256 + 13);
};


var spi1 = new SPI();
spi1.setup({sck: D18, mosi: D19, baud: 2000000});
DC = D28;
CS = D12;
//BUSY=D27;
RST=D11;
//
opts = {
  cs: CS,
  dc: DC,
  rst: RST,
};
g=exports.connect(spi1, opts);

//1.54
//g.setRotation(2,1);
g.setColor(0).setBgColor(1);
g.clear();


_S = require("Storage");

g.setBgColor(1).setColor(0);
g.clear();
g.setFont("Omnigo",2);
g.setFontAlign(0,-1).drawString("DT28",100,125);
g.setFontAlign(0,-1).drawString("-- REBORN -- ",100,155);
g.setFont("Omnigo",1);

//setTimeout(g.flip, 500);

const startX=[11,52,112,153],startY=[40,40,40,40],nmX=[16,42,88,126],nmY=[12,12,12,12];let rotate=!1,xS=1,yS=1;function setScale(t,r){xS=t,yS=r}function drawScaledPoly(r,n,a){let d=[];for(let t=0;t<r.length;t+=2){var e;d[t]=Math.floor(r[t]*xS)+n,d[t+1]=Math.floor(r[t+1]*yS)+a,rotate&&(e=d[t],d[t]=80-d[t+1],d[t+1]=e)}g.fillPoly(d,!1)}let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t)}

g.fillCircle(100,70,4).fillCircle(100,90,4);
for(let x=0; x<25; x++) g.buffer[x]=0xaa;
g.setFontOmnigo();
g.setFontAlign(0,-1);

lastTime="    ";

let drawClock = (d) => {
  g.setBgColor(1).setColor(0);
  //g.clear();//.fillRect(0,138,143, 149);
  let tm=('0'+d.hr).slice(-2)+('0'+d.min).slice(-2);

   for(let i=0; i<4; i++) {
    //console.log(tm[i],lastTime[i]);
    if(tm[i] != lastTime[i]) {
      //g.setColor(-1);
      g.clearRect(
        startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      //g.setColor(0);
      drawDigit(i,tm[i], false);
    }
  }  
  lastTime = tm;
  g.drawString(d.nicedate, 100, 6);
  g.drawString(d.nicedate, 101, 6);
  
  g.drawPoly([ 180,6, 192,6, 192,15,  180,15, 
              ], true);
  g.fillPoly([ 182,8, 190,8, 190,14,  182,14, 
              ], true);
  
  g.drawPoly( [2,8,  10,16, 6,20, 6,4, 10,8, 2,16], false);
  g.flip();
};

setInterval(()=> {
  let d = Date();
  drawClock({hr: d.getHours(), min: d.getMinutes(), nicedate: d.toString().substring(0, 15)});
}, 60000);



