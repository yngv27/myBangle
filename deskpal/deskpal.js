let exports = {};
let debug = print; //()=>{}; //print;

exports.connect = (opts) => {
  var g = Graphics.createArrayBuffer(opts.width, opts.height, 1,{msb:true});
  
  function delay(ms) {
    digitalPulse(opts.delay, 0, ms);
    digitalPulse(opts.delay, 0, 0);
  }
  function cmd(c, d) {
      opts.dc.reset();
      opts.spi.write(c, opts.cs);
      if (d !== undefined) {
          opts.dc.set();
          opts.spi.write(d, opts.cs);
      }
  }
  function send(c) {
    opts.dc.reset();
    opts.spi.send(c);
    opts.dc.set();
    let val=opts.spi.send([0]);
    print(val.toString(2));
  }
  function data(d) {
    opts.dc.set();
    opts.spi.write(d, opts.cs); 
  }
  function init() { 
    debug("reset");
    if(opts.rst) 
      digitalPulse(opts.rst, 0, [50]);
  }
  function isIdle() {
    cmd(0x71);
    return(opts.busy.read());
  }
  function round1() {
    debug("round1");
    cmd(1 ,[3,0,0x2f,0x2f,0]); // trying low power for R pixel : 0xff]);
    cmd(6 ,[0x17,0x17,0x17]);
    cmd(4); //Wait for idle
  }
  function round2() {
    let LUT = new Uint8Array([0,0x8,0,0,0,2, 0,0x8,0x8,0,0,2, 0,0xa,1,0,0,1, 0,0xe,0xe,0,0,2, 0,0,0,0,0,0]);
    debug("round2");
    cmd(0 ,0x3f); //[0xf,0xd]); //0xb]);
    cmd(0x30 ,[0x3c]);
    cmd(0x61 ,[1,0x90,1,0x2c]);
    cmd(0x82 ,[0x28]);  //0x12]);
    cmd(0x50 ,[0x97]);
    //* pure evil...
    //LUT[5]=8; LUT[11]=8; LUT[17]=8; LUT[23]=8;
    //LUT[0]=0; LUT[6]=0; LUT[12]=0; LUT[18]=0;
    
    cmd(0x20 ,LUT);
    data([0,0]);
    //[0x40,0x17,0,0,0,2, 0x90,0x17,0x17,0,0,2, 0x40,0xa,1,0,0,1, 0xa0,0xe,0xe,0,0,2, 0,0,0,0,0,0,0,0]);
    LUT[0]=0x40; LUT[6]=0x90; LUT[12]=0x40; LUT[18]=0xa0;
    cmd(0x21 ,LUT); 
    cmd(0x22 ,LUT); 
    //[0x80,0x17,0,0,0,2, 0x90,0x17,0x17,0,0,2, 0x80,0xa,1,0,0,1, 0x50,0xe,0xe,0,0,2, 0,0,0,0,0,0,0,0]);
    LUT[0]=0x80; LUT[6]=0x90; LUT[12]=0x80; LUT[18]=0x50;
    cmd(0x23 ,LUT); 
    cmd(0x24 ,LUT);
    //*/
  }
  function round2a() {
    debug("round2a");
    //let LUT = 
    let Ateen0s = new Uint8Array([0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0]);
    cmd(0x00, 0x3f);		//KW-3f   KWR-2F	BWROTP 0f	BWOTP 1f
    cmd(0x30,0x3c);      	//100hz 
    cmd(0x61,[0x01,0x90,0x01,0x2c]);
    cmd(0x82,0x12);
    cmd(0X50,0x97);

    cmd(0x20 ,new Uint8Array([0,0x0A,0,0,0,1,0x60,0x14,0x14,0,0,1,0,0x14,0,0,0,1,0,0x13,0x0A,1,0,1]));
    data(Ateen0s);
    cmd(0x21 , new Uint8Array([0x40	,0x0A	,0x00	,0x00	,0x00	,0x01,
0x90	,0x14	,0x14	,0x00	,0x00	,0x01,
0x10	,0x14	,0x0A	,0x00	,0x00	,0x01,
0xA0	,0x13	,0x01	,0x00	,0x00	,0x01]));
    data(Ateen0s);
    cmd(0x22 ,new Uint8Array([0x40	,0x0A	,0x00	,0x00	,0x00	,0x01,
0x90	,0x14	,0x14	,0x00	,0x00	,0x01,
0x00	,0x14	,0x0A	,0x00	,0x00	,0x01,
0x99	,0x0C	,0x01	,0x03	,0x04	,0x01
      ]));
    data(Ateen0s);
    cmd(0x23 ,new Uint8Array([0x40	,0x0A	,0x00	,0x00	,0x00	,0x01,
0x90	,0x14	,0x14	,0x00	,0x00	,0x01,
0x00	,0x14	,0x0A	,0x00	,0x00	,0x01,
0x99	,0x0B	,0x04	,0x04	,0x01	,0x01,
      ]));
    data(Ateen0s);
    cmd(0x24 ,new Uint8Array([0x80	,0x0A	,0x00	,0x00	,0x00	,0x01,
0x90	,0x14	,0x14	,0x00	,0x00	,0x01,
0x20	,0x14	,0x0A	,0x00	,0x00	,0x01,
0x50	,0x13	,0x01	,0x00	,0x00	,0x01,
    ]));
    data(Ateen0s);
    cmd(0x25 , new Uint8Array([0x40	,0x0A	,0x00	,0x00	,0x00	,0x01,
0x90	,0x14	,0x14	,0x00	,0x00	,0x01,
0x10	,0x14	,0x0A	,0x00	,0x00	,0x01,
0xA0	,0x13	,0x01	,0x00	,0x00	,0x01]));
    data(Ateen0s);

  }
  function round2b() {
    let LUT = new Uint8Array([0x0,0x4,0x4,0,0,4]);
    let LUT2 = new Uint8Array([0x0,0xa,0,0,0,5]);
    let Ateen0s = new Uint8Array([0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0]);

    debug("round2");
    cmd(0 ,[0xbf,0xd]); //0xb]);
    cmd(0x30 ,[0x3c]);
    cmd(0x61 ,[1,0x90,1,0x2c]);
    cmd(0x82 ,[0x28]);  //0x12]);
    cmd(0x50 ,[0x97]);
    LUT[0]=0x0;
    LUT2[0]=0x0; 
    cmd(0x20 ,LUT);
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    data([0,0]);
    LUT[0]=0x60; //a0;
    LUT2[0]=0xa0; 
    cmd(0x21 ,LUT); 
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    cmd(0x22 ,LUT); 
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    LUT[0]=0x90; //50;
    LUT2[0]=0x50; 
    cmd(0x23 ,LUT); 
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
    cmd(0x24 ,LUT);
    data(LUT2);
    data(Ateen0s);
    data(Ateen0s);
  }

  function wake() {
    debug("wake");
    init();
    setTimeout(round1, 100);
    setTimeout(()=>{round2(); }, 200);
  }
  function wake2() {
    debug("wake2");
    init();
    setTimeout(round1, 100);
    setTimeout(()=>{round2a(); }, 200);
  }
  function wake2b() {
    debug("wake2b");
    init();
    setTimeout(round1, 100);
    setTimeout(()=>{round2b();}, 200);
  }

  function sleep() {
    debug("Sleep");
    cmd(0x02); // POWER_OFF
    delay(100);
    cmd(0x07, 0xa5); // DEEP_SLEEP
    //j fix this to the object!
    //setTimeout(()=>{
    g.emit("free");
    //}, 100);
  }

  g.flip = function (addr) {
    g.update(0,0,g);
  };
  
  /*
  g3=Graphics.createArrayBuffer(280, 30, 1, {msb:true});
  //g3.setColor(0).setBgColor(-1).clear();
  g3.setFontBlocky();
  for(let y=0; y<7; y++) { 
    setTimeout((y)=>{
      g.busy=false;g3.clear(); 
      g3.drawString(y,0,0);
      g.update(128,y*30,g3);
    }, (y)*2500, y);
  }

*/
  g.update = (X_start,Y_start, gfx, full) => {
    if(g.busy) return;
    g.busy = true;
    if(full) wake(); else wake2b();
    setTimeout(()=>{
      let Width = (opts.width % 8 == 0)? (opts.width / 8 ): (opts.width / 8 + 1);
      let Height = opts.height;

      X_start = (X_start % 8 == 0)? X_start: (X_start|7)+1;
      X_end = X_start + gfx.getWidth();
      Y_end = Y_start + gfx.getHeight();
      //print(`XS: ${X_start}; Xe: ${X_end}`);

      cmd(0x91);		//This command makes the display enter partial mode
      cmd(0x90,	[(X_start)/256, 
                (X_start)%256,   //x-start    
                (X_end )/256,		
                (X_end )%256-1,  //x-end
                (Y_start/256),
                (Y_start%256),   //y-start    
                (Y_end/256),		
                (Y_end%256-1),  //y-end
                0x28]); // scan the whole line, prevent shadowing?	

      cmd(0x10, gfx.buffer);
      cmd(0x13, gfx.buffer);
      cmd(0x12);		 //DISPLAY REFRESH 		             
      delay(100);
      cmd(0x92);
//      setTimeout(()=>{g.busy=false; sleep();}, 3000);
      setWatch(()=>{g.busy=false; sleep();} ,opts.busy, {edge: "rising"});
    }, 300);
  };
  g.wake=wake;
  g.delay=delay;
  g.round1=round1;
  g.round2=round2;
  g.init=init;
  g.cmd=cmd;
  g.sleep=sleep;
  return g;
};

