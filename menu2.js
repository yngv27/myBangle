g.clear();
require("FontHaxorNarrow7x17").add(Graphics);
g.setFont("HaxorNarrow7x17",2);
let menu = [
  {t:"Watch" ,a: "apw.js" },
  {t:"nothing", a: "oops.js"},
  {t:"Reader", a: "reader.js" },
];
_C = {
  selected: 0,
  BG: -1,
  FG: 0,
  lh: g.getFontHeight(),
};
function flip() {
  if(g.busy) g.busy=false; //setTimeout(flip, 1500);
  else {
    g.busy = true;
    g.flip();
    setTimeout(()=>{g.busy = false;}, 1000);
  }
}
function drawMenu() {
  for(let i=0; i<menu.length; i++) {
    if(_C.selected == i)
      g.setColor(_C.BG).setBgColor(_C.FG);
    else
      g.setColor(_C.FG).setBgColor(_C.BG);
    g.clearRect(0, _C.lh*i, g.getWidth()-1, _C.lh*(i+1));
    g.drawString(menu[i].t, 0, i*_C.lh);
  }
  flip();
}
wOS.UI.on("tap", ()=>{
  _C.selected --;
  if(_C.selected < 0) _C.selected = menu.length-1;
  drawMenu();
});
wOS.UI.on("longpress", ()=>{
  load(menu[_C.selected].a);
});
setWatch(()=>{
  _C.selected ++;
  if(_C.selected >= menu.length) _C.selected = 0;
  drawMenu();
}, BTN2, {repeat: true, edge: "rising"});
setTimeout(()=>{
  drawMenu();
  setTimeout(()=>{g.setPartial();}, 3500);
  //setTimeout(()=>{ g.flip();}, 4500);
}, 3500);
