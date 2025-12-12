/*
IR WORK

//pinMode(D1,"input_pullup");
var d = [];
setWatch(function(e) {
  d.push(1000*(e.time-e.lastTime));
}, D2, {edge:"both",repeat:true});

function clean() {
  d.shift(); // remove first element
  console.log(d.map(a=>a.toFixed(3)).toString());
}
//*/
const GarageLight = [
8.972,4.547,0.549,0.549,0.549,0.610,0.549,0.549,0.549,0.610,0.549,0.549,0.579,0.579,0.579,0.549,0.549,0.579,0.579,1.678,0.549,1.678,0.579,1.678,0.579,1.709,0.549,1.709,0.549,1.709,0.549,1.709,0.549,1.709,0.579,0.549,0.549,1.709,0.549,1.709,0.519,0.610,0.549,0.579,0.549,0.579,0.549,1.709,0.549,0.579,0.549,1.709,0.549,0.579,0.549,0.579,0.610,1.648,0.549,1.709,0.549,1.709,0.549,0.579,0.549,1.709,0.549,39.734,8.942,2.289,0.519,95.947,8.942,2.289,0.519
];
const GarageLightOld = [ 9.0,4.5,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.6,0.5,0.6,1.7,0.6,1.7,0.6,1.7,0.5,1.7,0.5,1.7,0.5,1.7,0.5,1.7,0.5,1.7,0.6,0.6,0.5,1.7,0.6,1.7,0.6,0.6,0.5,0.6,0.5,0.6,0.5,1.7,0.5,0.6,0.5,1.7,0.5,0.6,0.5,0.6,0.5,1.7,0.5,1.7,0.5,1.7,0.5,0.6,0.5,1.7,0.5,39.7,9.0,2.3,0.5,95.9,8.9,2.3,0.5
];
const GarageFan = [ 9.0,4.5,0.6,0.6,0.5,0.6,0.5,0.6,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.6,0.5,1.7,0.6,1.7,0.6,1.7,0.6,1.7,0.6,1.7,0.6,1.7,0.6,1.7,0.6,1.7,0.6,0.5,0.6,0.5,0.6,0.5,0.6,1.7,0.6,1.7,0.6,0.5,0.6,0.5,0.6,0.6,0.5,1.7,0.5,1.7,0.5,1.7,0.6,0.6,0.5,0.6,0.5,1.7,0.5,1.7,0.6,1.7,0.5,39.6,9.0,2.3,0.5,95.8,9.0,2.2,0.6
];
const TVpower = [ 8.9,4.5,0.5,0.5,0.5,0.6,0.5,1.7,0.5,0.6,0.5,0.6,0.5,0.6,0.5,0.5,0.6,0.5,0.5,1.7,0.5,1.7,0.5,0.6,0.5,1.7,0.5,1.7,0.5,1.7,0.5,1.7,0.5,1.7,0.5,0.5,0.5,0.6,0.5,0.5,0.5,1.7,0.5,0.6,0.5,0.6,0.5,0.5,0.5,0.6,0.5,1.7,0.5,1.7,0.5,1.6,0.5,0.6,0.5,1.7,0.5,1.6,0.5,1.7,0.5,1.6,0.6,40.1,8.9,2.3,0.6
 ]
;

ANODE=D2;
CATHODE=D9;

// ANODE
//D9.reset();

function tv() { xmit(TVpower); }
function lite() { xmit(GarageLight); }
function fan() { xmit(GarageFan); }

function xmit(code)
{
  // CATHODE
  analogWrite(ANODE,0.9,{freq:38000});

  digitalPulse(CATHODE, 1, code);
  digitalPulse(CATHODE, 1, 0);
  digitalRead(ANODE);
}
/*
setWatch(tv, BTNA, {edge: "falling", repeat: true});
setWatch(lite, BTNB, {edge: "falling", repeat: true});
setWatch(fan, BTNC, {edge: "falling", repeat: true});

//*/
var Ambi = {
  avg: 0,
  high: false,
  check: function() {
    let now = new Date();
    now = now.getHours()*100+now.getMinutes();
    //print(now);
    if(now > 1900 || now < 700) return; // not work hours
    let l = Puck.light();
    this.avg = (this.avg + l) /2;
    if(this.avg < 0.12 && this.high) {this.high = false; this.emit("low");}
    if(this.avg >= 0.12 && !this.high) {this.high = true; this.emit("high");}
  }
};
/*
Ambi.ival = setInterval(()=>{Ambi.check(); }, 999);
Ambi.on("high",()=>{Puck.IR(TVpower);});
Ambi.on("low",()=>{Puck.IR(TVpower);});
*/
setWatch(()=>{print("TV");setTimeout(()=>{Puck.IR(TVpower);}, 1000);}, BTN1, {edge: "falling", repeat: true});

