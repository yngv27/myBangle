function init() {
    const _C = {
      CYAN: "#80FFFF",
      WHITE: "#FFFFFF",
      YHT: g.getHeight(),
      XWID: 80,
      XMID: 40,
      YMID: g.getHeight() / 2,
      W: 80,
    };
  
    let start = () => {
      g.clear();
Graphics.prototype.setFontBlocky=function(scale){this.setFontCustom(atob("AAAAAAAD+QfyAAAAADgAcAAAAcADgAAAACACeAfwfwDzwD+D+AeQAQAAABwQZCH/4RCCHwAcAAAOAD4ARCD4wOcAGADABzgY+CEQA+ADgAAB3gf+CIQRiD+wOeABgAeACQAADQAcAAAAP8D/wwDEAIAAEAIwDD/wP8AAANgA4AfwA4ANgAAAAgAEAD4AfAAgAEAAAAAAAGgA4AAAEAAgAEAAgAAAAGAAwAAAAAADAB4B8A+AeADAAAAB/gf+CAQQCCAQf+B/gAACAAf+D/wAAAAAA8CPwRCCIQRCD4QOAAAAQCCIQRCCIQf+B3gAAAMADgA0AMgD/wf+AEAAAD4AfCCIQRCCIQR+AHgAAB/gf+CIQRCCIQR+AHgAACAAQACBwQ+CeAfADgAAAB3gf+CIQRCCIQf+B3gAAB4AfiCEQQiCEQf+B/gAAAxgGMAAAGNAxwAAAEABwAbAGMAggAAASACQASACQASAAAAggGMAbABwAEAAABAAYACGQRyD4AOAAAAH4B/gYGGeQn6EhQn6EeQwaDDAPwAAAP+D/wQQCCAQQD/wP+AAAf+D/wRCCIQRCD/wO8AAAP8D/wQCCAQQCDAwIEAAAf+D/wQCCAQQCD/wP8AAAf+D/wRCCIQRCAAAf+D/wRACIARAAAAP8D/wQCCAQQiDHwI+AAAf+D/wBAAIABAD/wf+AAAf+D/wAAAAgAGAAQACAAQf+D/gAAD/wf+AeAGYBhgYGCAQAAD/wf+AAQACAAQACAAAf+D/wGAAcADgAwAf+D/wAAD/wf+BgAGAAYAf+D/wAAB/gf+CAQQCCAQf+B/gAAD/wf+CIARACIAfABwAAAB/gf+CAQQCCBwf/B/oAAD/wf+CIARACIAf+B3wAABxgfOCIQRCCIQd+BngAACAAQAD/wf+CAAQAAAAf8D/wACAAQACD/wf8AAAfgD/AAeAAwAeD/AfgAAAfgD/AAeABwf0D/AAeAAwf8D/AAADAweeA/ABgA/AeeDAwAADwAfAAPwB+D4AeAAAAQeCHwRiCIQTCDwQcCAAA//H/4gBAAAYADwAHwAPgAPAAYAAEAI//H/4AAAYAPADgAwADgAPAAYAAAAAIABAAIABAAIABAAAcABgAAAAJgDeASQCSAfwB+AAAf+D/wCCAQQD+APgAAAPgD+AQQCCAQQAAAPgD+AQQCCD/wf+AAAB8AfwCSASQDyAOAAAAQAP+D/wSAAAAB8AfyCCQQSD/wf8AAD/wf+AQACAAfwB+AAAT+CfwAAAACAASf+T/gAAf+D/wAgAOAHeAxwAAD/wf+AAAD+AfwCAAfwD+AQAD+APwAAAfwD+AQACAAfwB+AAAB8AfwCCAQQD+APgAAAf+D/wQQCCAfwB8AAAB8AfwCCAQQD/wf+AAAfwD+AQACAAYABAAAABkAewCSASQDeAJgAAAQAH8A/wCCAAAD8AfwACAAQD+AfwAAAfAD8AAwAGAfgD4AAAD4AfgAGAfwD8AAwD+AfAAAAYwDuAHAA4AdwDGAAADwAfAAMAAiD/wf8AAAQwCOATQCyAcQDCAAAAwB/4fPiAEAAH/+//wAAQAj58P/AGAAAAgAMABAAMAAwACAAwAEAAAAAAAAAAAAAA"), 32, atob("AwQGCQgNCgMFBQYHBAUEBwgFCAcICAgICAgDAwYGBgYMCAkICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
    };
  
    let drawClock = (d) => {
  
      g.clearRect(0, 0, _C.XWID, _C.YMID + 120);
      if(d.min < 10) d.min = '0'+d.min;
      g.setFontAlign(1, -1);
      g.setFont("Blocky",4);
      g.drawString(d.hr, _C.W-1, 24);
      g.drawString(d.min, _C.W-1, 68);
      /*let dt = `${d.hr} ${d.min}`;
      let mtx = g.stringMetrics(dt);
      let g2 = Graphics.createArrayBuffer(mtx.width, mtx.height, 1, {msb: true});
      g2.setFont("Blocky",3).setFontAlign(-1,-1).drawString(dt,0,0);
      g.drawImage({buffer: g2.buffer, width: mtx.width, height: mtx.height, bpp: 1}, 0, 32);
      */
    };
  
    let ttgo = () => {
      let d1 = Math.floor(getTime());
      let d2 = (new Date("2024-06-20T00:00")).getTime()/1000;
      let days = Math.floor((d2 - d1)/(60*60*24));
      let secs = (d2-d1)%(60*60*24);
      let hrs = Math.floor((secs) / (60*60)); 
      secs %= 60*60;
      let mins = Math.floor(secs / 60);
      return(`${days}d${hrs}h${mins}`);
    };
    let drawData = (d) => {
      // STATUS
      g.setFontAlign(0, -1);
      let batt = E.getBattery(); //process.env.VERSION; //battInfo();
      for (let x = 0; x < 3; x++) {
        if (batt >= x * 33) 
          g.fillRect(76 - x * 5, 0, 79 - x * 5, 6);
      }
      g.setFont("Blocky",1);
      g.setFontAlign(1, -1).drawString(d.niceDate, _C.W-1, 9);
      g.setFontAlign(1, -1);
      g.drawString(wOS.getStepCount().toString().padStart(5,'0'), _C.W-1, 122);
      g.drawString("T- "+ttgo(), _C.W-1, 140,true);

    };
   
    let showMsg = (msgobj) => {
      const topY = 120;
      g.setColor("#000000");
      g.fillRect(0, topY, _C.XWID - 1, _C.YHT - 1);
      g.setColor("#CCCCCC");
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
    };
  
    return {
      start: start,
      drawClock: drawClock,
      drawData: drawData,
      showMsg: showMsg,
    }
  }
  exports = init();
  //*
   
  wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  exports.drawData(dt);
  //exports.showMsg({text:"This would be message 1"});
  //* /
  