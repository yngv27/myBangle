const rotatePoly = (pArr, angle, x0,  y0) => {
  let newArr = [];
  const a = Math.PI + angle; // * Math.PI / 180;;
  for(let i=0; i<pArr.length ; i+= 2) {
    newArr[i] = x0 + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1];
    newArr[i+1] = y0 + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1];
  }
  return newArr;
};

function getTicks() {
  return {
  width : 120, height : 119, bpp : 4,
  transparent : -1,
  palette : new Uint16Array([0,44077,6306,56722,4193,35723,58835,23111,31497,29417,52496,48303,20998,2113,12612,14692]),
  buffer : require("heatshrink").decompress(atob("AH4A3g1mAgUMyA75g9wBQcNHekJ4AKDgMgHecF8AKDoJ30gpxE8o716AKDu4QEh2QHdvVBQmOAoj7FHdMoBQlSAokBX4g7lmwEClIJDgVQCAj1qgczAgXndBWcHd3/BIcM+C5Kg65jHZMJFwkOXIshHccK0YJHgvQPolwBgmZWccK1QJHo4FEhBwFXIo7oAAsoAokPyAFDuK4eHZ/MX4vgAoc2so8dHZ/yAon4AgcJs1mHbsL3YVTz4EDkdmsKzdHakEwAFDq1mmQ7yg7uDgSyByA7ypFAAgUBs1qHTohBiIUSpwEDu1ms4MEQYY7qAAmzm1QAwcMiQ7xhMzmcgA4chAogAtlUznAHEq46xgFa0eyWQmAHWMC1Wq4AHDkqyygOq1YGDglfWWXK1WuAwcHPggAtgkb3ToE/AOFktAHdUH3e7dAcEygNEhtXO9cr3e3AwcO8ANEhNwHdeb3cdBpV4HVcPiMb4ANJhldHdcFiMRBpXFfQYAogWRiSEKwg6rHgSyKlFAHdoAKgmCHXA7B8AIGz5D57NdHXENrJ25ktwevNcO3XwHXEOwR25/EgHfP0HXIA/AAcC4A75+NwHXHXiSx5q/QHfH1dvPXwix5xg64gEpkA75ho65AA8P2T1521hHW8Ew1ms3wHe1zHQNmyA61+I6C3461kszHQOnHWtJ0czm05oA60h+6HYMxkA60h1a1WqmPwHWkNze6HYNwdmtx3e71WUHWvljY7BqQ61gGBiO7jwLH7kUHdshiMXBQ/XivgHdsMi/QBI3nBJAAnhprHlNcHV4AI/GeHO4AB4Q65AH4A/AH4A/AGUnqQ53h3FjPgHW0sqt+HO0E5GMOm8AgXyHO4A/AH4A/AH4A/AH4As73gHO8vysVuA40gnsytZ4R027F/9rx/AH4A/AH4A/AH4A/AH4A/AC/S995qo514+FquJvnyHevipq3/AH4A/AH4A/AEERje73Wq1Uzm1mAAQ72mY76O+gAMA="))
};
}

let prevTime;

function drawTime() {
  let dt = new Date();
  let thisTime = `${dt.getHours}:${dt.getMinutes}`;
  if(prevTime == thisTime) return;
  prevTime = thisTime;
  let hrAngle = (dt.getHours() * 60 + dt.getMinutes()) * Math.PI / 360;
  let minAngle = dt.getMinutes()  / 30 * Math.PI;
  let centerX = 120, centerY = 120;

  g.setColor(0);
  g.fillCircle(120,120,85);
  g.setColor('#D8AF8F');
  
  g.fillPolyAA(rotatePoly([
    -4, -4, -4, -55, 0, -60, 4, -55, 4, -4
    ], hrAngle, centerX, centerY), true);

  g.fillPolyAA(rotatePoly([
    -3, -4, -3, -80, 0, -85, 3, -80, 3, -4
    ], minAngle, centerX, centerY), true);

  g.setColor('#8C6541');
  g.fillCircle(120,120,8);
  g.setColor(0);
  g.drawCircleAA(120,120,8);
  
}

g.clear();
g.drawImage(getTicks(), 180, 60, {rotate: 0});
g.drawImage(getTicks(), 179, 180, {rotate: Math.PI / 2});
g.drawImage(getTicks(), 59, 179, {rotate: Math.PI});
g.drawImage(getTicks(), 59, 60, {rotate: Math.PI * 3 / 2});

E.stepCount = () => {};

  
ACCEL.removeAllListeners('faceup');
ACCEL.on('faceup',()=>{
//print("Wakey");
let a = ACCEL.read();
if(a.x < -200 && a.x > -500 && a.y < 200 && a.y > -700 && a.z > 0) {
  wOS.wake();
  drawTime();
}
});

setTimeout(drawTime, 1000);
