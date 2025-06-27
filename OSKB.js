/*
** In progress.. use 240x240 touchscreen for QWERTY input
** requires a touchscreen
*/
TC.on("touch", (p)=> {
    if(p.y > 108) {
      p.y-=108; p.y = Math.floor(p.y/24);
      p.x -= 12*p.y; p.x = Math.floor(p.x/24);
    print(`${p.x} : ${p.y}`);
      if(p.y >= 0 && p.y < kbd.length) {
        if(p.x >= 0 && p.x < kbd[p.y].length) {
          g.drawString(kbd[p.y][p.x], 120, 60, true);
        }
      }
    }
  });
  
  require("Font6x8").add(Graphics);
  g.setFont("6x8");
  
  let kbd= [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM",
    ",    ."
  ];
  
  
  function drawKey(key, xoff, x, y) {
    g.setFont("6x8",2).setFontAlign(0,0);
    //g.drawRect(xoff+x*24, y, xoff+x*24+23, y+23);
    g.drawString(key, xoff+x*24+12, y+12);
  }
  function drawKbd() {
    let xoff = 0;
    g.clear();
    let y = 108;
    kbd.forEach((k) => { 
      for(let c=0; c<k.length; c++) {
        drawKey(k[c], xoff, c, y);
      }
      y+= 24;
      xoff+=12;
    });
  }
  
  wOS.wake();
  drawKbd();
  