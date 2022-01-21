E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(15, false);
let thisWatch = 
    //"QY03"; 
    "C16";
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
//#define SPIFLASH_CS (1<<5)

//SPI0 0x40003000
//SPI1 0x40004000
//SPI2 0x40023000
//SPI3 0x4002F000
#define SPIBASE 0x4002F000
#define SPI3
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
#define PSELCSN REG(0x514)
#define CSNPOL REG(0x568)
#define PSELDCX REG(0x56c)
#define ERRT195 REG(4)
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
#define OUTSET1  GPIO(0x808)
#define OUTCLR1  GPIO(0x80c)
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
  pSCK=sck;pMOSI=mosi;pCS=1<<cs;pCD=1<<(cd-32);
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
#ifdef SPI3
    SPI[PSELCSN]= -1;
    SPI[PSELDCX]= -1;
#endif
    SPI[FREQUENCY]=speed<<24; // 0x80=8mbits,0x40=4mbits,...
    SPI[CONFIG]=mode<<1; //msb first
    return 1;
  }
  return 0;
}
void disable(){
  SPI[ENABLE]=0;
  SPI[READY]=0;
#ifdef SPI3
  SPI[ERRT195]=1; // Errata 195
#endif
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
  *OUTSET1 = pCD; // data
  write_dma(buffer,len,0);
  if(pCS>0) *OUTSET = pCS; // CHIP SELECT
#ifdef SHARED_SPIFLASH
    SPI[ENABLE]=0;//disable SPI
#ifdef SPI3
  SPI[ERRT195]=1; // Errata 195
#endif
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
  *OUTCLR1 = pCD; // CMD
  if(pCS>0) *OUTCLR = pCS; // CHIP SELECT
  write_dma(buffer,1,0);
  *OUTSET1 = pCD; // data
  if (len>1)
    write_dma(buffer+1,len-1,0);
  if(pCS>0) *OUTSET = pCS; // CHIP SELECT
#ifdef SHARED_SPIFLASH
    SPI[ENABLE]=0;//disable SPI
#ifdef SPI3
  SPI[ERRT195]=1; // Errata 195
#endif
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
#define LCHUNK 48 //36 // divisible by 3 and 2

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
      uint8_t px1= (palbuff) ? palbuff[val&mask] : val&mask;
      val=val>>bpp;bpos+=bpp;
      if(bpos>=8){bpos-=8;val=val|(*pxbuff++)<<(8-bpos);} //less than 8 bits available, prefetch another byte
      //put 8bit pixel into buffer
      lbuff[lbufpos++]= px1<<2 ; //(bpp==6) ? px1<<2 : px1 ; // 6bit to 8bit
      w--;
#elif LCD_BPP==6
      // send 4 packed 6bit pixels in 3 bytes
      uint8_t px[4];
      for (int i=0;i<4;i++){
        px[i] = (palbuff) ? palbuff[val&mask] : val&mask;
        val=val>>bpp;bpos+=bpp;
        if(bpos>=8){bpos-=8;val=val|(*pxbuff++)<<(8-bpos);} //less than 8 bits available, prefetch another byte
      }
      //pack into 3 bytes
      lbuff[lbufpos++]= px[0]<<2 | px[1]>>4;
      lbuff[lbufpos++]= px[1]<<4 | px[2]>>2;
      lbuff[lbufpos++]= px[2]<<6 | px[3];
      w-=4;
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
#ifdef SPI3
  SPI[ERRT195]=1; // Errata 195
#endif
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
  var bin=atob("//////////8AAAAAAAAAAP////8AAAAAAAAAAAAAAL8QtQZMfETE6QABIDsBIQH6AvKZQKJg4WAQvQC/2P///wZLACLD+AAlw/gIIQEiWmDT+AQjCrHD+AgjcEcA8AJAEkvT+AAlELXqudP4BCMKscP4CCMOSnpEAAYUaMP4CEVUaMP4DEUSacP4ECVJAE/w/zLD+BQlw/hsJcP4JAXD+FQVASAQvU/w/zD75wDwAkCG////CEt7RJuKU7EFStL4GDEAK/vQACPC+BgxA0p6RJOCcEcA8AJARv///y7///8QtQNMfETigiCDYYOjgxC9GP////i1FUb/99z/FEsAJMP4NEX/J8P4OEUBIsP4GEEmRv8pAOsEDMP4RMWLv/80w/hIFcP4SHUAIYi//zkaYSWxGbkHS3tEmoL4vdP4GMG88QAP+tDD+BhhACnh0fTnAPACQMb+//8bSnpEOLUMRtFoWbMXTQcjxfgANU/woEPD+AwYkmgKscP4DCUAIgEh//e4/xFLe0QBLNpoT/CgQ8P4CCgE3QAiYR4BMP/3qv8LS3tEm2gbsU/woELC+Ag1ACABI8X4AAVrYDi9T/D/MPvnAL8A8AJAov7//3b+//9a/v//cLUERoixRhgAJSBGEPgBGxmxRBi0QgLZbUIoRnC9//ex/wAo+dEBNe/nBUb15xO1ACgd2wAppr+N+AUQAiQBJAAqob8CqQkZATQB+AQsACuivwKqEhkBNI34BACovwL4BDwhRgGo//eN/yBGArAQvQAk+uct6fBPobDN6QESU0p6RAdGkvgWkAAoAPCZgAApAPCWgAnx/zMHKwDykYABIwP6CfMBOwVG27I1+AJLA5MCm0VJsvgagBxBByPB+AA1k2ikshuxT/CgQsL4DDVP6kkD27IEkz5Le0QUqAWTCKvN6QYwT/AAC1lGBZsCnrP4GKADmwGaI0BE+gn0MvgTwAObI0BE+gn0MvgTIASbHkT2sgcugb8IPhX4ATv2ssbxCA6EvwP6DvMcQ0/qHBNDVBMKAfECDkPqDBxDGAMxqvECCi8pg/gBwKSyAPgOIB/6ivoJ3QEi//fj/tvxAQsLvweYBphZRgAhuvEAD8HRGUt7RAjx/zibix9EPUYCmzX4Aksf+oj4HEGksrjxAA+s0ZmxQkb/98T+D0t7RJtoG7FP8KBCwvgINQdKACABI8L4AAVTYCGwvejwj//3kf7r50/w/zD25wC/APACQKj9//9Q/f//uPz//478//8=");
  return {
    cmd:E.nativeCall(345, "int(int,int)", bin),
    cmds:E.nativeCall(469, "int(int,int)", bin),
    cmd4:E.nativeCall(515, "int(int,int,int,int)", bin),
    setpins:E.nativeCall(33, "void(int,int,int,int)", bin),
    enable:E.nativeCall(97, "int(int,int)", bin),
    disable:E.nativeCall(65, "void()", bin),
    blit_setup:E.nativeCall(225, "void(int,int,int,int)", bin),
    blt_pal:E.nativeCall(585, "int(int,int,int)", bin),
  };
})();

