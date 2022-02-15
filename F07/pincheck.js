
E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(30, false);

//eval(require("Storage").read("F07.js"));

let pins = [
  D2, D3, D6, D7, D8, D11 
  ];
 
let pinnames = 
  '  D2  D3  D6  D7  D8 D11 '
;
 
let U = 'input_pullup';
let D = 'input_pulldown';
 
function hdr() {
  let l1='', l2='', l3='';
  
  for(let p=0; p< pinnames.length; p++) {
    l1 += pinnames.charAt(p*4+1);
    l2 += pinnames.charAt(p*4+2);
    l3 += pinnames.charAt(p*4+3);
    if((p%4)==0) {
      l1 += ' ', l2 += ' ', l3+=' ';
    }
  }
  console.log(l1);
  console.log(l2);
  console.log(l3);
  scan();
}
 
function scan() {
 
  let l1 = '';
  for(let p=0; p< pins.length; p++) {
    l1 += pins[p].read() ?'1' : '0';
 
    if((p%4)==0) {
      l1 += ' ';
    }
  }
  //console.log('');
  console.log(l1);
}
let s = scan, h = hdr;
 
 
 
 