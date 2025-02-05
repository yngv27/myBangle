

// CALENDAR
function updCal(p) { //num, today, x, y) {
  p.buf.clear();
  let bw = p.buf.getWidth();
  let bh = p.buf.getHeight();
  p.buf.drawRect(0, 0, bw, bh);
  p.buf.drawString(p.num, bw-4, 4);
  if(p.num == p.today)
    p.buf.drawString(p.num, bw-5, 4);
  g.update(p.x,p.y,p.buf);
}

function calendar() { //x0, y0, w, h) {
  let x0=0, y0=0, w=391, h=295;
  let bw = Math.floor(w/7);
  let bh = Math.floor(h/5);
  let buf=Graphics.createArrayBuffer(bw+1, bh+1, 1, {msb:true});
  buf.setFontVector(16); //("HaxorNarrow7x17",2);
  buf.setColor(0).setBgColor(-1);
  //buf.setFont("8x12",1);
  buf.setFontAlign(1,-1);
  let d=new Date();
  //g.clear();
  let today=d.getDate();
  let start = d.getDay() - ((today-1)%7);
  if(start < 0) start += 7;
  let date=1-start;
  print(`start is ${start}, date is ${date}`);
  for(let r =0; r<5;r++) {
    for(let c=0; c<7; c++) {
      if(date > 0 && date < 32) {
        debug(date);
        ifFree( {func: updCal, parm:{buf:buf,num:date, today:today, x:x0+c*bw, y:y0+r*bh}});
      }
      date++;
    }
  }
  return((start < 3) ? -1 : 1); // for top left vs bottom right time display
}

//*/
//
// CLOCK
//
let g2=Graphics.createArrayBuffer(104,48,1,{msb:true});
g2.setBgColor(0).setColor(-1);
let clockObj = {
  sleepy: false,
  clockLoc: 0,
  clockIval: 0,
};
function clock(h1,m1) {
  let h=(new Date()).getHours();
  let m = (new Date()).getMinutes();
  if(h1) {h=h1; m=m1;}
  let dt=h+":"+('0'+m).slice(-2);
  
  // done for the day?
  if((h == 17) && (m == 0)) {
    clearInterval(clockObj.clockIval);
    clockObj.clockIval = setInterval(clock, 30*60*1000);
    g.cls();
    clockObj.clockLoc = calendar();
    clockObj.sleepy=true;
  } else if ((h == 9) && (m == 0)) {
    clearInterval(clockObj.clockIval);
    clockObj.clockIval = setInterval(clock, 60*1000);
    newday();
    clockObj.sleepy=false;
  }
  if(clockObj.sleepy) {
    g2.setFontAlign(0,0);
    g2.setColor(0).setBgColor(-1);
    g2.clear();
    g2.drawString(dt, g2.getWidth()/2, g2.getHeight()/2);
    ifFree({func:() => {
      if(clockObj.clockLoc > 0)
        g.update(0,0, g2);
      else
        g.update(399-g2.getWidth(), 299-g2.getHeight(), g2);
    }, parm: 0});
  } else {
    g2.setFontAlign(1,-1);
    g2.setColor(-1).setBgColor(0);
    g2.clear();
    g2.drawString(dt, g2.getWidth()-4, 6);
    g2.fillPoly(new Uint8Array([0,42, 6,48, 0,48  ]));
    ifFree({func:() => {
      g.update(400-g2.getWidth(), 0, g2);
    }, parm: 0});
    // erase any old agenda items
    if((m == 0) && (h > 9)) {
      _agenda[h-10]="";
      ifFree({func:updAgenda, parm: h-10});
    }
  }
}


let motd = "With3,sit,fork!";
function newday() {
  g.cls();
  //ifFree({func:()=>{
    msgline(motd, 280);
  //}, parm: 0});
  //ifFree({func:()=>{
    msgline((new Date().toString().substring(0,15)), 0);
  //}, parm:0});
  agenda();
  todo();
}


