E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(15, false);
/*
// MIT License (c) 2020 fanoush https://github.com/fanoush
// see full license text at https://choosealicense.com/licenses/mit/
var SPI2 = E.compiledC(`
// int cmd(int,int)
// int cmds(int,int)
// int cmd4(int,int,int,int)
// void setpins(int,int,int,int)
// int enable(int,int)
// void disable()
// void blit_setup(int,int,int,int)
// int blt_pal(int,int,int)

//// int data(int,int)
//// void save()
//// void restore()
//// int fill_color(int,int)

// bpp 16,12 and 8 supported
#define LCD_BPP 12

// with SHARED_SPIFLASH we need to enable SPI only iniside native code and disable it before return
// to allow espruino to execute from SPI flash on shared SPI pins
#define SHARED_SPIFLASH

// also we may need to unselect flash chip CS pin as Espruino is in a middle of read command
#define SPIFLASH_CS (1<<5)

//SPI0 0x40003000
//SPI1 0x40004000
//SPI2 0x40023000
#define SPIBASE 0x40023000

typedef unsigned int uint32_t;
typedef signed int int32_t;
typedef unsigned short uint16_t;
typedef unsigned char uint8_t;
typedef signed char int8_t;
#define NULL ((void*)0)
// if code is in RAM we can put global data into text/code segment
// this allows simpler pc-relative addressing and shorter/faster code
#define __code __attribute__((section(".text")))
//#define __code
// _code volatile uint32_t *SPI =(uint32_t*)SPIBASE;
// direct constant makes smaller/faster code
#define SPI ((volatile uint32_t*)SPIBASE)
//divide register offsets by sizeof(uint32_t)
#define REG(offset) (offset/4)
// SPI master documentation
// https://infocenter.nordicsemi.com/topic/com.nordic.infocenter.nrf52832.ps.v1.1/spi.html?cp=4_2_0_47
// common/nonDMA registers
#define READY REG(0x108)
#define INTENSET REG(0x304)
#define INTENCLR REG(0x308)
#define ENABLE REG(0x500)
#define PSELSCK REG(0x508)
#define PSELMOSI REG(0x50c)
#define PSELMISO REG(0x510)
#define RXD REG(0x518)
#define TXD REG(0x51c)
#define FREQUENCY REG(0x524)
#define CONFIG REG(0x554)
/// EasyDMA registers
#define TASKS_START REG(0x010)
#define TASKS_STOP REG(0x014)
#define EVENTS_STOPPED REG(0x104)
#define EVENTS_ENDRX REG(0x110)
#define EVENTS_END REG(0x118)
#define EVENTS_ENDTX REG(0x120)
#define EVENTS_STARTED REG(0x14C)
#define SHORTS REG(0x200)
#define RXDPTR REG(0x534)
#define RXDMAXCNT REG(0x538)
#define RXDAMOUNT REG(0x53C)
#define RXDLIST REG(0x540)
#define TXDPTR REG(0x544)
#define TXDMAXCNT REG(0x548)
#define TXDAMOUNT REG(0x54C)
#define TXDLIST REG(0x550)
#define ORC  REG(0x5c0)
#define GPIO(x) ((volatile uint32_t*)(0x50000000+x))
#define OUT     GPIO(0x504)
#define OUTSET  GPIO(0x508)
#define OUTCLR  GPIO(0x50c)
#define IN     GPIO(0x510)
// direction 1=output
#define DIR     GPIO(0x514)
#define DIRSET     GPIO(0x518)
#define DIRCLR     GPIO(0x51c)

__code uint32_t pSCK= -1;
__code uint32_t pMOSI= -1;
__code uint32_t pMISO= -1;
__code uint32_t pCS= 0;
__code uint32_t pCD= 0; //command/data
void setpins(int sck,int mosi,int cs,int cd){
  pSCK=sck;pMOSI=mosi;pCS=1<<cs;pCD=1<<cd;
}
__code uint32_t savedintflags=0;
__code uint32_t savedmode=0;

void save(){
  savedintflags=SPI[INTENSET];
  savedmode=SPI[ENABLE];
}

void restore(){
  SPI[ENABLE]=0;
  SPI[INTENSET]=savedintflags;
  SPI[ENABLE]=savedmode;
}

// pins need to be already preconfigured as gpio input/outputs
int setup(uint32_t speed,uint32_t mode){
  if (pSCK>=0 && (pMISO>=0||pMOSI>=0)){
    uint32_t flags=SPI[INTENSET];
    if (flags) SPI[INTENCLR]=flags; // clear all interrupt flags
    SPI[PSELSCK]=pSCK;
    SPI[PSELMOSI]=pMOSI;
    SPI[PSELMISO]=pMISO;
    SPI[FREQUENCY]=speed<<24; // 0x80=8mbits,0x40=4mbits,...
    SPI[CONFIG]=mode<<1; //msb first
    return 1;
  }
  return 0;
}
void disable(){
  SPI[ENABLE]=0;
  SPI[READY]=0;
  uint32_t flags=SPI[INTENSET];
  if (flags) SPI[INTENCLR]=flags; // clear all interrupt flags
}


int enable(uint32_t speed,uint32_t mode){
  if (SPI[ENABLE]) return -1;
  if (setup(speed,mode)){
#ifndef SHARED_SPIFLASH
    SPI[ENABLE]=7;//SPIM with DMA
    SPI[TASKS_STOP]=1;
    //isDMA=1;
#endif
    return 1;
  }
  return 0;
}
int write_dma(uint8_t *buffer, uint32_t len,int async);

int data(uint8_t *buffer, int len){
  if (pCD==0) return -1;
  if(buffer==NULL || len==0) return -1;
#ifdef SHARED_SPIFLASH
#ifdef SPIFLASH_CS
  *OUTSET = SPIFLASH_CS;
#endif
    SPI[ENABLE]=7;//SPIM with DMA
#endif
  if(pCS>0) *OUTCLR = pCS; // CHIP SELECT
  *OUTSET = pCD; // data
  write_dma(buffer,len,0);
  if(pCS>0) *OUTSET = pCS; // CHIP SELECT
#ifdef SHARED_SPIFLASH
    SPI[ENABLE]=0;//disable SPI
#endif
  return 0;
}
int cmd(uint8_t *buffer, int len){
  if (pCD==0) return -1;
#ifdef SHARED_SPIFLASH
#ifdef SPIFLASH_CS
  *OUTSET = SPIFLASH_CS;
#endif
    SPI[ENABLE]=7;//SPIM with DMA
#endif
  *OUTCLR = pCD; // CMD
  if(pCS>0) *OUTCLR = pCS; // CHIP SELECT
  write_dma(buffer,1,0);
  *OUTSET = pCD; // data
  if (len>1)
    write_dma(buffer+1,len-1,0);
  if(pCS>0) *OUTSET = pCS; // CHIP SELECT
#ifdef SHARED_SPIFLASH
    SPI[ENABLE]=0;//disable SPI
#endif
  return 0;
}
int cmds(uint8_t *ptr,int bufflen){
  int cnt=0;
  if (!ptr) return cnt;
  uint8_t *endptr=ptr+bufflen;
  uint8_t len;
  while ((len=*ptr++)!=0){
    if ((ptr+len)>endptr) return -cnt;// break if we would go past buffer
    if(cmd(ptr,len)) break;
    ptr+=len;cnt++;
  }
  return cnt;
}
// send command with up to 3 parameters (espruino allows methods with up to 4 parameters)
int cmd4(int c0,int d1,int d2, int d3){
  int cnt=0;
  uint8_t buff[4];
  if (c0>=0)buff[cnt++]=c0; else return 0;
  if (d1>=0)buff[cnt++]=d1;
  if (d2>=0)buff[cnt++]=d2;
  if (d3>=0)buff[cnt++]=d3;
  cmd(buff,cnt);
  return cnt;
}
__code uint16_t running=0;
void wait_dma(){
  if (running) {
    while (SPI[EVENTS_END] == 0); // wait for previous transfer
    SPI[EVENTS_END]=0;
    running=0;
  }
}
int write_dma(uint8_t *ptr, uint32_t len, int async)
{
  wait_dma();
  int offset = 0;
  SPI[RXDPTR]=0;
  SPI[RXDMAXCNT]=0;
  SPI[EVENTS_END]=0;
  do {
    SPI[TXDPTR]=(uint32_t)(ptr + offset);
    if (len < 0x100) {
      SPI[TXDMAXCNT]=len;
      len = 0;
    } else {
      SPI[TXDMAXCNT]=0xff;
      offset = offset + 0xff;
      len = len - 0xff;
    }
    SPI[TASKS_START]=1;
    if (async && len==0){
      running=1; // do not wait for last part
    } else {
        while (SPI[EVENTS_END] == 0);
        SPI[EVENTS_END]=0;
    }
  } while (len != 0);
  return 0;
}
__code uint16_t blit_bpp=0;
__code uint16_t blit_w=0;
__code uint16_t blit_h=0;
__code uint16_t blit_stride=0;
void blit_setup(uint16_t w,uint16_t h,uint16_t bpp, uint16_t stride){
  blit_bpp=bpp;blit_w=w;blit_h=h;blit_stride=stride; //*bpp/8;
}
#define LCHUNK 36 // divisible by 3 and 2

#if LCD_BPP==8
//only 8 bit palette entry
typedef uint8_t palbuff_t;
#else
typedef uint16_t palbuff_t;
#endif
int blt_pal(uint8_t *buff,palbuff_t* palbuff,uint8_t xbitoff){
  uint8_t *pxbuff=buff;
  uint8_t bpp=blit_bpp;
  if (pxbuff==NULL || palbuff==NULL || bpp==0 || bpp>8) return -1;
  uint8_t mask=(1<<bpp)-1; //pixel bitmask
  uint8_t bpos=xbitoff;
  uint16_t val=(*pxbuff++)|((*pxbuff++)<<8);val>>=bpos; // we prefetch 8-16 bits
  uint16_t w=blit_w;
  uint16_t h=blit_h;
  uint8_t lbuff_1[LCHUNK];
  uint8_t lbuff_2[LCHUNK];
  uint8_t *lbuff=lbuff_1;
  int lbufpos=0;
  int lbuffnum=0;
#ifdef SHARED_SPIFLASH
#ifdef SPIFLASH_CS
  *OUTSET = SPIFLASH_CS;
#endif
  SPI[ENABLE]=7;//SPIM with DMA
#endif
  if(pCS>0) *OUTCLR = pCS; // CHIP SELECT
  do {
    w=blit_w;
    do {
#if LCD_BPP==12
      // pixel 1
      uint16_t px1=palbuff[val&mask]; // get color
      val=val>>bpp;bpos+=bpp;
      //pixel 2
      uint16_t px2=palbuff[val&mask]; // get color
      val=val>>bpp;bpos+=bpp;
      if(bpos>=8){bpos-=8;val=val|(*pxbuff++)<<(8-bpos);} //less than 8 bits, prefetch another byte
      //put 2x 12bit pixels into buffer
      lbuff[lbufpos++]=px1>>4;
      lbuff[lbufpos++]=(px1<<4)|(px2>>8);
      lbuff[lbufpos++]=px2&255;
      w-=2;
#elif LCD_BPP==16
      // pixel 1
      uint16_t px1=palbuff[val&mask]; // get color
      val=val>>bpp;bpos+=bpp;
      if(bpos>=8){bpos-=8;val=val|(*pxbuff++)<<(8-bpos);} //less than 8 bits, prefetch another byte
      //put 16bit pixel into buffer
      lbuff[lbufpos++]=px1>>8;
      lbuff[lbufpos++]=px1&255;
      w--;
#elif LCD_BPP==8
      // pixel 1
      // get color from palette or as direct value if no palette
      uint8_t px1= (palbuff) ? palbuff[val&mask] : (bpp==6 ? (val&mask)<<2: val&mask);
      val=val>>bpp;bpos+=bpp;
      if(bpos>=8){bpos-=8;val=val|(*pxbuff++)<<(8-bpos);} //less than 8 bits, prefetch another byte
      //put 8bit pixel into buffer
      lbuff[lbufpos++]=px1;
      w--;
#endif
      if (lbufpos >= LCHUNK){
        // buffer full, start async draw and switch to other buffer
        write_dma(lbuff,lbufpos,1);
        lbuffnum=1-lbuffnum;
        lbuff = lbuffnum ? lbuff_2 : lbuff_1;
        lbufpos=0;
      }
    } while(w>0);
    buff+=blit_stride;
    pxbuff=buff;bpos=xbitoff;
    val=(*pxbuff++)|(*pxbuff++)<<8;val>>=bpos;//val=(*pxbuff++)>>bpos;
    h--;
  } while(h>0);
  // send the rest
  if (lbufpos>0){
    write_dma(lbuff,lbufpos,0);
  } else {
    wait_dma();
  }
  if(pCS>0) *OUTSET = pCS; // CHIP SELECT
#ifdef SHARED_SPIFLASH
  SPI[ENABLE]=0;//disable SPI
#endif
  return 0;
}
#if 0
// write same buffer many times repeatedly
int write_many_dma(uint8_t *buffer, int len, int count){
  wait_dma();
  SPI[RXDPTR]=0;
  SPI[RXDMAXCNT]=0;
  SPI[EVENTS_END]=0;
  SPI[TXDPTR]=(uint32_t)(buffer);
  SPI[TXDMAXCNT]=len;
  if (count > 1)
    SPI[SHORTS]=1<<17;
  SPI[TASKS_START]=1;
  do {
    while (SPI[EVENTS_END] == 0); // wait
    SPI[EVENTS_END]=0;
    if (count <= 2) SPI[SHORTS]=0; // stop shortcut for next loop
  } while (--count);
return 0;
}
#if LCD_BPP==12
int fill_color(uint32_t val,uint32_t len){
  uint8_t buff[12]={ // 92ms for 24, 97ms for 12
//    val>>4,(val&0xf)<<4|val>>8,val&0xff,
//    val>>4,(val&0xf)<<4|val>>8,val&0xff,
//    val>>4,(val&0xf)<<4|val>>8,val&0xff,
//    val>>4,(val&0xf)<<4|val>>8,val&0xff,
    val>>4,(val&0xf)<<4|val>>8,val&0xff,
    val>>4,(val&0xf)<<4|val>>8,val&0xff,
    val>>4,(val&0xf)<<4|val>>8,val&0xff,
    val>>4,(val&0xf)<<4|val>>8,val&0xff
  };
  return write_many_dma(buff,12,len/8);
}
#elif LCD_BPP==16
int fill_color(uint32_t val,uint32_t  len){
  uint8_t buff[16]= { // 126ms for 16, 121ms for 32 bytes
//    val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff,
//    val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff,
    val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff,
    val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff, val>>8,val&0xff
  };
  return write_many_dma(buff,16,len/8);
}
#elif LCD_BPP==8
int fill_color(uint32_t val,uint32_t len){
  uint8_t v=val&0xff;
  uint8_t buff[16]= { // 126ms for 16, 121ms for 32 bytes
    v, v, v, v,
    v, v, v, v,
    v, v, v, v,
    v, v, v, v
  };
  return write_many_dma(buff,16,len/16);
}
#endif
#endif
`);
*/