// this method would produce code string that can replace bin declaration above with heatshrink compressed variant
// however it seems the gain is very small so is not worth it
//    shrink:function(){return `var bin=E.toString(require("heatshrink").decompress(atob("${btoa(require("heatshrink").compress(bin))}")))`;}
//*/
E.kickWatchdog();

D7.write(1); // turns off HR red led
//MAGIC3 pins
CS=D3;DC=D47;RST=D2;BL=D12;
SCK=D45;MOSI=D44;
RST.reset();
// CLK,MOSI,CS,DC
SCK.write(0);MOSI.write(0);CS.write(1);DC.write(1);
SPI2.setpins(SCK,MOSI,CS,DC);
SPI2.enable(0x14,0); //32MBit, mode 0
if(thisWatch == "QY03")
  D4.mode('input_pullup');
//C16
D46.mode('input_pulldown');

NRF.setAdvertising({},{name:thisWatch+" "+NRF.getAddress().split(':').slice(-2).join('')});

function delayms(ms){
  digitalPulse(DC,0,ms);
  digitalPulse(DC,0,0); // 0=wait for previous
}

function toFlatString(arr){
  var b=E.toString(arr);if (b) return b   ;
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
  delayms(120);
  if(thisWatch == 'QY03')
    cmd([0x36, 0x48]);     // MADCTL - This is an unrotated screen
  else  //if(thisWatch == 'C16')
    cmd([0x36, 0]);     // MADCTL - This is an unrotated screen
//cmd([0x37,0,0]);
  // These 2 rotate the screen by 180 degrees
  //[0x36,0xC0],     // MADCTL
  //[0x37,0,80],   // VSCSAD (37h): Vertical Scroll Start Address of RAM
  cmd([0x3A, 0x03]);  // COLMOD - interface pixel format - 03 - 12bpp, 05 - 16bpp
  //RAM Control - affects how LSB of Green is handled
  cmd([0xB0, 0, 0xE0]);
  cmd([0xB2, 0xb, 0xb, 0x00, 0x33, 0x33]); // PORCTRL (B2h): Porch Setting
  cmd([0xB7, 0x11]);     // GCTRL (B7h): Gate Control
  cmd([0xBB, 0x35]);  // VCOMS (BBh): VCOM Setting 
  cmd([0xC0, 0x2c]);
  cmd([0xC2, 1]);     // VDVVRHEN (C2h): VDV and VRH Command Enable
  cmd([0xC3, 8]);  // VRHS (C3h): VRH Set 
  cmd([0xC4, 0x20]);  // VDVS (C4h): VDV Set
  cmd([0xC6, 0x1F]);   // VCMOFSET (C5h): VCOM Offset Set .
  cmd([0xD0, 0xA4, 0xA1]);   // PWCTRL1 (D0h): Power Control 1 
  // originale
  /*
  cmd([0xe0, 0xF0, 0x4, 0xa, 0xa, 0x8, 0x25, 0x33, 0x27, 0x3d, 0x38, 0x14, 0x14, 0x25, 0x2a]);   // PVGAMCTRL (E0h): Positive Voltage Gamma Control
  cmd([0xe1, 0xf0, 0x05, 0x08, 0x7, 0x6, 0x2, 0x26, 0x32, 0x3d, 0x3a, 0x16, 0x16, 0x26, 0x2c]);   // NVGAMCTRL (E1h): Negative Voltage Gamma Contro
  */
    cmd([0xe0, 0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]);   // PVGAMCTRL (E0h): Positive Voltage Gamma Control
  cmd([0xe1, 0x70, 0x15, 0x20, 0x15, 0x10, 0x09, 0x48, 0x33, 0x53, 0x0B, 0x19, 0x15, 0x2a, 0x2f]);   // NVGAMCTRL (E1h): Negative Voltage Gamma Control

  if(thisWatch == 'C16')
    cmd(0x21); // INVON (21h): Display Inversion On
  else
    cmd(0x20);
  cmd([0x35, 0]);
  cmd([0x44, 0x25,0,0]);
  delayms(120);
  cmd([0x2a,0,0,0,239]);
  cmd([0x2b,0,0x14,1,0x2b]);
  cmd(0x29);
  cmd([0x35, 0]);
  //cmd([0x2a,0,0,0,239]);
  //cmd([0x2b,0,0,0,239]);
  //cmd([0x2c]);
}

