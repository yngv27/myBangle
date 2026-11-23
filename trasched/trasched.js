function trash() {
  let dates = _S.readJSON("trasched.json");
  if(!dates) {
    return(null);
  } 
  let dt = new Date().getTime();
  let idx=0;
  let fdt = 0;
  let days = 0;
  //while( true) {
  for(idx=0; idx<dates.length; idx++) {
    fdt = new Date(dates[idx].dt).getTime();
    days = Math.ceil((fdt-dt)/86400000);
    if(days >= 0) break;
  }
  if(idx >= dates.length) return ({msg:"Update me!", stuff:""});
  let rval;
  if(days < 0) {
    rval = "Update me!";
  } else if(days == 0) {
    rval = "TO-DAY!";
  } else if(days == 1) {
    rval = "Tomorrow";
  } else {
    rval = days+" days";
  }
  return({msg:rval, stuff: dates[idx].stuff});

}