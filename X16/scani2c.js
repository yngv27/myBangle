/*
D2, D3, D4, D5 = display / spi flash
D6, D7 = I2C (HRS3300, BMA421)
D13  Enable IT7259 (touch)
D14  BL 1
D16  Buzzer
D19  Charging (true == HIGH)
D22  BL 2
D23  BL 3
D28  IT7259 interrupt
D31  Battery level

*/
let brightness= function(v) {
    v = Math.round(v/0.125);
    v = v>7?7:v<0?0:v;
    v=v>7?1:v;	
    digitalWrite([D23,D22,D14],7-v);
};

let pins = [
    D0, D1, D6, D7, D8, D9,
    D10, D11, D12, D13, D15, D17, D18,
    D20, D21, D24, D25, D26, D27, D28, D29,
    D30
    ];

function delay(ms) {
  let t = Math.floor(Date().getTime())+ms;
  while(t > Date().getTime()) {
    // something silly
    out3 = ' ';
  }
}
function delayF(ms) {
  digitalPulse(D18,0,ms);digitalPulse(D18,0,0);
}

let pinBusy = [];

function resetBusy() {
  for(let i = 0; i< pins.length; i++) {
    pinBusy[i] = false;
  }
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

let later = 0;

function bigTest(SCL, SDA) {
    //var i2c = new I2C();
  print(`Trying ${SCL}, ${SDA})`);
  I2C1.setup( {scl: SCL, sda: SDA, bitrate: 100000} );
  let res = detect( I2C1 );
  if(res.length > 0) {
    print(`Scanning SCL=${SCL} SDA=${SDA}`);
    print(`--------------- RES= ${res}--------------`);
  }

}

for(let EN=0; EN < 1; EN++) {
  print("top");
  resetBusy();
  //pinBusy[EN] = true;
  //pins[EN].set();
  for(let SDA=1; SDA < pins.length; SDA++) {
    pinBusy[SDA] = true;
    //print(`Scanning EN=${pins[EN]} SDA=${pins[SDA]}`);
    for(let SCL=1; SCL < pins.length; SCL++) {
      if(pinBusy[SCL]) continue;
      pinBusy[SCL] = true;
      setTimeout(bigTest, later, pins[SCL], pins[SDA]);
      later += 500;
      pinBusy[SCL] = false;
    }
    pinBusy[SDA] = false;
  }
  //pinBusy[EN] = false;
}