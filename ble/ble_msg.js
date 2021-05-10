g.clear();

function go(str) {
  g.setFont('6x8',1);
  g.setFontAlign(0,0);
  g.drawString(str, 120, 120, true);
}

function stringFromArray(data)
{
  var count = data.length;
  var str = "";

  for(var index = 0; index < count; index += 1)
    str += String.fromCharCode(data[index]);

  return str;
}

go("!");

// New code to define services
NRF.setServices({
  "feb10001-f00d-ea75-7192-abbadabadebb": {
    "feb10002-f00d-ea75-7192-abbadabadebb": {
      value : [0],
      maxLen : 18,
      writable : true,
      onWrite : function(evt) {
        g.clear();
        LED2.toggle();
        let str = stringFromArray(evt.data);
        go(str);
      }
    }
  }
}, { }); //uart : false });
// Change the name that's advertised
//NRF.setAdvertising({}, {name:"YNGV", advertise: [ 'feb10001-f00d-ea75-7192-abbadabadebb' ] });