///*
// MIT License (c) 2020 fanoush https://github.com/fanoush
// see full license text at https://choosealicense.com/licenses/mit/
// compiled with options LCD_BPP=12,SHARED_SPIFLASH,SPIFLASH_CS=(1<<5)
var SPI2 = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////8QtQNMfEQigGCAoYDjgBC92P///wdLe0QbiUOxBEoTaAAr/NAAIxNgA0p6RBOBcEcYMQJAxv///7L///8t6fBHkEYZTBlO//fl/xlK3/hkwAAjASUTYE/w/w5TYKlGI2AQMh9G/ykA6wMKwvgAoIu//zMxYMb4AOAAIYi//znM+ACQuPEADwbQKbkLS3tEHYEAIL3o8IfU+ACguvEAD/rQJ2AAKd7R8+cYMQJASDUCQDQ1AkAQMAJAUP///y3p8E+dsM3pARJWSnpEBkaS+ACQACgA8JuAACkA8JiACfH/MwcrAPKTgAEjA/oJ8wE727IEeAOTQ3hHSZeIROoDJAKbAPECC0RIHEEgIwNgByMLYNNopLLN6QYBC7FAShNgT+pJA9uyBJM/S3tEE6gFkwqrzekIME/wAAhBRgWbAp2z+AKgA5sBmiNARPoJ9DL4E8ADmyNARPoJ9DL4EyAEmx1E7bIHLULYpLJP6iwTQ1QTEgHxAg5D6gwcQxgDMarxAgojKYP4AcAf+or6APgOIAndASL/91P/2PEBCAu/CZgImEFGACG68QAPy9EfS3tEAT/biB5Ev7JzeDR4ROoDJAKbHEEG8QILpLIAL7bR2bE6Rv/3NP8VS3tE22gLsQaaE2AHmwAgGGAdsL3o8I/eRgg9HvgBO+2yxfEICwP6C/McQ6Sy80aw5//3Bf/j50/w/zDp5wC/ADUCQAgFAFAMBQBQFP///7T+//8w/v//Bv7//xlKekT4tQZGEGkPRhCzE0wTTSAjI2AHIytgEksYYNJoArEaYAAiASEwRv/37/4PS3tEAS8baSNgBN0AInkecBz/9+T+Ckt7RNtoA7EjYAAgKGD4vU/w/zD75wC/CAUAUAA1AkAMBQBQqv3//3z9//9m/f//E7UAKB7bACmmv434BRACJAEkACqkvwKpCRmN+AQApL8BNAH4BCwAK6K/AqoSGQE0IUYBqKi/AvgEPP/3p/8gRgKwEL0AJPrncLUFRoixRhgAJChGEPgBGxmxRRi1QgLZZEIgRnC9//eR/wAo+dEBNO/nBEb15wAADUsbaBC1o7kMSxtoC7EMShNgDksLSntEAAZcaRRgnGlUYNppCEtJABpgWGFZZAEgEL1P8P8w++cANQJABDMCQAgzAkAINQJAEDUCQKr8//8FSgAjE2Ci9X5yE2ADSxtoC7HC+AAycEcANQJABDMCQBC1Bkx8RMTpBQEBIQH6AvIB+gPz4mAjYRC9AL9M/P//");
  return {
    cmd:E.nativeCall(593, "int(int,int)", bin),
    cmds:E.nativeCall(781, "int(int,int)", bin),
    cmd4:E.nativeCall(709, "int(int,int,int,int)", bin),
    setpins:E.nativeCall(941, "void(int,int,int,int)", bin),
    enable:E.nativeCall(829, "int(int,int)", bin),
    disable:E.nativeCall(909, "void()", bin),
    blit_setup:E.nativeCall(33, "void(int,int,int,int)", bin),
    blt_pal:E.nativeCall(221, "int(int,int,int)", bin),
  };
})();