let flist = [];
function ifFree(f) {
  debug("BUSY: "+g.busy+" "+getTime().toFixed(3));
  if(typeof(f) != "object") f=null;
  if(!g.busy) {
    if(flist.length) {
      // execute first in list
      let o = flist.shift();
      (o.func)(o.parm);
      // push the latest one
      if(f) flist.push(f);
    } else {
      // execute this one
      if(f) (f.func)(f.parm);
    }
  } else {
    if(f) flist.push(f);
    //setWatch(ifFree, BUSY, {edge: "rising"});
  }
}
g.on("free", ifFree);

// TODO
class _todo {
  constructor() {
    this.list = [];
    this.hdr="";
    this.height = 44;
  }
  footer() {return( "\n".padStart(this.height-this.list.length,"\n"));}
  aa(task) {this.a("A", task);}
  ab(task) {this.a("B", task);}
  a(pri,task) {this.list.push({task: task, pri: pri.toUpperCase() /*, id: this.list.length*/});this.ls();}
  p(id, pri){this.list[id].pri = pri.toUpperCase();this.ls();}
  ls(ceil) {
    this.sort();
    if(!ceil) ceil='Z'; else ceil=ceil.toUpperCase();
    let lastLevel = ' ';
    print(this.hdr); //"\n");
    this.list.filter((x)=>{ return x.pri <= ceil; }).forEach((t,i)=>{
      if(lastLevel != t.pri) { lastLevel = t.pri; print("-".padStart(48,"-")); }
      print(`${i.toString().padStart(2,' ')}  (${t.pri}) ${t.task}`);
    });
    print(this.footer());
  }
  d(id) {this.list.splice(id,1);this.ls();}
  top(id) {this.list.splice(0,0,this.list.splice(id,1)[0]); this.ls();}
  feh(id) {let t=this.list.splice(id,1); this.list.push(t[0]); this.ls();}
  sort() {
    this.list.sort((a,b)=>{return (a.pri >= b.pri ? 1 : -1);});
  }
}
let w=new _todo();
w.list = _S.readJSON("todos")[0];
let n=new _todo();
n.list = _S.readJSON("todos")[1];

let g3 = Graphics.createArrayBuffer(280, 29, 1, {msb: true});
g3.setColor(0).setBgColor(-1);
function updTodo(parms) {
  let i = parms[0];
  let msg = parms[1];
  g3.clear();
  if(msg.length) {
    g3.drawString(msg, 24, 0);
    g3.drawRect(4,0,16,12);
    //if(done == "X") { g3.drawLine(4,0,16,12); g3.drawLine(16,0,4,12);}
  }
  g.update(128, i*30+50, g3);
  debug("I got "+i);
}
function todo() {
  for(let i=0; i<7; i++) {
    //ifFree({func: updTodo, parm: i});
  }
  let cnt=0;
  w.list.filter((x)=>{ return x.pri == "A"; }).forEach((t,i)=>{
    if(cnt < 8) ifFree({func:updTodo, parm:[cnt++, t.task]});
  });
  n.list.filter((x)=>{ return x.pri == "A"; }).forEach((t,i)=>{
    if(cnt < 8) ifFree({func:updTodo, parm:[cnt++, t.task]});
  });
}

