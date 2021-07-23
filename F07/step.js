let intvl = 0;
let sstate = 0;
let scnt = 0;
let prev, curr;
g.on();
g.clear();
g.setColor(15);
require("Font6x8").add(Graphics);
g.setFont("6x8",2);
let a = () => { 
  curr = accCoords();
  if(!prev) { prev=curr; return;}
  if(curr.y > -52 || curr.y < -63) {
    if(!sstate) sstate = 1;
    //console.log('up1: v='+Math.abs(prev.y-curr.y));
  } else {
    if(sstate) {
      //console.log('reset');
      let v = Math.abs(prev.y-curr.y);
      if(v > 10) {
        scnt++;
        console.log(`STEP:${scnt} v=${v}`);
        g.drawString(scnt,0,70,true);
        g.flip();
      }
      sstate = 0;
    }
  }
  prev = curr;
};

intvl = setInterval(a,100);