var bpp=4; // powers of two work, 3=8 colors would be nice
var g=Graphics.createArrayBuffer(240,280,bpp);
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
/*
  cmd([0x2a,0,x1,0,x2-1]);
  cmd([0x2b,0,r.y1,0,r.y2]);
  cmd([0x2c]);
*/
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
  c[3]=x1;c[5]=x2-1; //0x2a params
  var y=r.y1+20;c[9]=y%256;c[8]=y>>8;
  y=r.y2+20;c[11]=y%256;c[10]=y>>8; // 0x2b params
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
  BL.reset();
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
      digitalWrite(BL,val);
    else
      analogWrite(BL,val,{freq:60});
  }
};


var VIB=D6;
function vibon(vib){
 if(vib.i>=1)VIB.write(0);else analogWrite(VIB,vib.i);
 setTimeout(viboff,vib.on,vib);
}
function viboff(vib){
 VIB.write(1);
 if (vib.c>1){vib.c--;setTimeout(vibon,vib.off,vib);}
}

vibrate=function(intensity,count,onms,offms){
 vibon({i:intensity,c:count,on:onms,off:offms});
};

function battVolts(){
  return 4.20/0.60*analogRead(D30);
}
function battLevel(v){
  var l=3.5,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}


//require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
//require("Font8x16").add(Graphics);

// Bangle up
logD = console.log; //()=>{};log
E.getBattery = battLevel;
if(typeof Bangle == 'undefined') var Bangle = {};
Bangle.buzz = (dur,intns) => vibrate(intns,1,dur?dur:200,25);

