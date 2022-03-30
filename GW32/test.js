
/* Bebinca 79 specific */
function GC9A01(CS, IO, CLK, DC, RST) {
    var LCD_WIDTH = 240;
    var LCD_HEIGHT = 240;
    var COLSTART = 0;
    var ROWSTART = 0;
    var INVERSE = 1;
    
    var cmd = (c, d) => {
        DC.reset();
        SPI1.write(c, CS);
        if (d !== undefined) {
            DC.set();
            SPI1.write(d, CS);
        }
    };
  
    function init(rst,fn) {
        function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}
        if (rst) {
            digitalPulse(rst,0,10);
        } else {
            cmd(0x01); //ST7735_SWRESET: Software reset, 0 args, w/delay: 150 ms delay
        }
      analogWrite(D24, 0.95); 
      D25.set();
      /* bebinca 
        delay(120);
        cmd(0x11); //SLPOUT
        delay(50);
        cmd(0xFE);
        cmd(0xEF);
        cmd(0xEB,0x14);
        cmd(0x84,0x40);
        cmd(0x85,0xF1);
        cmd(0x86,0x98);
        cmd(0x87,0x28);
        cmd(0x88,0xA);
        cmd(0x8A,0);
        cmd(0x8B,0x80);
        cmd(0x8C,1);
        cmd(0x8D,0);
        cmd(0x8E,0xDF);
        cmd(0x8F,82);
        cmd(0xB6,0x20);
        cmd(0x36,0x48);
        cmd(0x3A,5);
        cmd(0x90,[8,8,8,8]);
        cmd(0xBD,6);
        cmd(0xA6,0x74);
        cmd(0xBF,0x1C);
        cmd(0xA7,0x45);
        cmd(0xA9,0xBB);
        cmd(0xB8,0x63);
        cmd(0xBC,0);
        cmd(0xFF,[0x60,1,4]);
        cmd(0xC3,0x17);
        cmd(0xC4,0x17);
        cmd(0xC9,0x25);
        cmd(0xBE,0x11);
        cmd(0xE1,[0x10,0xE]);
        cmd(0xDF,[0x21,0x10,2]);
        cmd(0xF0,[0x45,9,8,8,0x26,0x2A]);
        cmd(0xF1,[0x43,0x70,0x72,0x36,0x37,0x6F]);
        cmd(0xF2,[0x45,9,8,8,0x26,0x2A]);
        cmd(0xF3,[0x43,0x70,0x72,0x36,0x37,0x6F]);
        cmd(0xED,[0x1B,0xB]);
        cmd(0xAC,0x47);
        cmd(0xAE,0x77);
        cmd(0xCB,2);
        cmd(0xCD,0x63);
        cmd(0x70,[7,9,4,0xE,0xF,9,7,8,3]);
        cmd(0xE8,0x34);
        cmd(0x62,[0x18,0xD,0x71,0xED,0x70,0x70,0x18,0x0F,0x71,0xEF,0x70,0x70]);
        cmd(0x63,[0x18,0x11,0x71,0xF1,0x70,0x70,0x18,0x13,0x71,0xF3,0x70,0x70]);
        cmd(0x64,[0x28,0x29,1,0xF1,0,7,0xF1]);
        cmd(0x66,[0x3C,0,0xCD,0x67,0x45,0x45,0x10,0,0,0]);
        cmd(0x67,[0,0x3C,0,0,0,1,0x54,0x10,0x32,0x98]);
        cmd(0x74,[0x10,0x80,0x80,0,0,0x4E,0]);
        cmd(0x35,0);  
        if (INVERSE) {
            //TFT_INVONN: Invert display, no args, no delay
            cmd(0x21);
        } else {
            //TFT_INVOFF: Don't invert display, no args, no delay
            cmd(0x20);
        }
        //TFT_NORON: Set Normal display on, no args, w/delay: 10 ms delay
        cmd(0x13);
        //TFT_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
        cmd(0x29);
      */
    /* SN80 */
        delayms(120);
          cmd(0x11); //SLPOUT
          delayms(50);
          cmd(0xFE);
          cmd(0xEF);
          cmd(0xEB,0x14);
      
          cmd(0x84,0x40);
          cmd(0x85,0xF1);
          cmd(0x86,0x98);
          cmd(0x87,0x28);
          cmd(0x88,0xA);
          cmd(0x8A,0);
          cmd(0x8B,0x80);
          cmd(0x8C,1);
          cmd(0x8D,0);
          cmd(0x8E,0xDF);
          cmd(0x8F,82);
          
          cmd(0xB6,0x20);
          cmd(0x36,0x48);
          cmd(0x3A,5);
          cmd(0x90,[8,8,8,8]);
          cmd(0xBD,6);
          cmd(0xA6,0x74);
          cmd(0xBF,0x1C);
          cmd(0xA7,0x45);
          cmd(0xA9,0xBB);
          cmd(0xB8,0x63);
          cmd(0xBC,0);
          cmd(0xFF,[0x60,1,4]);
          cmd(0xC3,0x17);
          cmd(0xC4,0x17);
          cmd(0xC9,0x25);
          cmd(0xBE,0x11);
          cmd(0xE1,[0x10,0xE]);
          cmd(0xDF,[0x21,0x10,2]);
          cmd(0xF0,[0x45,9,8,8,0x26,0x2A]);
          cmd(0xF1,[0x43,0x70,0x72,0x36,0x37,0x6F]);
          cmd(0xF2,[0x45,9,8,8,0x26,0x2A]);
          cmd(0xF3,[0x43,0x70,0x72,0x36,0x37,0x6F]);
          cmd(0xED,[0x1B,0xB]);
          cmd(0xAC,0x47);
          cmd(0xAE,0x77);
          cmd(0xCB,2);
          cmd(0xCD,0x63);
          cmd(0x70,[7,9,4,0xE,0xF,9,7,8,3]);
          cmd(0xE8,0x34);
          cmd(0x62,[0x18,0xD,0x71,0xED,0x70,0x70,0x18,0x0F,0x71,0xEF,0x70,0x70]);
          cmd(0x63,[0x18,0x11,0x71,0xF1,0x70,0x70,0x18,0x13,0x71,0xF3,0x70,0x70]);
          cmd(0x64,[0x28,0x29,1,0xF1,0,7,0xF1]);
          cmd(0x66,[0x3C,0,0xCD,0x67,0x45,0x45,0x10,0,0,0]);
          cmd(0x67,[0,0x3C,0,0,0,1,0x54,0x10,0x32,0x98]);
          cmd(0x74,[0x10,0x80,0x80,0,0,0x4E,0]);
          cmd(0x35,0);  
          if (INVERSE) {
              //TFT_INVONN: Invert display, no args, no delay
              cmd(0x21);
          } else {
              //TFT_INVOFF: Don't invert display, no args, no delay
              cmd(0x20);
          }
          //TFT_NORON: Set Normal display on, no args, w/delay: 10 ms delay
          cmd(0x13);
          //TFT_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
          cmd(0x29);
          if (fn) fn();
          /*
    cmd(0x36 ,0x00);
    cmd(0x3A ,0x05);
  
    cmd(0xB2, [0x0C, 0x0C ,0x00 ,0x33 ,0x33]);
    cmd(0xB7,0x35);
    cmd(0xBB ,0x19);
  
    cmd(0xC0 ,0x2C);
    cmd(0xC2 ,0x01);
    cmd(0xC3 ,0x12);
    cmd(0xC4 ,0x20);
    cmd(0xC6 ,0x0F);
  
    cmd(0xD0 ,[0xA4 ,0xA1]);
  
    cmd(0xE0, [0xD0 ,0x04 ,0x0D ,0x11 ,0x13 ,0x2B ,0x3F ,0x54 ,0x4C ,0x18 ,0x0D ,0x0B ,0x1F ,0x23]);
    cmd(0xE1 ,[0xD0 ,0x04 ,0x0C ,0x11 ,0x13 ,0x2C ,0x3F ,0x44 ,0x51 ,0x2F ,0x1F ,0x1F ,0x20 ,0x23]);
  
    cmd(0x21);
      delay(50);
    cmd(0x11);
    delay(100);
    cmd(0x29);
      delay(150);
      */
    }
  
    
    function connect(options, callback) {
      var spi=options.spi, dc=options.dc, ce=options.cs, rst=options.rst;
      var g = Graphics.createCallback(LCD_WIDTH, LCD_HEIGHT, 16, {
          setPixel: function (x, y, c) {
              ce.reset();
              spi.write(0x2A, dc);
              spi.write((COLSTART + x) >> 8, COLSTART + x, (COLSTART + x) >> 8, COLSTART + x);
              spi.write(0x2B, dc);
              spi.write((ROWSTART + y) >> 8, ROWSTART + y, (ROWSTART + y) >> 8, (ROWSTART + y));
              spi.write(0x2C, dc);
              spi.write(c >> 8, c);
              ce.set();
          },
          fillRect: function (x1, y1, x2, y2, c) {
              ce.reset();
              spi.write(0x2A, dc);
              spi.write((COLSTART + x1) >> 8, COLSTART + x1, (COLSTART + x2) >> 8, COLSTART + x2);
              spi.write(0x2B, dc);
              spi.write((ROWSTART + y1) >> 8, ROWSTART + y1, (ROWSTART + y2) >> 8, (ROWSTART + y2));
              spi.write(0x2C, dc);
              spi.write({ data: String.fromCharCode(c >> 8, c), count: (x2 - x1 + 1) * (y2 - y1 + 1) });
              ce.set();
          }
      });
      init(rst, callback);
      return g;
    }
  
  
    SPI1.setup({sck:CLK, mosi:IO, baud: 8000000});
    return connect({spi:SPI1, dc:DC, cs:CS, rst:RST});
  }
  
  function id(CLK, IO, CS, DC, MISO) {
    //SN80
   // CLK =D2, IO=D3 ;
    //DC=D18, CS=D25, RST=D26;
    let spi9 = new SPI();
    spi9.setup({sck:CLK, mosi:IO, miso: IO, baud: 8000000});
  /*
    D8.reset();
    let c = 4, d = new Uint8Array([0,0,0,0]);
    SPI1.write(c, D7);
    if (d !== undefined) {
        //D8.set();
        SPI1.send(d, D7);
    }
    */
    DC.set();
    let c = new Uint8Array([0x4,0,0,0,0]);
    let r = spi9.send(c, CS);
    //if(r[0] && r[0] != 255) print(JSON.stringify(r));
    return r;
  }
    
  
  let Vpins = [
    D7, D8,
    D14, D15, D16, 
    D25, 
    D36, D37, D38,
    ];
  
  let Vplbl = 
    ' D7,  D8,'+
    'D14, D15, D16,'+ 
    'D25, '+
    'D36, D37, D38,';
  
  let pins = [
    D1, D2, D3, D4, D5, D6, D9,
    D10, D11, D12, D13, D17, D18, D19,
    D20, D21, D23, D26, D27, D28, D29,
    D30, D31, D33, D34, D35, D39,
    D40, D41, D42, D43, D44, D45, D46, D47
    ];


  
  let plbl = 
   " D1,  D2,  D3,  D4,  D5,  D6,  D9, "+
   "D10, D11, D12, D13, D17, D18, D19, "+
   "D20, D21, D23, D26, D27, D28, D29, "+
   "D30, D31, D33, D34, D35, D39, "+
   "D40, D41, D42, D43, D44, D45, D46, D47, "
    ;

  let out1 = '';
  let out2 = '';
  let out3 = '';
  
  function delay(ms) {
    let t = Math.floor(Date().getTime())+ms;
    while(t > Date().getTime()) {
      // something silly
      out3 = ' ';
    }
  }
  
  let pinBusy = [];
  
  function resetBusy() {
    for(let i = 0; i< pins.length; i++) {
      pinBusy[i] = false;
    }
  }

  
  function on() {   analogWrite(D24, 0.95); }
  function off() {   D24.reset(); }
  
  function testDisplay() {
    on();
    for(let CS=0; CS < 1; CS++) {
      resetBusy();
      pinBusy[CS] = true;
      for(let IO=0; IO < pins.length; IO++) {
        if(pinBusy[IO]) continue;
        pinBusy[IO] = true;
        print(`IO = ${IO}`);
        for(let CLK=0; CLK < pins.length; CLK++) {
          if(pinBusy[CLK]) continue;
          pinBusy[CLK] = true;
          print(`CLK = ${CLK}`);
          for(let DC=0; DC < pins.length; DC++) {
            if(pinBusy[DC]) continue;
            pinBusy[DC] = true;
            for(let RST=0; RST < pins.length; RST++) {
              if(pinBusy[RST]) continue;
              //pinBusy[RST] = true;
  
              /*
              let g = GC9A01(pins[CS], pins[IO], pins[CLK], pins[DC], pins[RST]);
  
              g.clear(1).setColor('#ffffff').fillRect(40,40,80,80);                                       g.setFontAlign(0,-1).drawString("Loading...",120,120);
  
              delay(1500);
              */
              let r = id(pins[CS], pins[IO], pins[CLK], pins[DC], pins[RST]);
              if(r[0] && r[0] != 255) {
                print(Date().toString().slice(16,24)+` Testing: CS:${CS} IO:${IO} CLK:${CLK} DC:${DC} RST:${RST}`);
                print(JSON.stringify(r));
              }
            }
            pinBusy[DC] = false;
          }
          pinBusy[CLK] = false;
        }
        pinBusy[IO] = false;
      }
      pinBusy[CS] = false;
    }
  }
  
  function r() {
    delay(3000);
    for(let p=0; p < pins.length; p++) {
      let pin = pins[p].toString();
      for(c=0; c<1; c++) {
        pins[p].set();
        print(`${pin} is SET`);
        delay(999);
        pins[p].reset();
        print(`${pin} is RESET`);
        delay(999);
      }
    }
  }
 function t(p) {
    for(let c=0; c < 100; c++) {
      let pin = p.toString();
      p.set();
      print(`${pin} is SET`);
      delay(999);
      p.reset();
      print(`${pin} is RESET`);
      delay(999);
    }
  }
  
  
    
    function h() {
      out1 = '';
      out2 = '';
      out3 = '';
      for(let p=0; p < pins.length; p++) {
        if(p%4 == 0) {
          out1 += ' ';
          out2 += ' ';
          out3 += ' ';
        }
        out1 += plbl.charAt(p*5);
        out2 += plbl.charAt(p*5+1);
        out3 += plbl.charAt(p*5+2);
    
      }
      print (out1); print(out2); print(out3);
    }
    
    function d() {
      out1 = '';
      for(let p=0; p < pins.length; p++) {
        if(p%4 == 0) {
          out1 += ' ';
        }
        out1 += pins[p].read() ? '1' : '0';
    
      }
      print (out1);
    }
  
  function clock() {
    on();
    g.setColor("#80ffff");
    g.setFont("6x8", 6);
    let dt = new Date().toString().substring(16,21);
    g.setFontAlign(0,0);
    g.drawString(dt,120,120, true);
    setTimeout(off, 8000);
  }
  //g = GC9A01(D8, D15, D14, D7, D38);
  
  //setWatch(clock, BTN1, {edge: "rising"});
    
  let apins = [
      D2, D3, D4, D5, D28, D29, D30, D31, 
  ];

