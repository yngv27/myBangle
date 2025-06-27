/*
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
 */
    E.kickWatchdog();
    function KickWd(){
      //if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) 
        E.kickWatchdog();
    }
    var wdint=setInterval(KickWd,2000);
    E.enableWatchdog(15, false);
    
    let SPI2 = (function(){
      var bin=atob("AAAAAAAAAAAAAAAA////////////////HksaSntELenwQRuIO7ETaAAr/NAaTHxEACMTYCOAFEwUThVPACMjYE/w/w5jYE/wAQwTYBQ0HUb/KQDrAwjG+ACAi7//MyFgxPgA4AAhiL//Ocf4AMDS+ACAuPEAD/rQFWAAKejRCEa96PCBGDECQDQ1AkBENQJAEDACQOD////O////Akt7RAISGnBYcHBH0gIAABhKekT4tQVGUGgORgCzEkwSTyAjI2AHIztgEUsYYJJoArEaYAEhKEb/96D/Dkt7RAEuW2gjYAPdcR5oHP/3lv8KS3tEm2gDsSNgACA4YPi9T/D/MPi9AL8IBQBQADUCQAwFAFBO////Iv///w7////3tcCyACYNRiojjfgCAI34BAAFIWhGF0aN+AAwjfgBYI34A2D/97T/6bIrI434AhCN+AQQaEYFIY34ADCN+AFgjfgDYP/3pP8sI434ADADITsSaEaN+AEwjfgCcP/3mP8DsPC9E7UAKB7bACmmv434BRACJAEkACqkvwKpCRmN+AQApL8BNAH4BCwAK6K/AqoSGQE0IUYBqKi/AvgEPP/3d/8gRgKwEL0AJPrncLUERoCxRhgAJSF4YBwZsUQYpkIC0m1CKEZwvf/3Yv8AKPnRATXw5wVG9ecTSnpEcLVTaMOxuLGxsQ1MICMjYAxLByUdYJJoHUYKsQpLGmALTn5Ec2gjYP/3+v6zaAOxI2AAIChgcL1P8P8wcL0AvwgFAFAANQJADAUAUAb+///i/f//LenwQ7+wACYMRh1GjfgCACojBSGBRmhGkEaN+AQgjfgAMI34AWCN+ANg//cZ/ysjBSFoRo34ADCN+AFgjfgCQI34A2CN+ARQ//cK/ywjASFoRo34ADD/9wP/Dkt7RAKvGXhaePFVuxkCNnguWnD50SwbqOsJCAE0CPsERAAsBd0CIThG//eQ/wE89+c/sL3o8IMAv8gAAAANSxtoELWjuQxLG2gLsQxKE2AOSwtKe0QABtxoFGAcaVRgWmkIS0kAGmBYYVlkASAQvU/w/zAQvQA1AkAEMwJACDMCQAg1AkAQNQJAAv3//wVKACMTYKL1fnITYANLG2gLscL4ADJwRwA1AkAEMwJAELUGTHxEIWEBIQH6AvIB+gPz4GCiYGNgEL0Av6T8//8AAAAA");
      return {
        cmd:E.nativeCall(173, "int(int,int)", bin),
        cmds:E.nativeCall(457, "int(int,int)", bin),
        cmd4:E.nativeCall(385, "int(int,int,int,int)", bin),
        data:E.nativeCall(501, "int(int, int)", bin),
        setpins:E.nativeCall(853, "void(int,int,int,int)", bin),
        enable:E.nativeCall(741, "int(int,int)", bin),
        disable:E.nativeCall(821, "void()", bin),
        setPixel:E.nativeCall(285, "void(int,int,int)", bin),
        setFillColor:E.nativeCall(157, "void(int)", bin),
        fillRect:E.nativeCall(589, "void(int, int, int, int)", bin),
      };
    })();
        
    
    BL=D11;
    CS=D30; DC=D27; MOSI=D29; SCK=D28; RST=D31;
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
    function init() {
       cmd(0x11); // sleep out
      delayms(20);
      
      cmd([0x36, 0]);     // MADCTL - This is an unrotated screen
      cmd([0x37,0,0]);
      // These 2 rotate the screen by 180 degrees
      //[0x36,0xC0],     // MADCTL
      //[0x37,0,80],   // VSCSAD (37h): Vertical Scroll Start Address of RAM
      cmd([0x3A, 0x05]);  // COLMOD - interface pixel format - 03 - 12bpp, 05 - 16bpp
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
    }
    /*
    CS.reset();
    cmd([0x2a, 0,0, 0, 120]);
    cmd([0x2b, 0,0, 0, 120]);
    cmd([0x2c, 0, 0, 0x20, 0x20]);
    CS.set();
    //* /
    var g = Graphics.createCallback(240, 240, 16, {
            setPixel: function (x, y, c) {
                CS.reset();
                spi.write(0x2A, DC);
                spi.write([0, x, 0, x]);
                spi.write(0x2B, DC);
                spi.write([0, y, 0, y]);
                spi.write(0x2C, DC);
                spi.write([c>>8, c]);
                CS.set();
            },
            fillRect: function (x1, y1, x2, y2, c) {
                CS.reset();
                spi.write(0x2A, dc);
                spi.write((COLSTART + x1) >> 8, COLSTART + x1, (COLSTART + x2) >> 8, COLSTART + x2);
                spi.write(0x2B, dc);
                spi.write((ROWSTART + y1) >> 8, ROWSTART + y1, (ROWSTART + y2) >> 8, (ROWSTART + y2));
                spi.write(0x2C, dc);
                spi.write({ data: String.fromCharCode(c >> 8, c), count: (x2 - x1 + 1) * (y2 - y1 + 1) });
                CS.set();
            }
        });
    */
    setPix = (x,y,c) => {
    //  CS.reset();
      cmd([0x2A, 0, x, 0, x]);
        cmd([0x2B, 0, y, 0, y]);
        cmd([0x2C, c>>8, c&0xff]);
    //    CS.set();
    };
    fillR = (x1,x2,y1,y2,c) => {
    //  CS.reset();
      cmd([0x2A, 0, x1, 0, x2]);
        cmd([0x2B, 0, y1, 0, y2]);
        cmd([0x2C]);
      SPI2.data({ data: String.fromCharCode(c >> 8, c), count: (x2 - x1 + 1) * (y2 - y1 + 1) });
    //    CS.set();
    };
    
    var g = Graphics.createCallback(240,240,16, { 
      setPixel: SPI2.setPixel, 
      fillRect: function(x1, y1, x2, y2, c) {
        SPI2.setFillColor(c);
        SPI2.fillRect(x1,y1,x2,y2);
      }
    });
    g.lcd_sleep = function(){cmd(0x10);cmd(0x28);};
    g.lcd_wake = function(){cmd(0x29);cmd(0x11);};
    g.flip = ()=>{};
    
    init();
    /*
    
    g.clear();g.drawString("Hello",0,0).setFontVector(20).setColor(0,0.5,1).drawString("Espruino",0,10);
    
    */