
let pad2=(s)=>{return ('0'+s).slice(-2);};
eval(_S.read("6x8s.js"));

class Timer {
  constructor(h,m,s) {
    this.secs = ((h*60)+m*60)+s;
    this.ival = 0;
    g.init();
    setTimeout(()=>{g.flip();}, 500);
    g.setRotation(1,1);
    g.setFont("6x8s",6).setFontAlign(0,0);
    g.midx = g.getWidth()/2;
    g.midy = g.getHeight()/2;
    setTimeout(()=>{g.setPartial();}, 2500);
  }
  start() {
    this.tick();
    this.ival = setInterval(()=>{this.tick();}, 2000);
  }
  tick ()  {
    //print(this.secs);
    let h = Math.floor(this.secs / 3600);
    let m = pad2(Math.floor( (this.secs % 3600) / 60));
    let s = pad2(this.secs % 60);
    // print(`${h}:${m}:${s}`);
    g.clear().drawString(`${h}:${m}:${s}`,g.midx, g.midy).flip();
    this.secs -= 2;
    if(this.secs < 0) {
      this.stop();
      g.init(); 
      setTimeout(()=>{
        g.flip();
        setTimeout(()=>{g.setPartial();}, 2500);
      }, 250);
    }
  }
  stop () {
    clearInterval(this.ival);
    this.ival = 0;
  }
}

//t=new Timer(0,0,30);