// Add ACCEL
var WI2C = new I2C();
WI2C.setup({scl:D14,sda:D15,bitrate:200000});

var ACCEL = {
  writeByte:(a,d) => { 
      WI2C.writeTo(0x18,a,d);
  }, 
  readBytes:(a,n) => {
      WI2C.writeTo(0x18, a);
      return WI2C.readFrom(0x18,n); 
  },
  init:() => {
      var id = ACCEL.readBytes(0x0F,1)[0];
    // datarate: 4 = 50Hz; 0 for LPen (no low power); 0b111 = enable all axes
      ACCEL.writeByte(0x20,0x47);
      ACCEL.writeByte(0x21,0x00); //highpass filter disabled
      ACCEL.writeByte(0x22,0x40); //interrupt to INT1
      ACCEL.writeByte(0x23,0x88); //BDU,MSB at high addr, HR
      ACCEL.writeByte(0x24,0x00); //latched interrupt off
      ACCEL.writeByte(0x32,0x10); //threshold = 250 milli g's
      ACCEL.writeByte(0x33,0x01); //duration = 1 * 20ms
      ACCEL.writeByte(0x30,0x02); //XH interrupt 
      pinMode(D16,"input",false);
      setWatch(()=>{
         if (ACCEL.read0()>192) ACCEL.emit("faceup");
      },D16,{repeat:true,edge:"rising",debounce:50});
      return id;
  },
  read0:()=>{
      return ACCEL.readBytes(0x1,1)[0];
  },
  read:()=>{
      function conv(lo,hi) { 
        var i = (hi<<8)+lo;
        return ((i & 0x7FFF) - (i & 0x8000))/16;
      }
    // register 28, with high bit set for sequential read[
      var a = ACCEL.readBytes(0xA8,6);
      return {ax:conv(a[0],a[1]), ay:conv(a[2],a[3]), az:conv(a[4],a[5])};
  },
};
ACCEL.init();

/**************** ALARMS **********************/
let _Alarms = [];
let inAlarm = false;
let loadAlarms = () => {
  _Alarms =  _Storage.readJSON('alarms.json');
  if(!_Alarms) _Alarms = [{"msg":"16:00|Stop|working|today","time":"2021-10-28T17:13:00"}];
  //_Alarms.sort((a,b) => {return(a.time > b.time);});
  scheduleAlarms();
};
function vibrat(lvl, cnt, onms, offms) {
  let tout = 0;
  digitalWrite(VIB, 0);
  for(let x=0; x < cnt; x++) {
    setTimeout(analogWrite, tout, VIB, lvl);
    tout += onms;
    setTimeout(digitalWrite, tout, VIB, 1);
    tout += offms;
  }
}
function notify() {vibrat(0.8, 5, 600, 200);}

function buzz() {vibrat(0.8, 1, 800, 200);}
let showMsg = (title, msg) => {
  logD('showMsg START');
  inAlarm = true;
  
  //g.setFont("Dylex7x13");
  
  g.setColor(1);
  g.fillRect(0,0,g.getWidth()-1,g.getHeight()-1);
  g.setColor(15);
  g.setFontAlign(0,-1);
  let y = 4;
  let midX= g.getWidth()/2;
  if(title) {
    g.drawString('* '+title+' *', midX, y);
    g.drawString('* '+title+' *', midX+1, y);
    y = 20; //g.getFontHeight();
    logD(`t:${title}`);
  }
  let lines = msg.split("|");
  for(let l = 0; l < lines.length; l++) {
    g.drawString(lines[l], midX, y);
    logD(`l:${lines[l]}`);
    y += g.getFontHeight();
  }

  notify();
  logD('showMsg END');
};

/*
** alarms are in order, pop the top and show it
*/

function showAlarm(msg) {
  console.log(`alarming w ${msg}`);
  showMsg('ALARM', msg);
  // remove the TO from the list, so we don't kill something by accident
}