let spi1=new SPI();
/* Dk832
spi1.setup({sck: D23, mosi: D22, baud: 2000000});
let CS=D24, RST=D26, BUSY=D0, DC=D25, DELAY=D31;
*/
//* ProMicro
spi1.setup({sck: D45, mosi: D47, baud: 2000000});
let CS=D43, RST=D9, BUSY=D2, DC=D10, DELAY=D31;
//*/
/* QY03
spi1.setup({sck: D45, mosi: D2, baud: 2000000});
DC = D44;
RST=D47;
CS = D0;
BUSY=D3;
DELAY=D40;
//*/
opts={
  spi: spi1,
  cs: CS,
  rst: RST,
  dc: DC,
  busy: BUSY,
  width: 400,
  height: 300,
  delay: DELAY,
};
g = exports.connect(opts);


g.setColor(0).setBgColor(-1).clear();
//g.setRotation(2);

let wakeupTime="2024-06-18T09:00";
function gnite(){
  g.clear();
  g.drawCircle(200,150,150);
  g.drawCircle(200,150,75);
  g.drawCircle(40,40,40);
  g.drawCircle(40,260,40).drawCircle(360,260,40).drawCircle(360,40,40);
  
  //g.drawImage(_S.read("tp1.png"),0,0);
  //g.drawImage(_S.read("tp2.png"),200,0);
  //g.drawImage(_S.read("tp3.png"),0,150);
  //g.drawImage(_S.read("tp4.png"),200,150);
  g.setFontAlign(0,0).drawString("Very much asleep...", 200, 150) ;
  g.flip();
  later = (new Date(wakeupTime).getTime()) - Math.floor((new Date().getTime()));
  if(clockIval) clearInterval(clockIval);
  setTimeout(()=>{
    status();
    clockIval = setInterval(clock, 5*60*1000);
    setTimeout(clock, 18000);
  },  later);

}
/*
function yay() {
  let min=59-(new Date()).getMinutes();
  let sec=59-(new Date()).getSeconds();
  g.clear();
  g.drawString(min+":"+('0'+sec).slice(-2),200,150).flip();
}
*/
let g2=Graphics.createArrayBuffer(104,48,1,{msb:true});
g2.setBgColor(0).setColor(-1);
lastSpot = 0;
function clock(h1,m1) {
  let h=(new Date()).getHours();
  let m = (new Date()).getMinutes();
  let delay = 500;
  g.setColor(-1).setBgColor(0);
  
  setTimeout(()=>{
    //if(h1) {h=h1; m=m1;}
    let dt=h+":"+('0'+m).slice(-2);
    let y1 = 20, y2 = 270;
    //let spot = y1+Math.floor((y2-y1)/8)*(h-9);
    let spot = y1+Math.floor((y2-y1)/8)*((h-9)+(m/60));
    if(spot < y1) spot = y1;
    if(spot > y2) spot = y2;
    //g?.fillPoly(new Uint8Array([0,8, 4,0, 50,0, 50,16, 4,16]));
    g2.setFontAlign(1,-1);
    g2.setColor(-1).setBgColor(0);
    g2.clear();
    g2.drawString(dt, g2.getWidth()-4, 6);
    //g2.drawString(dt, 30, 0);
    //g.update(Math.random()*45*8, Math.random()*250, g2);
    lastSpot = spot;
    g2.fillPoly(new Uint8Array([0,42, 6,48, 0,48  ]));
//    if(m % 15)
      g.update(400-g2.getWidth(), 0, g2);
//    else {    
//      g.drawImage(g2, 304, 0);
//      g.flip();
//    }
  }, delay, h, m);
}

