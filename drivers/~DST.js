function getTZOff() {
    let dt=Date();
    let m = dt.getMonth(), d=dt.getDate(), dow=dt.getDay();
    if(m<2 || m>10) return(-5);
    if(m>2 && m<10) return(-4);
    if(m == 2) {
      if(d-dow > 7) return(-4);
      return(-5);
    } else if (m == 10) {
      if(d-dow > 0) return(-5);
      return(-4);
    }
     return(-1);
  }