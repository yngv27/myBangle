
function init() {
    const _C = {
      CYAN: "#80FFFF",
      WHITE: "#FFFFFF",
      YHT: g.getHeight(),
      XWID: 130,
      XMID: 130/2, 
      YMID: g.getHeight()/2,
    };
      g.setFontDefault = function() {
        this.setFontCustom( atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==")
        , 32, atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc="), 256 + 13);
        };
        
    
      g.setFont("Default");
     
      //if(!_C) let _C = {};
      _C.BKGD = "#260A00";
      
      /***********
      Shared bits
      ************/
      let start = () => {
        g.setBgColor(_C.BKGD);
        let img = _S.read("wbkgd.png");
        if(img) g.drawImage(img, 0, 0);
        g.clearRect(25, 8, 110, 30);
      }
    
      let drawClock = (d) => {
        g.setColor(_C.BKGD).fillCircle(66,79,58);
        let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
        let minAngle = d.min  / 30 * Math.PI;
    
        g.drawImage(_S.read("minHand.png"),66,79,{rotate: minAngle});
        g.drawImage(_S.read("hrHand.png"),66,79,{rotate: hrAngle});
        g.setColor("#FFFFFF").fillCircle(66, 79, 5);
        g.setColor(_C.BKGD).fillCircle(66, 79, 3);
    
      }
    
      let drawData = (d) => {
          // STATUS
        g.setFontAlign(0,-1).setColor("#ffc55c");
        let batt = E.getBattery(); //process.env.VERSION; //battInfo();
        for(let x=0; x<5; x++) {
          if(batt < x*20) g.setColor("#d6825e");
          g.fillRect(25+x*17,16,x*17+38,19);
        }
        //g.clearRect(30, 133, 100, 146);
        g.setColor("#ffc55c").setFontAlign(0,-1).drawString(` ${d.niceDate} `,_C.XMID, 135,true);
      };
    
      let showMsg = (msgobj) => {  
        g.setFont("Default");
        g.setColor("#000000");
        g.fillRect(0,160,_C.XWID-1,_C.YHT-1);
        g.setColor("#CCCCCC");
        g.setFontAlign(0,-1);
        let y = 168;
        let mstr = ''; 
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
    
      return { 
        drawClock: drawClock,
        start: start,
        drawData: drawData,
        showMsg: showMsg,
      };
    }
    exports = init();
  /*
    wOS.wake();
    exports.start();
    let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
    exports.drawClock(dt);
    exports.drawData(dt);
    exports.showMsg({text:"This would be message 1"});
    */
  