// this method would produce code string that can replace bin declaration above with heatshrink compressed variant
// however it seems the gain is very small so is not worth it
//    shrink:function(){return `var bin=E.toString(require("heatshrink").decompress(atob("${btoa(require("heatshrink").compress(bin))}")))`;}
//*/
E.kickWatchdog();

//P8 pins
CS=D25;DC=D18;RST=D26;BL=D14;
SCK=D2;MOSI=D3;
RST.reset();
// CLK,MOSI,CS,DC
D2.write(0);D3.write(0);CS.write(1);DC.write(1);
SPI2.setpins(SCK,MOSI,CS,DC);
SPI2.enable(0x80,0); //8MBit, mode 0

function delayms(ms){
  digitalPulse(DC,0,ms); // just to wait 10ms
  digitalPulse(DC,0,0);
}

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

RST.set();

function init(){
  cmd(0x11); // sleep out
  delayms(20);
  
  cmd([0x36, 0]);     // MADCTL - This is an unrotated screen
  cmd([0x37,0,0]);
  // These 2 rotate the screen by 180 degrees
  //[0x36,0xC0],     // MADCTL
  //[0x37,0,80],   // VSCSAD (37h): Vertical Scroll Start Address of RAM
  cmd([0x3A, 0x03]);  // COLMOD - interface pixel format - 03 - 12bpp, 05 - 16bpp
  cmd([0xB2, 0xC, 0xC, 0, 0x33, 0x33]); // PORCTRL (B2h): Porch Setting
  cmd([0xB7, 0]);     // GCTRL (B7h): Gate Control
  cmd([0xBB, 0x3E]);  // VCOMS (BBh): VCOM Setting 
  cmd([0xC2, 1]);     // VDVVRHEN (C2h): VDV and VRH Command Enable
  cmd([0xC3, 0x19]);  // VRHS (C3h): VRH Set 
  cmd([0xC4, 0x20]);  // VDVS (C4h): VDV Set
  cmd([0xC5, 0xF]);   // VCMOFSET (C5h): VCOM Offset Set .
  cmd([0xD0, 0xA4, 0xA1]);   // PWCTRL1 (D0h): Power Control 1 
  cmd([0xe0, 0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]);   // PVGAMCTRL (E0h): Positive Voltage Gamma Control
  cmd([0xe1, 0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]);   // NVGAMCTRL (E1h): Negative Voltage Gamma Contro
  cmd(0x29); // DISPON (29h): Display On 
  cmd(0x21); // INVON (21h): Display Inversion On
  //cmd([0x2a,0,0,0,239]);
  //cmd([0x2b,0,0,0,239]);
  //cmd([0x2c]);
}

