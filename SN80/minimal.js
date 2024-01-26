let lastTime = '9999';
E.stepCount = () => {};

function drawClock(d) {
  let h = d.hour;
  let m = d.min;
  let r = 115;
  g.setColor('#888888');
  for(let a=0; a<60; a++) {
    let th = a * Math.PI  / 30;
    let x = 120 + r * Math.sin(th);
    let y = 120 - r * Math.cos(th);
    //print (`x:y ${x}:${y}`);
    //g.fillCircle(x,y, (a % 5) ? 1 : 3);
    g.drawCircleAA(x,y, (a % 5) ? 2 : 4);
    if(a == m) g.setColor('#000000');
  }
  let th = h * Math.PI  / 6;
  g.setColor('#dddddd');  
  g.fillCircle( 120 + r * Math.sin(th), 120 - r * Math.cos(th), 4);
}

function clock() {
  let dt = new Date();
  let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
  if(d.hour >= 20 || d.hour < 8) {
    g.setBgColor('#000000');
    wOS.brightness(0.2);
  } else {
    g.setBgColor('#403330');
    wOS.brightness(0.8);
  }
  g.clear();
  wOS.wake();
  drawClock(d);
}

//setWatch(wOS.wake, BTN1,{ repeat:true, edge:'rising',debounce:25 });

wOS.ON_TIME=12;

ACCEL.removeAllListeners('faceup');
ACCEL.on('faceup',()=>{
  if(!wOS.awake) clock();
});

clock();