let alarmTOs = [];
let scheduleAlarms = () => {
  for(let idx=0; idx < alarmTOs.length; idx++) {
    clearTimeout(alarmTOs[idx]);
  }
  alarmTOs = [];
  for(let idx=0; idx < _Alarms.length; idx++) {
    logD('idx = '+idx);
    let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
    let msg = _Alarms[idx].msg;
    if(tdiff > 0) {
      logD(`will alarm ${msg} in ${tdiff}`);
      alarmTOs.push(setTimeout(showAlarm, tdiff,_Alarms[idx].msg));
    } else {
      //expired
      logD('tossing out' + idx);
    }
  }
};
//loadAlarms();
var la = loadAlarms;
/******************************** END ALARMS *************************/

/**********************************************/

let font=atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==');
let widths=atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=');

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(font, 32, widths, 256 + 13);
};
let h = require("heatshrink");
let font2 = h.decompress(atob('ABEP8kf5AFBuEA8AEBgeAg4EBkECvEH+F/gHz4E/wf4g+QgIhCjkQskh//hiGCj4JBD4IEBkUQvlgueAhkAsEDzkMvkQxEB+EB4AjB98D/8EoUI4kf7Ec+EA4ED4EEwEAgkAhw7Cj/gv/hwFigFAgEIgMYg0f/AOBCQNsNgMD/AzBgw1CAAMCE4U+gF8OoIiCAAILBnBWBAwMQBwhCBAAMwBwaYCgEeMwMPwF4LQILBgP/g//hECiEEkEIv6mBB4JABBwMP/wkE8GPUgNCkGEoMPwR5DoCaBkIOCw4uBLoKGBwE/NQkIFgpxCDouEdAIdDJAPwBxR8E8MP4V8g/AJAcdDo5KGgF/iGCkLsCBwX8BwMMsEYSgVi4HHOQbVDBwMgXIVIgGQgMggVAggKCBwNjeYbgDbALOBw1BjmD8EDC4UH8Ef8FgsOeoV+wmFhP6iPkmFomHAUgIAB/+D/8EiEIkEQoE/+E/8DtCBwRrBwkRhAOBnZoC/8DBwMChAgCmEwkBQBDogOEFgQdBFhIoBv/g//BiECkEEOoUPDYPwoCFBoMIwcfgT5BYAP4BwMEgAiBiBKBg/+Bwp2CwEBAIMAgUAggOCOoJmB4P/wF4gOYg0YAAKJBBwodEGwRZD4DGBZ4LEBHYwdCwI+DwAOFv+B/+CgKVDBwLgBDomCQwUIDoMAjhnCDo8cj/8j/oDpf4jo7CuOB+eCkLCDjv4jI7COgSkDVYQ5D4B3BCIcCh45BFQV+HYMAg+AQYMebwMfwAOHg8H+gOBgF4gEwFgQTBgcDg+egfwS4MP4F58HAHYMD4EHAgP8gP4nwgCgEBg+Cj8EsRoBicInkQuEgMwXH/+ILYMAjEAnjVBgEPK4PAGwJ1BgU//l//AUD+EDwEMgEOC4MAgyICgAuBoCIEgEEBYNwgFgCIUmgHegMkgVIg/wg61BgP/wZ7BcYUD/EDYQRKBn+AoIODRwXgh/giFAkAdBaIJ/CFQPwhMgiVAnmAnAMCEwP4n/wpBICPYN/kGCoMEEYX8BgP/4P/wBpDWYQMBp/gz69BPYdJ/+TH4V/8H/4EIgE4gPegccBgI7BBwIFCwF/FgZ3BNYJoBeYIjCgH+UoaVELIaVJj5uCSoZZB+AMBg/Aj/AkCkCNwYsCUgRlCaoJ5BS4OQg+wUgc3wDgBUgQbC+EIDQJoBJQT8CJQIQBK4YOBgcAgyiBdosfQIKGCXgMMDoSCCjHAneAUAKmB7kDjAdCFgQqBgUgNAQMBgkwhHgidAlmAuMA4TWCQQP4vn4wB4Bg//97XBgEQgU+vigBgwXCwAvBZoMMAITrBmCRDAA4='));
let widths2 = h.decompress(atob('gcEg0IhENhUDgsFg0HgkFgkHhEFBwIAFgcDgwAChkIhIKBAwIOCAQMHBQQADEgMIhYECFgMEAoMDg8HHAMHgoCBIIICBhIGBAAYNCBIcFCQMJA=='));
Graphics.prototype.setFontBlocky = function() {
    this.setFontCustom(E.toString(font2), 32, E.toString(widths2), 256 + 15);
};

