g.clear();

const bgColor = '#201010';
const fgColor = '#e0e020';

let myFile = 'sample.txt';

require('m_omnigo').add(Graphics);
g.setFont('Omnigo');
//g.setFont('6x8');
let text = 'The principle is easy enough to understand. Take hydrogen atoms, add enough heat and pressure and they will fuse together to form helium. During that process some of the hydrogen mass is transformed into heat, which you can use to make electricity.\n\nNot sure if this works.';

let x = 0, y = 0;
let lines = text.split("\n");

for(let idx=0; idx < lines.length; idx++) {
  let l = lines[idx];
  cnt = 100;
  let spot = 0;
  while(l.length && cnt-- && spot >= 0) {
    spot = l.indexOf(' ');
    let word = l;
    if(spot > -1) word = l.substr(0,spot);
    console.log('i:s:w:l:'+idx+':'+spot+';'+word+';'+l+':');
    if(x + g.stringWidth(word) > 239) {
      x=0; y += g.getFontHeight();
      if(y > g.getHeight()) break;
    }
    word = word + ' ';
    g.drawString(word, x, y);
    console.log('x:y:'+x,y);
    x += g.stringWidth(word);
    l = l.substr(spot+1);
  }
  x=0; y += g.getFontHeight();
}

