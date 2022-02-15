let _S = require("Storage");
eval(_S.read("lcd-g5.js"));
eval(_S.read("accel.js"));
E.setTimeZone(-5);
// Bangle up
let batLo = 0.530, batHi = 0.62;
E.getBattery = () => {
  let pct = Math.floor((analogRead(D4) - batLo) * 100 / (batHi-batLo));
  return (pct > 100) ? 100 : pct;
};
if(typeof Bangle == 'undefined') var Bangle = {};
Bangle.buzz = (dur,intns) => {
  //vibrate(intns,1,dur?dur:200,25);
};
battLevel = () => { 
  return analogRead(D4).toFixed(6);
};
g.cmd(0xfe);
g.cmd(0x39);
g.brightness(128);
ACCEL.init();


/**********************************************/

let font=atob('AAAAAAAAB/QAAcAAAHAAAAKAPgCgD4AoAAAZASQf8EkBMAAAQwUwKwC0A1AygwgAAM4JmE5BnAGQAAcAAAA4BjBAQAAQEGMA4AAAqAOAHAFQAAAQAIAfACABAAAABoA4AACABAAgAQAAAAYAMAAAHAcBwAAAP4ISERCQg/gAAIAP+AAAAAgwgoQkIiDhAAAgggISEJCDeAAAHAMgIQP+AEAAB4gkISEJCEeAAA/gkISEJCAeAABAAgYQwJgHAAAA3gkISEJCDeAAA8AhIQkISD+AAAAAMwGYAAAAAzQZwAAAAAgA4A2AxgQQAABQAoAUAKAAAIIGMBsAcAEAAAIAIAENCIA4AAAHwEEEBCchRQooXkEYDEA8AAAB4HQOIBkAOABwAAf8IiERCIg8QDwAAH8EBCAhAQgIIIAAH/CAhAQgIIED8AAD/hEQiIREICAAD/hEAiARAIAAAB/BAQgIREIiCeAAB/wCABAAgAQD/gAAAAf8AAAAABAAQAIf4AAH/AYASAQgQIACAAD/gAQAIAEACAAD/gwAGAAwBgDAD/gAA/4IADAAYACB/wAAP4ICEBCAhAQfwAAP+EICEBCAhAPAAAD+CAhAQgoQIH6AAAAB/whAQgIoESBwgAAYQSEIiEJBDAAAgAQAP+EACAAAA/wAEACABABB/wAAeAA4ADAGAMA4AAAPAAYADgOAA4BgDAGAAABgwIgDgBwBEDBgAA4ACAA+AQAwBgAAAQMIKEJCIhIQ4IAAP+EBAABwAGAA8AAEBD/gAAIAIAIAEABAAQAAAAEACABAAgAQAIAAMABAAAADgKIFECiA/AAB/wEIEECCA+AAAPgIIEECCAiAAAPgIIEEBCH/AAAPgJIEkCSA4AAAIAf4SAIAAAAfAQUIKELD/AAD/gIAIAEAB+AAC/gAAACABL/AAD/gGAEgEIACAAD/gAAP4CACAA/AgAQAH4AAD+AgAgAQAH4AAB8BBAggQQHwAAD/hCAggQQHwAAB8BBAggQgP+AAD+AgAgAAAEIFECSBGAAAQA/wEEAAB+AAgAQAQH8AABwAGAAwBgHAAABwAGAAwDgAMAYBwAAAYwCgAgAoBjAAAfgAIAFAFB/AAAQwJoFEDCAAAIA7ggIAAP+AACAg7gCAAACACABAAQAIAIAAAAAAAAAAAA==');
let widths=atob('AwIEBgYIBgIEBAUGAwUDBAYEBgYGBgYGBgYEBQYFBgYLBwcHBwcGBwcEBQcGCAcHBwcHBgYHBwkHBwcDBAMHBwMGBgYGBgUGBgIEBgIIBgYGBgQFBAYGCAYGBQQCBAc=');

