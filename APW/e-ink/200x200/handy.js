/* 
** simple analog face: needs handy.png for background
*/

function init() {
  
    let log = (msg) => {};// print(msg); };
  
    let _C = {
      setBG: () => {g.setColor(-1);},
      setFG: () => {g.setColor(0);},
      XWID: g.getWidth(),
      XMID: g.getWidth()/2,
      YHT: g.getHeight(),
      YMID: g.getHeight()/2,
    };
    function start() {
  
      g.setBgColor(-1).setColor(0);
      g.setFontOmnigo();
      g.setFontAlign(0,-1);
    }
    
    lastTime="    ";
  
    let upTime = () => {
      let r = Math.floor(Date().getTime()/1000 - wOS.uptime);
      //let s = r % 60;
      r = Math.floor(r / 60);
      let m = r % 60;
      r = Math.floor(r / 60);
      let h = r % 24;
      r = Math.floor(r / 24);
  
      g.setFont("Omnigo",2);
      let up = ` ${r}d ${h}h ${m}m `;
      g.setFontAlign(0,0);
      g.drawString(up,_C.XMID, _C.YMID*3/4, false);
      //g.drawString(up,g.getWidth()/2+1, 30, false);
      g.setFont("Omnigo",1);
      g.setColor(-1);
      for(let y=-10; y<10; y+=2) {
        g.drawLine(0,_C.YMID*3/4+y,199,_C.YMID*3/4+y);
      }
      g.setBgColor(-1).setColor(0);
    };
  
    let drawData = (d) => {
     let mx=_C.XMID, my=_C.YMID*3/4;
      g.setBgColor(0).setColor(-1);
      g.clearRect(0,0,199, 20);
      g.fillCircle(mx,my, my*0.875);
      g.setFontAlign(1,-1);
      let batstr='BAT:  '+(4.20/0.60 * analogRead(D30)).toFixed(2);
      g.drawString(batstr, 199, 4, true);
      //g.drawString(batstr, 198, 4, false);
      g.setFontAlign(-1,-1);
      g.drawString(d.niceDate.toUpperCase(), 0, 4, true);
      //g.drawString(d.niceDate.toUpperCase(), 1, 4, false);
      g.setFontAlign(0,-1);
    };
    
   let drawClock = (d) => {
     debug("in drawClock");
     g.drawImage(_S.read("handy.png"),0,0);
  
     let mx=_C.XMID, my=_C.YMID;
     g.setBgColor(-1).setColor(0);
     let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
     let minAngle = d.min / 30 * Math.PI;
  
      g.drawImage(_S.read("minute.png"), mx, my, { rotate: minAngle, scale: 0.75 });
      g.drawImage(_S.read("hour.png"), mx, my, { rotate: hrAngle, scale: 0.75 });
      if(typeof(wOS.uptime) != "undefined")    upTime();
      debug("passed _S.read");
      g.flip();
    };
    
    let showMsg = (msgobj) => {
      g.setBgColor(-1).setColor(0);
      g.setFontAlign(0,-1);
      const topY = 164;
      g.clearRect(20, topY, _C.XWID - 21, _C.YHT - 1);
      g.setFontAlign(0, -1);
      let y = topY + 4; //8 +  g.getFontHeight();
      /*
      let mstr = '';
      msgobj.text.split(' ').forEach((w) => {
        if (g.stringWidth(mstr + w) > _C.XWID || w == '|') {
          g.drawString(mstr, _C.XMID, y);
          mstr = '';
          y += g.getFontHeight();
        }
        if (w != '|') mstr += w + ' ';
      });
      */
      g.drawString(g.wrapString(msgobj.text, _C.XWID-40).join("\n"), _C.XMID, y);
      g.flip();
    };
  
    return {
      start: start,
      drawClock: drawClock,
      drawData: ()=>{},
      showMsg: showMsg,
      log: log,
    };
  }
  //g.setPartial=()=>{};
  exports = init();
    Graphics.prototype.setFontOmnigo = function() {
      this.setFontCustom(atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=='), 32, atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc='), 256 + 13);
  };
  Graphics.prototype.setFontBlocky=function(scale){this.setFontCustom(atob("AAAAAAAAAAAAD+QfyAAAcADgAAADgAcAACACeAfwfwDzwD+D+AeQAQAAABwQZCH/4RCCHwAcBwAfACIQfGBzgAwAYAOcDHwQiAHwAcAAAO8D/wRCCMQf2BzwAMADwASAAAQADgAAAB/gf+GAYgBAAAgBGAYf+B/gAABsAHAD+AHABsAAAAAAAgAEAD4AfAAgAEAAAAAEADgAYAAAEAAgAEAAgAAAADAAYAAAAAADAB4B8A+AeADAAAAB/wf/CAIQBCAIf/B/wAACAAf/D/4AAAAAA+CP4RBCIIRBD4IOAAAAQBCIIRBCIIf/B3wAAB+APwACAAQACAf/D/4AAD4AfBCIIRBCIIR/AHwAAB/wf/CIIRBCIIR/AHwAACAAQACA4Q/CfAfADgAAAB3wf/CIIRBCIIf/B3wAAB8AfxCCIQRCCIf/B/wAAAxgGMAAAGLAxwAAAEABwAbAGMAggAAASACQASACQASAAAAggGMAbABwAEAAABAAYACGQRyD4AOAAAAH4B/gYGGeQn6EhQn6EeQwaDDAPwAAAP+D/wQQCCAQQD/wP+AAAf+D/wRCCIQRCD/wO8AAAP8D/wQCCAQQCDAwIEAAAf+D/wQCCAQQCD/wP8AAAf+D/wRCCIQRCAAAf+D/wRACIARAAAAP8D/wQCCAQQiDHwI+AAAf+D/wBAAIABAD/wf+AAAf+D/wAAAAgAGAAQACAAQf+D/gAAD/wf+AeAGYBhgYGCAQAAD/wf+AAQACAAQACAAAf+D/wGAAcADgAwAf+D/wAAD/wf+BgAGAAYAf+D/wAAB/gf+CAQQCCAQf+B/gAAD/wf+CIARACIAfABwAAAB/gf+CAQQCCBwf/B/oAAD/wf+CIARACIAf+B3wAABxgfOCIQRCCIQd+BngAACAAQAD/wf+CAAQAAAAf8D/wACAAQACD/wf8AAAfgD/AAeAAwAeD/AfgAAAfgD/AAeABwf0D/AAeAAwf8D/AAADAweeA/ABgA/AeeDAwAADwAfAAPwB+D4AeAAAAQeCHwRiCIQTCDwQcCAAA//H/4gBAAAYADwAHwAPgAPAAYAAEAI//H/4AAAYAPADgAwADgAPAAYAAAAAIABAAIABAAIABAAAcABgAAAAJgDeASQCSAfwB+AAAf+D/wCCAQQD+APgAAAPgD+AQQCCAQQAAAPgD+AQQCCD/wf+AAAB8AfwCSASQDyAOAAAAQAP+D/wSAAAAB8AfyCCQQSD/wf8AAD/wf+AQACAAfwB+AAAT+CfwAAAACAASf+T/gAAf+D/wAgAOAHeAxwAAD/wf+AAAD+AfwCAAfwD+AQAD+APwAAAfwD+AQACAAfwB+AAAB8AfwCCAQQD+APgAAAf+D/wQQCCAfwB8AAAB8AfwCCAQQD/wf+AAAfwD+AQACAAYABAAAABkAewCSASQDeAJgAAAQAH8A/wCCAAAD8AfwACAAQD+AfwAAAfAD8AAwAGAfgD4AAAD4AfgAGAfwD8AAwD+AfAAAAYwDuAHAA4AdwDGAAADwAfAAMAAiD/wf8AAAQwCOATQCyAcQDCAAAAwB/4fPiAEAAH/+//wAAQAj58P/AGAAAAgAMABAAMAAwACAAwAEAAAAAAAAAAAAAA"), 32, atob("AwQGCAgNCgMFBQYHBAUEBwgFCAgICAgICAgDAwYGBgYMCAkICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
  /*
  _S = require("Storage");
  wOS = { UI: {},
        uptime: getTime(),
        };
  debug=print;
  wOS.isLCDOn = () => {return true;};
  wOS.wake = () => {};
  //*
  g.clear().setFontOmnigo();
  //*
  let bootTime = Math.floor(Date('Wed, 30 Jan 2025 10:04').getTime()/1000);
  //wOS.wake();
  setTimeout(()=>{
    exports.start();
    let dt = {hr:12, min:55, niceDate: "Sun Jul 12"};
    exports.drawClock(dt);
    exports.drawData(dt);
    exports.showMsg({text:"This would be message 1"});
  }, 1500);
  //  */
    
  