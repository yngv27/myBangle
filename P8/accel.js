var ACCEL = {
  writeByte:(a,d) => { 
      P8I2C.writeTo(0x18,a,d);
  }, 
  readBytes:(a,n) => {
      P8I2C.writeTo(0x18, a);
      return P8I2C.readFrom(0x18,n); 
  },
  init:() => {
      var id = ACCEL.readBytes(0x00,1)[0];
      ACCEL.writeByte(0x7c,0);
      // wait 2 ms!!
      setTimeout(() => {
        ACCEL.writeByte(0x59,0);
        // do magical config
        ACCEL.writeByte(0x59, 1);
        // low power read
        ACCEL.writeByte(0x7d,4);
        ACCEL.writeByte(0x40,0x17);
        ACCEL.writeByte(0x7c,3);
      }, 2);
      pinMode(D8,"input",false);
      setWatch(()=>{
         if (ACCEL.read0()==0x11) ACCEL.emit("faceup");
      },D8,{repeat:true,edge:"rising",debounce:50});
      return id;
  },
  read0:()=>{
      return ACCEL.readBytes(0,1)[0];
  },
  read:()=>{
      function conv(lo,hi) { 
        var i = (hi<<8)+lo;
        return ((i & 0x7FFF) - (i & 0x8000))/16;
      }
      var a = ACCEL.readBytes(0x12,6); 
      return {ax:conv(a[0],a[1]), ay:conv(a[2],a[3]), az:conv(a[4],a[5])};
  },
  isFaceUp:() => {
    let xyz = ACCEL.readBytes(0x12,6);
    if ( (xyz[1] < 5 || xyz[1] > 250) &&
      (xyz[3] < 5 || xyz[3] > 240) &&
      (xyz[5] > 200) ) return true;
    return false;
  },
};
