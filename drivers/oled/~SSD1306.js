I2C1.setup({scl:D11, sda:D32, bitrate:100000});
require("omnigo2.js").add(Graphics);
function go(){
 // write some text
  g.setFont("Omnigo",2);
  g.clear();
  let dt=(new Date()).toString().substring(16,24);
  g.drawString(dt,2,22);
  // write to the screen
  g.flip(); 
}
var g = require("SSD1306").connect(I2C1, go, { address: 0x3C });
setWatch(go, D2, {edge:"falling",repeat: true});
