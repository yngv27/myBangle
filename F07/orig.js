E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,1000);
E.enableWatchdog(10, false);
var SPI2 = (function(){
  var bin=atob("AAAAAAAAAAAAAAAA/////////////////////wAAAAAAAAAAELUDTHxEIoBggKGA44AQvdT///8HS3tEm2hDsQRKE2gAK/zQACMTYANKekSTYHBHGDECQML///+u////LenwR5BGGUwZTv/35f8ZSt/4ZMAAIwElE2BP8P8OU2CpRiNgEDIfRv8pAOsDCsL4AKCLv/8zMWDG+ADgACGIv/85zPgAkLjxAA8G0Cm5C0t7RJ1gACC96PCH1PgAoLrxAA/60CdgACne0fPnGDECQEg1AkA0NQJAEDACQEz///8t6fBPm7DN6QASBJNDS3tEBkaT+ACQACh90AApe9AJ8f8yByp32AEiAvoJ8gE60rIEeAKSQniT+ASwBZNE6gIkAZqHHAirEagUQc3pBjBP6kkC0rJP8AAIpLIDkkFGBZsBnZP4AqACmwCaI0BE+gn0MvgTwAKbI0BE+gn0MvgTIAObHUTtsgctgb8IPRf4ATvtssXxCA6EvwP6DvMcQ0/qLBNDVBMSAfECDkPqDBxDGAMxqvECCiMpg/gBwKSyAPgOIF/6ivoJ3QEi//dZ/9jxAQgLvweYBphBRgAhuvEAD8HRD0t7RNuIHkS3HHN4NHhE6gMkAZscQQvx/zMT8P8LpLKs0RmxBJr/9zr/WUYIRhuwvejwj0/w/zH45w7///84/v//H7XDssDzBxIACkDqAxDAsgApjfgFAI34CACN+AsAjfgOAAhGuL/IHY34BCCN+AYwjfgHII34CTCN+AogjfgMMI34DSCN+A8wwBD/9/P+EksSTAAiGmBaYKPyHEMPKRpgAaoiYA5KT/AMBBRgwr+i9VJyT/QAMRFgCkoBIRFgCkkAIhxoACz80AIoGmDYvwpgATj20QSwEL00NQJARDUCQEg1AkAQMAJAADICQP/3wr4YsRGxASL/99G+T/D/MHBHGLERsQAi//fJvk/w/zBwR/i1Ek5+RAdG82gAKw1GFdsBJAxKBPoD8xNgIUYAIv/3tf7zaJxACEsBLRxgBN0AImkeeBz/96r+ACAB4E/w/zD4vQC/DAUAUAgFAFAk/f//Ckp6RBC10mgAKgrbSLFBsQEjk0AEShNgACL/94/+ACAQvU/w/zD75wgFAFDW/P//MLUVTANGIGgQuxlKekQVaQAtHNtVaQAtAtqSaQAqFtsOShBoUGATSg1IekQbBhVpBWCVaUVgUGkKShBgU2EKS0kAGWAHIyNgCEsBIBhgML1P8P8w++cAvwA1AkAEMwJACDUCQBA1AkBUNQJAFDACQJz8//9+/P//BUsbaAuxBUoTYAVKACMTYKL1fnITYHBHBDMCQAgzAkAANQJABUsGSQAiGmAFSnpE0GkIYBJqGmBwRwC/ADUCQAQzAkAC/P//BEsaaAVLe0TaYQNKEmgaYnBHAL8EMwJAADUCQOL7//8QtQNMfETE6QUhIGHjYBC9xPv//w==");
  return {
    cmd:E.nativeCall(725, "int(int,int)", bin),
    data:E.nativeCall(805, "int(int,int)", bin),
    write:E.nativeCall(709, "int(int,int)", bin),
    write_async:E.nativeCall(693, "int(int, int)", bin),
    async_wait:E.nativeCall(689, "void()", bin),
    fill_color:E.nativeCall(517, "int(int,int)", bin),
    setpins:E.nativeCall(1077, "void(int,int,int,int)", bin),
    enable:E.nativeCall(853, "int(int,int)", bin),
    disable:E.nativeCall(973, "void()", bin),
    save:E.nativeCall(1045, "void()", bin),
    restore:E.nativeCall(1009, "void()", bin),
    blit_setup:E.nativeCall(37, "void(int,int,int,int)", bin),
    blt_pal:E.nativeCall(225, "int(int,int,int,int)", bin),
  };
})();

// F07 display pins
var RST=D7,CS=D8,DC=D6,PWR=D11,SCK=D3,MOSI=D2;

CS.write(1); // CS
DC.write(1); // CD
RST.write(1); // RESET
//PWR.write(0);
digitalPulse(RST,0,10);