var bpp=4; // powers of two work, 3=8 colors would be nice
var g=Graphics.createArrayBuffer(240,240,bpp);
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
  5, 0x2a, 0,0, 0,0,
  5, 0x2b, 0,0, 0,0,
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
/*
  cmd([0x2a,0,x1,0,x2-1]);
  cmd([0x2b,0,r.y1,0,r.y2]);
  cmd([0x2c]);
*/
  var c=g.winCmd;
  c[3]=x1;c[5]=x2-1; //0x2a params
  c[9]=r.y1;c[11]=r.y2; // 0x2b params
  SPI2.blit_setup(xw,yw,bpp,g.stride);
  var xbits=x1*bpp;
  var bitoff=xbits%8;
  var addr=g.buffA+(xbits-bitoff)/8+r.y1*g.stride; // address of upper left corner
  //VIB.set();//debug
  SPI2.cmds(g.winA,c.length);
  SPI2.blt_pal(addr,g.palA,bitoff);
  //VIB.reset();//debug
};

g.isOn=false;
init();

g.on=function(){
  if (this.isOn) return;
  cmd(0x11);
  g.flip();
  //cmd(0x13); //ST7735_NORON: Set Normal display on, no args, w/delay: 10 ms delay
  //cmd(0x29); //ST7735_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
  this.isOn=true;
  this.setBrightness();
};


