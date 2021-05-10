let a = [
  { 'time': '2020-05-27T16:00:00', 'msg': "4:00PM!" }
  ];
let j = require("Storage").writeJSON('g26.alarm.json', a);
console.log(j);
let msgs = [
  "Sitepoint", "US Taxes", "Bmnt Clean"
  ];
j = require("Storage").writeJSON('g26.msgs.json', msgs);
console.log(j);