let agenda = [
 "",
  "",
  "",
  "12 ",
  "13 CCB",
  "14 ",
  "15 SW Bugs & backlog",
  ""
];

let todos=[
  "_ Rework UIS Rev history",
  "_ Top 5 skills",
  "_ Jen: LEGAL page content",
  "_ Fill out VGI form for disbursement",
  "X Bottom out anonymous ID",
 ];

function today()  { return (new Date().toString().substring(0,15)); }
let motd = "I didn't catch that frequency, could you put it in the form of a spatula?";
function status() {
  g.setFontAlign(-1,-1);
  g.setColor(0).setBgColor(-1).clear();
  //g.fillRect(0,280,399,299);
  g.drawRect(0,20,120,280);
  //g.fillRect(0,0,399,20);
  g.drawString(agenda, 6, 24);
  //g.drawString(agenda, 7, 24);
  g.drawString(todos, 128, 40);
  /*
  g.setColor(-1);
  g.drawString((new Date()).toString().substring(0,15), 4,4);
  g.drawString("This would be something like your scrolling feed...", 4,280);
  g.setColor(0);
  */
  g.flip();
  setTimeout(()=>{
    msgline((new Date()).toString().substring(0,15), 0);
  }, 6000);
  setTimeout(()=>{
    msgline(motd, 280);
  }, 12000);
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

let g3 = Graphics.createArrayBuffer(280, 30, 1, {msb: true});
g3.setColor(0).setBgColor(-1);
function updTodo(i) {
  let msg = (i < todos.length)?todos[i]:"";
  let done=msg[0];
  debug(`msg: ${msg}`);
  msg = msg.substring(2);
  g3.clear();
  if(msg.length) {
    g3.drawString(msg, 20, 0);
    g3.drawRect(4,0,16,12);
    if(done == "X") { g3.drawLine(4,0,16,12); g3.drawLine(16,0,4,12);}
  }
  g.update(128, i*30+50, g3);
  debug("I got "+i);
}
function todo() {
  for(let i=0; i<7; i++) {
    ifFree({func: updTodo, parm: i});
  }
}
let g4 = Graphics.createArrayBuffer(120, 32, 1, {msb: true});
g4.setColor(0).setBgColor(-1);
function updAgenda(i) {
  let msg = agenda[i];
  let time=msg.substring(0,2);
  msg = msg.substring(3);
  g4.clear().drawString(time+": "+msg, 0, 0).drawLine(119,0,119,31);
  for(let x=0; x < 120; x+=2) g4.setPixel(x,30);
  g.update(6, i*32+24, g4);
  print("I got "+i);
}
function cal() {
  for(let i=0; i<agenda.length; i++) {
    ifFree({func: updAgenda, parm: i});
  }
}
/* Agency
Graphics.prototype.setFontBlocky=function(scale){this.setFontCustom(atob("AAAAAAAAAAD/kAAAAADwAAAA8AAAAAAAEIB/4BCAEIB/4BCAAAB4cIQQ//iCEOHgAAD8AIQw/EABgAYAGAAj8MIQA/AAAPHwihCEEIAQ5/AEEAAAAADwAAAAB4A4cMAMAAAAAMAMOHAHgAAAUAAgAPgAIABQAAAAAgACAA+AAgACAAAAAAAAOAAAAQABAAEAAQAAAAAwAAAAAABwAYAGABgA4AAAAP/wgBCAEIAQ//AAAP/wAADx8IIQhBCIEPAQAADw8IAQhBCKEPHwAAD/gACAAIAf8ACAAAD48IgQiBCIEI/wAAD/8IQQhBCEEOfwAADAAIAAh/CIAPAAAAD78IQQhBCEEPvwAAD+cIIQghCCEP/wAAAGMAAAAAAGOAAAAAAGABmAYGAAAASABIAEgASABIAAAGBgGYAGAAAA8ACAAIewiADwAAAA//CAEL+QoJCgkL+QgJD/kAAA//CEAIQAhAD/8AAA//CEEIQQhBD78AAA//CAEIAQgBDg8AAA//CAEIAQgBB/4AAA//CEEIQQhBCAEAAA//CEAIQAhACAAAAA//CAEIQQhBDn8AAA//AEAAQABAD/8AAA//AAAADwABAAEAAQ//AAAP/wCAAUACIAwfAAAP/wABAAEAAQAAD/8DAADAAwAP/wAAD/8DAADAADAP/wAAB/4IAQgBCAEH/gAAD/8IIAggCCAP4AAAB/4IAQgFCAMH/wAAD/8IIAgwCCgP5wAADw8IgQhBCCEPHwAACAAIAA//CAAIAAAAD/8AAQABAAEP/wAAD/AADAADAAwP8AAAD/AADwBwAA8P8AAADg8BsABAAbAODwAADgABgAB/AYAOAAAACAcIGQhhCYEOAQAAD//IAEgAQAAOAAGAAGAAGAAHAAAIAEgAT//AAAMADAADAAAAAAAgACAAIAAgAAwABgAAAADfAJEAkQD/AAAP/wCBAIEA/wAAAP8AgQCBAOcAAAD/AIEAgQ//AAAA/wCRAJEA8wAAAIAP/wiAAAAA/2CBIIEg/+AAD/8AgACAAP8AAAb/AAAAACb/4AAP/wAYAGYAgQAAD/8AAAD/AIAA/wCAAP8AAAD/AIAAgAD/AAAA/wCBAIEA/wAAAP/ggQCBAP8AAAD/AIEAgQD/4AAA/wCAAIAA4AAAAOcAkQCJAMcAAACAB/8AgQAAAP8AAQABAP8AAADAADwAAwA8AMAAAAD8AAcAHAAHAPwAAADnABgAGADnAAAA/gACIAIg/+AAAMcAiQCRAOMAAAAgB9+IAEgAQAAP/+AACABIAEffgCAAAAAAAAAAAAgAD/8AAAAAA="), 32, atob("AwMFCAYKBwMFBAYGAwUDBgYCBgYGBgYGBgYDAwQGBAYJBgYGBgYGBgYCBgYFBgYGBgYGBgYGBgYGBgYEBgQEBQMFBQUFBQQFBQIDBQIGBQUFBQUFBAUGBgUFBQUCBQYB"), 16+(scale << 8)+(1 << 16));};
*/
Graphics.prototype.setFontBlocky=function(scale){this.setFontCustom(atob("AAAAAAAD+QfyAAAAADgAcAAAAcADgAAAACACeAfwfwDzwD+D+AeQAQAAABwQZCH/4RCCHwAcAAAOAD4ARCD4wOcAGADABzgY+CEQA+ADgAAB3gf+CIQRiD+wOeABgAeACQAADQAcAAAAP8D/wwDEAIAAEAIwDD/wP8AAANgA4AfwA4ANgAAAAgAEAD4AfAAgAEAAAAAAAGgA4AAAEAAgAEAAgAAAAGAAwAAAAAADAB4B8A+AeADAAAAB/gf+CAQQCCAQf+B/gAACAAf+D/wAAAAAA8CPwRCCIQRCD4QOAAAAQCCIQRCCIQf+B3gAAAMADgA0AMgD/wf+AEAAAD4AfCCIQRCCIQR+AHgAAB/gf+CIQRCCIQR+AHgAACAAQACBwQ+CeAfADgAAAB3gf+CIQRCCIQf+B3gAAB4AfiCEQQiCEQf+B/gAAAxgGMAAAGNAxwAAAEABwAbAGMAggAAASACQASACQASAAAAggGMAbABwAEAAABAAYACGQRyD4AOAAAAH4B/gYGGeQn6EhQn6EeQwaDDAPwAAAP+D/wQQCCAQQD/wP+AAAf+D/wRCCIQRCD/wO8AAAP8D/wQCCAQQCDAwIEAAAf+D/wQCCAQQCD/wP8AAAf+D/wRCCIQRCAAAf+D/wRACIARAAAAP8D/wQCCAQQiDHwI+AAAf+D/wBAAIABAD/wf+AAAf+D/wAAAAgAGAAQACAAQf+D/gAAD/wf+AeAGYBhgYGCAQAAD/wf+AAQACAAQACAAAf+D/wGAAcADgAwAf+D/wAAD/wf+BgAGAAYAf+D/wAAB/gf+CAQQCCAQf+B/gAAD/wf+CIARACIAfABwAAAB/gf+CAQQCCBwf/B/oAAD/wf+CIARACIAf+B3wAABxgfOCIQRCCIQd+BngAACAAQAD/wf+CAAQAAAAf8D/wACAAQACD/wf8AAAfgD/AAeAAwAeD/AfgAAAfgD/AAeABwf0D/AAeAAwf8D/AAADAweeA/ABgA/AeeDAwAADwAfAAPwB+D4AeAAAAQeCHwRiCIQTCDwQcCAAA//H/4gBAAAYADwAHwAPgAPAAYAAEAI//H/4AAAYAPADgAwADgAPAAYAAAAAIABAAIABAAIABAAAcABgAAAAJgDeASQCSAfwB+AAAf+D/wCCAQQD+APgAAAPgD+AQQCCAQQAAAPgD+AQQCCD/wf+AAAB8AfwCSASQDyAOAAAAQAP+D/wSAAAAB8AfyCCQQSD/wf8AAD/wf+AQACAAfwB+AAAT+CfwAAAACAASf+T/gAAf+D/wAgAOAHeAxwAAD/wf+AAAD+AfwCAAfwD+AQAD+APwAAAfwD+AQACAAfwB+AAAB8AfwCCAQQD+APgAAAf+D/wQQCCAfwB8AAAB8AfwCCAQQD/wf+AAAfwD+AQACAAYABAAAABkAewCSASQDeAJgAAAQAH8A/wCCAAAD8AfwACAAQD+AfwAAAfAD8AAwAGAfgD4AAAD4AfgAGAfwD8AAwD+AfAAAAYwDuAHAA4AdwDGAAADwAfAAMAAiD/wf8AAAQwCOATQCyAcQDCAAAAwB/4fPiAEAAH/+//wAAQAj58P/AGAAAAgAMABAAMAAwACAAwAEAAAAAAAAAAAAAA"), 32, 
atob("AwQGCAgNCgMFBQYHBAUEBwgFCAcICAgICAgDAwYGBgcMCAgICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
//atob("AwQGCAgNCgMFBQYHBAUEBwgFCAgICAgICAgDAwYGBgcMCAgICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
//*/

g.setFontBlocky();

g2.setFont("Blocky",3);
g3.setFontBlocky();
g4.setFontBlocky();

function getNextIval() {
  let d = new Date();
  return (((5 - (d.getMinutes() % 5)) *60) - d.getSeconds()) *1000;
}

/*
let later = getNextIval();
let clockIval=0;

print('Will set intvl in '+later);
setTimeout(()=>{
  status();
  clockIval = setInterval(clock, 5*60*1000);
  setTimeout(clock, 18000);
},  later);
//*/
//*
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

function msgline(msg, y) {
  let gM=Graphics.createArrayBuffer(400,20,1,{msb:true});
  gM.setFontBlocky();
  gM.setColor(-1).setBgColor(0).clear();
  //msg = bold(msg);
  gM.drawString(msg, 4, 3);
  //gM.drawString(msg, 5, 3);
  g.update(0, y, gM);
}

