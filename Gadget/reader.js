/* simple EPD page-turner
**
*/
class Book {
    constructor() { 
      //print("CONS!");
      this.lines=[];
      this.lpp = 20;
      this.top = 0;
    }
    add(m){this.lines.push(m);}
    draw()  {
      let y=0; g.clear();
      for(let l=0; l<this.lpp; l++) {
        if(l+this.top < this.lines.length) {
          g.drawString(this.lines[l+this.top],6,y);
          y+= g.getFontHeight();
        }
      }
      g.flip();
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
      g.wrapString(s,122).forEach((l)=>{B.add(l);});
    }
  }
  
  B = new Book();
  
  pu=()=>{B.pgup().draw();};
  pd=()=>{B.pgdn().draw();};
  