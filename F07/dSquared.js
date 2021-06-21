const startX=[6,43,6,43],startY=[14,14,82,82],nmX=[4,42,88,126],nmY=[12,12,12,12];let xS=1,yS=1,rotate=!1;function drawScaledPoly(l,e,o){let d=[];for(let t=0;t<l.length;t+=2){var a;d[t]=Math.floor(l[t]*xS)+e,d[t+1]=Math.floor(l[t+1]*yS)+o,rotate&&(a=d[t],d[t]=80-d[t+1],d[t+1]=a)}g.fillPoly(d,!0)}
let lcdTopSeg=Uint8Array([0,0,29,0,29,9,0,9]);
let lcdTopLeftSeg=Uint8Array([0,0,9,0,9,29,0,29]);
let    lcdTopRightSeg=Uint8Array([20,0,29,0,29,29,20,29]);
let    lcdMiddleSeg=Uint8Array([0,25,29,25,29,34,0,34]);
let    lcdBottomLeftSeg=Uint8Array([0,30,9,30,9,59,0,59]);
let    lcdBottomRightSeg=new Uint8Array([20,30,29,30,29,59,20,59]);
let    lcdBottomSeg=new Uint8Array([0,50,29,50,29,59,0,59]);
function drawDigit(t,l,e){let o=(e?nmX:startX)[t];t=(e?nmY:startY)[t];EMULATOR&&(o+=80),1!=l&&4!=l&&drawScaledPoly(lcdTopSeg,o,t),1!=l&&2!=l&&3!=l&&7!=l&&drawScaledPoly(lcdTopLeftSeg,o,t),5!=l&&6!=l&&drawScaledPoly(lcdTopRightSeg,o,t),0!=l&&1!=l&&7!=l&&drawScaledPoly(lcdMiddleSeg,o,t),0!=l&&2!=l&&6!=l&&8!=l||drawScaledPoly(lcdBottomLeftSeg,o,t),2!=l&&drawScaledPoly(lcdBottomRightSeg,o,t),1!=l&&4!=l&&7!=l&&drawScaledPoly(lcdBottomSeg,o,t);}
