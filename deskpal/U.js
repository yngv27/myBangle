/*
** not the best home for it
*/

if(typeof(_S)=="undefined") _S=require("Storage");
eval(_S.read("calendar.js"));
if(!CAL.items) CAL.items=[];

U = {

  nd: function (d) {return d.toISOString().substring(0,10);},
  nx: function (d) {d.setTime(d.getTime()+24*60*60*1000);},

  idx: 0,
  iv: 0,
  delay: 200,
  cmd: eval,

  set: function(dt) {
    U.dt = new Date(dt);
    U.pfx = U.nd(U.dt);
    U.iv=0;
    U.idx=0;
  },
  proc: function(dt) {

    if(U.idx >= U.data.length) {print("DONE. Now delete U!"); if(U.iv) clearTimeout(U.iv); return; }
    if(U.data[U.idx].length == 2) { U.nx(U.dt); U.pfx=U.nd(U.dt); }
    else {
      let O = U.data[U.idx].split(",");
      U.cmd(`CAL.add("${U.pfx}T${O[0]}",${O[1]},"${O[2]}")`);
    }
    U.idx++;
  },
  loop: function() { U.iv = setInterval(U.proc, U.delay); },
};


U.data = [
  "MO",
  "09:00,30,PLT stand up",
  "09:00,15,Check CRA",
  //"09:30,60,PLT 26.1.6 Sprint planning",
  "09:30,30,PatCtx Review",
  "11:00,60,PLT UX w KC",
  "13:00,60,Platform work",
  "14:30,60,UX Team Mtg",

  "TU",
  "09:00,30,PLT stand up",
  //"11:30,60,PLT Retrospective",
  "10:00,30,Training",
  "13:00,60,VS2 DLS",
  "15:00,60,Coffee n CoPilot",
  //"19:00,60,BOD Meeting", // TUE May 19

  "WE",
  "09:00,30,PLT stand up",
  "09:30,210,PI 26.2.2 Demo",
  "10:30,30,PLT UX/HF check-in",
  "14:00,30,Do-ers sync up",
  "16:00,30,UX Market",

  "TH",
  "10:00,270,Duck cleaning",
  "09:00,30,PLT stand up",
  //"14:30,30,DLS Opp thru PLT",
  "15:00,30,Open Studio",
  //"15:30,30,AIM Weekly",

  "FR",
  "09:00,30,PLT stand up",
  "09:30,30,ACE / 1 on 1",
  
];

// make it SUNDAY
U.set("2026-04-12");

// run U.loop with U.cmd set to either 'eval' or 'send'