function adump() {
  let out1 = '';
  for(let p=0; p < apins.length; p++) {
    out1 += analogRead(apins[p])+",";
  }
  print(out1);
}

/*
** I2C checks
*/
function scanI2c( i2c, first, last ) {
    if (typeof first === "undefined") {
         first = 0x0;
     }
     if (typeof (last) === "undefined") {
         last = 0x77;
     }
     print( "     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f" );
     for (var upper = 0; upper < 8; ++upper) {
         var line = upper + "0: ";
         for (var lower = 0; lower < 16; ++lower) {
             var address = (upper << 4) + lower;
             // Skip unwanted addresses
             if ((address < first) || (address > last)) {
                 line += "   ";
                 continue;
             }
             try {
                 i2c.readFrom( address, 1 );
                 line += (address + 0x100).toString( 16 ).substr( -2 );
                 line += " ";
             } catch (err) {
                 line += "-- ";
             }
         }
         print( line );
     }
 }
 
 function scanSC7(i2c, f, l) {
   let addr = 0x03;
   try{
     i2c.writeTo(addr, 0xf);
     return i2c.readFrom(addr,1);  
   } catch(err) {
     return "--";
   }
 }
 
 function isDeviceOnBus(i2c,id) {
   try {
     return i2c.readFrom(id,1);
   }
   catch(err) {
     return -1;
   }
 }
 function detect(i2c,first, last) {
   first = first | 0;
   last = last | 0x77;
   var idsOnBus = Array();
   for (var id = first; id <= last; id++) {
     if ( isDeviceOnBus(i2c,id) != -1) {
       idsOnBus.push(id);
     }
   }
   return idsOnBus;
 }

 /*
for(let EN=2; EN < 3; EN++) {
  resetBusy();
  pinBusy[EN] = true;
  pins[EN].set();
  for(let SDA=0; SDA < pins.length; SDA++) {
    pinBusy[SDA] = true;
    print(`Scanning EN=${pins[EN]} SDA=${pins[SDA]}`);
    for(let SCL=0; SCL < pins.length; SCL++) {
      if(pinBusy[SCL]) continue;
      pinBusy[SCL] = true;
      I2C1.setup( {scl: pins[SCL], sda: pins[SDA], bitrate: 100000} );
      let res = detect( I2C1 );
      if(res.length > 0) {
        print(`Scanning SCL=${pins[SCL]} SDA=${pins[SDA]}`);
        print(`--------------- RES= ${res}--------------`);
      }
      delay(500);
      pinBusy[SCL] = false;
    }
    pinBusy[SDA] = false;
  }
  pinBusy[EN] = false;
}
*/

