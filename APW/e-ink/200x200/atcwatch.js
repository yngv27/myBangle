//F07X
//let bootTime = Math.floor(new Date('Wed, 24 Jan 2024 17:00').getTime()/1000);
//MagicX
//let bootTime = Math.floor(Date('Wed, 3 Feb 2024 10:04').getTime()/1000);
wOS.isLCDOn = () => {return true;};

function init() {
  eval(_S.read("atcfont.js"));
  
  let log = (msg) => {};// print(msg); };

  let _C = {
    setBG: () => {g.setColor(-1);},
    setFG: () => {g.setColor(0);},
    XWID: g.getWidth(),
    XMID: g.getWidth()/2,
    YHT: g.getHeight(),
  };
  function start() {

    g.setBgColor(-1).setColor(0);
    g.fillCircle(100,70,4).fillCircle(100,90,4);
    //for(let x=0; x<25; x++) g.buffer[x]=0xaa;
   // g.drawPoly([ 180,6, 192,6, 192,15,  180,15, 
     //           ], true);
    //g.fillPoly([ 182,8, 190,8, 190,14,  182,14, 
      //          ], true);

    g.drawPoly( [2,8,  10,16, 6,20, 6,4, 10,8, 2,16], false);
    g.setFontOmnigo();
    g.setFontAlign(0,-1);
  }
  
  lastTime="    ";

  let upTime = () => {
    let r = Math.floor(Date().getTime()/1000 - bootTime);
    //let s = r % 60;
    r = Math.floor(r / 60);
    let m = r % 60;
    r = Math.floor(r / 60);
    let h = r % 24;
    r = Math.floor(r / 24);

    //g.setFont("Blocky",1);
    let up = ` ${r}d ${h}h ${m}m `;
    g.drawString(up,_C.XMID, 32, true);
    //g.drawString(up,g.getWidth()/2+1, 30, false);
    //g.setFont("Blocky",1);
  };

  let drawData = (d) => {
    g.setFontAlign(1,-1);
    g.drawString('  '+(4.20/0.60 * analogRead(D30)).toFixed(2), 199, 4, true);
    g.setFontAlign(0,-1);
  };
  let drawClock = (d) => {
    //g.clear();//.fillRect(0,138,143, 149);
    log(`d = ${JSON.stringify(d)}`);
    let tm=('0'+d.hr).slice(-2)+':'+('0'+d.min).slice(-2);
    g.setFontATC();
    g.drawString(' '+tm+' ', _C.XMID, 64, true);
    g.setFontBlocky();
    _C.setFG();
    lastTime = tm;
    d.nicedate = Date().toString().substring(0, 15);
    let nd =` ${d.nicedate} `;
    g.drawString(nd, g.getWidth()/2, 4, true);
    // this will bold it
    //g.drawString(nd, g.getWidth()/2+1, 4, false);

    if(typeof(bootTime) != "undefined")    upTime();
    drawData(d);
    g.flip();
    
    if(!d.min) {
      Bangle.buzz();
      // ICKY! But quickie...
      setTimeout(g.setPartial, 10*1000);
    }
    if(d.min == 59) {
      // ICKY! But quickie...
      setTimeout(g.reset, 10*1000);
    }
  };
  
    let showMsg = (msgobj) => {
      g.setFontAlign(0,-1);
      const topY = 144;
      g.clearRect(0, topY, _C.XWID - 1, _C.YHT - 1);
      g.setFontAlign(0, -1);
      let y = topY + 4; //8 +  g.getFontHeight();
      let mstr = '';
      msgobj.text.split(' ').forEach((w) => {
        if (g.stringWidth(mstr + w) > _C.XWID || w == '|') {
          g.drawString(mstr, _C.XMID, y);
          mstr = '';
          y += g.getFontHeight();
        }
        if (w != '|') mstr += w + ' ';
      });
      g.drawString(mstr, _C.XMID, y);
      g.flip();
    };
  
  return {
    start: start,
    drawClock: drawClock,
    drawData: drawData,
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
eval(_S.read("atcfont.js"));
wOS.wake = () => {};
/*
g.setFontOmnigo();
let bootTime = Math.floor(new Date('Wed, 24 Jan 2024 17:00').getTime()/1000);
  //wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  exports.drawData(dt);
  exports.showMsg({text:"This would be message 1"});

//  */
  