Graphics.prototype.setFontOmnigo = function() {
    this.setFontCustom(font, 32, widths, 256 + 13);
};
let h = require("heatshrink");
let font2 = h.decompress(atob('ABEP8kf5AFBuEA8AEBgeAg4EBkECvEH+F/gHz4E/wf4g+QgIhCjkQskh//hiGCj4JBD4IEBkUQvlgueAhkAsEDzkMvkQxEB+EB4AjB98D/8EoUI4kf7Ec+EA4ED4EEwEAgkAhw7Cj/gv/hwFigFAgEIgMYg0f/AOBCQNsNgMD/AzBgw1CAAMCE4U+gF8OoIiCAAILBnBWBAwMQBwhCBAAMwBwaYCgEeMwMPwF4LQILBgP/g//hECiEEkEIv6mBB4JABBwMP/wkE8GPUgNCkGEoMPwR5DoCaBkIOCw4uBLoKGBwE/NQkIFgpxCDouEdAIdDJAPwBxR8E8MP4V8g/AJAcdDo5KGgF/iGCkLsCBwX8BwMMsEYSgVi4HHOQbVDBwMgXIVIgGQgMggVAggKCBwNjeYbgDbALOBw1BjmD8EDC4UH8Ef8FgsOeoV+wmFhP6iPkmFomHAUgIAB/+D/8EiEIkEQoE/+E/8DtCBwRrBwkRhAOBnZoC/8DBwMChAgCmEwkBQBDogOEFgQdBFhIoBv/g//BiECkEEOoUPDYPwoCFBoMIwcfgT5BYAP4BwMEgAiBiBKBg/+Bwp2CwEBAIMAgUAggOCOoJmB4P/wF4gOYg0YAAKJBBwodEGwRZD4DGBZ4LEBHYwdCwI+DwAOFv+B/+CgKVDBwLgBDomCQwUIDoMAjhnCDo8cj/8j/oDpf4jo7CuOB+eCkLCDjv4jI7COgSkDVYQ5D4B3BCIcCh45BFQV+HYMAg+AQYMebwMfwAOHg8H+gOBgF4gEwFgQTBgcDg+egfwS4MP4F58HAHYMD4EHAgP8gP4nwgCgEBg+Cj8EsRoBicInkQuEgMwXH/+ILYMAjEAnjVBgEPK4PAGwJ1BgU//l//AUD+EDwEMgEOC4MAgyICgAuBoCIEgEEBYNwgFgCIUmgHegMkgVIg/wg61BgP/wZ7BcYUD/EDYQRKBn+AoIODRwXgh/giFAkAdBaIJ/CFQPwhMgiVAnmAnAMCEwP4n/wpBICPYN/kGCoMEEYX8BgP/4P/wBpDWYQMBp/gz69BPYdJ/+TH4V/8H/4EIgE4gPegccBgI7BBwIFCwF/FgZ3BNYJoBeYIjCgH+UoaVELIaVJj5uCSoZZB+AMBg/Aj/AkCkCNwYsCUgRlCaoJ5BS4OQg+wUgc3wDgBUgQbC+EIDQJoBJQT8CJQIQBK4YOBgcAgyiBdosfQIKGCXgMMDoSCCjHAneAUAKmB7kDjAdCFgQqBgUgNAQMBgkwhHgidAlmAuMA4TWCQQP4vn4wB4Bg//97XBgEQgU+vigBgwXCwAvBZoMMAITrBmCRDAA4='));
let widths2 = h.decompress(atob('gcEg0IhENhUDgsFg0HgkFgkHhEFBwIAFgcDgwAChkIhIKBAwIOCAQMHBQQADEgMIhYECFgMEAoMDg8HHAMHgoCBIIICBhIGBAAYNCBIcFCQMJA=='));
Graphics.prototype.setFontBlocky = function() {
    this.setFontCustom(E.toString(font2), 32, E.toString(widths2), 256 + 15);
};

let EMULATOR = false;
// which Bangle?
const isB2 = (process.env.BOARD == 'BANGLEJS2');

const MY_HEIGHT = 70;  // in inches..  divide by 2.54 if cm
const MY_WEIGHT = 170; // in pounds.. multipley by 2.2 if kg
// calories / step == 0.57 * weight(lb) * height(in) / 126720
const MY_BURN_RATE = 0.57 * MY_WEIGHT * MY_HEIGHT / 126720;

// global coordinate system
const wX = g.getWidth();
const wY = g.getHeight();
const midX = wX/2, midY = wY/2;
// relative positioning: send 0 <= coord < 1
function relX(x) { return Math.floor(x*wX); }
function relY(y) { return Math.floor(y*wY); }

//require("knxt.fnt").add(Graphics);
//g.setFont("Omnigo",isB2 ? 1 : 2);
g.setFont("Blocky",isB2 ? 1 : 1);

const imgCalorie = {
  width : 16, height : 22, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([65504,65504,15,9]),
  buffer : require("heatshrink").decompress(atob("kmSpEAyVJAoNAAogPBAoWQgEEAoWAApMgAoIXCgAFDgIFEAQIFCEwIADiBfekBlFAgcBJoQABhJfCAAJrEgR3EAoIA=="))
};

const imgStep = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,50956,50956,0]),
  buffer : require("heatshrink").decompress(atob("AAkCpAHFgmSoAHEhMkyQXFpMkwAIEyVJkAHEC4IpFEAkSFgQgBCgYLCpILDyBBEBYIUCJogUEgEBEAIUDEBJWBJoIUBBYJWBO4xuGR5JuGECB3BR4oA="))
};

const imgPulse = {
  width : 22, height : 21, bpp : 3,
  transparent : 1,
  palette : new Uint16Array([0xf000,65535]),
  buffer : require("heatshrink").decompress(atob("kmAAQOSoEAiVJBQMBBYUAyQXGghBokAHGIIQAEyVIAwhNBJQ1JkmQC4oIBL4QXDBAIHCgQFBBAI7CggOCGQYXERIQXEHYQXEHYUJBwgCFoA="))
};