let EMULATOR = false;
// which Bangle?
const isB2 = (process.env.BOARD == 'BANGLEJS2');

const MY_HEIGHT = 70;  // in inches..  divide by 2.54 if cm
const MY_WEIGHT = 170; // in pounds.. multipley by 2.2 if kg
// calories / step == 0.57 * weight(lb) * height(in) / 126720
const MY_BURN_RATE = 0.57 * MY_WEIGHT * MY_HEIGHT / 126720;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

//require("knxt.fnt").add(Graphics);
//g.setFont("Omnigo",isB2 ? 1 : 2);
g.setFont("Blocky",isB2 ? 1 : 1);

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([14,64482,15,9]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,11,11,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([12,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

function drawBattery(x,y) {
  // x,y is top/left
  g.setColor(fgc);
  let segX = isB2 ? 2 : 3;
  let segY = isB2 ? 12 : 18;
  let yinc = segY / 4;
  let xinc = (segX + 3) * 4;
  g.drawPoly([
    x,y,
    x+xinc,y,
    x+xinc,y+yinc,
    x+xinc+segX,y+yinc,
    x+xinc+segX,y+yinc*3,
    x+xinc,y+yinc*3,
    x+xinc, y+yinc*4,
    x, y+yinc*4
    ], true);
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
}
/*
** BEGIN WATCH FACE
*/
const startX=[6,47,95,136],startY=[60,60,60,60],nmX=[16,42,88,126],nmY=[12,12,12,12];
let xS=1,yS=1;
function setScale(t,r){xS=t;yS=r;}
function drawScaledPoly(r,n,a){
  let d=[];
   for(let t=0;t<r.length;t+=2){
    var e;
     d[t]=Math.floor(r[t]*xS)+n;
     d[t+1]=Math.floor(r[t+1]*yS)+a;
   }
  g.fillPoly(d,!1);
}
let d0=new Uint8Array([0,4,4,0,32,0,36,4,36,65,25,65,25,5,11,5,11,65,36,65,36,66,32,70,4,70,0,66]),d1=new Uint8Array([7,4,11,0,20,0,24,4,24,70,13,70,13,5,7,5]),d2=new Uint8Array([0,4,4,0,32,0,36,4,36,34,32,38,11,38,11,65,36,65,36,66,32,70,0,70,0,36,4,32,25,32,25,5,0,5]),d3=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38,0,32,25,32,25,5,0,5]),d4=new Uint8Array([0,4,4,0,11,0,11,32,25,32,25,0,32,0,36,4,36,70,25,70,25,38,0,38]),d5=new Uint8Array([0,0,32,0,36,4,36,5,11,5,11,32,32,32,36,36,36,66,32,70,4,70,0,66,0,65,25,65,25,38,0,38]),d6=new Uint8Array([0,4,4,0,32,0,36,4,36,5,11,5,11,65,25,65,25,38,11,38,11,32,32,32,36,36,36,66,32,70,4,70,0,66]),d7=new Uint8Array([0,4,4,0,32,0,36,4,36,70,25,70,25,5,0,5]),d8=new Uint8Array([0,4,4,0,32,0,36,4,36,32,33,35,36,38,36,66,32,70,18,70,18,65,25,65,25,38,18,38,18,32,25,32,25,5,11,5,11,32,18,32,18,38,11,38,11,65,18,65,18,70,4,70,0,66,0,38,3,35,0,32]),d9=new Uint8Array([0,4,4,0,32,0,36,4,36,66,32,70,4,70,0,65,0,65,25,65,25,5,11,5,11,32,25,32,25,38,4,38,0,34]);function drawDigit(t,r,n){let a=(n?nmX:startX)[t];t=(n?nmY:startY)[t];drawScaledPoly([d0,d1,d2,d3,d4,d5,d6,d7,d8,d9][r],a,t);}
/*
** END WATCH FACE
*/

let lastTime = '9999';
let WHITE = isB2 ? 7 : '#ffffff';
let BLACK = 0;
let bgc = BLACK;
let fgc = WHITE;
// set to true for some playful color blocks
let MONDRIAN = false;

// adjust coords by Bangle
if(isB2) {
  xS = 1; yS = 1;
} else {
  xS = 1.36; yS = 1.36;
  for(let i=0; i<4; i++) {
    startX[i] *= xS;
    startY[i] *= yS;
  }
}

if(MONDRIAN) {
  for(let i=0; i<4; i++) {
    startX[i] *= 0.6;
    startY[i] *= 0.6;
  }
  xS *= 0.6; yS *= 0.8;
}

function drawBkgd(nm) {
  // Bangle1 and B2 if night mode
  bgc = BLACK; fgc = WHITE; 
  if(!nm && isB2)  { bgc = WHITE; fgc = BLACK; }
  g.setBgColor(bgc);
  g.clear();
  lastTime = '    ';

  if(MONDRIAN) {
    g.setColor(0);
    g.fillRect(110,0,117,175);
    g.fillRect(0,110,175,117);
    g.setColor(4);
    g.fillRect(118,0,175,109);
    g.setColor(1);
    g.fillRect(0,118,109,175);
    g.setColor(6);
    g.fillRect(118,118,175,176);
  }
  g.flip();
}

let b2NightMode = false;

function drawClock(d, nm) {
  if(inAlarm) {
    logD(`inAlarm - returning`);
    return;
  }
  
  //console.log(d);
  d.hour %= 12;
  if (d.hour === 0) d.hour = 12;
  
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) {
    //console.log(`no change: last time = [${lastTime}]`);
    return;
  }
  console.log("tm/last= "+tm+"/"+lastTime);

  //drawBkgd(nm);
  for(let i=0; i<4; i++) {
    console.log(`${tm[i]}:${lastTime[i]}`);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+36*xS,startY[i]+70*yS);
      g.setColor(i > 1 ? fgc : 11);
      console.log(`calling dD: ${i} ${tm[i]}`);
      drawDigit(i,tm[i], false);
      //g.flip();
    } else {
      console.log('skipping digit '+i);
    }
  }
  lastTime = tm;
  g.flip();
}

