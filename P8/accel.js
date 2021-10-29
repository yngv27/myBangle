var ACCEL = {
    writeByte:(a,d) => { 
        P8I2C.writeTo(0x18,a,d);
    }, 
    readBytes:(a,n) => {
        P8I2C.writeTo(0x18, a);
        return P8I2C.readFrom(0x18,n); 
    },
    getCfgArr:() => {
      let arr = new Uint16Array(64);
      let b=E.toString(arr);if (b) return b;
      E.defrag();b=E.toString(arr);if (b) return b;
      E.defrag();b=E.toString(arr);if (b) return b;
      console.log("No 64!"); return b;
    },
    init:() => {
        var id = ACCEL.readBytes(0x00,1)[0];
        ACCEL.writeByte(0x7c,0);
        // wait 2 ms!!
        setTimeout(() => {
          ACCEL.writeByte(0x59,0);
          // read in config file (64 bytes)
          let c = ACCEL.readBytes(0x5e,64);
          //console.log(c[0x36], c[0x37]);
          // set INT1 for wrist, wakeup, step
          c[0x36] = 0x01;
          c[0x37] = 0x14;
          // enable wrist
          //c[0x3a] |= 1;
          // write out config file (64 bytes)
          ACCEL.writeByte(0x5e, c);
          
          ACCEL.writeByte(0x56, 8);
          // we done
          ACCEL.writeByte(0x59, 1);
          // low power read
          ACCEL.writeByte(0x7d,4);
          ACCEL.writeByte(0x40,0x17);
          ACCEL.writeByte(0x7c,3);
        }, 2);
        pinMode(D8,"input",false);
        setWatch(()=>{
           if (ACCEL.read0()==0x11) console.log('ACCEL.emit("faceup")');
        },D8,{repeat:true,edge:"falling",debounce:50});
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
    getCoords:() => {
      let a = ACCEL.readBytes(0x12,6);
      return({x:a[1],y:a[3],z:a[5]});
    },
  };
  
  
  
  
  
  
  
  
  
  
  
  
    