g.off=function(){
  if (!this.isOn) return;
  //cmd(0x28);
  cmd(0x10);
  BL.set();
  this.isOn=false;
};

// does PWM on BL pin, not best for P8 as it has 3 BL pins
g.lev=256;
g.setBrightness=function(lev){
  if (lev>=0 && lev<=256)
    this.lev=lev;
  else
    lev=this.lev;
  if (this.isOn){
    val=lev/256;
    if (val==0||val==1)
      digitalWrite(BL,1-val);
    else
      analogWrite(BL,val,{freq:60});
  }
};

var VIB=D16;
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
  return 4.20/0.60*analogRead(D31);
}
function battLevel(v){
  var l=3.5,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}

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
  g.setColor(0);g.fillRect(60,60,180,180);g.setColor(1+cc);cc=(cc+1)%15;
  drawCube(120,120,120);
  // update the whole display
  g.flip();
}

//require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
require("Font8x16").add(Graphics);

function info(){
  g.clear();
  g.setFont("6x8",2);g.setColor(10);
  g.drawString("Espruino "+process.version,30,20);
  if (bpp==1) g.flip();
  g.setFont("6x8",1);g.setColor(14);
  g.drawString("ST7789 12 bit mode, 8Mbps SPI with DMA",8,42);
  if (bpp==1) g.flip();
  for (var c=0;c<8;c++){
    g.setColor(c+8);g.fillRect(20+25*c,185,45+25*c,205);
    if (bpp==1) g.flip();
  }
  for ( c=0;c<8;c++) {g.setColor(c);g.fillRect(20+25*c,210,45+25*c,230);
    if (bpp==1) g.flip();
  }
  g.flip();
  return setInterval(function(){
    stepCube();
  },5);
}