/*
** SPI Flash test 
*/
function delay(ms) {
    let t = Math.floor(Date().getTime())+ms;
    while(t > Date().getTime()) {
      // something silly
      out3 = ' ';
    }
  }
let pins = [
    D0, D1, D2, D3, D5, D6, D9,
    D10, D11, D12, D13, D17, D18, D19,
    D20, D21, D23, D26, D28, D29,
    D30, D33, D34, D35, D39,
    //D40, D41, 
    D42, D43, D45, D46, D47,
    D16, D37, D38, D36
    ];



function scanI2c( i2c, first, last ) {
   if (typeof first === "undefined") {
        first = 0x0;
    }
    if (typeof (last) === "undefined") {
        last = 0x77;
    }
    print( "     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f" );
    for (var upper = 0; upper < 8; ++upper) {
        var line = upper + "0: ";
        for (var lower = 0; lower < 16; ++lower) {
            var address = (upper << 4) + lower;
            // Skip unwanted addresses
            if ((address < first) || (address > last)) {
                line += "   ";
                continue;
            }
            try {
                i2c.readFrom( address, 1 );
                line += (address + 0x100).toString( 16 ).substr( -2 );
                line += " ";
            } catch (err) {
                line += "-- ";
            }
        }
        print( line );
    }
}

