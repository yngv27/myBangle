/*
** BASIC GadgetBridge handler
*/
/*/GB = (msg) => {
  // filter
  if(msg.t != "notify" && msg.t != "call") return;
  // let's get pickier; ignore the annoyances
  if(msg.src === "Gmail") return;
  //if(msg.src === "Google") { saveInfo(msg); return; }
  
  //allMsgs.push(msg);
  showAlarm(`${msg.title} | ${msg.body}`);
  
};
*/
