function init() {
    const _C = {
      CYAN: "#80FFFF",
      WHITE: "#FFFFFF",
      YHT: g.getHeight(),
      XWID: 130,
      XMID: 130/2, 
      YMID: g.getHeight()/2,
    };
  
  const startX=[-4,29,62,95],startY=[48,48,48,48];
  optFilled = true;
  const hht = 20;
  const vht = 30;
   
  function Poly(arr, fill) {
    if (fill) g.fillPoly(arr, true);
    else g.drawPoly(arr, true);
  }
  
  function drawVertSeg(x, y) {
    let d = 4;
    Poly([x, y, x+d, y+d, x+d, y+vht-d, x, y+vht, x-d, y+vht-d, x-d, y+d], optFilled);
  
    g.drawLine(x, y, x, y+vht);
  }
  
  function drawHorizSeg(x, y) {
    let d = 4;
    Poly([x, y, x+d, y-d, x+hht-d, y-d, x+hht, y, x+hht-d, y+d, x+d, y+d], optFilled);
  
    g.drawLine(x, y, x+hht, y);
  }
  
  function drawSegments(slot, val) {
  let xOff = startX[slot];
  let yOff = startY[slot];
  if (val != 1 && val != 4)
    drawHorizSeg(xOff, yOff);
  if (val != 1 && val != 2 && val != 3 && val != 7)
    drawVertSeg(xOff, yOff+1);
  if (val != 5 && val != 6)
    drawVertSeg(xOff+hht, yOff+1);
  if (val != 0 && val !=1 && val != 7)
    drawHorizSeg(xOff, yOff+vht+2);
  if (val == 0 || val == 2 || val == 6 || val == 8)
    drawVertSeg(xOff, yOff+vht+2);
  if (val != 2 )
    drawVertSeg(xOff+hht, yOff+vht+2);
  if (val != 1 && val != 4 && val != 7)
    drawHorizSeg(xOff, yOff+vht*2+3);
  }
  
  /***********
  Shared bits
  ************/
  let start = () => {
    g.clear().setBgColor("#260a00");
    let img = _S.read("wbkgd.png");
    if(img) g.drawImage(img, 0, 0);
  }
  
  let drawClock = (d) => {
    g.clearRect(10,30,118,114);
    console.log("DrawClock: time to draw");
    rotate = false;
    g.setColor("#c0a000");
    drawSegments(1,d.hr%10);
    if(!Math.floor(d.hr/10))  
      g.setColor("#260a00");
    drawSegments(0,1);
    g.setColor(_C.WHITE);
    drawSegments(2,Math.floor(d.min/10)); //52);
    drawSegments(3,Math.floor(d.min%10)); //52);
  }
  
  let drawData = (d) => {
      // STATUS
    g.setFontAlign(0,-1).setColor("#909800");
    let batt = E.getBattery(); //process.env.VERSION; //battInfo();
    for(let x=0; x<5; x++) {
      if(batt < x*20) g.setColor("#404000");
      g.fillRect(25+x*17,124,x*17+38,127);
    }
    //g.clearRect(30, 133, 100, 146);
    g.setColor("#D0C000").setFontAlign(0,-1).drawString(` ${d.niceDate} `,_C.XMID,135,true);
  
  };
  
  let showMsg = (msgobj) => {  
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
    start: start,
    drawClock: drawClock,
    drawData: drawData,
    showMsg: showMsg,
  };
  }
  exports = init();
  /*
  
    g.setFontOmnigo = function() {
        this.setFontCustom( atob("AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZgWQf8E0DMAAAQwUwKwC0A1AygwgAAM4LmE5BnAGwAAcAAAB8DjhAQAAQEOOB8AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAeB4AAAP4MWERDRg/gAAIAP+AAAAAhwxoRkNiDhAAAggwYRENmDeAAAHAOgMQP+AEAAB4gkYSEJmEeAAA/g2YSEJmAeAABAAg4RwLgHAAAA3g2YRENmDeAAA8AzIQkM2D+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAMAEdDYA4AAAHwGMGDCchbQooXkEYDEA8AAAB4HwOIB0AOABwAAf8IiERCYg8wDwAAH8GDCAhAQwYIIAAH/CAhAQwIMMD8AAD/hEQiIREICAAD/hEAiARAIAAAB/BgwgIREMmCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAwAIf4AAH/AYAeAZgYYIGAAD/gAQAIAEACAAD/gwAGABwBgDAD/gAA/4MABgAYADB/wAAP4MGEBCAhgwfwAAP+EICEBCAzAPAAAD+DBhBQg4YMH+AAAAB/wjARwIsGzBwgAAYQWMJiGbBHAAAgAQAP+EACAAAA/wAMACADADB/wAAeAB4AHAOAcA4AAAPAA4AHgeADAAcB4HgAABgwYwDgBwDGDBgAA4AHAA+AwBwBgAAAQcIaEZCYhYQ4IAAP+EBAAB4AHAA8AAEBD/gAAIAMAMAGABgAQAAAAEACABAAgAQAIAAMADAAAADgLYFEDiA/AAB/wEIGEDGA+AAAPgMYEEDGAiAAAPgMYGEBCH/AAAPgNYEkDSA4AAAIAf4aAIAAAAfAY0ISEbD/AAD/gMAMAGAB+AAC/gAAACADL/AAD/gGAHgGYCGAAD/gAAP4GACAA/AwAQAH4AAD+AgAwAYAH4AAB8BjAggYwHwAAD/hCAhgYwHwAAB8BjAhgQgP+AAD+AwAwAAAGIFkCaBGAAAQA/wEMAAB+ABgAwAQH8AABwAOABwDgHAAABwAOABwDgAcA4BwAAAYwGwBwBsBjAAAfgAaAJANh/gAARwJoFkDiAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==")
    , 32, atob("AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc="), 256 + 13);
    };
    g.setFont("Omnigo");
  wOS.wake();
  exports.start();
  let dt = {hr:12, min:35, niceDate: "Sun Jul 12"};
  exports.drawClock(dt);
  exports.drawData(dt);
  exports.showMsg({text:"This would be message 1"});
  
  */