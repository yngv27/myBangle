function clock() {
  let dt = (new Date()).toString().match(/\d\d:\d\d/)[0];
  //dt = dt.replace(':',' ');
  if(dt[0] == '0') dt=dt.substring(1);
  g.clear().setFontAlign(0,0);
  g.setFontRationale56();
  g.drawString(dt, 64, 25);
  g.setFont("Vector",8);
  g.drawString(motd.toUpperCase(), 64, 60);
  g.flip();
}
