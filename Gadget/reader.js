//eval(_S.read("Omnigo.js"));
//g.setFontOmnigo();

g.busy=false;
function flip() {
  if(g.busy) g.busy=false; //setTimeout(flip, 1500);
  else {
    g.busy = true;
    g.flip();
    setTimeout(()=>{g.busy = false;}, 700);
  }
}
function sidebar() {
  /*
  d = new Date();
  d = { hr: d.getHours(), min: d.getMinutes() };
  g.setFont("Omnigo",2).setFontAlign(0,0);
  g.setRotation(1,1).setColor(0);
  g.fillRect(0,0,199,23).setColor(-1);
  g.drawString(`${d.hr}:${('0'+d.min).slice(-2)}`,100, 14);
  g.setRotation(2,1).setColor(0);
  flip();
  */
}

class Book {
  constructor() { 
    //print("CONS!");
    this.lines=[];
    this.lpp = Math.floor(g.getHeight() / g.getFontHeight()); //15;
    this.top = 0;
  }
  add(m){print(m); this.lines.push(m);}
  draw()  {
    //g.setFont("Omnigo",1);
    g.setFontAlign(-1,-1);
    let y=0; g.clearRect(0,0,g.getWidth()-1, g.getHeight()-1);
    for(let l=0; l<this.lpp; l++) {
      if(l+this.top < this.lines.length) {
        g.drawString(this.lines[l+this.top],0,y);
        y+= g.getFontHeight();
      }
    }
    flip();
  }
  pgup() {
    if(B.top > B.lpp) B.top -= (B.lpp-1); else B.top=0;
    return this;
  }
  pgdn(){
    B.top += (B.lpp-1);
    if(B.top >= B.lines.length) B.top = B.lines.length - 1;
    return this;
  }
  process(s) {
    //g.setFont("Omnigo",1);
    g.wrapString(s,g.getWidth()).forEach((l)=>{B.add(l);});
  }
}

B = new Book();

pu=()=>{B.pgup().draw();};
pd=()=>{B.pgdn().draw();};
B.lines.push("Ready...");

/*
wOS.UI.on("tap", pu);
setWatch(pd, BTN2, {repeat: true, edge: "rising"});
wOS.UI.on("longpress", ()=>{load("showMenu.js");});
sidebar();
*/
B.draw();

//setTimeout(g.setPartial, 5000);
ival2 = new Date();
ival2 = (ival2.getMinutes()*60+ival2.getSeconds()) % 150;
setTimeout(()=>{
  ival1 = setInterval(sidebar, 150*1000);
},  (150-ival2) * 1000);//2.2*60*1000);
setTimeout(()=>{g.setPartial();}, 3500);

/*
require("Font5x9Numeric7Seg").add(Graphics);
function go() {
  g.clear().setFont("5x9Numeric7Seg",8);
  g.setFontAlign(0,0);
  let d=new Date();
  g.drawString(` ${d.getHours()}:${('0'+d.getMinutes()).slice(-2)} `, 125, 61);
  g.flip();
  let min=d.getMinutes();
  if(min >= 57) setTimeout(g.init, 5000);
  if(min == 0) setTimeout(g.setPartial,5000);
}
setTimeout(go, 2000);

_tidBits= [
  "",
  "Find joy in what you're doing",
  "Take the task slowly",
  "Go to ZERO mind",
  "Breathe...",
  "Prepare for tonight's dream"
 ]
*/