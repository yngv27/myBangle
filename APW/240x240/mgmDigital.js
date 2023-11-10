/* needs:
RichFont.js, WFace1.jpg, Oswald12, Oswald48.fnt
*/
FONT = {
    init: (f) => { 
      return( {
        fname: f, 
        offs: new Uint16Array(E.toArrayBuffer(_S.read(f, 0, 20))),
        wids: new Uint16Array(E.toArrayBuffer(_S.read(f, 20, 20))),
      });
    },
  
    getDigit: (o, d) => { 
        return(_S.read(o.fname, o.offs[d], o.wids[d]));
    },
  
    print: (o) => { print(o.fname); },
  };
  
  function init() {
    
    g.setFontOmnigo = function() {
        this.setFontCustom( atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==")
    , 32, atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc="), 256 + 13);
    };
    g.setFont("Omnigo");
    f12 = FONT.init("Oswald12.fnt");
    f48 = FONT.init("Oswald48.fnt");
  
    /***********
    Shared bits
    ************/
    let start = () => {
      g.setBgColor(0).clear();
      g.drawImage(_S.read("WFace1.png"),0,0);
    };
  
    let drawClock = (d) => {
      g.setColor(0).drawCircle(120,84,68);
      g.drawImage(FONT.getDigit(f48,Math.floor(d.hr/10)), 62, 50);  
      g.drawImage(FONT.getDigit(f48,d.hr%10), 86, 50);
      g.drawImage(FONT.getDigit(f48,Math.floor(d.min/10)), 120, 50);
      g.drawImage(FONT.getDigit(f48,d.min%10), 150, 50);
    };
  
    let drawData = (d) => {
        // STATUS
      //g.setFontAlign(0,-1).setColor("#909800");
      let batt = E.getBattery(); //process.env.VERSION; //battInfo();
      /*
      g.setColor("#a0a0a0");
      for(let x=0; x<5; x++) {
        if(batt < x*20) 
          g.drawRect( 86+x*16,6,96+x*16, 9);
        else
          g.fillRect( 86+x*16,6,96+x*16, 9);  
      }
      */
      g.setColor("#f0fff0").setFontAlign(0,-1);
      g.drawString("BAT", 30, 118);
      g.drawImage(FONT.getDigit(f12,Math.floor(batt/10)), 24, 128);
      g.drawImage(FONT.getDigit(f12,batt%10), 31, 128);
  
    };
  
    let showMsg = (msgobj) => {  
    // g.setFont("Omnigo");
      g.setBgColor(_C.BKGD);
      let y = 164;
      g.clearRect(0, y,_C.XWID-1,_C.YHT-1).flip();
      g.setColor("#f0fff0");
      g.setFontAlign(0,-1);
      let mstr = ''; 
      y+= 8;
      msgobj.text.split(' ').forEach((w)=>{
        if(g.stringWidth(mstr+w) > _C.XWID || w == '|') {
          g.drawString(mstr, _C.XMID, y);
          mstr='';
          y+=g.getFontHeight();
        }
        if(w != '|') mstr += w + ' ';
      });
      g.drawString(mstr, _C.XMID, y);
    };
  
    let stop = () => {
    };
    
    return { 
      drawClock: drawClock,
      start: start,
      drawData: drawData,
      showMsg: showMsg,
      stop: stop,
    };
  }
  exports = init();
  
  const _C = {
  CYAN: "#80FFFF",
  WHITE: "#FFFFFF",
    FRGD: "#E0E0FF",
    BKGD: "#000000",
    DATA_BRIGHT: "#F0F080",
  YHT: g.getHeight(),
  XWID: g.getWidth(),
  XMID: g.getWidth()/2, 
  YMID: g.getHeight()/2,
  };
  wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  exports.drawData(dt);
  exports.showMsg({text: "This would be message 1"});
  