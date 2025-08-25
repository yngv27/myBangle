/*
** ugly... if we're Deskpal specifically...
*/
if(NRF.getAddress() == "e2:96:8a:4f:49:3a") {
  var g0 = g;
  g=Graphics.createArrayBuffer(400,300,1,{msb: true});
  g.redbuf = Graphics.createArrayBuffer(opts.width, 50, 1, {msb:true});
  g.flip = ()=> {
    if(!g.redbuf.isClear) g.drawImage(g.redbuf, 0, 0);
    g0.update(0,0,g, true); 
    /*
    if(!g.redbuf.isClear)
      setTimeout(()=>{g0.update(0,0,g.redbuf);}, 4000);
      */
  };
  g.setFont8x12 = ()=> {g.setFontVector('10');};
  g.setColor(0).setBgColor(-1);
  g.redbuf.setFontAlign(0,0); //.setColor(0).setBgColor(-1);
  setTimeout(()=>{g.redbuf.setFontRoboto20();}, 600);
}
// fun time with PocketPal
if(NRF.getAddress() == "e1:b3:9a:94:14:31") {
  eval(_S.read("6x8s.js"));
  g.setFontRoboto20 = g.setFont6x8s;
  g.setFont8x12 = g.setFont6x8s;
  g.redbuf = Graphics.createArrayBuffer(opts.width, 20, 1, {msb:true});
  g.redbuf.setFontAlign(0,0); 
  g.redbuf.setFont6x8s();
  g.oldFlip = g.flip;
  g.flip = (boo)=> {
    if(!g.redbuf.isClear) g.drawImage(g.redbuf, 0, 0);
    g.oldFlip(boo); 
    /*
    if(!g.redbuf.isClear)
      setTimeout(()=>{g0.update(0,0,g.redbuf);}, 4000);
      */
  };
  // when UI gets built, change it
  setTimeout(()=>{UI.spacer = "\n  ";}, 5000);

} else {


Graphics.prototype.setFontRoboto20=function(scale){this.setFontCustom(atob("AAAAAAAAAAAAAAAAAAAAAAAAH/zA/+YAAAAAAAHwAA4AAAAAA+AAHAAAAAAAAQACDAAYbADP4B/8A/zAGYZADH4A/+A/7AHYYADCAAAAAAAQAeHgH4eBzgwMMHnhw88GGBw4wHj+AcPgAAAAAAAAAAB4AA/gAGMGAwhwGMYAfuABzgABzgAc+AOMYBhBAAMYAB/AAHwAAAAAHwD5+A/8YGPDAw8YGPzA/HYD4fAADwAB/AAOYAABAAAAHwAA4AAAAAAAAAAP/AH/+D4B84AB2AAGAAAAAAAwAA3gAOPAPg//wB/4AAAAEAABiAAGwAA8AA/AAH+AAGwAByAAEAAAAAAAMAABgAAMAABgAH/wA/+AAMAABgAAMAABgAAAAAAAIAAfAADwAAAABgAAMAABgAAMAABgAAAAAAAAAAAAADAAAYAAAAAAAAAAAAAAAADgAB8AB+AA+AA+AA/AAHAAAAAAAAAAAAAAAAAP/gD/+A4A4GADAwAYGADA4A4D/+AP/gAAAAAAAAAAAAAABgAAMAADAAA//4H//AAAAAAAAAAAAAAAOA4DwPA4D4GA7AwOYGDjA44YD+DAPgYAAAAAAABgMAcBwHAHAwwYGGDAwwYHPHAf/wB58AAAAAAAAAPAAD4AB7AA8YAPDAHgYA//4H//AADAAAAAAAAH+MA/xwGMDAxgYGMDAxwYGHPAwfwAA4AAAAAAAAD/gB/+Aew4HMDAxgYGMDAxw4AH+AAfgAAAAAAAGAAAwAAGADAwB4GB+Aw+AGfAA/gAHwAAAAAAAAAPPgD/+A544GGDAwwYGGDA544D/+APPgAAAAAAAB+AAf4AHDjAwMYGBjAwM4HDOAf/gB/wAAAAAAAADAYAYDAAAAAAAAAAAAAAYDAfAYHwAAAAAAAAIAADgAAcAAHwAA2AAO4ABjAAMcADBgAAAAAAAAMwABmAAMwABmAAMwABmAAMwABmAAEQAAAAAAAADBgAccABjAAO4AA2AAGwAAcAADgAAIAAAAAAAABgAAcAAHAAAwOYGDzAw4AH+AAfgAAwAAAAAAAAAAGAAP/AH5+BwAwcADDB+Mw/5mHDMxgZmMDMxnxmP/Mw4YDABAcAYB4OAD/gABgAAAAAAAAAAYAAfAAPwAPwAH2AH4wA8GAH4wAP2AAPwAAfwAAfAAAYAAAAAAAH//A//4GGDAwwYGGDAwwYGGDA544D/+APPgAAAAAAAADAAH/AD/+AcBwHADAwAYGADAwAYGADA4A4DweAODgAAAAAAAH//A//4GADAwAYGADAwAYGADAYAwD4+AP/gAfwAAAAAAAAAAAH//A//4GGDAwwYGGDAwwYGGDAwwYGADAwAYAAAAAAAH//A//4GGAAwwAGGAAwwAGGAAwAAGAAAAAAAAAAH/AD/8AcBwHAHAwAYGADAwYYGDDA4YYDz/AOfwAAAAAAAH//A//4ADAAAYAADAAAYAADAAAYAADAA//4H//AAAAAAAAAAAH//A//4AAAAAAAAAAAADAAAeAAA4AADAAAYAADAAAYAAHA//wH/8AAAAAAAA//4H//AA4AAPAAD8AA7wAOHADgcA4B4GAHAgAYAAAAAAAH//A//4AADAAAYAADAAAYAADAAAYAADAAAAAAAA//4H//A+AAB8AAD4AAH4AAPwAAfAAPwAH4AD8AB8AA+AAH//A//4AAAAAAAH//A//4DwAAPgAAeAAB8AADwAAHgAAeA//4H//AAAAAAAAH/AB/8AeDwHAHAwAYGADAwAYGADA4A4DweAP/gA/4AAAAAAAA//4H//AwMAGBgAwMAGBgAwMAGDgA44AD+AAHgAAAAAAAAA/4AP/gDgOA4A4GADAwAYGADAwAYHAHgeD+B/8wD+GAAAAAAAH//A//4GDAAwYAGDAAwcAGDwA4/gD+fAPg4AABAAAAAAAAADAB4eAfhwHOHAwwYGGDAw4YGDDA4c4Dx+AOHgAAAAAAAGAAAwAAGAAAwAAGAAA//4H//AwAAGAAAwAAGAAAwAAAAAAAAAH/4A//wAAPAAAYAADAAAYAADAAAYAAPA//wH/8AAAAAAAAgAAHAAA/AAB/AAD+AAD+AAD4AAfAAfwAfwAfwAH4AA4AAEAAAAAAAAAA+AAH/AAH/gAD/AAD4AD+AH+AH8AA+AAH+AAD+AAD/AAD4AH/AP/AH+AA8AAAAAAAAAGADA4A4HweAPPgA/wAB8AAfwAPvgDweA8B4GADAAAAAAAAwAAHAAA+AAB8AAD4AAH/AA/4AfAAPgAHwAA8AAGAAAAAAAAAAwAYGAPAwD4GB7AweYGPDAzwYH4DA+AYHADAwAYAAAAAAAH//+///2AAGwAAwAAAAAAGAAA+AAD8AAD8AAD4AAH4AAHgAAMAAAAAAAGAAGwAA3//+///wAAAAAAAOAAHwAD4AA8AAD8AADwAAGAAAAAAABgAAMAABgAAMAABgAAMAABgAAMAABgAAAEAAAwAADAAAIAAAAAAAAAAAAAAAAAEeABn4Ad3ADMYAZjADMYAZmAB/4AP/AAAAAAAA//4H//ABgwAYDADAYAYDADg4AP+AA/gABwAAAAAAAAA/gAP+ADg4AYDADAYAYDADAYAOOABxwAAAAAAAAH8AB/wAcHADAYAYDADAYAMGA//4H//AAAAAAAAA/gAP+ADs4AZjADMYAZjADMYAPnAA8wABgAAAAAAAABgAAMAAP/4D//A5gAGMAAxAAAAAAAAAAH8YB/zAcHMDAZgYDMDAZgcHcD//Af/wAAAAAAA//4H//ABgAAYAADAAAYAADgAAf/AB/4AAAAAAAGf/Az/4AAAAAAAAAAMz//mf/4AAAAAAA//4H//AAOAADwAA/AAOeADh4AQDAAAIAAAAAAAH//A//4AAAAAAAAf/AD/4AMAADAAAYAADAAAcAAD/4AP/ABgAAYAADAAAYAADgAAP/AA/4AAAAAAAAf/AD/4AMAADAAAYAADAAAcAAD/4AP/AAAAAAAAA/gAP+ADg4AYDADAYAYDADAYAcHAB/wAH8AAAAAAAAD//gf/8DAYAYDADAYAYDADg4AP+AA/gABwAAAAAAAAAOAAH8AB/wAcHADAYAYDADAYAYDAD//gf/8AAAAAAAD/4Af/ABgAAYAADAAAQAAAAAAAAAB5wAfnADMYAZjADGYAYzADn4AOeAAAAAAAADAAAYAAf/wD//ADAYAYDAAAAAAAAD/gAf+AAA4AADAAAYAADAAAwAf/AD/4AAAAAAAAYAAD4AAP4AAP4AAPAAH4AH4AD8AAcAAAAAAAAADwAAf4AA/4AAPAAP4AH4ADwAAfgAA/gAA/AAB4AH+AD+AAeAAAAAAAAACAYAcHADzwAH8AAfAAH8ADx4AcHACAIAAAAAAAAcAMD4BgP4MAP/AAPwAP4AP4AD4AAcAAAAAAAAADAYAYHADD4AY7ADOYAfjADwYAcDADAYAAAAAAAAAQAAHAA//4P8/jgAOYAAQAAAAAAH//+///wAAAAAACAACcAAx/n+H//AA4AACAAAAAAAAABwAAcAADAAAYAADgAAMAAAwAAGAAAwAAOAADgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),32,atob("BwQGDQ0PDQQHBgoLBAgGCwsLCwsLCwsLCwsFBQsLCwsUDwwODgwLDQ4FDA0LEQ0ODQ4NDQ4NEBMNDg0GCgYICggLDAsLDAkLCwQFCwQSCwwMDAgKCAsLEAsLCwgECA0="), 21+(scale << 8)+(1 << 16));return this;};
}
debug=print;

// Test Pilot
//spi1.setup({sck: D29, mosi: D31, baud:2000000});
//g = exports.connect({spi: spi1, cs: D2, dc: D47, rst: D45, busy:D43, width: 152, height: 152});

g.on("ready", ()=>{
  g.setFontRoboto20();
  g.redbuf.setFontRoboto20();
});

g.midx = g.getWidth()/2;
g.midy = g.getHeight()/2;

function p0(s) {return ('0'+s).slice(-2);}
function toLocalISOString(d) {
  return `${d.getFullYear()}-${p0(d.getMonth()+1)}-${p0(d.getDate())}T${p0(d.getHours())}:${p0(d.getMinutes())}:00`;
}

let UI = {
  bannerMsg: '',
  runningLong: false,
  endedEarly: false,
  cursor: 60,
  spacer: "     ",
      
  cls: function () { g.clear(); UI.cursor = 60; },
  println: function(str) { 
    str.split("\n").forEach((s) => {
      g.drawString(s, 8, UI.cursor); UI.cursor += g.getFontHeight(); 
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
      UI.invertBanner(); g.redbuf.clear();
      g.redbuf.drawString(UI.bannerMsg, g.redbuf.getWidth()/2, g.redbuf.getHeight()/2);
      //g.redbuf.setBgColor(0).setColor(-1);
      UI.invertBanner(); 
      g.redbuf.isClear = false;
    }
  },
  setHeader: () => {
    g.clearRect(0,0,399,49);
    if(!UI.bannerMsg.length) {
      g.drawString((new Date()).toString().substring(0,15), 8, 18);
      g.drawLine(8, 49, g.getWidth()-8, 49);
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
    if(tm) UI.nextUpdate = E.at(tm, go);
    else UI.nextUpdate = 0;
  },
  offDuty: (str)=> {
    if(!str) str = "ZZzz...";
    UI.cls(); g.setFontRoboto20();g.setFontAlign(0,0);
    UI.setBanner(); UI.drawBanner();
    g.drawString(str, g.midx, g.midy);
    g.flip(true);
    UI.setNextUpdate(); // clear it
    UI.runningLong = false; // we're DONE
  }
};

function isIn(mtg) {
  /*
  let now = getTime();
  let start = new Date(mtg.start).getTime()/1000;
  if (now >= start && now <= start+mtg.dur*60) return true;
  */
  if(compare(mtg) == 0) return true;
  return false;
}

function compare(mtg) {
  let now = getTime();
  let start = new Date(mtg.start).getTime()/1000;
  //debug(`now: ${now}, start: ${start}`);
  if (now < start) return 1;
  if (now >= start && now <= start+mtg.dur*60) { print("IN"); return 0;}
  //print("DONE"); return -1;
}

let AG = {
  filename: "schedule.json",
  items:[ ],
  list: ()=>{
    for(let idx=0; idx<AG.items.length; idx++) {
      a=AG.items[idx];
      print(`${idx}: ${a.start}  ${a.dur}  ${a.text}`);
    }
  },
  find: (str)=>{
    return(AG.items.findIndex((a)=>{ return (a.text.indexOf(str) >= 0); }));
  },
  add: (timeStr, dur, txt) => {
    let today = toLocalISOString((new Date())).substring(0,11);
    if(timeStr.indexOf("T") < 0) { timeStr = today+timeStr;}
    AG.items.push( { start: timeStr, dur: dur, text: txt});
    AG.sort();
    // purge from the top
    while(AG.items.length && AG.items[0].start.substring(0,11) < today)
      AG.items.shift();
  },
  save: ()=> {_S.writeJSON(AG.filename,AG.items);},
  load: ()=> {AG.items = _S.readJSON(AG.filename);},
  niceDate: (d)=>{ return d.toISOString().substring(0,10); },
  nextDay: (d)=>{ d.setTime(d.getTime()+24*60*60*1000); },
  del: (i)=>{AG.items.splice(i,1);},
};

AG.push= AG.add;
AG.sort= ()=>{AG.items.sort((a,b) => { return (b.start > a.start ? -1 : b.start < a.start ? 1 : 0);});};
  
function go() {
  UI.cls();g.setFontRoboto20();g.setFontAlign(-1,-1); 
  UI.setBanner();
  UI.setNextUpdate();
  let now = toLocalISOString((new Date()));
  let today = now.substring(0,10);
  let next = '', empty = true;
  
  AG.sort();
  AG.items.forEach((a) =>  {
    let t = a.start.substring(11,16).split(':');
    t[0] *= 1; t[1] *= 1; t[2] = t[0];  // [ 12hr, min, 24hr]
    if(t[0] > 12) t[0] -= 12;
    let e =[t[0],t[1],t[2]]; e[1]+=a.dur; while(e[1] >= 60) { e[1] -= 60; e[0]++; e[2]++;}
    if(e[0] > 12) e[0] -= 12;
    if(today == a.start.substring(0,10)) { // && compare(a) >= 0) {
      empty = false; // there's at least one mtg today
      let inSession = isIn(a);
      if(!UI.endedEarly && inSession) { //spacer = " ** "; 
        UI.setBanner("MEETING IN PROGRESS"); 
        if(LED2) LED2.blink(3);
        UI.runningLong = false; // this meeting resets last long mtg
        UI.invert();
        let bkgdHt = UI.spacer.indexOf("\n") > -1 ? 2 : 1;
        g.clearRect(0, UI.cursor-2 ,g.getWidth()-1, UI.cursor-2+g.getFontHeight()*bkgdHt);
        // for week of 7/6-12 - no auto long
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
  if(empty) { UI.offDuty(); return;}
  
  // should catch just after a mtg ended; auto "run long"
  if(UI.runningLong && !UI.bannerMsg.length) { UI.setBanner("MEETING RUNNING LONG!"); }
  UI.drawBanner();
  UI.setHeader();
  UI.cursor = 284;
  g.setFont8x12();
  UI.println(next);
  if(next.length) {
    UI.setNextUpdate(next);
  }
  g.flip(true);
  //UI.runningLong = false;
  UI.endedEarly = false;
}
let free = function() { 
  UI.endedEarly = true; 
  UI.runningLong = false; 
  go(); 
};

function doneForDay() {
  UI.offDuty();
  setTimeout(()=>{E.at("18:25", doneForDay);}, 1000);
}
E.at("18:25", doneForDay);
function beginDay() {
  go();
  setTimeout(()=>{E.at("07:25", beginDay);}, 1000);
}
E.at("07:25", beginDay);

setTimeout(()=>{
  AG.load();
  AG.add((new Date()).toLocalISOString().substring(0,16), 0, "Fresh Start");
  go();
}, 2500);

NRF.setServices({
    0xF000: {
      0xF001: {
        value : "IDLE",
        maxLen : 8,
        readable: true,
        notify: true,
       },
      0xF002: {
        value : "X",
        maxLen : 8,
        writable : true,
        onWrite : function(evt) {
          // When the characteristic is written, raise flag
          handle(evt);
        }
      }
    }
  }, {});

function sendReply(val) {
  debug("Updating w "+val);
  NRF.updateServices({
    0xF000: {
      0xF001: {
      value: val,
      readable: true,
      notify: true,
      }
    }
  });
}

function handle(evt) {
  debug(`PERFORM: e=${JSON.stringify(evt)} and data=${JSON.stringify(evt.data)}`);
  if(evt.data == 0) {
    free();
    sendReply("0:OK");
  }
  else if(evt.data == 1) {
    UI.runningLong = false; // end mtg on time
    sendReply("1:OK");
  }
  else if(evt.data == 2) {
    let idx = AG.items.findIndex((e)=>{return(e.text == "Fresh Start");});
    if(idx >= 0) AG.items.splice(idx, 1);
    sendReply("2:OK");
  }

  // after 10 sec reset
  setTimeout(()=>{sendReply("IDLE");}, 10*1000);
}
