function battVolts(){
return 4.20/0.60*analogRead(D30);
}
function battLevel(v){
    var l=3.5,h=4.19;
    v=v?v:battVolts();
    if(v>=h)return 100;
    if(v<=l)return 0;
    return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}
E.getBattery = battLevel;

 
  
  