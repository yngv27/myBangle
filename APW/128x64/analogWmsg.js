Graphics.prototype.setFont6x8r=function(scale){this.setFontCustom(
    atob("AAAAAAB6AA4AAOAAAkH4JB+CQAAkFI/xSAwADCMwEBmIYAAMFIshMBIADgAAfiBAAgR+AACAqBwKgIAACAID4CAIAAAQGAACAIAgCAAAYAADAwMDAAAfCKJIoh8AAQj+AIABGIokiSGIABEIIkiSGwAAcCQRD+AQADkKIoiiJwAB8KIoiiBwACAIYiCQOAABsJIkiSGwABwIoiiKHwAA2AAAQ2AACAUCIQQABQFAUBQABBCIFAIAAQCAIokBgAAfiBJkpR9AABg4MgOAGAA/iSJIkhsAAfCCIIghEAA/iCIIRA4AA/iSJIggAP4kCQIAAB8IIkiSBwAD+BAED+AAgj+IIAAEAIAj8AA/gQCgRCCAA/gCAIAgAP4QAgEA/gAP4IAQAg/gAHwgiCIIfAAP4iCIIgcAAHwgiCIQewAP4kCYJQYgAGQkiSJITAAIAgD+IAgAAPwAgCAI/AAPADACAw8AAPgBgcAY+AAMYKAQCgxgAOAEAOBA4AAIYiiSKIwgAP8gQAMAMAMAMACBP8AAwMAMAAAEAQBAEACAEAAAcCIIg+AA/giCIHAABwIgiBQAAcCIIj+AAHAqCoGAACAfigAAHAiiKPwAP4IAgB4AC+AAIS+AA/gIBQIgAPwAgAD4IAeCAHgAD4IAgB4AAcCIIgcAAP4iCIHAABwIgiD+AA+BAIAABoKgqAwAAgPwIgADwAgCD4AA4AYBA4AAOAGAgBg4AAJgYBgJgADwAoCj8AAiCYKgyAAaycgA/wAJyawADAQAgBAYAAP///8="), 32, 
    atob("AwMEBQcGBgIDAwYGAwUCBQYEBgYGBgYGBgYCAwUFBQYGBgYGBgUFBgUEBQYFBgYGBgYGBgYGBgYGBgYDBQMEBQMFBQUFBQQFBQIDBQMGBQUFBQQFBAUFBgUFBQMCAwY="),
     10+(scale << 8)+(1 << 16));};
g.setFont6x8r();

Clock = {
  r1: 10, r2: 6, r3: 20, r4: 30,
  ticks: [0,-32, 0, 32],
  x0: 64,
  msgAreaX0: 0,
};
Clock.hrHand = [ -1,0, 0, Clock.r3, 1,0 ];
Clock.minHand = [ 0,0, 0, Clock.r4];

Clock.update = ()=>  {
  let _C=Clock;
  g.clearRect(_C.x0,0,_C.x0+63,63);
  for(let a = 0; a < Math.PI; a += Math.PI/6) g.drawPoly(g.rotatePoly(_C.ticks, a, _C.x0+31, 31));
  g.setColor(0).fillCircle(_C.x0+32,32,28).setColor(-1);
  let dt = new Date(new Date().getTime()+75000);
  d = {hr: dt.getHours(), min: dt.getMinutes()};
  let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
  let minAngle = d.min / 30 * Math.PI;
  g.drawPoly(g.rotatePoly(_C.minHand, minAngle, _C.x0+31, 31));
  g.fillPoly(g.rotatePoly(_C.hrHand, hrAngle, _C.x0+31, 31)); 
  g.drawCircle(_C.x0+31,31, 2);
  g.fillRect(_C.x0+30,30,_C.x0+32,32);
  g.flip();
};

Clock.msg = function msg(m) {
  let _C=Clock;
  g.clearRect(_C.msgAreaX0,0,_C.msgAreaX0+63,63);
  g.drawString(g.wrapString(m, g.getWidth()/2).join("\n"), _C.msgAreaX0+1, 0);
  g.flip();
};

