Graphics.prototype.setFont6x8r=function(scale){this.setFontCustom(
    atob("AAAAAAB6AA4AAOAAAkH4JB+CQAAkFI/xSAwADCMwEBmIYAAMFIshMBIADgAAfiBAAgR+AACAqBwKgIAACAID4CAIAAAQGAACAIAgCAAAYAADAwMDAAAfCKJIoh8AAQj+AIABGIokiSGIABEIIkiSGwAAcCQRD+AQADkKIoiiJwAB8KIoiiBwACAIYiCQOAABsJIkiSGwABwIoiiKHwAA2AAAQ2AACAUCIQQABQFAUBQABBCIFAIAAQCAIokBgAAfiBJkpR9AABg4MgOAGAA/iSJIkhsAAfCCIIghEAA/iCIIRA4AA/iSJIggAP4kCQIAAB8IIkiSBwAD+BAED+AAgj+IIAAEAIAj8AA/gQCgRCCAA/gCAIAgAP4QAgEA/gAP4IAQAg/gAHwgiCIIfAAP4iCIIgcAAHwgiCIQewAP4kCYJQYgAGQkiSJITAAIAgD+IAgAAPwAgCAI/AAPADACAw8AAPgBgcAY+AAMYKAQCgxgAOAEAOBA4AAIYiiSKIwgAP8gQAMAMAMAMACBP8AAwMAMAAAEAQBAEACAEAAAcCIIg+AA/giCIHAABwIgiBQAAcCIIj+AAHAqCoGAACAfigAAHAiiKPwAP4IAgB4AC+AAIS+AA/gIBQIgAPwAgAD4IAeCAHgAD4IAgB4AAcCIIgcAAP4iCIHAABwIgiD+AA+BAIAABoKgqAwAAgPwIgADwAgCD4AA4AYBA4AAOAGAgBg4AAJgYBgJgADwAoCj8AAiCYKgyAAaycgA/wAJyawADAQAgBAYAAP///8="), 32, 
    atob("AwMEBQcGBgIDAwYGAwUCBQYEBgYGBgYGBgYCAwUFBQYGBgYGBgUFBgUEBQYFBgYGBgYGBgYGBgYGBgYDBQMEBQMFBQUFBQQFBQIDBQMGBQUFBQQFBAUFBgUFBQMCAwY="),
     10+(scale << 8)+(1 << 16));};
g.setFont6x8r();

let r1 = 10, r2 = 6, r3 = 20, r4 = 30;
let hrHand = [ -1,0, 0,r3, 1,0 ];
let minHand = [ 0,0, 0,r4];
let ticks = [0,-32, 0, 32];

function clock  ()  {
  g.clearRect(0,0,63,63);
  for(let a = 0; a < Math.PI; a += Math.PI/6) g.drawPoly(g.rotatePoly(ticks, a, 31, 31));
  g.setColor(0).fillCircle(32,32,28).setColor(-1);
  let dt = new Date();
  d = {hr: dt.getHours(), min: dt.getMinutes()};
  let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
  let minAngle = d.min / 30 * Math.PI;
  g.drawPoly(g.rotatePoly(minHand, minAngle, 31, 31));
  g.fillPoly(g.rotatePoly(hrHand, hrAngle, 31, 31)); 
  g.drawCircle(31,31, 2);
  g.fillRect(30,30,32,32);
  g.flip();
}

function msg(m) {
  g.clearRect(64,0,127,63);
  g.drawString(g.wrapString(m, g.getWidth()/2).join("\n"), 65, 0);
  g.flip();
}
