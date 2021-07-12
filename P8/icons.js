
var img1 = {
  width : 16, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65024,41977,41976,0]),
  buffer : E.toArrayBuffer(atob("AAAEkAAAAAAkkAAAAAEkkAAAAAkkgAAAAEkkgAAAAEkkgAAAEEkkkAAAkEkkkAEgkEkkkAEkkEkkkAkkkkkkkgkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkEkkkkkkkAkkkkkkgAEkkkkkAAAkkkkgAAAEkkkAAAAAkkkAA"))
};

var img2 = {
  width : 22, height : 22, bpp : 3,
  transparent : 0,
  palette : new Uint16Array([65535,2016,41976,0]),
  buffer : E.toArrayBuffer(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAABJJAAAAAAAAJJJIAAAAAABJJJIAAAAAABJJJIAAAAAABJJJIAABJJABJJJIAAJJJIBJJJIABJJJIBJJJIABJJJIBJJJIABJJJIAJJJAABJJJIAAAAAABJJJIJJJAAABJJJIJJJAAABJJJAJJJAAABJJJAJJJAAAAAAAAAAAAAAJJJAAAAAAAAJJJAAAAAAAAJJJAAAAAAAABJJAAAAAAAA="))
};

g.setBgColor('#404040');
g.clear();
g.setColor('#FFCC00');
g.drawImage(img1, 100,100);
g.drawImage(img2, 100,140);