function scanSC7(i2c, f, l) {
  let addr = 0x03;
  try{
    i2c.writeTo(addr, 0xf);
    return i2c.readFrom(addr,1);  
  } catch(err) {
    return "--";
  }
}

function isDeviceOnBus(i2c,id) {
  try {
    return i2c.readFrom(id,1);
  }
  catch(err) {
    return -1;
  }
}
function detect(i2c,first, last) {
  first = first | 0;
  last = last | 0x77;
  var idsOnBus = Array();
  for (var id = first; id <= last; id++) {
    if ( isDeviceOnBus(i2c,id) != -1) {
      idsOnBus.push(id);
    }
  }
  return idsOnBus;
}
// Espruino boards
// I2C1.setup( {scl: B8, sda: B9} );
// ESP8266 
//I2C1.setup({sda: D2, scl: D4} );
//console.log('I2C detect as array:',detect(I2C1));

// Usage
let pinBusy = [];
  
  function resetBusy() {
    for(let i = 0; i< pins.length; i++) {
      pinBusy[i] = false;
    }
  }

// NEXT: 3rd loop, go through another round of pins, setting and resetting
/*
for(let EN=2; EN < 3; EN++) {
  resetBusy();
  pinBusy[EN] = true;
  pins[EN].set();
  for(let SDA=0; SDA < pins.length; SDA++) {
    pinBusy[SDA] = true;
    print(`Scanning EN=${pins[EN]} SDA=${pins[SDA]}`);
    for(let SCL=0; SCL < pins.length; SCL++) {
      if(pinBusy[SCL]) continue;
      pinBusy[SCL] = true;
      I2C1.setup( {scl: pins[SCL], sda: pins[SDA], bitrate: 100000} );
      let res = detect( I2C1 );
      if(res.length > 0) {
        print(`Scanning SCL=${pins[SCL]} SDA=${pins[SDA]}`);
        print(`--------------- RES= ${res}--------------`);
      }
      delay(500);
      pinBusy[SCL] = false;
    }
    pinBusy[SDA] = false;
  }
  pinBusy[EN] = false;
}
*/