var lastmin=-1;
var volts;
function drawClock(){
  var d=Date();
  volts= volts ? (volts+battVolts())/2:battVolts(); // average until shown
  if (d.getMinutes()==lastmin) return;
  d=d.toString().split(' ');
  var min=d[4].substr(3,2);
  var sec=d[4].substr(-2);
  var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  lastmin=min;
  g.clear();
  var w=g.getWidth();
  g.setColor(15);
  g.setFont("8x16");
  var batt=battInfo(volts);volts=0;// clear average
  g.drawString(batt,w-g.stringWidth(batt)-2,0);
  //var tm=hr+" "+min;
/*
  g.drawString(hr,40-g.stringWidth(hr)/2,10);
  g.drawString(min,40-g.stringWidth(min)/2,80);
*/
  g.setFontVector(62);
  //g.setFontCopasetic40x58Numeric();
  //g.drawString(hr,w/2-g.stringWidth(hr)-5,50);
  //g.drawString(min,w/2+5,50);
  g.drawString(tm,4+(w-g.stringWidth(tm))/2,50);
  //g.setColor(8+4);
  //g.setFontVector(26);
  //if (sec&1)g.drawString("o o",40-g.stringWidth("o o")/2,60);
  //if (sec&1)g.drawString(":",40-g.stringWidth(":")/2,42);
  //if (sec&1)g.drawString(". .",40-g.stringWidth(". .")/2,44);
  if(bpp==1) g.flip();
  g.setFontVector(28);
  g.setColor(8+3);
  var dt=d[0]+" "+d[1]+" "+d[2];//+" "+d[3];
  g.drawString(dt,(w-g.stringWidth(dt))/2,130);
  g.flip();
}
function clock(){
  lastmin=-1;
  drawClock();
  return setInterval(function(){
    drawClock();
  },1000);
}


function sleep(){
  g.clear();//g.flip();
  g.off();
  currscr=-1;
  return 0;
}

var screens=[clock,info,randomShapes,randomLines,sleep];
var currscr= -1;
var currint=0;
setWatch(function(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
},BTN1,{ repeat:true, edge:'rising',debounce:25 }
);

/*
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
