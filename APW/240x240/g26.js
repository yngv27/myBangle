function init() {
    const _C = {
      CYAN: "#80FFFF",
      WHITE: "#FFFFFF",
      YHT: g.getHeight(),
      XWID: g.getWidth(),
      XMID: g.getWidth() / 2,
      YMID: g.getHeight() / 2,
      setFG: (c) => { g.setColor("#FFFFFF"); },
      setBG: (c) => { g.setColor(0,0,0.3); }
    };
  
  
  
    /*
    ** BEGIN WATCH FACE
    */
    const startX = [20, 82, 167, 235];
    const startY = [82, 82, 82, 82];
  
    const w = 60;
    const h = 90;
  
    const xyScale = 0.75;
    const fillDigits = true;
  
    let lastH1 = -1;
    let lastH2 = -1;
    let lastM1 = -1;
    let lastM2 = -1;
  

  
    function scaleArray(arrOrig) {
      let scaled = [];
      for (let i = 0; i < arrOrig.length; i++) {
        scaled.push(arrOrig[i] * xyScale);
      }
      return scaled;
    }
    function ellipse(x1, y1, x2, y2, fill) {
      if (fill) g.fillEllipse(x1 * xyScale, y1 * xyScale, x2 * xyScale, y2 * xyScale);
      else g.drawEllipse(x1 * xyScale, y1 * xyScale, x2 * xyScale, y2 * xyScale);
    }
  
    function poly(arr, fill) {
      let sarr = scaleArray(arr);
      if (fill) g.fillPoly(sarr, true);
      else g.drawPoly(sarr, true);
    }
  
    function rect(x1, y1, x2, y2, fill) {
      if (fill) g.fillRect(x1 * xyScale, y1 * xyScale, x2 * xyScale, y2 * xyScale);
      else g.drawRect(x1 * xyScale, y1 * xyScale, x2 * xyScale, y2 * xyScale);
    }
  
    function drawRoundRect(x1,y1,x2,y2,r) {
      g.fillRect(x1,y1+r,x2,y2-r).fillRect(x1+r,y1,x2-r,y2);
      g.fillCircle(x1+r,y1+r,r).fillCircle(x2-r,y1+r,r).fillCircle(x1+r,y2-r,r).fillCircle(x2-r,y2-r,r);
    }
  
    /** DIGITS **/
  
    /* zero */
    function draw0(xOrig, yOrig) {
      _C.setFG();
      ellipse(xOrig, yOrig, xOrig + w, yOrig + h, fillDigits);
      if (fillDigits) _C.setBG();
      ellipse(xOrig + 15, yOrig + 15, xOrig + w - 15, yOrig + h - 15, fillDigits);
    }
  
    /* one */
    function draw1(xOrig, yOrig) {
      _C.setFG();
      poly([xOrig + w / 2 - 6, yOrig,
      xOrig + w / 2 - 12, yOrig,
      xOrig + w / 2 - 20, yOrig + 12,
      xOrig + w / 2 - 6, yOrig + 12
      ], fillDigits);
      rect(xOrig + w / 2 - 6, yOrig, xOrig + w / 2 + 6, yOrig + h - 3, fillDigits);
  
    }
  
    /* two */
    function draw2(xOrig, yOrig) {
      _C.setFG();
      ellipse(xOrig, yOrig, xOrig + 56, yOrig + 56, fillDigits);
      if (fillDigits) _C.setBG();
      ellipse(xOrig + 13, yOrig + 13, xOrig + 43, yOrig + 43, fillDigits);
  
      _C.setBG();
      rect(xOrig, yOrig + 27, xOrig + 40, yOrig + 61, true);
  
      _C.setFG();
      poly([xOrig, yOrig + 88,
        xOrig + 56, yOrig + 88,
        xOrig + 56, yOrig + 75,
        xOrig + 25, yOrig + 75,
        xOrig + 46, yOrig + 50,
        xOrig + 42, yOrig + 36
      ], fillDigits);
    }
  
    /* three */
    function draw8(xOrig, yOrig) {
      _C.setFG();
      ellipse(xOrig + 3, yOrig, xOrig + 53, yOrig + 46, fillDigits);
      ellipse(xOrig, yOrig + 33, xOrig + 56, yOrig + 89, fillDigits);
      if (fillDigits) _C.setBG();
      ellipse(xOrig + 17, yOrig + 13, xOrig + 40, yOrig + 33, fillDigits);
      ellipse(xOrig + 13, yOrig + 46, xOrig + 43, yOrig + 76, fillDigits);
    }
  
    function draw3(xOrig, yOrig) {
      draw8(xOrig, yOrig);
      _C.setBG();
      rect(xOrig, yOrig + 24, xOrig + 24, yOrig + 61, true);
    }
  
    /* four */
    function draw4(xOrig, yOrig) {
      _C.setFG();
      rect(xOrig + 8, yOrig + 54, xOrig + w - 4, yOrig + 67, fillDigits);
      rect(xOrig + 36, yOrig + 12, xOrig + 49, yOrig + 88, fillDigits);
      poly([xOrig, yOrig + 67,
        xOrig + 12, yOrig + 67,
        xOrig + 49, yOrig + 12,
        xOrig + 49, yOrig + 1,
        xOrig + 42, yOrig + 1
      ], fillDigits);
    }
  
    function draw5(xOrig, yOrig) {
      _C.setFG();
      ellipse(xOrig, yOrig + 33, xOrig + 56, yOrig + 89, fillDigits);
      if (fillDigits) _C.setBG();
      ellipse(xOrig + 13, yOrig + 46, xOrig + 43, yOrig + 76, fillDigits);
  
      _C.setBG();
      rect(xOrig, yOrig + 24, xOrig + 19, yOrig + 61, true);
  
      _C.setFG();
      poly([xOrig + 20, yOrig + 1,
      xOrig + 7, yOrig + 47,
      xOrig + 19, yOrig + 47,
      xOrig + 32, yOrig + 1
      ], fillDigits);
      rect(xOrig + 20, yOrig + 1, xOrig + 53, yOrig + 13, fillDigits);
    }
  
    /* six */
    function draw6(xOrig, yOrig) {
      _C.setFG();
      ellipse(xOrig, yOrig + 33, xOrig + 56, yOrig + 89, fillDigits);
      poly([xOrig + 2, yOrig + 48,
      xOrig + 34, yOrig,
      xOrig + 46, yOrig + 7,
      xOrig + 14, yOrig + 56
      ], fillDigits);
      if (fillDigits) _C.setBG();
      ellipse(xOrig + 13, yOrig + 46, xOrig + 43, yOrig + 76, fillDigits);
    }
  
    /* seven */
    function draw7(xOrig, yOrig) {
      _C.setFG();
      poly([xOrig + 4, yOrig + 1,
      xOrig + w - 1, yOrig + 1,
      xOrig + w - 7, yOrig + 13,
      xOrig + 4, yOrig + 13
      ], fillDigits);
      poly([xOrig + w - 1, yOrig + 1,
      xOrig + 15, yOrig + 88,
      xOrig + 5, yOrig + 81,
      xOrig + w - 19, yOrig + 9
      ], fillDigits);
    }
  
    function draw9(xOrig, yOrig) {
      _C.setFG();
      ellipse(xOrig, yOrig, xOrig + 56, yOrig + 56, fillDigits);
      poly([xOrig + 54, yOrig + 41,
      xOrig + 22, yOrig + 89,
      xOrig + 10, yOrig + 82,
      xOrig + 42, yOrig + 33
      ], fillDigits);
      if (fillDigits) _C.setBG();
      ellipse(xOrig + 13, yOrig + 13, xOrig + 43, yOrig + 43, fillDigits);
    }
  
    /** END DIGITS **/
  
    function drawDigit(pos, dig) {
      let x = startX[pos];
      let y = startY[pos];
  
      _C.setBG();
      rect(x, y, (x + w), (y + h), true);
      [draw0,draw1,draw2,draw3,draw4,draw5,draw6,draw7,draw8,draw9][dig](x,y);
    }
  
    let start = () => {
      g.setBgColor(0).clear();     
    };
  
    let drawClock = (d) => {
  
      g.setColor(0,0,0.3); 
      let y = _C.YHT*0.67;
      drawRoundRect(0, 0, _C.XWID, y, 12);
      y -= 16;
      g.setColor(0.7,0.7,0.7).drawLine(20,y,220,y);
      y += 4;
      g.setColor(0.5,0.5,0.5).drawLine(28,y,212,y);
      y += 3;
      g.setColor(0.5,0.5,0.5).drawLine(36,y,204,y);
      console.log("DrawClock: time to draw");
  
      rotate = false;
      let xndg = 15;
      g.setColor(_C.CYAN);
      if (Math.floor(d.hr / 10) > 0) {
        drawDigit(0, 1);
        drawDigit(1, d.hr % 10);
      } else {
        drawDigit(0, 0);
        drawDigit(1, d.hr);
      }
      g.setColor(_C.WHITE);
      drawDigit(2, Math.floor(d.min / 10));
      drawDigit(3, Math.floor(d.min % 10));
    };
  
    let drawData = (d) => {
      // STATUS
      let xoff = 80;
      g.setFontAlign(0, -1).setColor("#009800");
      let batt = E.getBattery(); //process.env.VERSION; //battInfo();
      for (let x = 0; x < 5; x++) {
        if (batt < x * 20) g.setColor("#004000");
        g.fillRect(xoff + x * 17, 5, x * 17 + xoff+13, 8);
      }
      g.setColor("#80ffcc").setFontAlign(0, -1).drawString(d.niceDate, _C.XMID, 20);
  
    };
   
    let showMsg = (msgobj) => {
      const topY = 172;
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
    };
  }
  exports = init();
  Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA=='), 32, atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc='), 256 + 13);
};
g.setFontOmnigo();
  wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  exports.drawData(dt);
  exports.showMsg({text:"This would be message 1"});
  
  