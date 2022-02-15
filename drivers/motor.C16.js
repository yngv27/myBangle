var VIB=D6;
function vibon(vib){
 if(vib.i>=1)VIB.write(0);else analogWrite(VIB,vib.i);
 setTimeout(viboff,vib.on,vib);
}
function viboff(vib){
 VIB.write(1);
 if (vib.c>1){vib.c--;setTimeout(vibon,vib.off,vib);}
}

vibrate=function(intensity,count,onms,offms){
 vibon({i:intensity,c:count,on:onms,off:offms});
};


Bangle.buzz = (dur,intns) => vibrate(intns,1,dur?dur:200,25);
