E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(15, false);
// set name to F10
// NRF.setAdvertising({},{name:"F10 "+NRF.getAddress().split(':').slice(-2).join('')});
var SPI2 = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////8QtQNMfEQigGCAoYDjgBC92P///wdLe0QbiUOxBEoTaAAr/NAAIxNgA0p6RBOBcEcYMQJAxv///7L///8t6fBHkEYZTBlO//fl/xlK3/hkwAAjASUTYE/w/w5TYKlGI2AQMh9G/ykA6wMKwvgAoIu//zMxYMb4AOAAIYi//znM+ACQuPEADwbQKbkLS3tEHYEAIL3o8IfU+ACguvEAD/rQJ2AAKd7R8+cYMQJASDUCQDQ1AkAQMAJAUP///y3p8E+bsM3pARJQSnpEBkaS+ACQACgA8JGAACkA8I6ACfH/MwcrAPKJgAEjA/oJ8wE727IDkwR4Q3iXiETqAyQCmxxB02gA8QILpLILsT1KE2BP6kkD27IEkz1Le0QRqAWTCKvN6QYwT/AACEFGBZsCnbP4AqADmwGaI0BE+gn0MvgTwAObI0BE+gn0MvgTIASbHUTtsgctQNiksk/qLBNDVBMSAfECDkPqDBxDGAMxqvECCiMpg/gBwB/6ivoA+A4gCd0BIv/3W//Y8QEIC78HmAaYQUYAIbrxAA/L0R1Le0QBP9uIHkS/snN4NHhE6gMkApscQQbxAguksgAvttHJsTpG//c8/xNLe0TYaBCxDUsYYAAgG7C96PCP3kYIPR74ATvtssXxCAsD+gvzHEOksvNGsuf/9w//5edP8P8w6ecAvwwFAFAIBQBQFP///8T+//9A/v//Fv7//xVKekRwtQ5GEWkFRuGxEEsZYNJoArEaYAAiASEoRv/3Af8OSwtMe0QBLhppImAE3QAicR5oHP/39f4JS3tE2GgIsSBgACBwvU/w/zD75wC/DAUAUAgFAFDC/f//nv3//4j9//8TtQAoHtsAKaa/jfgFEAIkASQAKqS/AqkJGY34BACkvwE0AfgELAAror8CqhIZATQhRgGoqL8C+AQ8//ev/yBGArAQvQAk+udwtQVGiLFGGAAkKEYQ+AEbGbFFGLVCAtlkQiBGcL3/95n/ACj50QE07+cERvXnAAA4tQ9Le0QaaZKxiLGBsdtoC7EJShNgC00ITH1EACIraSNg//eR/uhoCLEgYAAgOL1P8P8w++cAvwwFAFAIBQBQ5Pz//878//8PSjC1FGjEuQ5LG2gLsQ5MI2ARSw1Me0QABl1pJWCdaWVg3GkKS0kAHGBYYVlkByMTYAhLASAYYDC9T/D/MPvnADUCQAQzAkAIMwJACDUCQBA1AkAUMAJAivz//wVKACMTYKL1fnITYANLG2gLscL4ADJwRwA1AkAEMwJAELUGTHxExOkFAQEhAfoC8gH6A/PiYCNhEL0AvyD8//8=");
  return {
    cmd:E.nativeCall(569, "int(int,int)", bin),
    cmds:E.nativeCall(741, "int(int,int)", bin),
    cmd4:E.nativeCall(669, "int(int,int,int,int)", bin),
    data:E.nativeCall(789, "int(int,int)", bin),
    setpins:E.nativeCall(985, "void(int,int,int,int)", bin),
    enable:E.nativeCall(861, "int(int,int)", bin),
    disable:E.nativeCall(953, "void()", bin),
    blit_setup:E.nativeCall(33, "void(int,int,int,int)", bin),
    blt_pal:E.nativeCall(221, "int(int,int,int)", bin),
  };
})();

E.kickWatchdog();

// F07 display pins
var RST=D7,CS=D8,DC=D6,PWR=D11,SCK=D3,MOSI=D2;

CS.write(1); // CS
DC.write(1); // CD
RST.write(1); // RESET
//PWR.write(0);
digitalPulse(RST,0,10);