//SC7!

var ACCELPIN = D19;
let ACCELADDR = 0x19;
let wOSI2C = new I2C();
var ACCEL = {};

wOSI2C.setup({scl:D4,sda:D27,bitrate:200000});

ACCEL = {
    writeByte:(a,d) => { 
      wOSI2C.writeTo(0x19,a,d);
    }, 
    readBytes:(a,n) => {
      wOSI2C.writeTo(0x19, a);
        return wOSI2C.readFrom(0x19,n); 
    },
    init:() => {
        var id = ACCEL.readBytes(0x0F,1)[0];
        ACCEL.writeByte(0x20,0x47);
        ACCEL.writeByte(0x21,0x00); //highpass filter disabled
        ACCEL.writeByte(0x22,0x40); //interrupt to INT1
        ACCEL.writeByte(0x23,0x88); //BDU,MSB at high addr, HR
        ACCEL.writeByte(0x24,0x00); //latched interrupt off
        ACCEL.writeByte(0x32,0x10); //threshold = 250 milli g's
        ACCEL.writeByte(0x33,0x01); //duration = 1 * 20ms
        ACCEL.writeByte(0x30,0x02); //XH interrupt 
        pinMode(ACCELPIN,"input",false);
        setWatch(()=>{
          timeon();
           //var  v = ACCEL.read0();
           //if (v>192) ACCEL.emit("faceup");
        },ACCELPIN,{repeat:true,edge:"rising",debounce:50});
        return id;
    },
    read0:()=>{
        return ACCEL.readBytes(0x0F,1)[0];
    },
    read:()=>{
        function conv(lo,hi) { 
          var i = (hi<<8)+lo;
          return ((i & 0x7FFF) - (i & 0x8000))/16;
        }
        var a = ACCEL.readBytes(0xA8,6);
        return {x:conv(a[0],a[1]), y:conv(a[2],a[3]), z:conv(a[4],a[5])};
    },
  };

