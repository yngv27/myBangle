require("FontDylex7x13").add(Graphics);
g.setFont("Dylex7x13",2);
function logD(a){console.log(a);}
function setScale(a,b){xS=a,yS=b;}
function Poly(a,b){
  b?g.fillPoly(a,!0):g.drawPoly(a,!0)}
function drawScaledPoly(b,c,d){let a=[];for(let e=0;e<b.length;e += 2)a[e]=Math.floor(b[e]*xS)+c,a[e+1]=Math.floor(b[e+1]*yS)+d;Poly(a,!0)}function drawTopSeg(a,b){drawScaledPoly([20,36,22,34,45,34,40,42,26,42],a,b)}function drawTopLeftSeg(a,b){drawScaledPoly([18,37,25,44,25,58,20,63,17,63,17,39],a,b)}function drawTopRightSeg(a,b){drawScaledPoly([41,45,46,35,47,35,49,37,49,63,46,63,41,58],a,b)}function drawMiddleSeg(a,b){drawScaledPoly([25,61,41,61,45,65,41,69,25,69,21,65],a,b)}function drawBottomLeftSeg(a,b){drawScaledPoly([18,93,25,86,25,72,20,67,17,67,17,91],a,b)}function drawBottomRightSeg(a,b){drawScaledPoly([41,85,46,95,47,95,49,93,49,67,46,67,41,72],a,b)}function drawBottomSeg(a,b){drawScaledPoly([19,95,21,96,44,96,40,88,26,88],a,b)}

function drawSegments(b,c,a){a != 1 && a != 4 && drawTopSeg(b,c),a != 1 && a != 2 && a != 3 && a != 7 && drawTopLeftSeg(b,c),a != 5 && a != 6 && drawTopRightSeg(b,c),a != 0 && a != 1 && a != 7 && drawMiddleSeg(b,c),(a == 0 || a == 2 || a == 6 || a == 8)&& drawBottomLeftSeg(b,c),a != 2 && drawBottomRightSeg(b,c),a != 1 && a != 4 && a != 7 && drawBottomSeg(b,c);
}
function drawRoundRect(b,c,d,e,a){g.C=g.fillCircle,g.C(b+a,c+a,a),g.C(d-a,e-a,a),g.C(b+a,e-a,a),g.C(d-a,c+a,a),g.R=g.fillRect,g.R(b,c+a,d,e-a),g.R(b+a,c,d-a,e)}
const CY="#00ffff", BLK=0, WHT="#ffffff", RED="#ff0000", GRN="#00FF00", YLW="#ffff00";

function drawBkgd(b){
  g.setColor(CY),drawRoundRect(0,0,wX,wY,16),g.setColor(BLK),drawRoundRect(4,4,wX-4,wY-4,14);
  g.fillRect(0,20,wX,wY-24).setColor(GRN).fillRect(0,24,3,wY-28).fillRect(wX-3,24,wX,wY-28);
  //g.setColor(WHT),drawRoundRect(dix(.1)-4,diy(.3)-4,dix(.9)+4,diy(.75)+4,10),g.setColor(BLK),drawRoundRect(dix(.1)-3,diy(.3)-3,dix(.9)+3,diy(.75)+3,9),
    g.setColor(WHT),drawRoundRect(dix(.05),diy(.05),dix(.95),diy(.95),8);
  /*
  g.drawImage({width:109,height:34,bpp:1,buffer:require('heatshrink').decompress(atob('AH4A7n/6AQIBB/kLgP/+AMBg///EH/kDAgN8n//4ANBv//8E/AIP/8fh///BgIVB/+BAIX/j8f//8GoXV/kfvkfwH4/H9k/ggEBGgPg/Pw/kCg/P4ASBgEPwEIh+Pwf1oE+n0A/AoBvgCCFAP/8Pz+AjBIYICBg/h+BDBx+fwAcBgEfAQM+h5RB/gfBIAIKBAQOh//+gEX+fn8BABEoPgj+fR4UPz4jBIAU/yX8GYPfwH8NgMvIAMABQPvFAKaB8/HSoawB/w9B/YEBnymBIYRnB+49B5//+PwDwJDBGwP+jcAnVf/0NMQLZCAH4AsA='))},33,10);
  */
}
function drawTime(d){
  let a = {
    hour: d.getHours(),
    min: d.getMinutes(),
  };
  //logD(a);
  setScale(1.25,1.25);
  a.hour>12 && (a.hour -= 12);
  a.hour || (a.hour=12);
  a.h1=Math.floor(a.hour/10),a.h2=a.hour%10;
  a.m1=Math.floor(a.min/10),a.m2=a.min%10;
  if(a.h1 != lastH1) {
    g.setColor(bgColor);drawSegments(startX[0],startY[0],1);
    if(a.h1) 
      g.setColor(fgColor1);drawSegments(startX[0],startY[0],1);//a.h1);
    drawData(d);
  }
  if(a.h2 != lastH2) {
    g.setColor(bgColor); drawSegments(startX[1],startY[1],8);
    g.setColor(fgColor1); drawSegments(startX[1],startY[1],a.h2);
  }
  if(a.m1 != lastM1) {
    g.setColor(bgColor); drawSegments(startX[2],startY[2],8);
    g.setColor(fgColor2); drawSegments(startX[2],startY[2], a.m1);
  }
  if(a.m2 != lastM2) {
   g.setColor(bgColor); drawSegments(startX[3],startY[3],8);
    g.setColor(fgColor2);drawSegments(startX[3],startY[3],a.m2);
  }
  lastH1=a.h1,lastH2=a.h2,lastM1=a.m1,lastM2=a.m2;
}

