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
  save: ()=> {_S.writeJSON(AG.filename,AG.items);},
  load: ()=> {AG.items = _S.readJSON(AG.filename);},
  niceDate: (d)=>{ return d.toISOString().substring(0,10); },
  nextDay: (d)=>{ d.setTime(d.getTime()+24*60*60*1000); },
  del: (i)=>{AG.items.splice(i,1);},
  sort: ()=>{AG.items.sort((a,b) => { return (b.start > a.start ? -1 : b.start < a.start ? 1 : 0);});},
};