// AGENDA
let _agenda = [
 "", "", "", "", "", "", "", ""
];
let g4 = Graphics.createArrayBuffer(120, 32, 1, {msb: true});
g4.setColor(0).setBgColor(-1);
function updAgenda(i) {
  let msg = _agenda[i];
  let tm= i > 3 ? i-3 : i+9;
  g4.clear();
  g4.setFont("Default",2).setFontAlign(1,-1).drawString(tm, 16, 2);
  g4.setFont("Default").setFontAlign(-1,-1);

  g4.drawString(msg, 18, 0).drawLine(119,0,119,31);
  for(let x=0; x < 120; x+=2) g4.setPixel(x,30);
  g.update(6, i*32+24, g4);
  //debug("I got "+i);
}
function agenda() {
  for(let i=0; i<_agenda.length; i++) {
    ifFree({func: updAgenda, parm: i});
  }
}
//* Agency
Graphics.prototype.setFontDefault=function(scale){this.setFontCustom(atob("AAAAAAAAAAD/kAAAAADwAAAA8AAAAAAAEIB/4BCAEIB/4BCAAAB4cIQQ//iCEOHgAAD8AIQw/EABgAYAGAAj8MIQA/AAAPHwihCEEIAQ5/AEEAAAAADwAAAAB4A4cMAMAAAAAMAMOHAHgAAAUAAgAPgAIABQAAAAAgACAA+AAgACAAAAAAAAOAAAAQABAAEAAQAAAAAwAAAAAABwAYAGABgA4AAAAP/wgBCAEIAQ//AAAP/wAADx8IIQhBCIEPAQAADw8IAQhBCKEPHwAAD/gACAAIAf8ACAAAD48IgQiBCIEI/wAAD/8IQQhBCEEOfwAADAAIAAh/CIAPAAAAD78IQQhBCEEPvwAAD+cIIQghCCEP/wAAAGMAAAAAAGOAAAAAAGABmAYGAAAASABIAEgASABIAAAGBgGYAGAAAA8ACAAIewiADwAAAA//CAEL+QoJCgkL+QgJD/kAAA//CEAIQAhAD/8AAA//CEEIQQhBD78AAA//CAEIAQgBDg8AAA//CAEIAQgBB/4AAA//CEEIQQhBCAEAAA//CEAIQAhACAAAAA//CAEIQQhBDn8AAA//AEAAQABAD/8AAA//AAAADwABAAEAAQ//AAAP/wCAAUACIAwfAAAP/wABAAEAAQAAD/8DAADAAwAP/wAAD/8DAADAADAP/wAAB/4IAQgBCAEH/gAAD/8IIAggCCAP4AAAB/4IAQgFCAMH/wAAD/8IIAgwCCgP5wAADw8IgQhBCCEPHwAACAAIAA//CAAIAAAAD/8AAQABAAEP/wAAD/AADAADAAwP8AAAD/AADwBwAA8P8AAADg8BsABAAbAODwAADgABgAB/AYAOAAAACAcIGQhhCYEOAQAAD//IAEgAQAAOAAGAAGAAGAAHAAAIAEgAT//AAAMADAADAAAAAAAgACAAIAAgAAwABgAAAADfAJEAkQD/AAAP/wCBAIEA/wAAAP8AgQCBAOcAAAD/AIEAgQ//AAAA/wCRAJEA8wAAAIAP/wiAAAAA/2CBIIEg/+AAD/8AgACAAP8AAAb/AAAAACb/4AAP/wAYAGYAgQAAD/8AAAD/AIAA/wCAAP8AAAD/AIAAgAD/AAAA/wCBAIEA/wAAAP/ggQCBAP8AAAD/AIEAgQD/4AAA/wCAAIAA4AAAAOcAkQCJAMcAAACAB/8AgQAAAP8AAQABAP8AAADAADwAAwA8AMAAAAD8AAcAHAAHAPwAAADnABgAGADnAAAA/gACIAIg/+AAAMcAiQCRAOMAAAAgB9+IAEgAQAAP/+AACABIAEffgCAAAAAAAAAAAAgAD/8AAAAAA="), 32, atob("AwMFCAYKBwMFBAYGAwUDBgYCBgYGBgYGBgYDAwQGBAYJBgYGBgYGBgYCBgYFBgYGBgYGBgYGBgYGBgYEBgQEBQMFBQUFBQQFBQIDBQIGBQUFBQUFBAUGBgUFBQUCBQYB"), 16+(scale << 8)+(1 << 16));};
//*/
/* Blocky
Graphics.prototype.setFontDefault=function(scale){this.setFontCustom(atob("AAAAAAAD+QfyAAAAADgAcAAAAcADgAAAACACeAfwfwDzwD+D+AeQAQAAABwQZCH/4RCCHwAcAAAOAD4ARCD4wOcAGADABzgY+CEQA+ADgAAB3gf+CIQRiD+wOeABgAeACQAADQAcAAAAP8D/wwDEAIAAEAIwDD/wP8AAANgA4AfwA4ANgAAAAgAEAD4AfAAgAEAAAAAAAGgA4AAAEAAgAEAAgAAAAGAAwAAAAAADAB4B8A+AeADAAAAB/gf+CAQQCCAQf+B/gAACAAf+D/wAAAAAA8CPwRCCIQRCD4QOAAAAQCCIQRCCIQf+B3gAAAMADgA0AMgD/wf+AEAAAD4AfCCIQRCCIQR+AHgAAB/gf+CIQRCCIQR+AHgAACAAQACBwQ+CeAfADgAAAB3gf+CIQRCCIQf+B3gAAB4AfiCEQQiCEQf+B/gAAAxgGMAAAGNAxwAAAEABwAbAGMAggAAASACQASACQASAAAAggGMAbABwAEAAABAAYACGQRyD4AOAAAAH4B/gYGGeQn6EhQn6EeQwaDDAPwAAAP+D/wQQCCAQQD/wP+AAAf+D/wRCCIQRCD/wO8AAAP8D/wQCCAQQCDAwIEAAAf+D/wQCCAQQCD/wP8AAAf+D/wRCCIQRCAAAf+D/wRACIARAAAAP8D/wQCCAQQiDHwI+AAAf+D/wBAAIABAD/wf+AAAf+D/wAAAAgAGAAQACAAQf+D/gAAD/wf+AeAGYBhgYGCAQAAD/wf+AAQACAAQACAAAf+D/wGAAcADgAwAf+D/wAAD/wf+BgAGAAYAf+D/wAAB/gf+CAQQCCAQf+B/gAAD/wf+CIARACIAfABwAAAB/gf+CAQQCCBwf/B/oAAD/wf+CIARACIAf+B3wAABxgfOCIQRCCIQd+BngAACAAQAD/wf+CAAQAAAAf8D/wACAAQACD/wf8AAAfgD/AAeAAwAeD/AfgAAAfgD/AAeABwf0D/AAeAAwf8D/AAADAweeA/ABgA/AeeDAwAADwAfAAPwB+D4AeAAAAQeCHwRiCIQTCDwQcCAAA//H/4gBAAAYADwAHwAPgAPAAYAAEAI//H/4AAAYAPADgAwADgAPAAYAAAAAIABAAIABAAIABAAAcABgAAAAJgDeASQCSAfwB+AAAf+D/wCCAQQD+APgAAAPgD+AQQCCAQQAAAPgD+AQQCCD/wf+AAAB8AfwCSASQDyAOAAAAQAP+D/wSAAAAB8AfyCCQQSD/wf8AAD/wf+AQACAAfwB+AAAT+CfwAAAACAASf+T/gAAf+D/wAgAOAHeAxwAAD/wf+AAAD+AfwCAAfwD+AQAD+APwAAAfwD+AQACAAfwB+AAAB8AfwCCAQQD+APgAAAf+D/wQQCCAfwB8AAAB8AfwCCAQQD/wf+AAAfwD+AQACAAYABAAAABkAewCSASQDeAJgAAAQAH8A/wCCAAAD8AfwACAAQD+AfwAAAfAD8AAwAGAfgD4AAAD4AfgAGAfwD8AAwD+AfAAAAYwDuAHAA4AdwDGAAADwAfAAMAAiD/wf8AAAQwCOATQCyAcQDCAAAAwB/4fPiAEAAH/+//wAAQAj58P/AGAAAAgAMABAAMAAwACAAwAEAAAAAAAAAAAAAA"), 32, 
atob("AwQGCAgNCgMFBQYHBAUEBwgFCAcICAgICAgDAwYGBgcMCAgICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
//atob("AwQGCAgNCgMFBQYHBAUEBwgFCAgICAgICAgDAwYGBgcMCAgICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
//*/
/* Tamzen
Graphics.prototype.setFontDefault = function(scale) 
{this.setFontCustom(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8wAAAAAAAAAAAAAAAAeAAAAAAAeAAAAAAAAAAEQB/wBEAEQB/wBEAAAAAAAAAGIAkgOTgJIAjAAAAAAAwgEkASgA1gApAEkAhgAAAc4CMQIxAckABgAGABkAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAH4BgYIAQAAAAAAAAAACAEGBgH4AAAAAAAAAAAAQAFQAOAA4AFQAEAAAAAAAEAAQABAA/gAQABAAEAAAAAAAAAADIAPAAAAAAAAAAAAQABAAEAAQABAAEAAAAAAAAAAAAAMAAwAAAAAAAAAAAADAAwAMADAAwAMAAAAAAAD+AQkBEQEhAUEA/gAAAAAAAABBAIEB/wABAAEAAAAAAIEBAwEFAQkBEQDhAAAAAAECAQEBIQFhAaEBHgAAAAAAGAAoAEgAiAH/AAgAAAAAAeIBIQEhASEBIQEeAAAAAAB+AJEBEQERAREADgAAAAABAAEAAQcBGAFgAYAAAAAAAO4BEQERAREBEQDuAAAAAADgAREBEQERARIA/AAAAAAAAAAAAGMAYwAAAAAAAAAAAAAAAABjIGPAAAAAAAAAAAAQACgARACCAQEAAAAAAAAAJAAkACQAJAAkACQAAAAAAAABAQCCAEQAKAAQAAAAAAEAAgACEwIgAkABgAAAAAAA/wEAgjxCQkJCQURA/kAAAH8AiAEIAQgAiAB/AAAAAAH/AREBEQERAREA7gAAAAAAfACCAQEBAQEBAQEAAAAAAf8BAQEBAQEAggB8AAAAAAH/AREBEQERAREBAQAAAAAB/wEQARABEAEQAQAAAAAAAHwAggEBAQEBEQEfAAAAAAH/ABAAEAAQABAB/wAAAAAAAAEBAQEB/wEBAQEAAAAAAAYAAQABAAEAAQH+AAAAAAH/ABAAKABEAIIBAQAAAAAB/wABAAEAAQABAAEAAAAAAf8AgABAADAAQACAAf8AAAH/AIAAQAAgABAB/wAAAAAA/gEBAQEBAQEBAP4AAAAAAf8BEAEQARABEADgAAAAAAD+AQEBAQEBAQGA/oAAgAAB/wEQARABGAEUAOMAAAAAAMEBIQERAREBCQEGAAAAAAEAAQABAAH/AQABAAEAAAAB/gABAAEAAQABAf4AAAAAAfAADAADAAMADAHwAAAAAAH/AAEAAgAcAAIAAQH/AAABgwBEACgAEAAoAEQBgwAAAYAAQAAgAB8AIABAAYAAAAEBAQcBGQFhAYEBAQAAAAAAAAAAA//CAEIAQgBAAAAAAwAAwAAwAAwAAwAAwAAAAAIAQgBCAEP/wAAAAAAAAAAAgAEAAgABAACAAAAAAAAAQABAAEAAQABAAEAAQABAAAAABAACAAEAAIAAAAAAAAAABgBJAEkASQBKAD8AAAAAA/8AIgBBAEEAQQA+AAAAAAA+AEEAQQBBAEEAIgAAAAAAPgBBAEEAQQAiA/8AAAAAAD4ASQBJAEkASQA5AAAAAABAAEAB/wJAAkACQAAAAAAAOsBFIEUgRSB5IEDAAAAAA/8AIABAAEAAQAA/AAAAAAAAAEEAQQN/AAEAAQAAAAAAAAAAIEAgQCN/wAAAAAAAA/8ACAAYACQAQgABAAAAAAIAAgAD/gABAAEAAQAAAAAAfwBAAEAAPwBAAEAAPwAAAH8AIABAAEAAQAA/AAAAAAA+AEEAQQBBAEEAPgAAAAAAf+AiAEEAQQBBAD4AAAAAAD4AQQBBAEEAIgB/4AAAAAB/ACAAQABAAEAAIAAAAAAAIQBRAEkASQBFAEIAAAAAAEAAQAH+AEEAQQBBAAAAAAB+AAEAAQABAAIAfwAAAAAAcAAMAAMAAwAMAHAAAAAAAH4AAQABAD4AAQABAH4AAABBACIAFAAIABQAIgBBAAAAfgABIAEgASACIH/AAAAAAEMARQBJAFEAYQBBAAAAEAAQABAD74QARABEAEAAAAAAAAAAAAAH/8AAAAAAAAAABABEAEQAQ++AEAAQABAAAAGAAgACAAEAAIAAgAMAA="), 32, 8, 16 + (scale << 8) | 256);};
*/

