eval(require("Storage").read("boot0"));
let stop = Date.now() + 20000;
let intvl = 0;

let sstate = 0;
let scnt = 0;
let prev, curr;
let a = () => { 
  curr = accCoords();
  if(!prev) { prev=curr; return;}
  //console.log(curr);
  if(curr.y > -52) {
    if(! sstate) {
      console.log('up1: v='+Math.abs(prev.y-curr.y));
      sstate = 1;
    }
  } else if(curr.y < -63) {
    if(! sstate) {
      console.log('up2: v='+Math.abs(prev.y-curr.y));
      sstate = 1;
    }
  } else {
    if(sstate) {
      console.log('reset');
      let v = Math.abs(prev.y-curr.y);
      if(v > 12) {
        scnt++;
        console.log(`STEP:${scnt} v=${v}`);
      }
      sstate = 0;
    }
  }
  prev = curr;
  if(Date.now() > stop) clearInterval(intvl);
};

intvl = setInterval(a,100);
