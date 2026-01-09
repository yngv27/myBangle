let CAL = {
  filename: "calendar.json",
  items:[ ],
  ls: ()=>{
    for(let idx=0; idx<CAL.items.length; idx++) {
      a=CAL.items[idx];
      print(`${idx}: ${a.start}  ${a.dur}  ${a.text}`);
    }
  },
  find: (str)=>{
    return(CAL.items.findIndex((a)=>{ return (a.text.indexOf(str) >= 0); }));
  },
  add: (timeStr, dur, txt) => {
    let today = new Date().toLocalISOString().substring(0,11);
    if(timeStr.indexOf("T") < 0) { timeStr = today+timeStr;}
    CAL.items.push( { start: timeStr, dur: dur, text: txt});
    CAL.sort();
    // purge from the top
    while(CAL.items.length && CAL.items[0].start.substring(0,11) < today)
      CAL.items.shift();
  },
  save: ()=> {_S.writeJSON(CAL.filename,CAL.items);},
  load: ()=> {CAL.items = _S.readJSON(CAL.filename);},
  niceDate: (d)=>{ return d.toISOString().substring(0,10); },
  nextDay: (d)=>{ d.setTime(d.getTime()+24*60*60*1000); },
  del: (i)=>{CAL.items.splice(i,1);},
  sort: ()=>{CAL.items.sort((a,b) => { return (b.start > a.start ? -1 : b.start < a.start ? 1 : 0);});},
  isIn: (mtg) => {
    let now = getTime();
    let start = new Date(mtg.start).getTime()/1000;
    //debug(`now: ${now}, start: ${start}`);
    if (now >= start && now <= start+mtg.dur*60) { print("IN"); return true;}
    return false;
    },
};
CAL.load();
