/*
** Creates / modifies optinos for m_vatch
*/
let _Options = {
    autoNightMode: true,
    useAlarms: true,
    stepManager: true,
    debug: true,
  };

let optFile = 'm_vatch.opts.json';

let opts = require("Storage").readJSON(optFile);
if( ! opts ) opts = _Options;

function pad0(n) {
  return (n > 9) ? n : ("0"+n);
}

function getNiceTime() {
  d = new Date();
  return( pad0(d.getHours())+':'+pad0(d.getMinutes()));
}

let mainMenu = [];

mainMenu['Save & Exit'] = function() {
  require("Storage").writeJSON(optFile, opts);
  Bangle.showLauncher();
};
mainMenu['Debug'] = {
    value: opts.debug,
    format : v => v?"Oui":"Non",
    onchange: v => {opts.debug = v;}
};
mainMenu['Use Alarms'] = {
    value: opts.useAlarms,
    format : v => v?"Oui":"Non",
    onchange: v => {opts.useAlarms = v;}
};
mainMenu['Use Step Manager'] = {
    value: opts.stepManager,
    format : v => v?"Oui":"Non",
    onchange: v => {opts.stepManager = v;}
};
mainMenu['Auto Night Mode'] = {
    value: opts.autoNightMode,
    format : v => v?"Oui":"Non",
    onchange: v => {opts.autoNightMode = v;}
};  
E.showMenu(mainMenu);
  