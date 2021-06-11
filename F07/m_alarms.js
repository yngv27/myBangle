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
