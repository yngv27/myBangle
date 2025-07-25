/*
** ST7571
*/

// F07X

var spi1 = new SPI();
spi1.setup({mosi: D7, sck: D2, baud: 2000000});
let CS=D8, RST=D6;

// use unused GPIO
function delay_ms(ms) {
  digitalPulse(D4, 0, ms);
  digitalPulse(D4, 0, 0);
}
function write_com(com) {
  spi1.write(com,CS);
}
write_data = write_com;

function init() {
  RST.reset();
  delay_ms(2);
  RST.set();
  delay_ms(2);
  write_com(new Uint8Array([0xae,0xa9,0xc0,0xa1,0xab,0xa6, 0xa4,0x4c,0x00,0x38,0x08,0x48, 
                            0x80,0x40,0x00,0x44,0x00,0x57,0x26,0x81,0x35,0xa8,0x2c]));
	delay_ms(200);
	write_com(0x2e);
	delay_ms(200);
	write_com(0x2f);
	delay_ms(200);
	write_com(0xaf);//,0xb0,0xa2,0x10,0x00);
}
/*
function flipSlow() {
  let b=new Uint8Array(258);
  let bidx = 0;
  
  write_com(0xb0);

  b[0] = 0xe8; // set data length cmd
  b[1] = 255; // 1 means 2!!! (0=>1...255=>256)
 for(let x=0; x<16; x++) {
   bidx = 2;
   for(let y=0; y< 128; y++) {
     //write_com(0xe8); write_com(0x1); 
     
       let d = y; //g.buffer[x+y*16];
     //write_data(d); write_data(0);
     b[bidx++]=(y > 63)?0:0xff; b[bidx++]= (x>7)?0:0xff;
   }
   write_data(b); // write a row at a time
 }
}
*/
/*
function flipfaster() {
  let b=new Uint8Array(258*16);
  let bidx = 0;
  
  write_com(0xb0);

 for(let x=0; x<16; x++) {
   b[bidx++] = 0xe8; // set data length cmd
   b[bidx++] = 255; // 1 means 2!!! (0=>1...255=>256)
   for(let y=0; y< 128; y++) {
     let d = y;//g.buffer[x+y*16];
     b[bidx++]=d; b[bidx++]=d;
   }
 }
 write_data(b); // write the block
}
*/
/*
var c = E.compiledC(`
// void munge(int, int);

typedef unsigned int uint32_t;
typedef signed int int32_t;
typedef unsigned short uint16_t;
typedef unsigned char uint8_t;
typedef signed char int8_t;
#define NULL ((void*)0)

void munge(unsigned char *src, unsigned char *tgt) {
  // darn well better be 2048!
  int tidx=0;
  int x;
  int y;
  unsigned char d;

 for( x=0; x<16; x++) {
   tgt[tidx++] = 0xe8; // set data length cmd
   tgt[tidx++] = 255; // 1 means 2!!! (0=>1...255=>256)
   for(y=0; y< 128; y++) {
     d = src[x+y*16];
     tgt[tidx++]=d; tgt[tidx++]=d;
   }
 }
}
`);


var src = new Uint8Array(2048);
var tgt = new Uint8Array(2048);
//var res = c.munge(E.getAddressOf(src,true),E.getAddressOf(tgt,true));


*/
let c=(function(){
  var bin=atob("8LUAI+gm/ycOcE9wDEYAIgDrAw4e+DJQpXACMrL1gH/lcATxAgT10QEzECsB9YFx6tHwvQ==");
  return {
    munge:E.nativeCall(1, "void(int, int)", bin),
  };
})();

function flip() {
  let b=new Uint8Array(258*16);
  write_com(0xb0);
  c.munge(E.getAddressOf(g.buffer,true),E.getAddressOf(b,true));
  write_data(b); // write the block
}
var g = Graphics.createArrayBuffer(128,128,1);
g.setRotation(1,1);
g.flip = flip;
g.sleep = () => { write_com(0xa9);};
g.wake = () => { write_com(0xa8);};
init();
/*
var g2 = Graphics.createArrayBuffer(128,128,1,{vertical_byte: true});
function fix(w) {
  let h=0,l=0;
  for(let x=15; x>0; x--) {
    print(`x is ${x}, h is ${h}, l is ${l}`);
    if(w & 1<<x) { print("H"); h |= 1;}
    h <<= 1;
    x--;
    if(w & 1<<x) { print("L"); l |= 1;}
    l <<= 1;
  }
  print(h +" and " + l);
}
*/
