eval(_S.read("calendar.js"));
eval(_S.read("todo.js"));

g=gC;
g.redbuf = gH;

g.setFontDefault = g.setFontBarlowMC23;
eval(_S.read("omnigo2.js"));
g.setFontSmall = ()=>{g.setFont("Omnigo",1);};

updateAll = function() {EPD.flip();};

let UI = {
  bannerMsg: '',
  runningLong: false,
  endedEarly: false,
  cursor: 4,
  spacer: "  ",
  reboot: "",
      
  cls: function () { g.clear(); UI.cursor = 4; },
  println: function(str) { 
    str.split("\n").forEach((s) => {
      g.drawString(s, 4, UI.cursor); UI.cursor += g.getFontHeight(); 
    });
  },
  invert: function() { 
    g.setColor( g.getColor() ? 0: -1);
    g.setBgColor( g.getBgColor() ? 0: -1);
  },
  invertBanner: function() { 
    g.redbuf.setColor( g.redbuf.getColor() ? 0: -1);
    g.redbuf.setBgColor( g.redbuf.getBgColor() ? 0: -1);
  },

  setBanner: (msg) => {
    if(typeof(msg) == "undefined") msg='';
    UI.bannerMsg = msg;
  },
  drawBanner: () => {
    if(!UI.bannerMsg.length) {
      g.redbuf.clear();
      g.redbuf.isClear = true;
    } else {
      //g.redbuf.setBgColor(-1).setColor(0).clear();
      UI.invertBanner(); g.redbuf.clear().setFontAlign(0,0);
      g.redbuf.drawString(UI.bannerMsg, g.redbuf.getWidth()/2, g.redbuf.getHeight()/2);
      //g.redbuf.setBgColor(0).setColor(-1);
      UI.invertBanner(); 
      g.redbuf.isClear = false;
    }
  },
  setHeader: () => {
    if(!UI.bannerMsg.length) {
      g.redbuf.clear();
      g.redbuf.setFontAlign(-1, 0).drawString((new Date()).toString().substring(0,15), 4, 18);
      g.redbuf.drawLine(4,  g.redbuf.getHeight()-1, g.redbuf.getWidth()-4, g.redbuf.getHeight()-1);
    }
  },
  pad0: (s) => { return ('0'+s).slice(-2); },

  niceHHMM: (tm) => { // use 12 hr
    return `${UI.pad0(tm[0])}:${UI.pad0(tm[1])}`;
  },
  nextHHMM: (tm) => { // use 24 hr
    return `${UI.pad0(tm[2])}:${UI.pad0(tm[1])}`;
  },
  nextUpdate: 0,
  setNextUpdate: (tm)=>{
    print("Setting next upd to "+tm);
    if(UI.nextUpdate) clearTimeout(UI.nextUpdate); // catches undefined AND 0
    if(tm) UI.nextUpdate = E.at(tm, updateAll);
    else UI.nextUpdate = 0;
  },
  offDuty: (str)=> {
    if(!str) str = "ZZzz...";
    UI.cls(); g.setFontDefault();g.setFontAlign(0,0);
    UI.setBanner(); UI.drawBanner();
    g.drawString(str, g.getWidth()/2, g.getHeight()/2);
    UI.setNextUpdate(); // clear it
    UI.runningLong = false; // we're DONE
  }
};

function go() {
  UI.cls();g.setFontDefault();g.setFontAlign(-1,-1); 
  UI.setBanner();
  UI.setNextUpdate();
  let now = new Date().toLocalISOString();
  let today = now.substring(0,10);
  let next = '', empty = true;

  CAL.sort();
  CAL.items.forEach((a) =>  {
    let t = a.start.substring(11,16).split(':');
    t[0] *= 1; t[1] *= 1; t[2] = t[0];  // [ 12hr, min, 24hr]
    if(t[0] > 12) t[0] -= 12;
    let e =[t[0],t[1],t[2]]; e[1]+=a.dur; while(e[1] >= 60) { e[1] -= 60; e[0]++; e[2]++;}
    if(e[0] > 12) e[0] -= 12;
    if(today == a.start.substring(0,10)) { // && compare(a) >= 0) {
      empty = false; // there's at least one mtg today
      let inSession = CAL.isIn(a);
      if(!UI.endedEarly && inSession) { //spacer = " ** "; 
        UI.setBanner("MEETING IN PROGRESS"); 
        UI.runningLong = false; // this meeting resets last long mtg
        UI.invert();
        let bkgdHt = UI.spacer.indexOf("\n") > -1 ? 2 : 1;
        g.clearRect(0, UI.cursor-2 ,g.getWidth()-1, UI.cursor-2+g.getFontHeight()*bkgdHt);
        UI.runningLong = true; // pre-emptively; need to clear manually
      }
      UI.println(`${UI.niceHHMM(t)} - ${UI.niceHHMM(e)}${UI.spacer}${a.text}`);
      if(!UI.endedEarly && inSession) { 
        UI.invert();
        // use the end time to redraw
        next = UI.nextHHMM(e); //`${pad0(e[2])}:${pad0(e[1])}`;
      }
    }
    if(! next.length && now < a.start) next = UI.nextHHMM(t); 
  });
  if(empty) { UI.offDuty(trash()); return;}
  
  // should catch just after a mtg ended; auto "run long"
  if(UI.runningLong && !UI.bannerMsg.length) { UI.setBanner("MEETING RUNNING LONG!"); }
  UI.drawBanner();
  UI.setHeader();
  g.setFontSmall();
  UI.cursor = g.getHeight()-g.getFontHeight();
  UI.println(next + UI.reboot);
  if(next.length) {
    UI.setNextUpdate(next);
  }
  //UI.runningLong = false;
  UI.endedEarly = false;
}

let free = function() { 
  UI.endedEarly = true; 
  UI.runningLong = false; 
  updateAll(); 
};

// override
dC1 = ()=>{};
dH = go;
dC2 = ()=> {
  gC.clear().setFontDefault().setFontAlign(-1,-1);
  UI.cls();
  let str="";
  DO.list.filter((x)=>{ return x.pri <= "B"; }).forEach((t,i)=>{
      //if(lastLevel != t.pri) { lastLevel = t.pri; str+="-".padStart(48,"-")+"\n"; }
      str+=(`(${t.pri}) ${t.task}`+"\n");
    });
  gC.drawString(str,4,4);
};

function trash() {}

/*
function doneForDay() {
  UI.offDuty(trash());
  setTimeout(()=>{E.at("18:25", doneForDay);}, 1000);
}
E.at("18:25", doneForDay);
function beginDay() {
  updateAll();
  setTimeout(()=>{E.at("07:00", beginDay);}, 1000);
}
E.at("07:00", beginDay);
*/

setTimeout(()=>{
  //AG.add((new Date()).toLocalISOString().substring(0,16), 0, "Fresh Start");
  UI.reboot = " : "+(new Date()).toLocalISOString().substring(0,16);
  updateAll();
}, 7000);
