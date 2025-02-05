
function init() {
    //g.setFont("6x8",2)
    require("FontDylex7x13").add(Graphics);
    var _C = {
      WHITE: "#FFFFFF",
      YHT: g.getHeight(),
      XWID: g.getWidth(),
      XMID: g.getWidth() / 2,
      YMID: g.getHeight() / 2,
      FG: "#f8fff8", //"#fff5d9",
      BG: "#000000",
      MSGBG: "#202020" //#8079a0"
    };
    g.setBgColor(_C.BG).setColor(_C.FG).clear().drawImage(
      {
      width : 240, height : 240, bpp : 1,
      buffer : require("heatshrink").decompress(atob("AH4A/AFs//4ABwAdYv4dC8AHCj4ULnAIH4ADCsAlDEQYAHvwIH5+fz+/mAHCIAgdQ74dF4YdMMxAdD2EAgJ8FAA8PU44dGj4dLgOHRoYdH3wPBh//CA4ACgfDDp0HDpnjJA4dGwf/NQ5ZD+IdNgAdBShUADp9B/wcKnF5Dp1w/gdKvgdMaIMA/H4DpX8DqFwDpX+DpkwDpw7J54dBjwdClEgO6nAAYQdCgwdLnEwDo9//4ABBYUDsDvLABE/DoQ/CgJDDADOADrgA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AE//AAIcZgYdCwAGBh4FB+EAn4EB4AdRCQQYC/BGD8AdNgI7FDoX8DoZABABkMCIP+kAGBj47Dv47PhEcCQP8uAHB54YB8UDIAWIDpk4jwSB/BOBgPHDAPHg5ACjgdMvkfCQPxDoXjDAOPg+PMgM8Dpn8j4SB84dC+IdBj8HIAP8vixMDoJxB54dC/A2Bv8HIAP5XALtLDoKlBj4dC/g2B/8H+f/+YdMg/8n4aBAQUB/z4Cg7TBB4IdLh4dGgf/AQQMBB4QdLj4d/DrP4Du1/h0cDreejwdaufeDrdh78+DrVgDqkP/4DBn//CQI7Vj///yRB//4AYOfmwdEv/wnwdMBYIdBA4N/zNmDpUHDocfDoYZCLIVgjPmDqVP//5wJ3B8wdW8//+eDz//5wdC9wdS+f/8+D5//zwdC5wdS/P/5+DH4M+DoMY5gdSAgWDCYN+gAACDqTtBn+DdoIFBDsfgDoV+DrwNBDoQUBDuPgDsX+DoYXDv4dBgIdLngdaAQQdVCAM/4ASBDogCBDoQCBC4V/w4dGg/4j+H//HDoSNBCAMP+APCDpcD/EOj//8eADQP4v/8v0H8P/+IdMgHggl//5QBAAIYB/04gZGB/HgDpgAB///KoIABo4GBwEBIwIUBDpsBDosPAwKeBn4EBDpw7CLIY2BDoRkBDp8GGAPxHYqbBBQJZO4EPGoPnGoMAsYdBiEBx5kBoAdLgPgj4SBx7vBgHxGwN8gfH//5+DvM+E/HAMfDoLvBPoP+g/jfQLvMh/4n4aBv4CBga3BCAMP+EAg4dMj4dHBoMHDoK8BB4MBE4M/w4mBDok/DqcfDoV+DpSQBDpEAQIPPwaABnwdWbYPmbQWYDq0PXoIWB/7kCDqkfDoV/Do6SCHZ6TBHYPADpYaBDoQ4DO5wdQ+P/x8D4/+ngdE+AdPgKTCw4TBB4IdV/gPBw/wgId/Dv4d/DQQdY/4dih4dDn4d/v8HDoIFBDsfADoICBDrwNBh/8j/wB4Qd/Ds4ECEAQdVCAQiCDoIACEAQPDC4X/DoMDDokPLIP//8fDogQEB4IdLA4IdCx5ZCAoPxLIIEB44dMgYdD44dE/AdD8aHEAQJ3FgIdD8YdE/l8DoXxQ4gDCDokADofxDon+ngdC/BTBAgOfh4MBvgdEsE/CQR/CAoP/jgdC/lwgIEB54NCngdEIwISCP4QdCwAyBGYJrBAgPnDoWcDoowCCQIdE4AdC/4dD+QdC5AdFCQQ7CCYX/8BeDwAJC/AIC8AdFGoQJDHYZADBIf8BAS7DABJ+BL4SgEYgP4H4Q7GAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AEwA=="))
    }, 0,0);
  
  
    // segments are 12 bytes each; ordered top,topL,topR,mid,botL,botR,bottom
    const segdata = new Uint8Array([5, 3, 8, 0, 40, 0, 43, 3, 36, 10, 12, 10,
      0, 8, 3, 5, 10, 12, 10, 41, 4, 47, 0, 43,
      48, 8, 45, 5, 38, 12, 38, 41, 44, 47, 48, 43,
      7, 48, 12, 43, 36, 43, 41, 48, 36, 53, 12, 53,
      0, 88, 3, 91, 10, 84, 10, 55, 4, 49, 0, 53,
      48, 88, 45, 91, 38, 84, 38, 55, 44, 49, 48, 53,
      5, 93, 8, 96, 40, 96, 43, 93, 36, 86, 12, 86
    ]);
    /*
    const segdata = new Uint8Array(E.toArrayBuffer(atob('BQMIACgAKwMkCgwKAAgDBQoMCikELwArMAgtBSYMJiksLzArBzAMKyQrKTAkNQw1AFgDWwpUCjcEMQA1MFgtWyZUJjcsMTA1BV0IYChgK10kVgxW')));
    */
  
  
    function drawSegment(seg, xoff, yoff, xscale, yscale) {
      let arrTmp = new Uint8Array(12);
      let beg = seg * 12;
      for(let i=0; i<12; i+=2) {
        arrTmp[i] = segdata[beg+i]*xscale+xoff;
        arrTmp[i+1] = segdata[beg+i+1]*yscale+yoff;
      }
      g.fillPoly(arrTmp,true);
    }
  
    function drawDigit(d, x, y, xscale, yscale) {
      let mask = [0x77,0x24,0x5d,0x6d,0x2e,0x6b,0x7b,0x25,0x7f,0x6f,0][d];
      for(let s=0; s<7; s++) {
        // special case: first digit, only draw 2 segs (2 & 5)
        if( ! x &&  s!=2 && s!=5 ) {
          //print(`x=${x} d=${d} s=${s} mask=${mask}  continuing`);
        } else {
          if(mask & 1)  g.setColor(_C.FG);
          else g.setColor(_C.BG);
          //if((mask & 1) || (d != 1) || x) 
          drawSegment(s, x, y,xscale, yscale);
        }
        mask >>= 1;
      }
    }
  
    let lastDate = '';
    
    let start = () => {
      //g.setColor(0,0,0);
      g.clearRect(26,72,239,170);
      g.setBgColor(_C.BG).setColor(_C.FG).fillCircle(87,120,2).fillCircle(87,152,2);        
      
      wOS.on('tick', secs);
  
    };
  
    function clrDtWdw(r,gr,b) {
      if(typeof(r) == "string")
        g.setColor(r);
      else
        g.setColor(r,gr,b);
      g.fillRect(0,172,_C.XWID,_C.YHT).setColor(_C.FG);  
    }
  
    function drawDate(dt) {
      //let dtstr = dt.toString().substring(0,16);
      let m = dt.getMonth()+1;
      let d = dt.getDate();
      if(lastDate != d) {
        lastDate = d;
        let digs = [Math.floor(m / 10), m % 10, Math.floor(d / 10), d % 10];
        clrDtWdw(_C.BG);
        g.drawLine(116,235,124,179).drawLine(117,235,125,179);
        for(let d = 0; d < digs.length; d++) {
          if(!d && !digs[d]) continue;
          drawDigit(digs[d], [72,94,130,152][d], 182, 0.4, 0.5);
        }
      }
    }
  
    function drawBattery(b) {
      g.clearRect(195,8,224,22);
      //g.setColor(1,1,1);
      if(b > 35) g.fillRect(196,9,203,20);
      if(b > 55) g.fillRect(205,9,212,20);
      if(b > 75) g.fillRect(214,9,221,20);
    }
  
    let showMsg = (msgobj) => {
      g.setFont("Dylex7x13",1).setFontAlign(0,0);
      clrDtWdw(_C.MSGBG); //0,0.2,0.15);
  //    msgobj.text.split('|').forEach((s,i)=>{g.drawString(s, 120, 170+i*14);});
        msgobj.text.split('|').forEach((s,i)=>{
          g.drawString( msgobj.text.split('|').join("\n"), 120, 230);});
      lastDate = '';
    };
  
  
    let drawClock = (t) => {
      let digs = [Math.floor(t.hr / 10), t.hr % 10, Math.floor(t.min / 10), t.min % 10];
      for(let d = 0; d < digs.length; d++) {
        if(!d && !digs[d]) { digs[d]=10; }
        drawDigit(digs[d], [0,44,90,130][d], 72, 0.8, 1);
      }
  
    };
    let drawData = (d) => {
      g.setFont("Dylex7x13",2).setFontAlign(0,0);
      drawBattery(E.getBattery());
      g.drawString(analogRead(wOS.BAT).toFixed(4),120, 40, true);
      drawDate(new Date());
    };
  
    function secs() {
      let s = new Date().getSeconds();
      let digs = [Math.floor(s / 10), s % 10];
      for(let d = 0; d < digs.length; d++) {
        drawDigit(digs[d], [180,210][d], 94, 0.6, 0.75);
      }
    }
    let stop = () => {
      wOS.removeListener("tick", secs);
    };
  
    return {
      start: start,
      drawClock: drawClock,
      drawData: drawData,
      showMsg: showMsg,
      stop: stop
    };
  }
  exports = init();
  
  if(process.env.BOARD != "EMSCRIPTEN") {
    wOS.wake();
    TC.on("touch", (p)=>{
      if(p.y > 200) {
        showBits();
      }
    });
  } else {
    wOS = { BAT: D0 };
  }
  exports.start();
  let dt = { hr: 12, min: 35, niceDate: "Sun Jul 12" };
  exports.drawClock(dt);
  exports.drawData(dt);
  exports.showMsg({title:"Title", text:"This would be message 1 | That's it"});
  upTime = 173411102;
  
  