ACCEL.init();

for(let CS=5; CS < 6; CS++) {
  resetBusy();
  pinBusy[CS] = true;
  //print(`CS=${CS}`);
  for(let SI= 0 ; SI < pins.length; SI++) {
    if(pinBusy[SI]) continue;
    pinBusy[SI] = true;
    print(`${Date().toString().substring(16,24)} CS=${CS} SI = ${SI}`);
    for(let SO=0; SO < pins.length; SO++) {
      if(pinBusy[SO]) continue;
      pinBusy[SO] = true;
      for(let CLK=0; CLK < pins.length; CLK++) {
        if(pinBusy[CLK]) continue;
        pinBusy[CLK] = true;
        //print(`CLK = ${CLK}`);
        var spif=new SPI(); 
        pins[CS].set();
        spif.setup({sck:pins[CLK],miso:pins[SO],mosi:pins[SI],mode:0});
        //spif.send([0xb9],cs); //put to deep sleep

        spif.send([0xab],pins[CS]); // wake from deep sleep
        cmd90 = spif.send([0x90,0,0,1,0,0],pins[CS]);
        cmd9f = spif.send([0x9f,0,0,0],pins[CS]);
        if(cmd9f[0] != 0 && cmd9f[1] != 0 && cmd9f[0] != 0xff && cmd9f[1] != 0xff) {
          Bangle.buzz();
          print(`CS:${pins[CS]} SO:${pins[SO]} SI:${pins[SI]} CLK:${pins[CLK]}`);
          print(`90=${cmd90}`);
          print(`9f=${cmd9f}`);
        }
        delay(99);
        pinBusy[CLK] = false;
      }
      pinBusy[SO] = false;
    }
    pinBusy[SI] = false;
  }
  pinBusy[CS] = false;
}



  