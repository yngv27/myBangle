
function init() {
  //g.setFont("6x8",2)
  //require("FontDylex7x13").add(Graphics);
  var _C = {
    WHITE: "#FFFFFF",
    YHT: g.getHeight(),
    XWID: g.getWidth(),
    XMID: g.getWidth() / 2,
    YMID: g.getHeight() / 2,
    FG: -1,
    BG: 0,
    MSGBG: "#202020" //#8079a0"
  };


  // segments are 12 bytes each; ordered top,topL,topR,mid,botL,botR,bottom
  const segdata = new Uint8Array([5, 3, 8, 0, 40, 0, 43, 3, 36, 10, 12, 10,
    0, 8, 3, 5, 10, 12, 10, 41, 4, 47, 0, 43,
    48, 8, 45, 5, 38, 12, 38, 41, 44, 47, 48, 43,
    7, 48, 12, 43, 36, 43, 41, 48, 36, 53, 12, 53,
    0, 88, 3, 91, 10, 84, 10, 55, 4, 49, 0, 53,
    48, 88, 45, 91, 38, 84, 38, 55, 44, 49, 48, 53,
    5, 93, 8, 96, 40, 96, 43, 93, 36, 86, 12, 86
  ]);

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
    g.setBgColor(_C.BG).setColor(_C.FG).clear();
  };

  function clrDtWdw(r,gr,b) {
    if(typeof(r) == "string")
      g.setColor(r);
    else
      g.setColor(r,gr,b);
    g.fillRect(0,200,_C.XWID,_C.YHT).setColor(_C.FG);  
  }

  function drawDate(dt) {
    //let dtstr = dt.toString().substring(0,16);
    let m = dt.getMonth()+1;
    let d = dt.getDate();
    if(lastDate != d) {
      lastDate = d;
      let digs = [Math.floor(m / 10), m % 10, Math.floor(d / 10), d % 10];
      clrDtWdw(_C.BG);
      g.drawLine(56,250,64,210).drawLine(57,250,65,210);
      for(let d = 0; d < digs.length; d++) {
        if(!d && !digs[d]) continue;
        drawDigit(digs[d], [12,34,70,92][d], 210, 0.4, 0.4);
      }
    }
  }

  let drawClock = (t) => {
    let dt=new Date();
    t.hr = dt.getHours();
    t.min = dt.getMinutes();
    let x0 = 40;
    let digs = [Math.floor(t.hr / 10), t.hr % 10, Math.floor(t.min / 10), t.min % 10];
    for(let d = 0; d < digs.length; d++) {
      if(!d && !digs[d]) { digs[d]=10; }
      drawDigit(digs[d], [x0,x0+46,x0,x0+46][d], [40,40,120,120][d], 0.8, 0.8);
    }

  };
  let drawData = (d) => {
    //g.setFont("Dylex7x13",2).setFontAlign(0,0);
    drawDate(new Date());
  };

  return {
    start: start,
    drawClock: drawClock,
    drawData: drawData,
  };
}

Clock = init();

//g.flip();
Clock.lastHour = 99; // for tracking hour changes
function clock() {
  let dt = new Date();
  let hr = dt.getHours();
  if(hr != Clock.lastHour) {
    print("resetting!");
    g.init();
    setTimeout(()=>{g.setPartial();}, 10*1000);
    Clock.drawData();
    Clock.lastHour = hr;
  }
  Clock.drawClock({hr: hr, min: dt.getMinutes()});
  setTimeout(()=>{g.flip();}, 5*1000);
}
//*
(()=>{
  let dt=new Date();
  let secs = dt.getMinutes()*60+dt.getSeconds();
  let next = 150 - (secs % 150);
  setTimeout(()=>{setInterval(clock, 150*1000);}, next*1000);
  print (dt);
  print("will start in "+next);
})();

//*/