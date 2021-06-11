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
//SPI2.disable();SPI2.enable(0x80,0); //8MBit, mode 0


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

//g.lev=256;
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
  var l=3.5,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}

let ogf = atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==");
let ogw = atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=");




let to;
function goDark(s) {
  if(to) clearTimeout(to);
  to = setTimeout(sleep, s*1000);
}

const startX = [ 10,  45,  10,  45 ];
const startY = [ 16,  16,  78,  78 ];
const nmX = [ 60, 60, 20, 20];
const nmY = [40, 60, 80, 100];
let rotate = false;

let xS = 0.25;
let yS = 0.25;

const setFG = () => {};

function setScale(x, y) {
  xS = x; yS = y;
}


function drawScaledPoly(arr, x, y) {
  let newArr = [];
  for(let i=0; i< arr.length; i+=2) {
    newArr[i] = Math.floor(arr[i]*xS) + x;
    newArr[i+1] =Math.floor(arr[i+1]*yS) + y;
  }
  if(rotate) {
    let y = arr[i];
    arr[i] = arr[i+1];
    arr[i+1] = y;
    setScale(0.25,0.125);
  } else {
    setScale(0.25,0.25);
  }

  g.fillPoly(newArr, true);
}

/** DIGITS **/

/* zero */
function draw0(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    1,20 ,
    20,1 ,
    100,1 ,
    119,20 ,
    119,220 ,
    100,239 ,
    20,239 ,
    1,220,
    1,20 ,
	         
    10,22 , 
    10,218 ,
    22,230 ,
    98,230 ,
    110,218, 
    110,22,
    98,10 ,
    22,10 ,
    10,22, 22, 10
    ], xOrig, yOrig);
}

/* one */
function draw1(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    30,239, 
    90,239, 
    90,230, 
    65,230, 
    65,1, 
    55,1 ,
    35,21, 
    35,31, 
    55,11,   
    55,230, 
    30,230,
    ],xOrig, yOrig);
 
}

/* two */
function draw2(xOrig, yOrig) { 
  setFG();
  drawScaledPoly([1,20, 
                 20,1,
                 100,1,
                 119,20 ,
                 119,100, 
                 100,120, 
                 22,120 ,
                 10,132 ,
                 10,218, 
                 22,230 ,
                 119,230, 
                 119,239,

                 20,239 ,
                 1,220,
                 1,130 ,
                 22,110 ,
                 98,110 ,
                 110,98 ,
                 110,22 ,
                 98,10 ,
                 22,10 ,
                12,20 ,
                 1,20],
                xOrig, yOrig);
}

/* three */

function draw3(xOrig, yOrig) {
  setFG();
   drawScaledPoly([
     1,20 ,
     20,1 ,
     100,1 ,
     119,20 ,
     119,100 ,
     105,115 ,
			
     119,130 ,
     119,220 ,
     100,239 ,
     20,239 ,
     1,220,
			
     1,220 ,
     12,220 ,
     22,230 ,
     98,230 ,
     110,218 ,
     110,132 ,
     99,120   ,
     45,120  ,
     45,110 ,
     98,110 ,
     110,98,
     110,22, 
     98,10 ,
     22,10 ,
     12,20 ,
     1,20],
      xOrig, yOrig);
}

/* four */
function draw4(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    119,239 , 
    119,1,
    110,1,
	110,110, 
    22,110 ,
    10,98 ,
    10,10 ,
    1,10 ,
    1,102 ,
    20,120 ,
    110,120,
	110,239],
      xOrig, yOrig);
}

function draw5(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    1,220 ,
    20,239 ,
    100,239 ,
    119,220 ,
    119,130 ,
    100,110 ,
    16,110 ,
    10,104 ,
    10,10 ,
    100,10 ,
    100,1,
			 
    1,1 ,
    1,110, 
    12,120, 
    98,120 ,
    110,132 ,
    110,218 ,
    98,230 ,
    22,230 ,
    10,220 ,
    1,220,
    ],xOrig,yOrig);
}
/* six */
function draw6(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
100,10 ,
    100,1 ,
    20,1 ,
    1,20 ,
    1,220 ,
			
    20,239 ,
    100,239 ,
    119,220 ,
    119,130 ,
    100,110 ,
    12,110,
			
    12,120 ,
    98,120 ,
    110,132 ,
    110,218 ,
    98,230 ,
    22,230 ,
    10,218 ,
			
    10,22 ,
    22,10 ,
    100,10,
  ],xOrig,yOrig);

}

/* seven */
function draw7(xOrig, yOrig) {
  setFG();
  drawScaledPoly([
    65,239, 
    65,155 ,
    100,120 , 
    119,100 ,
    119,1 ,
			
    100,1 ,
    20,1 ,
    1,1 ,
    1,22 , 
			
    10,22 ,
    10,10 ,
    22,10 ,
    98,10 ,
    110,10 ,
    110,22 ,
			
    110,98 ,
    98,110 ,
    55,153 ,
    55,239,
    ], xOrig, yOrig);
}

