

let baud = 4800;

let s=Serial1;
p={};
if(NRF.getAddress() == "c8:75:6f:68:f1:7c") {
  //* DK832 bare
  p = {
    RX: D10,
    TX: D12,
    SET: D8,
  };//*/
}
else if(NRF.getAddress() == "c9:3a:60:ac:a3:96") {
  //* DK832 with pins
  p = {
    RX: D26,
    TX: D27,
    SET: D25
  };
  //*/
  }
else if(NRF.getAddress() == "e1:6b:57:49:c3:c7") {
//* QY03 bare
  p = {
    RX: D45,
    TX: D44,
    SET: D2,
  };
  //*/
}

s.setup(baud, {rx: p.RX, tx: p.TX});
p.SET.reset();


s.s = ()=>{
  s.print("AT+RX");
};
s.r = () => {
  print(s.read());
};

cnt = 0;
if(NRF.getAddress() == "c8:75:6f:68:f1:7c") {
  s.on("data", (d)=>{ s.print(d); });
} /* else {
  s.on("data", (d)=>{ print(d); });
  setInterval(()=>{
    cnt = cnt > 8 ? 0 : cnt;
    s.print(cnt++);
  }, 1500);
}//*/