//SPI2.save();
SPI2.setpins(SCK,MOSI,CS,DC); // CLK,MOSI,CS,DC
SPI2.disable();SPI2.enable(0x80,0); //8MBit, mode 0


function toFlatString(arr){
  var b=E.toString(arr);if (b) return b;
  print("toFlatString() fail&retry!");E.defrag();b=E.toString(arr);if (b) return b;
  print("fail&retry again!");E.defrag();b=E.toString(arr);if (b) return b;
  print("failed!"); return b;
}
function toFlatBuffer(a){return E.toArrayBuffer(toFlatString(a));}

function cmd(a){
  var l=a.length;
  if (!l)return SPI2.cmd4(a,-1,-1,-1);
  if (l==2)return SPI2.cmd4(a[0],a[1],-1,-1);
  if (l==3)return SPI2.cmd4(a[0],a[1],a[2],-1);
  if (l==4)return SPI2.cmd4(a[0],a[1],a[2],a[3]);
  if (l==1)return SPI2.cmd4(a[0],-1,-1,-1);
  var b=toFlatString(a);
  SPI2.cmd(E.getAddressOf(b,true),b.length);
}

function cmds(arr){
  var b=toFlatString(arr);
  var c=SPI2.cmds(E.getAddressOf(b,true),b.length);
  if (c<0)print('lcd_cmds: buffer mismatch, cnt='+c);
  return c;
}

function delayms(ms){
  digitalPulse(DC,0,ms); // just to wait 10ms
  digitalPulse(DC,0,0);
}

function init(){
  cmd(0x11); // sleep out
  delayms(10); // just to wait 10ms
  cmd([0xb1,1,8,5]);
  cmd([0xb2,1,8,5]);
  cmd([0xb3,1,8,5,5,8,5]);
  cmd([0xb4,0]);
  cmd([0xc0,0x28,8,4]);
  cmd([0xc1,0xc0]);
  cmd([0xc2,0xd,0]);
  cmd([0xc3,0x8d,0x2a]);
  cmd([0xc4,0x8d,0xee]);
  cmd([0xc5,0x1d]);
  cmd([0x36,200]);
  cmd([0xe0,7,0x17,0xc,0x15,0x2e,0x2a,0x23,0x28,0x28,0x28,0x2e,0x39,0,3,2,0x10]);
  cmd([0xe1,6,0x21,0xd,0x17,0x35,0x30,0x2a,0x2d,0x2c,0x29,0x31,0x3b,0,2,3,0x12]);
  // GMCTRP1 Gamma correction
  //cmd([0xE0, 0x02, 0x1C, 0x07, 0x12, 0x37, 0x32, 0x29, 0x2D, 0x29, 0x25, 0x2B, 0x39, 0x00, 0x01, 0x03, 0x10]);
  // GMCTRP2 Gamma Polarity correction
   //cmd([0xE1, 0x03, 0x1d, 0x07, 0x06, 0x2E, 0x2C, 0x29, 0x2D, 0x2E, 0x2E, 0x37, 0x3F, 0x00, 0x00, 0x02, 0x10]);
  cmd([0x3a,3]);//3=12bit mode, 5=16bit mode
}

var bpp=4; // powers of two work, 3=8 colors would be nice
var g=Graphics.createArrayBuffer(80,160,bpp);
var pal;
switch(bpp){
  case 2: pal= Uint16Array([0x000,0xf00,0x0f0,0x00f]);break; // white won't fit
//  case 1: pal= Uint16Array([0x000,0xfff]);break;
  case 1:
  pal= Uint16Array( // same as 16color below, use for dynamic colors
    [ 0x000,0x00a,0x0a0,0x0aa,0xa00,0xa0a,0xa50,0xaaa,
      0x555,0x55f,0x5f5,0x5ff,0xf55,0xf5f,0xff5,0xfff ]);
  g.sc=g.setColor;
  c1=pal[1]; //save color 1
  g.setColor=function(c){ //change color 1 dynamically
    c=Math.floor(c);
    if (c > 1) {
      pal[1]=pal[c]; g.sc(1);
    } else if (c==1) {
      pal[1]=c1; g.sc(1);
    } else g.sc(c);
  }; break;
  case 4: pal= Uint16Array( // CGA
    [
// 12bit RGB444
      0x000,0x00a,0x0a0,0x0aa,0xa00,0xa0a,0xa50,0xaaa,
     0x555,0x55f,0x5f5,0x5ff,0xf55,0xf5f,0xff5,0xfff
//16bit RGB565
//      0x0000,0x00a8,0x0540,0x0555,0xa800,0xa815,0xaaa0,0xad55,
//      0x52aa,0x52bf,0x57ea,0x57ff,0xfaaa,0xfabf,0xffea,0xffff

    ]);break;
}