SPI2.save();
SPI2.setpins(SCK,MOSI,-1,DC); // CLK,MOSI,MISO,DC
SPI2.disable();SPI2.enable(0x80,0); //8MBit, mode 0

function cmd(arr){
  var b=E.toString(arr); // flat string buffer
  if (!b){print("lcd_cmd: OOPS, undefined");E.defrag();b=E.toString(arr); }
  if (!b){print("lcd_cmd: OOPS again!");E.defrag();b=E.toString(arr); }
  CS.reset();
  SPI2.cmd(E.getAddressOf(b,true),b.length);
  CS.set();
}

function init(){
  cmd([0x11]); // sleep out
  digitalPulse(DC,0,10); // just to wait 10ms
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
  cmd([0x3a,3]);// 5
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

g.flip=function(force){
  var r=g.getModified(true);
  if (force)
    r={x1:0,y1:0,x2:this.getWidth()-1,y2:this.getHeight()-1};
  if (r === undefined) return;
  var x1=r.x1&0xfe;var x2=(r.x2+2)&0xfe; // for 12bit mode align to 2 pixels
  var xw=(x2-x1);
  var yw=(r.y2-r.y1+1);
  var stride=g.getWidth()*bpp/8;
  cmd([0x2a,0,24+x1,0,23+x2]); //offset by (128-80)/2=24
  cmd([0x2b,0,r.y1,0,r.y2]);
  cmd([0x2c]);
  SPI2.blit_setup(xw,yw,bpp,stride);
  var xbits=x1*bpp;
  var bitoff=xbits%8;
  var aoff=(xbits-bitoff)/8;
  var pa=E.getAddressOf(pal.buffer,true);
  var a=E.getAddressOf(g.buffer,true)+aoff+r.y1*stride; // address of upper left corner
  CS.reset();
  SPI2.blt_pal(a,pa,bitoff,0); // 0=not async, becasuse of CS
  CS.set();
};

g.lev=100;
g.setBrightness=function(lev){
  if (!lev || lev>256)
    lev=this.lev;
  else
    this.lev=lev;
  if (this.isOn) analogWrite(PWR,1-lev/256);
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
  PWR.set();//turn off brightness for now (if feeds off other pins now)
  init();
  this.flip(true);
  cmd([0x13]); //ST7735_NORON: Set Normal display on, no args, w/delay: 10 ms delay
  cmd([0x29]); //ST7735_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
  //PWR.reset(); // full brightness
  this.isOn=true;
  this.setBrightness();
};


g.off=function(){
  if (!this.isOn) return;
  cmd([0x28]);
  cmd([0x10]);
  PWR.set();
  SPI2.disable();
  //6,3,2,6,7
  [DC,SCK,MOSI,RST,CS].forEach((p)=>{p.mode("analog");} ); // disconnect pins like  poke32(0x50000700+4*pin,2);
  this.isOn=false;
};

function battLevel(){
return 4.21/0.18*analogRead(D5);
}

function randomLines(){
  g.clear();
  var cols=(bpp==1)?14:(1<<bpp)-1,w=g.getWidth(),h=g.getHeight(),r=Math.random;
  return setInterval(function(){
    g.setColor(1+r()*cols);
    g.drawLine(r()*w,r()*h,r()*w,r()*h);
      g.flip();
  },5);
}


function randomShapes(){
  g.clear();
  var cols=(bpp==1)?14:(1<<bpp)-1,w=g.getWidth()-10,h=g.getHeight()-10,r=Math.random;
  return setInterval(function(){
    g.setBgColor(0);
    g.setColor(1+r()*cols);
    x1=r()*w;x2=10+r()*w;
    y1=r()*h;y2=10+r()*h;
    if (bpp==1 && ((x1&31)==1)) g.clear(); // for bpp==1 clear sometimes so we can see ellipses again
    if (x1&1)
      g.fillEllipse(Math.min(x1,x2), Math.min(y1,y2),Math.max(x1,x2), Math.max(y1,y2));
    else
      g.fillRect(Math.min(x1,x2), Math.min(y1,y2),Math.max(x1,x2), Math.max(y1,y2));
    g.flip();
  },5);
}

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
  g.setColor(0);g.fillRect(0,40,80,120);g.setColor(1+cc);cc=(cc+1)%15;
  drawCube(40,80,80);
  g.flip();
}

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

function sleep(){
  g.clear();g.flip();
  g.off();
  currscr=-1;
  return 0;
}

var screens=[info,randomShapes,randomLines,sleep];
var currscr= -1;
var currint=0;

setWatch(function(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
},BTN1,{ repeat:true, edge:'rising',debounce:25 }
);
