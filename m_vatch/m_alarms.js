const _Storage = require('Storage');

let logD = (msg) => { console.log(msg); };

let _Alarms = [];

exports.inAlarm = false;
exports.reload = () => {
  _List = _Storage.readJSON('v.notes.json');
  if(!_List) _List = 'No notes...';

  _Alarms =  _Storage.readJSON('v.alarms.json');
  if(!_Alarms) _Alarms = [{"msg":"9:00|PSS town hall","time":"2021-05-26T17:02:00"}];
};

function notify() {
  Bangle.buzz(200);
}

let showMsg = (title, msg) => {
  exports.inAlarm = true;
  Bangle.setLCDPower(true);
  g.setFontAlign(0,-1);
  g.setColor('#FFFF00');
  g.fillRect(18, 18, 222, 222);
  g.setColor('#202020');
  g.fillRect(20, 20, 220, 220);
  g.setColor('#FFFFFF');
  
  let y = 30;
  if(title) {
    g.drawString('___'+title+'___', 120, y);
    g.drawString('___'+title+'___', 121, y);
    y += g.getFontHeight();
  }
  let lines = msg.split("|");
  for(let l = 0; l < lines.length; l++) {
    g.drawString(lines[l], 120, y);
    y += g.getFontHeight();
  }
  if(! title) return;

  setTimeout(notify, 800);
  setTimeout(notify, 1600);
  setTimeout(notify, 2400);
  setTimeout(notify, 3200);
  setTimeout(notify, 4000);
};
exports.showMsg = showMsg;

/*
** alarms are in order, pop the top and show it
*/
let _alarmMsgs = [];
function showAlarm() {
  showMsg('ALARM', _alarmMsgs.shift());
}

let alarmTOs = [];
exports.scheduleAlarms = () => {
  for(let idx=0; idx < alarmTOs.length; idx++) {
    clearTimeout(alarmTOs[idx]);
  }
  for(let idx=0; idx < _Alarms.length; idx++) {
    logD('idx = '+idx);
    let tdiff = Date.parse(_Alarms[idx].time) - Date.now();
    let msg = _Alarms[idx].msg;
    if(tdiff > 0) {
      logD(`will alarm ${msg} in ${tdiff}`);
      alarmTOs.push(setTimeout(showAlarm, tdiff));
      _alarmMsgs.push(_Alarms[idx].msg);
    } else {
      //expired
      logD('tossing out' + idx);
    }
  }
};

exports.showNotes = () => {
  showMsg('', _List);
};