function draw8(xOrig, yOrig) {
  setFG();
   drawScaledPoly([
      1,20 ,
     20,1 ,
     100,1 ,
     119,20 ,
     119,100 ,
     100,120 ,
     20,120 ,
     1,100 ,
     1,20 ,
	         
     10,22 ,
     10,98 ,
     22,110 ,
     98,110 ,
     110,98 ,
     110,22,  
     98, 10,
     22, 10, 
     10, 22, 22, 10],
     xOrig, yOrig);
  
   drawScaledPoly([
      1,130 ,
     20,111 ,
     100,111 ,
     119,130 ,
     119,220 ,
     100,239 ,
     20,239 ,
     1,220 ,
     1,130 ,
	         
     10,132 ,
     10,218 ,
     22,230 ,
     98,230 ,
     110,218 ,
     110,132  , 
     98,120 ,
     22,120 ,
     10,132, 22, 120],
      xOrig, yOrig);
}
function draw9(xOrig, yOrig) { 
  setFG();
  drawScaledPoly([
    20,230 ,
    20,239, 
    100,239, 
    119,220 ,
    119,20 ,
			
    100,1 ,
    20,1 ,
    1,20 ,
    1,110 ,
    20,130 ,
    108,130,
			
    108,120 ,
    22,120 ,
    10,108 ,
    10,22 ,
    22,10 ,
    98,10 ,
    110,22 ,
			
    110,218 ,
    98,230
    ], xOrig, yOrig);
}

/** END DIGITS **/

function drawDigit(pos, dig, nm) {
  let x = startX[pos];
  let y = startY[pos];
  if(nm) {
    x= nmX[pos]; y = nmY[pos];
  }
  const dFuncs = [ draw0, draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9];
  dFuncs[dig](x,y);
}


require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
//require("Font8x16").add(Graphics);

const _Notes = [
  'FRI',
  '10 AM 1-1 w Tim',
  '11 AM UX Daily',
  '11:30 AM Playground',
  '12 PM SCRM',
  'MON',
  '11 AM CA Townhall'
  ];

function info(){
  g.clear();
  g.setFontCustom(ogf, 32, ogw, 256 + 13);
  //g.setFont("4x6",1/*2*/);
  g.setColor(10);
  g.drawString("Espruino "+process.version, 0,0);
  //g.setFont("6x8",1);
  g.setColor(14);

  //g.drawString("ST7735 12 bit mode\n8Mbps SPI with DMA",4,40);
  for(let q=0; q < _Notes.length; q++) {
    g.drawString(_Notes[q], 0, 20+q*g.getFontHeight());
  }

  g.flip();
  goDark(30);
}

var lastsec=-1;
var volts;
var batt=battInfo();

function drawClock(){
  var d=Date();
  lastsec=d.getSeconds();
  d=d.toString().split(' ');
  var sec=d[4].substr(-2);
  //var tm=d[4].substring(0,5);
  var hr=parseInt(d[4].substr(0,2));
  var min=d[4].substr(3,2);
  let nm = false;
  if(hr > 20 || hr < 8) {
    nm = true;
  }
  hr %= 12;
  if (hr === 0) hr = 12;
  min = parseInt(min);

  volts= volts ? (volts+battVolts())/2:battVolts(); // average until shown
  g.clear();
  if (lastsec%10==0){
    batt=battInfo(volts);volts=0;
  }
  
  nm = false;
  
  if(!nm) {
    g.setFont("6x8",1);g.setColor(15);
    g.drawString(batt,40-g.stringWidth(batt)/2,0);
  }
  g.setFontVector(50);
  g.setColor(8+7);
  if(nm) {
    rotate = true;
    drawDigit(0,Math.floor(hr/10));
    drawDigit(1,Math.floor(hr%10));
    drawDigit(2,Math.floor(min/10));
    drawDigit(3,Math.floor(min%10));
    g.flip();
  } else {
    rotate = false;
    drawDigit(0,Math.floor(hr/10));
    drawDigit(1,Math.floor(hr%10));
    drawDigit(2,Math.floor(min/10));
    drawDigit(3,Math.floor(min%10));

    g.setFont('6x8',2); 
    g.setColor(8+2);
    var dt=/*d[0]+" "+*/d[1]+" "+d[2];//+" "+d[3];
    g.drawString(dt,40-g.stringWidth(dt)/2,140);
    g.flip();
    goDark(30);
  }
}

function clock(){
  volts=0;
  drawClock();
  
  return setInterval(function(){
    drawClock();
  },60000);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  currscr=-1;
  if (currint>0) clearInterval(currint);
  return 0;
}

function runScreen(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
  vibrate(1,1,100,0);

}

var screens=[clock,info,sleep];
var currscr= -1;
var currint=0;
setWatch(runScreen, BTN1,{ repeat:true, edge:'rising',debounce:25 }
);
/* uncomment to allow connection only when button is held while connecting
NRF.whitelist=[];
NRF.on('connect',function(addr) {
  if (!NRF.whitelist.includes(addr)){
    if (BTN1.read()){ // add to whitelist when button is held while connecting
      NRF.whitelist.push(addr);
      vibrate(1,1,100,0);
    } else
        NRF.disconnect();
  }
  NRF.connection = {};
  NRF.connection.addr = addr;
  NRF.connected=true;
  NRF.setRSSIHandler((rssi)=>{NRF.connection.RSSI=rssi;});
});
NRF.on('disconnect',function(reason) {
  NRF.connected=false;
  NRF.connection = {};
  NRF.lastReason=reason;
});
*/
var fc=new SPI(); // font chip - 2MB SPI flash
D23.write(1);
fc.setup({sck:D19,miso:D22,mosi:D20,mode:0});
fc.send([0xb9],D23); //put to deep sleep
