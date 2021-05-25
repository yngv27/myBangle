let alarmFile = 'yngv27.alarms.json';
let listFile = 'yngv27.list.json';

let _Alarms =  [
  ];

let humanData = [
'04-13 09:15;12 PM|IFU Review',

'04-13 13:00;Solar thingie',

'04-13 11:45;12 PM|IFU Review',
'04-13 13:50;2 PM|SAG Bi-weekly',
'04-13 14:50;3 PM|UIS Review',

'04-14 13:50;2 PM|SCRM Asset Details|PSS group',
'04-14 15:50;4PM|UX Market',

'04-16 09:45;10AM|1 on 1',
'04-16 12:50;1PM|UX Market',
'04-16 13:50;2 PM|SAG Bi-weekly',


'04-22 13:55;2 PM|DLS',

];

/* LIST */
let humanList = "Normally where you|would put your|shopping stuff";

for(let idx=0; idx < humanData.length; idx++) {
	let dx = humanData[idx].split(';');
  // don't forget the 'T'!
  let t = dx[0].replace(' ','T');
	let ax = {};
	ax.time = '2021-'+t+':00';
	ax.msg = dx[1];
  _Alarms.push(ax);
	console.log('a='+JSON.stringify(ax));
}


require('Storage').writeJSON(alarmFile, _Alarms);
require('Storage').writeJSON(alarmFile, _Alarms);
// This causes massive hangovers!

//setTimeout(Bangle.showLauncher, 3000);


/*
function toHexString(byteArray) {
  var s = '';
  for(let i=0; i< 100; i++) {
    let byte = byteArray.charCodeAt(i);
    //console.log(Number(byte).toString());
    s += ('0000000' + (byte & 0xFF).toString(2)).slice(-8) + ' ';
  }
  return s;
}
*/