function drawBattery(x,y) {
  // x,y is top/left
  g.setColor(fgc);
  let segX = isB2 ? 2 : 3;
  let segY = isB2 ? 12 : 18;
  let yinc = segY / 4;
  let xinc = (segX + 3) * 4;
  g.drawPoly([
    x,y,
    x+xinc,y,
    x+xinc,y+yinc,
    x+xinc+segX,y+yinc,
    x+xinc+segX,y+yinc*3,
    x+xinc,y+yinc*3,
    x+xinc, y+yinc*4,
    x, y+yinc*4
    ], true);
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
  x+=segX; x+=2;
  g.fillRect(x+2, y+2, x+2+segX, y+relY(0.068)-2);
}
/*
** BEGIN WATCH FACE
*/

const startX=[14,62,120,168],startY=[60,60,60,60],nmX=[16,42,88,126],nmY=[12,12,12,12];
let xS=0.5,yS=0.5;
function setScale(t,r){xS=t;yS=r;}

let d0 = () => { 
  return {
  width : 103, height : 161, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([0,65535,31695,4258,63390,33808,32,48631,19049,65503,63422,50744,16936,8452,61309,14823]),
  buffer : require("heatshrink").decompress(atob("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"))
  };
};
let d1 = () => {
  return {
  width : 82, height : 161, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([0,65535,38066,40147,44373,12710,59164,21130,63422,2145,42260,16936,59196,32,52857,54938]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4AluUiAAVQE8NfiIADkAngyQnEiMwE7+X+IolgvhE4oofhMoE4woehtWE44oeqYnIFDuXsIolhdBE5IobhMxE5Qob2wnLFDVaE5goZy+BFEsL8InNFC8N1AnOFC0NvgnPFC1UE6AoVyXBEJVPFDMH+InKs+SFDEJoInKieQgYoXhN4E5UW2EAFDDILjkpB4IoXyWBFBVFCAQoWZBn3yAoZZBcSE4YoWhvhE5MfqASEKK1YeBLICFDUCE48YZAYoahJ7HtYRHFC0AuLILFDYXFZAwobhNhCoUcZAwobgGxCoWlMSAoSe4X3UBAobPYLIJFDkAqjIJFDoAOFH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o/FH4o2kAohwIomgHZzIACyAnhAH4A/ABg="))
  };
};
let d2 = () => {
  return  {
  width : 90, height : 161, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([0,65535,29614,63422,32,4258,33808,61309,59196,44405,2145,48631,31727,65503,63390,21130]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4AH0v//9VoAojgn23GIxGB9ADBxeSqAqehVSxsRABEe2VaFbcF/YqJAAcbkora5ArNAAMYt67XgtoFZ4ACz4sW/ArSiMTyorU03RFicRi/0QiexFagABi1QQkwAE2orQh9xFjEY+AsP/wrYAAOPLB7dVcYy1Oq52Lxe73e4wItLworMhWxIxO2/5ICgv/kwSJHwJaMhIXIjf/CY9f/KaJyAsL/pDI/RuKrItI74rKgqhHj1qTpgtIcRcGII+1exsA/AYHygTJroSGjLIMAAUPco8VCZISHyorORAT3HWRJYHFaAAByIbG+AQHhIQG2AsS1AbPq4PFjCxPWolxDgvlCA9hB4sfFaQAB+IcFiwOGhTfGzQsU1LhNh/hBwkTYZCHN6KjFDo0MHYsZFakAguBDwsgBwtZBovfFisAloeFsANFroNFwAsW1AeF2rvMM4wAQhYeF6oNFsIMEjugFi0GFgsfYIuxdworWgEPFhnhBgkZFi8AmIfEiQsFHJYATwIfEiwsLiosYyJ5KSYztGACVhD4kbqALDgQsFwosYkIfEi4sEgwsFyosY+IsKpIsFyAsrsAskpYsFkAsYqIfEjwsL+AskhOL3YAC3AsZQwsYFgkA1QAEFbEAsIsEjIsFAD+RFgorkgGBFgkcFckE6IsEj4skh4rEFk0JFleoFgu1FkktFgtgFkmRFgsgb8lxFYkX+Asj1JYFjaFk+IsFiwrjhWxFgvlWUgrFiOwFkdeFgzfkQozfkgxYGiosj+4sGzQrigqFGi9QFkUCLA0WQsf9Fg2FQscxFYsdkAsirBYGjbeqiPlFkVGFY0R+AsikIrGjNAFcMPLA+FLEVeFY0XQsUFuIsG75YirCFHsBYi2LeHLEVbLA+1FkRYHi9QFcMJLA/vFcMKyIrGjsgFkOmLA8WWMVhFg9gFcMGFY8Z0BYqzSxqjZYhhRYI3SxqjFQFkPBFg+FFcMMLFchLFUCmJYqkZYqh/RFY0XLEXxLFaxI+Ash+5YHv5YiuIrGjxYi/xYHn4rhgvhLFVYLA/vLEWxFY0TkAshrJYH6QrhgGRFg5YigxYrkIrGjtgFcMPmIsGixYi/CFHLEUFwJYq1ZYHyAsiyIrGjIrigRYHyosi/wrGjdQb1WALEWpFY0YLEUA+IsGv4rigvhFYse+AsihZYGjgrigHBFg2QQtUbLEcJLA2FFkf+FgzejguxFYsWoAsigSFrrArFiaFjgHBQowrjgvhFgu6FkcGFYseqAsjrwsFjgrjgFhFguFWUmxFYkdkAsjh5YFjaFkhKyrrAsFuosk+IsFyArjglhFgtQFkcFuIrEjCFkgpYFiQskgQsFioskhIsF6oskhAsF2oskoYsF2UiADtQFgldFgoAfkAsE+IsrlosrsIs/FjGRFlexFn4s/Fn4sfzvdAEfe+AsEgmqAEegFYgA/AH4AyA"))
  };
};
let d3 = () => {
  return {
   width : 96, height : 161, bpp : 4,
  transparent : -1,
  palette : new Uint16Array([0,65535,6371,61309,29614,2145,35953,46486,65503,48631,63422,8452,32,21130,14791,59196]),
  buffer : require("heatshrink").decompress(atob("AH4A/AEUt6lEAANN70gFssNs//iIADj/5u3cFsMM7P6FogAE1+W8AuegtPFpIADidi4Aub5dvFxoABjVrFzULsIuPMIV9F7PfFyJhCvYuXk+BF6ZhB6CNWmIuUAAMWqAvU7AuWAAOeFycERqoADj6RTtAuYAAONFyPHLzIABjBgQhlhDpU//OZ//zfphgQggbJnNk2AQCgvUtIxKjXgF53oDRE2PY8M6l4GBOSFxsLJZEWLgYAGr1PF5EXF5spC48TPBkFoYwIeJjtJ/ZHNgqSI+oWLh2BRo9Qa50E0IZHCpdZCg0aoAuOAAPqDQ0fa5UA6IUGiguQPQMxDYxKKgvxCY1gF6JgI+QSJgwSGjIuSYILbGjxCcABVxeA3ACJFhdozSLABOzDo0gCA8LXw0dFyitI8AQHhoQGyQvVgGhDwtgB48pB4sTIBAAOVw3wB4/hB4sXFy0A2IfF0oOGhg/G/YvXrIfFjwOGgTuGT5AAPggfFigOGgtqBwkYqAvXhovFiwPHgtPwK+bgEOF4sZCJPXSQUbF7JODAAMfCRXkyMRyovYhYcBF58Al1/8AvYgFxF6MAqQuZF6gAbsIv/F/6/9heRF4kZF88O+IvuFwgvwi4vnhovFjovng4vFwovnl4vFngvn2IvFyAvnsIvFoAumgsxF4uwF80GFwsZqAvmkYvFjq+u/YumhfxF4tgF81XFwsT8COtiwumhouFiOrF83qF41AF0sEmIuFj9QF8tqR1tZFw0Y6AukrvxF40WF0ktFw8RzgtigvkFxEZkAuh8l5mIuHiOSFDft7vd6lnvOf0ItIiMXqAuagXxxGIwIrJAAUYvhebhaGJAA30W7gvQi+wF9ka6oucF58aoQudF591FzwvP+i9dX6P28AvtiMWMLovQiM9F90RvYvbguRF6EaYTnkogABo1nz4wL0jydAAdb9tjF5MYsAwhgFS2nxGBEXqAwigENzAwIvgvjGAN6F48WF8gwByIwHoAwlkwvH1ovlhnaF40f8AwlhfxGA11F8sAlIvGjovmMA8fkAwm8ZgGsAvmhuBF4seF80A6IvFjIvn44vFjXgF80OYF0MsIvF+qQn8YvF1ovngwvFi9QF80C0LwtgHxMAovoeA1AF8+xF4t1F88DF4uCF88HF4sbF88NF4seF88LF4sdF90UF90WF90Z4AvnwIvumIvEj9QF80C+IvthehF4q//F7AuEF+EXF90WF5Nb2AviigPHgXkyPyF7cNF4seBw0OpILBjovbhIvFjYNF2mTTYYvbgYvL7OhBYcfYDexF4qzF+IMF8AvaoIiFvgMEsIMFyovayIiFoAMEkL8NACUFmKCLfg0ZF7MEEIsfkANEhoNFiPQF7EvEAsWBosCF4z9FdzUUTo1xHxgARgXxEAv+B43RBwsaSC6+GiNwB41ZB42SF6xPPhuBCAsXFysLmIeFj4QHhmRMA1gF6kvDozuGAAXaCIzxUgtxDo08CREHCI0YoAvS24cGiK+HUIWhCQ2GFyMN+IbGi/AChPRIY9wF6FoDQ+uChUGCg8f3i8O9IZHiNgCxUCyIVHi3sFxcC7IuIjMgDBfjC5EW8oVJh1PCxER/Z3MggYJ1NtFo9HyYVJjHgVBtBDRX5u9k7tGs+Z/WBCZMRiguNMAIcLAAOIBphDCdpYAEpQhOABukFx5gB0IuaifQF6EA6Yva/wuRgELyIuYi9QF6UAgyRXRqYAD9OBFykYuQuVgEFp4vUvvAF6zCB7IuSty8UMI3pFp+JoRdYAAnmz71L1+UkAtcMQfWvP/FguPy9k6AtfAAm+7tEAAXd7YskAH4AP"))
  };
};
let d4 = () => {
  return  {
  width : 109, height : 161, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([0,65535,23243,33808,61309,40147,59164,32,63422,6371,16904,2145,21130,44373,44405,27469]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AGXmswACt2gGt3xiIADiQ1uyg1EiMgGtsOGopsuhmBNmcJsJs0mI1FNl2YGoxsthw1GNlsCGo5sshNBNmlRNmmoGo5sszw1INlcPGpBsrhdhNmnhNmmhGpJsq2w1JNlUDGpRsphVBNmcL8Js0kI1KNlOWGpZsogovFihsthQuFj3RNlthNYulNlsxFws7qJss0w1FtO1NlkNFopkBNlkKwItEj0AgpsrhdhFouQNlsxGovwNluYFgvnBIJsrgw1FjQJBNlcPFYsV2BsshNhFYkWyBssg8xFYvwBYRsq0I1FsAKCNlW+FQsaBYZsph41FiYLDNlMJwIpEi1wNlvhMAvANlshFIvbBghso2w1FpQMENlEDFAsTBopsnhWBFAkW2BsshfhFAvANlvBGovQBopsnzAnFpIOGNk0NGosfBwxsmhgmFj2wNlkJsImEimgNlsxEwtQB45slyw1FtIPHNksNEosfCBBskhQ1FjwQINkkLsIlFyBstEgsRmBst1AkFtJHPNju+GoscCJJsjh4jFj1wNlkJsIjEimgNlkHLIsRmATKNkWhGotnCRRsigwiFjQTLNkMDGosVCZZshhOBEIkWyBst8JYF+Bst5AhF9IUMNkGWGouKChhsggYgFioVNNj8JwIgEimQNlvhEAugNlvxGovnCppsfygfFpIWONjxVGiYWVNi8MDwsWyBsshPhGwvANlsxDwvgC55sdyg1FxLwWNi0ODosfDCBschg1Fj1wNlkLsIdF0BstDgsRrYYQNjmkDgtpJ65sVzw1Fj4ZRNjcCDYsWuBsshOBGwugNlpRFiMwDTBsU0I1FtYaSNjW2DQscQ7JsTgY1Fjo1TNjMKsIZEi2gNlvhKAswNlvBDItrGqZsZyw1FjQ1UNjEDDAsdGqhsYhQ1FjGQNlkHsLyYNjfxGovp3YAUNg2nCBG3GouUC4sRxAAVDqGOGom1C4wAosA1DhWBGt0WuA2D0Jsvs5sEGt5s/Nn5s/Nn5s/NntgGocLkczADlhFQkeCBMyGoYAfgphF4ArjABVRGokSGtxsGkBs/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s/Nn5s0gY1EimgG10A3YADGl4A/AH4A4A="))
  };
};
let d5 = () => {
  return  {
  width : 97, height : 161, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([0,65535,33808,63390,40179,19049,59196,32,2145,12710,42292,65503,31695,61277,63422,10597]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A5hGIAEAvM5szAEE2+AvKgURAEPZMBchF8MWyBgutJg/MH5g/MH5g/MH4AC7JgStWqADWAMCMVIZYAcMA1QF85g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g/MH5g2yvMr+AMFF5o1mtvRjtms1q5Bgjg+F0YMFAAUT0plWMBWJpYuIAAUd0vwMD2U2IvLAAMW55gchOtFxoACtiUTMA8MmIvQiO2yBgYjOKFyIABjcoMDEmF6YABt5gXAC/cMC4AXnhguiO8MF0RiRgdi2klnMklK0wRKjhgbnXF+AUEwsqmITImpgZicpCxGJ5oVIt5gYihdFAAuECxGoMC+vDBkJsIXH4BgVjoXNAAMjU453LMBMWyAvOgHDDI0aMCkWIxgAE5YaGipgTi2AF6EA4IbGtBgSjovSGBDbLMA9QF6UA0J8GMCUgF6cPsIcFmpgRt4vTgEMPo2gMCESF6kAxTeGyASJhNEAAdC+AwVyYwFiodVebOoF88FF4seP6wARgyRv4IwFoAvnhAvFjtwGE96GAu4SNFRGAuQF88JF4scMFH2GAugeVGhF4kWMFECMAtgGFHBMF0FMAvQGFFRF4kdwBgu75goqxgFyAvnhFhGAnVMFEKSIvAGFGhF4kcF9EGMF0JYIvcMFFeF4kdqAvngqQF75goqJgF+AvnhhgF7Bgo4IvEiwvoMA1gGFGhMF32MAugF88JF4sUMFFRGAtQF8+KF4sYF88ImIvEieASFzxKhA7cgwvFjgRJwXaF7cJF4sR+ARIrUR3gwb0IvFtCOIkYMB7IvayaQOhNhBoWoF7MEF4sbqAPGxmxf5wAOgofESBOaBwtAF68PP4aQKrwOFiMgF60HeA0W+APFgwvGjwwX4IgGWQ9RB40bSSwfH94QHoIQGiOnL7kUCA8IaIwAB14uShEhDg0TwASHgsxGA9sCZAAIh7vGAANQCZECCQ8RjWQF58FPpGoChMKGBEbSZ+W2IaH74VKGBMR2X4FxePRxER8oXLwwwJj2l+AWI/NaC5MUO5n2DBMRi2s4r4EhNcowVKjSoN/QaKAANm1QAC0zrIF4hDEABOKGBgARF58AgQvugEM6Ivb2guPcAWhF7U8F6MAhHNF7NpF6T1blAvUgEFtYuVi2QF6oAB4wvUtguXAAOFeyU6rAvZewOcsIuOjspFzQxD+QxMjtJw4vdAAWM01jmIsEifWtSMbABWc4VK1WqoksFswA/AH8AA=="))
  };
};
let d6 = () => {
  return  {
 width : 92, height : 161, bpp : 4,
  transparent : -1,
  palette : new Uint16Array([0,65535,2145,31695,35953,4258,61277,25356,6371,65503,54938,32,63422,59196,63390,23275]),
  buffer : require("heatshrink").decompress(atob("AH4A/AD+PuczAAM3v+AFUUFulK00RAAnaonwFj8n1uRFYoAD5tPFbkCxQrKAAdkRzUF/QrNAAXEFzIsRLrVU8ItSiOvFisH6IsTiMZpYtUoIsUAAMd+AsSrQsWAAPn2AsQhGhFrERoQtQxQsZiMUqAsOgpaaAAOiFp26DZUW1WqolE1Wm8IRJjRcNLRUW0l4CQkL+emFxNFFpkEIxM4fBM6XJOwFpd5FhH4CpUIvQuImAWL6IVHoRyMgVBC48fCpVaCg/ffh0HsIYGjmAChMxTw77NAAWKfY/wRBORfSgADgqLGt4SJhRaYAAMjfgqIK/ItG1YsRdAx0KgWhFgsaFiQABlQZCyb4LLQybKXJZLBjriJAANaFo0wFqkAxsR1AOL+LjGkAtVhGkfhjHEAAPoFioABrY7MsItFoAtXABkDFgsWN5gAY2wtFi4skgGBFotiFsuhFoswFsrkFjuAFkkPLQsULUsEFosfFstaFouoFsv+FotAFstBFgkc+AtrjUgFkkI0ItEihalh62Fj4tlg4tF8AtllQtF0AtlxotFoAtlwItFwAtsqAtlmIsEiwtlgWhFokUkAtlsItEj6Ilgq2FjAtlhAtsh4tF1AtlggtFootlhQtFoAtsmAtlhotFuAtlgwtF+Atlxwts/gsEjWAFssxFotQFstBFooslFo0UFs2hFv4t/Frdf+c0m9/qAtkhF01ttsIQBtvd1U42AsQgQtFiYOGguE6IPEAAnqwovPhAdFi4NG/QrJAAUcp8gFpsPFotvLIt6FhgACp4tOCovYBgl6yItPj2vFpkHCovSBYcqFiCMCpYtS0DCJAB0awAtKgYtJnIsTAAOUdJQtJgiHSAAlFFqdJFiyLBqAtRggsXAAOlFpAkGFoPxFrMaFqEI8IdJ7WkolK1XRFxWiFp8KDRGUn+ADAf3pQtJigtO0tBDI+nwQZGhHzNxEcuAtN1FhDA2okCkIgGELhFoFpukCw2vFZIACxTnI2AtMAA3kLJQADnwYHRQwtMjXwFhsAga6HsotS1AsOAAN8DI0UFqMawAtQh+RDQseOootL0osQAANxDY1AFp8aqAtSkgcG7AtP5AsSgEI6IcFiYtPTQrnWaYotJikgFqggHFokDFpCZFRSORcxQtJeooAR0IeF6QtMjpqEACXxD4sYBYcHWxAsWgEtD5UPFo+YFq5PGjQtE6ItG0AtXhAfFiwLEFo/wFrDmFjlQBYULeQ0RBgYAVoIfEjJOEFo0akAtYuIhFoAtKeQgAV+LYKFo0fFrOKFqMYFrNaFpTDFFrcKFtkEFpV5Ftn8BYuYFsGrBYe+Fs+lBYcNRM4tEeIwth0QtscokDBYsfFssIBYsXFssFBYsUkAtYlQtKgVhBYkdqAtYxotKhdBBgotZ+ItKBg4tgoAMEwIMF+AtYPgsZmAMExxoLACUI0ItFwANEkgtFsAtYD4seBosPBosfFq4fGjoNGsINEigtXhQtFjQNFhaXFBowARqJ7NmKXF+AtWDwsRioOGwwOFoAsVhfRDwuiTBtoFqsHDosRmAPNimwFqlaFo2AB40CsIOEjgPHABtxFgsaqAQHoK4ahGhDgsXCJGBCAsfFqcERA3YCJDmGiyKT/gtGPBMICI2gRCXhDQse+ASIgS4GigtRrpIGDReGIA07ca8R8rKSLiGKDA0RmBCLsLLQC4vRC40a2AWLXAwVBwAVLgU5LQ+fIhlaCw8TFxUC/QVHOZ0I8IXHs4uIhH0FhEaqChN+IZI7U4CIsvpQSIiPYfh0DDRMe1Wkn/3mmqtgRJiPwFp0C0IcKiMZzINLiOXFhwABxQfMABkeuAtQgpcMABnnFiAABkgsXiy1PXIkxFq2oFiQABg9hFimUFigABwmRFiUdcSIAG/QsSpAsXgEFFyEZFjLpCwnhFhkWpGwFrQABket4IrIj3a+ArcAAf0pXRFYka0k/FcCOD//3mczm9//ArjAH4AKA="))
  };
};
let d7 = () => {
  return  {
  width : 96, height : 161, bpp : 4,
  transparent : -1,
  palette : new Uint16Array([0,65535,50712,63390,40179,6371,32,27501,21130,2145,4258,19017,23243,16904,63422,38066]),
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A0zIAkywuHuczAEtAF40hiIAlkAuFhIv/F/4v/F/4v/F/4vn6AvFgwvmiQuFAAN0ogAdJ40cF44AehOxF4s6F80AoIvF+AumhUxFwkTdwwAgg7uOAD8CF4sXF8/TF4s1F89xF4tAF00FkIuEj2wF80Ld12Ud12hF4saF8/BF4sgF87uFiPQF00Fdw2gF80Pd11jF4sdF8+BF4sqF89BF4twd08xFwkT6AvmhheFiSOnggvFi4vnqYvFmovn2IvFkAumhNBF4twF80K8IuEj2gF80MLwsSX08CF4sdF89hF4saF89xF4tGF88hF4uwF00FmIuEidQF80HLwsfsAvmgQvFni+n6YvFlQvnuIvFoAvnoIvF4AumgsxFwkTL08LLwsSF8+UF4scF8+uF4vpF8+xF4sgF88hF4uAF00GmIvF0AvmhouFiWQF80EF4scX09jF4sdF8++F4sqF8/xF4twF88hFwkT2AumhsxF4kSL08HRwsfF8+UF4vsF8/TF4swF8+BF4sgF00JoIvFuAvmgsxF4uQF84uFiS+nh4vFj4vngYvFiovnqIvFnQvnuIvFpIvnkIvF2AvnmIuEifQF00I8IvEiRenh6OFj4vngQvFjAvn6YvFkovnuIvFoAvnoIvFuAumgshFwkTqAvmhpeFiSOng4vFj4vnyQvFjovnqIvFmAvn2IvFoAvnoIvF6AvnmIvFqAumhouFiWQF80PF4sXR08CF4sdF89TF4slF89xF4vwF89BF4twF00FkIuEifQF80ILwsSR08HF4sUF8+UF4sXF89TF4s1F8+xF4sgF89xF4vwF00JkIvF6AvmgouFj1gF80NF4sSX08PF4sXF88DF4sVF8+RF4s6F8/BF4tGF88hF4vAF93QF00FmIuEiVQF80HLwsUR08EF4sXF88CF4s4F8/TF4s1F89xF4sgF8/xF4vwF00JkIvF4AvmhsxFwkTqAvnLwsSX08HF4sUF8+SF4sYF89RF4sWF90wF8/BF4tAF88hF4uAF00GmIvFqAvmhIuFjwvnhAvFiWQF80EF4sXd08CF4sdF88DF4vtF8/TF4slF89xF4vwF89BF4twF88hF4vAF00KF4sT6AvmhcxF4kSR08HRwsUF88PF4sfF88EF4vsF89SF4s6F8/RF4swF8+xF4sgF8+BF4tAF89xF4twF00KoIvFqAvmhMhFwkTR08Ag2ZAAeQF9AA/AH4Au"))
  };
};
let d8 = () => {
  return  {
  width : 91, height : 161, bpp : 4,
  transparent : -1,
  palette : new Uint16Array([0,65535,63390,2145,16904,65503,21130,63422,32,29614,61309,14823,57083,4226,59196,61277]),
  buffer : require("heatshrink").decompress(atob("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"))
  };
};
let d9 = () => {
  return {
  width : 93, height : 161, bpp : 4,
  transparent : -1,
  palette : new Uint16Array([0,65535,50744,2145,25388,29614,4258,48631,65503,23243,61277,63422,32,63390,54970,10565]),
  buffer : require("heatshrink").decompress(atob("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"))
};
 };

function drawDigit(idx,dig,n){
  let getDig = [ d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];
  let x=(n?nmX:startX)[idx];y=(n?nmY:startY)[idx];
  g.drawImage(getDig[dig](), x,y,{scale: 0.5});
}
/*
** END WATCH FACE
*/

let lastTime = '9999';
let WHITE = '#ffffff';
let BLACK = 0;
let bgc = BLACK;
let fgc = WHITE;
// set to true for some playful color blocks
let MONDRIAN = false;

// adjust coords by Bangle

xS = 1; yS = 1;
for(let i=0; i<4; i++) {
  startX[i] *= xS;
  startY[i] *= yS;
}




function drawBkgd(nm) {
  // Bangle1 and B2 if night mode
  print(`dBkgd ${nm}`);
  bgc = BLACK; fgc = WHITE; 
  if(!nm && isB2)  { bgc = WHITE; fgc = BLACK; }
  g.setBgColor(bgc);
  g.clear();
  g.drawImage(imgCalorie, relX(0.17), relY(0.68));
  g.drawImage(imgStep, relX(0.454),  relY(0.78));
  g.drawImage(imgPulse, relX(0.739),  relY(0.68));

  lastTime = '    ';
  g.flip();
}

let b2NightMode = false;

function drawClock(d, nm) {
  // ignore the watch position nightmode for B2
  if(isB2) {
    if(d.hour > 17 || d.hour < 7) { 
      if(!b2NightMode) {
        b2NightMode = true;
        drawBkgd(b2NightMode);
      }
    } else {
      if(b2NightMode) {
        b2NightMode = false;
        drawBkgd(b2NightMode);
      }
    }
  }

  // console.log("colon time");
  if(d.sec % 2 ) g.setColor(fgc); else g.setColor(bgc);
  g.fillCircle(midX+4,  relY(0.42), 3);
  g.fillCircle(midX+4,  relY(0.54), 3);
  g.flip();
  
  //console.log(d);
  d.hour %= 12;
  if (d.hour === 0) d.hour = 12;
  
  let tm=('0'+d.hour).slice(-2)+('0'+d.min).slice(-2);
  if (tm == lastTime) {
    //console.log(`no change: last time = [${lastTime}]`);
    return;
  }
  console.log("tm/last= "+tm+"/"+lastTime);

  //drawBkgd(nm);
  for(let i=0; i<4; i++) {
    console.log(`${tm[i]}:${lastTime[i]}`);
    if(tm[i] != lastTime[i]) {
      g.setColor(bgc);
      g.fillRect(
        startX[i],startY[i],startX[i]+52*xS,startY[i]+80*yS);
      g.setColor(i > 1 ? fgc : '#80ffff');
      console.log(`calling dD: ${i} ${tm[i]}`);
      drawDigit(i,tm[i], false);
      //g.flip();
    } else {
      console.log('skipping digit '+i);
    }
  }
  lastTime = tm;
  g.flip();
}

// uses constants from top; set to your own
function calcCalories(steps) {
  // calories / step == 0.57 * weight(lb) * height(in) / 126720
  return Math.floor(MY_BURN_RATE * steps);
}

function drawData(d, nm) {
  //console.log(d);
  let dy = isB2 ? 2 : 20;

  g.setColor('#ffff80');
  g.setFontAlign(1,-1);
  g.drawString(' '+E.getBattery()+'% ', wX-48, dy, true);
  g.setFontAlign(-1,-1);
  g.drawString(' '+d.dateStr+' ', 48, dy, true);


  g.setFontAlign(0,-1); // center X, top Y
  g.setColor(fgc);
  g.drawString(' '+('0000'+calcCalories(d.steps)).slice(-4)+' ', relX(0.21), relY(0.8), true);
  //g.drawString(' '+('00000'+d.steps).slice(-5)+' ', relX(0.5), relY(0.9), true);
  g.drawString(' '+d.batt+' ', relX(0.5), relY(0.9), true);
  //g.setColor(fgc);
  g.drawString(' '+('000'+d.hrm).slice(-3)+' ', relX(0.8), relY(0.8), true);
  g.setBgColor(bgc);
  
  g.flip();
}

let needData = true;

function clock() {
  //lastmin=-1;
  //drawBkgd(false);
  function drawThatClock() {
    let dt = new Date();
    let d = { hour:dt.getHours(), min: dt.getMinutes(), sec: dt.getSeconds() };
    drawClock(d, false);
    if(d.sec == 0 || needData) {
      d.dateStr = dt.toString().substr(0,10);
      d.batt = battLevel();
      d.steps = 0;
      d.hrm = 0;
      drawData(d, false);
      needData = false;
    }
  }
  drawThatClock();
  return setInterval(drawThatClock, 1000);
}

g.off = () => {g.lcd_sleep(); g.isOn = false;};

function sleep(){
  //g.clear();//g.flip();
  if(currint) clearInterval(currint);
  currint = 0;
  g.off();
  currscr=-1;
  needData = true;
  return 0;
}

//var screens=[clock,sleep];
var currscr= -1;
var currint=0;

function timeOn(){
  if (g.isOn) return;
  g.lcd_wake(); 
  g.isOn =true;
  //currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=clock();
  setTimeout(()=>{sleep();}, 9900);
}

setWatch(timeOn,BTN1,{ repeat:true, edge:'rising',debounce:25 });

ACCEL.on('faceup',()=>{
  print('FACE UP');
  timeOn();
});
setInterval(ACCEL.isFaceUp, 1300);

drawBkgd(false);
timeOn();