// preallocate setwindow command buffer for flip
g.winCmd=toFlatBuffer([
  5, 0x2a, 0, 0, 0,0,
  5, 0x2b, 0, 0, 0,0,
  1, 0x2c,
  0 ]);
// precompute addresses for flip
g.winA=E.getAddressOf(g.winCmd,true);
g.palA=E.getAddressOf(pal.buffer,true); // pallete address
g.buffA=E.getAddressOf(g.buffer,true); // framebuffer address
g.stride=g.getWidth()*bpp/8;

g.flip=function(force){
  var r=g.getModified(true);
  if (force)
    r={x1:0,y1:0,x2:this.getWidth()-1,y2:this.getHeight()-1};
  if (r === undefined) return;
  var x1=r.x1&0xfe;var x2=(r.x2+2)&0xfe; // for 12bit mode align to 2 pixels
  var xw=(x2-x1);
  var yw=(r.y2-r.y1+1);
  if (xw<1||yw<1) {print("empty rect ",xw,yw);return;}
  var c=g.winCmd;
  c[3]=24+x1;c[5]=23+x2; //0x2a params
  c[9]=r.y1;c[11]=r.y2; // 0x2b params
  SPI2.blit_setup(xw,yw,bpp,g.stride);
  var xbits=x1*bpp;
  var bitoff=xbits%8;
  var addr=g.buffA+(xbits-bitoff)/8+r.y1*g.stride; // address of upper left corner
  SPI2.cmds(g.winA,c.length);
  SPI2.blt_pal(addr,g.palA,bitoff);
};

g.lev=256;
g.setBrightness=function(lev){
  if (lev>=0 && lev<=256)
    this.lev=lev;
  else
    lev=this.lev;
  if (this.isOn){
    var val=1-lev/256;
    if (val==0||val==1)
      digitalWrite(PWR,val);
    else
      analogWrite(PWR,val);
  }
};

g.isOn=false;
g.on=function(){
  if (this.isOn) return;
  [DC,SCK,MOSI,RST,CS].forEach((p)=>{p.mode("input_pullup");p.mode("output");});
  CS.write(1); // CS
  DC.write(1); // CD
  RST.write(1); // RESET
  SCK.write(0);
  MOSI.write(0);
  PWR.reset(); // enable power
  SPI2.enable(0x80,0);
  PWR.set();//turn off brightness for now (it feeds off other pins now)
  init();
  this.flip(true);
  cmd(0x13); //ST7735_NORON: Set Normal display on, no args, w/delay: 10 ms delay
  cmd(0x29); //ST7735_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
  //PWR.reset(); // full brightness
  this.isOn=true;
  this.setBrightness();
};


g.off=function(){
  if (!this.isOn) return;
  cmd(0x28);
  cmd(0x10);
  PWR.set();
  SPI2.disable();
  //6,3,2,8,7
  [DC,SCK,MOSI,RST,CS].forEach((p)=>{p.mode("analog");} ); // disconnect like  poke32(0x50000700+4*pin,2);
  this.isOn=false;
};

var VIB=D25;
function vibon(vib){
 if(vib.i>=1)VIB.set();else analogWrite(VIB,vib.i);
 setTimeout(viboff,vib.on,vib);
}
function viboff(vib){
 VIB.reset();
 if (vib.c>1){vib.c--;setTimeout(vibon,vib.off,vib);}
}

vibrate=function(intensity,count,onms,offms){
 vibon({i:intensity,c:count,on:onms,off:offms});
};

function battVolts(){
return 4.20/0.18*analogRead(D5);
}

function battLevel(v){
  var l=3.23,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}