function drawData(a) {
  //let a = Date();
  /*
  let dt = a.getFullYear()+'-'+pad0(a.getMonth()+1)+'-'+pad0(a.getDate());
  g.setColor(WHT).setBgColor(BLK).setFontAlign(0,0).drawString(`  ${dt}  `,88,160);
  let dow = a.getDay();
  let days = "SUMOTUWETHFRSA";
  g.setColor(BLK);//.drawString(days, dix(0.5), diy(0.34));
  for(let d=0; d<7; d++) {
    g.setColor(BLK);
    g.drawString(days.substring(d*2,(d+1)*2), 33+d*18, 60);
    g.drawString(days.substring(d*2,(d+1)*2), 34+d*18, 60);
    if(d != dow) g.setColor(WHT);
    g.fillRect(28+d*18, 66, 40+d*18, 68);
  }
  */
  g.setColor(fgColor1);
  
  g.fillCircle(dix(0.41), diy(0.50), 3);
  g.fillCircle(dix(0.41), diy(0.67), 3);

  g.setColor(BLK).setFontAlign(-1,0).drawString(a.toString().substring(0,4).toUpperCase()+' ',dix(0.1),diy(0.17),true);
  g.drawString((a.getHours() > 12 ? "PM " : "AM "), dix(0.1), diy(0.87),true);
  g.setColor(BLK).setFontAlign(1,0).drawString(' '+a.toString().substring(4,10).toUpperCase(),dix(0.9),diy(0.17),true);
  
}

function tick() {
  d = Date();
  s = d.getSeconds();

  setScale(0.375,0.375);
  s1=Math.floor(s/10),s2=s%10;
  g.setColor(bgColor);drawSegments(startX[4],startY[4],8);
  g.setColor(fgColor1);drawSegments(startX[4],startY[4],s1);
  g.setColor(bgColor); drawSegments(startX[5],startY[5],8);
  g.setColor(fgColor1); drawSegments(startX[5],startY[5],s2);
  if(!s) drawTime(d);
}
g.setBgColor(0),g.clear(),g.setColor(YLW);let wX=g.getWidth()-1,wY=g.getHeight()-1;let isB2=wX<200;
let dix=a => a*(g.getWidth());
let diy=a => a*(g.getHeight());
const pad0=a => a>9?a:'0'+a;

let bgColor=WHT;
let fgColor1=BLK;
let fgColor2=BLK;
g.setBgColor(WHT);
const startX=[dix(-0.225),dix(.025),dix(.32),dix(.57),   dix(0.73),dix(0.81)];
const startY=[diy(.06),diy(.06),diy(.06),diy(.06),    diy(0.73),diy(0.73)];
let xS=.5;let yS=.5;let lastH1=-1;let lastH2=-1;let lastM1=-1;let lastM2=-1;
E.setTimeZone(-4);
drawBkgd();
setInterval(tick, 1000);