// uses constants from top; set to your own
function calcCalories(steps) {
  // calories / step == 0.57 * weight(lb) * height(in) / 126720
  return Math.floor(MY_BURN_RATE * steps);
}



function drawData(d, nm) {
  //console.log(d);
  g.setColor(10);
  let dy = isB2 ? 2 : 20;

  g.setFontAlign(1,-1);
  g.drawString(' '+d.batt+'% ', wX-16, dy, true);
  g.setFontAlign(-1,-1);
  g.drawString(' '+d.dateStr+' ', 16, dy, true);
  g.flip();
  
  g.drawImage(imgCalorie, relX(0.17), relY(0.71));
  g.flip();
  g.drawImage(imgStep, relX(0.454),  relY(0.71));
  g.flip();
  g.drawImage(imgPulse, relX(0.739),  relY(0.71));
  g.flip();
  
  if(MONDRIAN) g.setBgColor(1);
  
  g.setFontAlign(0,-1); // center X, top Y
  g.setColor(14);
  g.drawString(' '+('0000'+calcCalories(d.steps)).slice(-4)+' ', relX(0.21), relY(0.84), true);
  g.drawString(' '+('00000'+d.steps).slice(-5)+' ', relX(0.5), relY(0.84), true);
  //g.setColor(fgc);
  g.drawString(' '+('000'+d.hrm).slice(-3)+' ', relX(0.8), relY(0.84), true);
  g.setBgColor(bgc);
  
  g.flip();
}

let needData = true;
function clock(){
  //lastmin=-1;
  drawBkgd(false);
  return setInterval(function(){
    let dt = new Date();
    let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
    drawClock(d, false);
    if(d.sec == 0 || needData) {
      d.dateStr = dt.toString().substr(0,10);
      d.batt = Math.floor(battLevel());
      d.steps = 0;
      d.hrm = 0;
      drawData(d, false);
      needData = false;
    }
  },1000);
}


function sleep(){
  //g.clear();//g.flip();
  g.off();
  inAlarm = false;
  currscr=-1;
  needData = true;
  return 0;
}

var screens=[clock,sleep];
var currscr= -1;
var currint=0;

let BUTN = (thisWatch == 'C16' ? D46 : D4);
setWatch(() => {
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
  setTimeout(()=>{g.off();}, 8000);
},BUTN,{repeat: true, edge:'rising', debounce:25});

ACCEL.on('faceup',() => {
  g.on();
  setTimeout(()=>{g.off();}, 8000);
});
