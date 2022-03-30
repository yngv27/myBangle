//SC7!

var ACCELPIN = D19;
let ACCELADDR = 0x19;
let wOSI2C = new I2C();
var ACCEL = {};

wOSI2C.setup({scl:D4,sda:D27,bitrate:200000});
ACCEL = {
  wasFaceUp: false,
  writeByte:(a,d) => { 
    wOSI2C.writeTo(ACCELADDR,a,d);
  }, 
  readBytes:(a,n) => {
    wOSI2C.writeTo(ACCELADDR, a);
    return wOSI2C.readFrom(ACCELADDR,n); 
  },
  init:()=>{
    ACCEL.writeByte(0x1b, 0);
    ACCEL.writeByte(0x1b, 0x80);
  },
  read0:()=>{
    return ACCEL.readBytes(0x0F,1)[0];
  },
  read:()=>{
    var a = ACCEL.readBytes(0x6,6);
    // just return MSB
    return {x:a[1], y:a[3], z:a[5]};
  },
  isFaceUp:()=>{
    let a = ACCEL.read();
    if((a.x < 15 || a.x > 240) && a.y > 20 && a.y < 45 && a.z > 190) {
      if(!ACCEL.wasFaceUp) ACCEL.emit('faceup');
      ACCEL.wasFaceUp = true;
      return true;
    }
    ACCEL.wasFaceUp = false;
    return false;
  }
};

var ACCEL = {
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
           var  v = ACCEL.read0();
           if (v>192) ACCEL.emit("faceup");
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