// cube from https://www.espruino.com/Pixl.js+Cube+Badge
var rx = 0, ry = 0, cc = 1;
// Draw the cube at rotation rx and ry
function drawCube(xx,yy,zz) {
  // precalculate sin&cos for rotations
  var rcx=Math.cos(rx), rsx=Math.sin(rx);
  var rcy=Math.cos(ry), rsy=Math.sin(ry);
  // Project 3D into 2D
  function p(x,y,z) {
    var t;
    t = x*rcy + z*rsy;
    z = z*rcy - x*rsy;
    x=t;
    t = y*rcx + z*rsx;
    z = z*rcx - y*rsx;
    y=t;
    z += 4;
    return [xx + zz*x/z, yy + yy*y/z];
  }
  var a,b;
  // -z
  a = p(-1,-1,-1); b = p(1,-1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  b = p(-1,1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(-1,-1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  // z
  a = p(-1,-1,1); b = p(1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  b = p(-1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(-1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  // edges
  a = p(-1,-1,-1); b = p(-1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,-1,-1); b = p(1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,1,-1); b = p(1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(-1,1,-1); b = p(-1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
}

function stepCube() {
  rx += 0.1;
  ry += 0.1;
  g.setColor(0);g.fillRect(0,40,80,120);g.setColor(15);//+cc);cc=(cc+1)%15;
  drawCube(40,80,80);
  g.flip();
}
require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
//require("Font8x16").add(Graphics);

function info(){
  g.clear();
  g.setFont("4x6",1/*2*/);g.setColor(10);
  g.drawString("Espruino "+process.version,5,10);
  if (bpp==1) g.flip();
  g.setFont("4x6",1);g.setColor(14);
  g.drawString("ST7735 12 bit mode\n8Mbps SPI with DMA",4,22);
  if (bpp==1) g.flip();
  for (var c=0;c<8;c++){
    g.setColor(c+8);g.fillRect(8+8*c,130,16+8*c,138);
    if (bpp==1) g.flip();
  }
  for ( c=0;c<8;c++) {g.setColor(c);g.fillRect(8+8*c,142,16+8*c,150);
    if (bpp==1) g.flip();
  }
  g.flip();
  return setInterval(function(){
    stepCube();
  },5);
}

/*
** BEGIN WATCH FACE
*/
const startX=[6,43,6,43],startY=[14,14,82,82],nmX=[4,42,88,126],nmY=[12,12,12,12];let xS=1,yS=1,rotate=!1;function drawScaledPoly(l,e,o){let d=[];for(let t=0;t<l.length;t+=2){var a;d[t]=Math.floor(l[t]*xS)+e,d[t+1]=Math.floor(l[t+1]*yS)+o,rotate&&(a=d[t],d[t]=80-d[t+1],d[t+1]=a)}g.fillPoly(d,!0)}
let lcdTopSeg=Uint8Array([0,0,29,0,29,9,0,9]);
let lcdTopLeftSeg=Uint8Array([0,0,9,0,9,29,0,29]);
let    lcdTopRightSeg=Uint8Array([20,0,29,0,29,29,20,29]);
let    lcdMiddleSeg=Uint8Array([0,25,29,25,29,34,0,34]);
let    lcdBottomLeftSeg=Uint8Array([0,30,9,30,9,59,0,59]);
let    lcdBottomRightSeg=new Uint8Array([20,30,29,30,29,59,20,59]);
let    lcdBottomSeg=new Uint8Array([0,50,29,50,29,59,0,59]);
function drawDigit(t,l,e){let o=(e?nmX:startX)[t];t=(e?nmY:startY)[t];EMULATOR&&(o+=80),1!=l&&4!=l&&drawScaledPoly(lcdTopSeg,o,t),1!=l&&2!=l&&3!=l&&7!=l&&drawScaledPoly(lcdTopLeftSeg,o,t),5!=l&&6!=l&&drawScaledPoly(lcdTopRightSeg,o,t),0!=l&&1!=l&&7!=l&&drawScaledPoly(lcdMiddleSeg,o,t),0!=l&&2!=l&&6!=l&&8!=l||drawScaledPoly(lcdBottomLeftSeg,o,t),2!=l&&drawScaledPoly(lcdBottomRightSeg,o,t),1!=l&&4!=l&&7!=l&&drawScaledPoly(lcdBottomSeg,o,t);}
/*
** END WATCH FACE
*/
var volts;
var batt=battInfo();
let lastTime = '';
let EMULATOR = false; 

function drawClock(){
  let d=Date();
  let sec=d.getSeconds();
  d=d.toString().split(' ');
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  let nm = false;
  if(hr > 20 || hr < 8) {
    nm = true;
  }
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);
  xmid = 40;
  if(EMULATOR) xmid=120;
  
  if(!nm) {
    let xyz = accCoords();
    console.log(JSON.stringify(xyz));
    if(xyz.x < -2 || xyz.x > 38 || xyz.y < -12 || xyz.y > 20) {
      g.off();
      return;
    }
  }
  g.on();

  if (tm == lastTime) return;
  lastTime = tm;

  g.clear();
  g.setFont("6x8");
  if(!nm) {
    //g.setFont(myFont,1);g.setColor(15);
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    let batt = battInfo();
    g.drawString(batt,xmid-g.stringWidth(batt)/2,0);
  } else {
    g.setColor(4);
    let b = battLevel();
    for(let c=0; c<5; c++) {
      if(b > c*20) g.fillCircle(24+8*c, 8, 2);
      else g.drawCircle(24+8*c,8,2);
    }
  }

  if(nm) {
    rotate = true;
    g.setColor(4);
    if(EMULATOR) g.setColor(0.5,0.5,0.5);
    if (hr>9) drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);
    g.fillCircle(40, 80,2);
    g.fillCircle(24, 80,2);
    g.flip();
  } else {
    //vibrate(1,1,100,0);
    rotate = false;
    g.setColor(8+7);
    if(EMULATOR) g.setColor(1,1,1);
    drawDigit(0,Math.floor(hr/10), nm);
    drawDigit(1,Math.floor(hr%10), nm);
    drawDigit(2,Math.floor(min/10), nm);
    drawDigit(3,Math.floor(min%10), nm);

    g.setFont("6x8",2); 
    g.setColor(8+2);
    if(EMULATOR) g.setColor(0,1,0);
    var dt=/*d[0]+" "+*/d[1]+" "+d[2];//+" "+d[3];
    g.drawString(dt,xmid-g.stringWidth(dt)/2,146);
    g.flip();
  }
}

function clock(){
  volts=0;
  drawClock();
  return setInterval(function(){
    drawClock();
},777);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  currscr=-1;
  return 0;
}

var screens=[clock,info,sleep];
var currscr= -1;
var currint=0;
setWatch(function(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
},BTN1,{ repeat:true, edge:'rising',debounce:25 }
);


var fc=new SPI(); // font chip - 2MB SPI flash
D23.write(1);
fc.setup({sck:D19,miso:D22,mosi:D20,mode:0});
fc.send([0xb9],D23); //put to deep sleep

// BMA 222E accelerometer on shared spi with fontchip, CS=D18
D18.set();
D31.set();
function accRegRead(r){
  return fc.send([0x80|r,0x00],D18)[1];
}
function accWriteReg(r,v){
  fc.send([0x7f & r,v],D18);
}
function accSetBit(r,b){
    var v = accRegRead(r);
    accWriteReg(r,v | 1<<b);
}
function accResetBit(r,b){
  var v = accRegRead(r);
  accWriteReg(r,v & ~(1<<b));
}
function accLowPowerMode(b){
  if (b)
    accSetBit(0x11,6);
  else
    accResetBit(0x11,6);
}

function accCoords(){
  var coords=Int8Array(fc.send([0x82,0,0,0,0,0,0],D18).buffer,2);
  return ({x:coords[0],y:coords[2],z:coords[4]});
}

/* try tap detection feature
D17.mode("input_pulldown"); // irq2 pin
accWriteReg(0x21,0x0E); // //latch irq for 50ms
accSetBit(0x16,5); // single tap enable
accSetBit(0x1b,5); // map it to int2
accLowPowerMode(1);
accWriteReg(0x2b,(3<<6)|4) //tap sensitivity  

// values are 4=face tap, 2=side tap, 1=bottom or top side tap
setWatch(()=>{
      var rv = accRegRead(0x0b);
      var v = (rv&0x7f)>>4;
      v  = rv&0x80?-v:v;
      print("tap ",v);
},D17,{ repeat:true, debounce:false, edge:'rising' });
*/