g2.setFont("Default",3);
g3.setFontDefault();
g4.setFontDefault();

function getNextIval() {
  let d = new Date();
  return (((5 - (d.getMinutes() % 5)) *60) - d.getSeconds()) *1000;
}

/*
setWatch(()=>{debug((getTime() % 1000).toFixed(3)+" --- BUSY FREE");}, BUSY, {edge: "rising", repeat: true});
setWatch(()=>{debug((getTime() % 1000).toFixed(3)+" --- BUSY BUSY");}, BUSY, {edge: "falling", repeat: true});
//*/
function bold(s) {
  debug(getTime().toFixed(3));
  let bs = '';
  for(let c=0; c<s.length; c++) {
    bs += s.charAt(c);
    if(s.charAt(c) != ' ') bs+=String.fromCharCode(127);
  }
  debug(getTime().toFixed(3));
  return bs;

}

let gM=Graphics.createArrayBuffer(400,20,1,{msb:true});
gM.setFontDefault();
gM.setColor(-1).setBgColor(0).clear();

function msgline(msg, y) {
  ifFree({func:function(p) {
    gM.clear();
  //msg = bold(msg);
    gM.drawString(p[0], 4, 3);
    g.update(0, p[1], gM);
  }, parm: [msg,y]});
}

var GB = (msg) => {
  debug("GB!"+JSON.stringify(msg));
  function fanoush(msg) {
    if(typeof(msg.cal) === "number") {
      let idx = msg.cal - 9;
      agenda[idx] = (msg.cal)+": "+msg.txt;
      ifFree({func: updAgenda, parm: idx});
    } else if (typeof(msg.todo) === "number") {
      todos[msg.todo] = msg.txt;
      ifFree({func: updTodo, parm: msg.todo});    
    } else if (msg.motd) {
      motd = msg.motd;
      msgline(motd, 280);
    }
  }
  // filter
  if(msg.t != "notify" && msg.t != "call") return;
  if(msg.body == "undefined") return;
  // let's get pickier; ignore the annoyances
  if(msg.src === "Gmail") return;
  // {"t":"notify","id":1721228504,"src":"Messages","title":"John Vann","subject":"","body":"{motd:\"You totally win!\"}","sender":"","reply":true}
  // {"t":"notify","id":1721228509,"src":"SMS Message","title":"","subject":"","body":"{\"cal\":12,\"txt\":\"LUNCH 2\"}","sender":"John Vann","tel":"+13156008266"}
  if(msg.title == "John Vann" || msg.sender == "John Vann") {
    print("Fanoushing...");
    fanoush(JSON.parse(msg.body)); 
    return; 
  }
  print("NOT fanoush...");
  let str = "";
  if(msg.title) str = msg.title +": ";
  str += msg.body;
  //DELME=JSON.stringify(msg);
  msgline(str,280);
  //blink(5);
};
/*
function LEDon() {
  D38.set(); D11.reset();
}
function LEDoff() {
  D11.set(); D38.reset();
}
function blink(n) {
  while(n--) {
    setTimeout(LEDon, n*1000);
    setTimeout(LEDoff,n*1000 + 500);
  }
}
*/
