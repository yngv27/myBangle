

let widths = [9, 6, 9, 9, 9, 9, 9, 9, 9, 9,
              3, 4, 7, 9, 7, 9, 9, 9, 9, 9,
              3, 4, 7, 9, 11,9,9,9,9,9,9,9
             ];
let height = 18;

let fontBits = [
  '.......................................................................................'+
  '.......................................................................................'+
  '...XXX.......X....XXX......XXX........X....XXXXXXX.....XXX...XXXXXXX....XXX......XXX...'+
  '..X...X.....XX...X...X....X...X.......X....X..........X............X...X...X....X...X..'+
  '.X.....X...X.X..X.....X..X.....X.....X.....X.........X.............X..X.....X..X.....X.'+
  '.X.....X..X..X..X.....X........X.....X.....X.........X.............X..X.....X..X.....X.'+
  '.X....XX.....X........X........X....X......X........X.............X...X.....X..X.....X.'+
  '.X...X.X.....X........X.......X.....X......XXXXX....X.XXX.........X....X...X...X.....X.'+
  '.X..X..X.....X.......X.....XXX.....X...X........X...XX...X........X.....XXX.....X...XX.'+
  '.X.X...X.....X......X.........X....X...X.........X..X.....X......X.....X...X.....XXX.X.'+
  '.XX....X.....X.....X...........X..X....X.........X..X.....X......X....X.....X........X.'+
  '.X.....X.....X....X............X..X....X.........X..X.....X......X....X.....X.......X..'+
  '.X.....x.....X...X.......X.....X..XXXXXXX..X.....X..X.....X.....X.....X.....X.......X..'+
  '..X...X......X..X.........X...X........X....X...X....X...X......X......X...X.......X...'+
  '...XXX.......X..XXXXXXX....XXX.........X.....XXX......XXX.......X.......XXX.....XXX....'+
  '.......................................................................................'+
  '.......................................................................................'+
  '.......................................................................................'
,

'.......................................'+
'.......................................'+
'.................................OOO...'+
'................................O...O..'+
'...............................O.....O.'+
'............O...........O......O.....O.'+
'.O...O.....O.............O...........O.'+
'.O...O....O....OOOOOOO....O.........O..'+
'.........O.................O.......O...'+
'........O...................O.....O....'+
'.........O.................O......O....'+
'..........O....OOOOOOO....O.......O....'+
'...........O.............O.............'+
'.O...O......O...........O.........O....'+
'.O...O............................O....'+
'....O..................................'+
'.......................................'+
'.......................................'
,
'....................................'+
'....................................'+
'.............O.....OOOOO......OOO...'+
'...OOO.......O.....O....O....O...O..'+
'..O...O.....O.O....O.....O..O.....O.'+
'.O.....O....O.O....O.....O..O.......'+
'.O..OO.O....O.O....O....O...O.......'+
'.O.O..OO...O...O...OOOOO....O.......'+
'.O.O...O...O...O...O....O...O.......'+
'.O.O...O...O...O...O.....O..O.......'+
'.O.O..OO...O...O...O.....O..O.......'+
'.O..OO.O..OOOOOOO..O.....O..O.......'+
'.O........O.....O..O.....O..O.....O.'+
'..O....O..O.....O..O....O....O...O..'+
'...OOOO...O.....O..OOOOO......OOO...'+
'....................................'+
'....................................'+
'....................................'

];

g.clear();
let byteBuilder = 0, bitCounter = 0;
let font = [];

for (let batch=0; batch < fontBits.length; batch++) {
  
  width = fontBits[batch].length / height;

  for (let fontBitIdx = 0; fontBitIdx <  fontBits[batch].length; fontBitIdx++) {
    let idx = Math.floor( fontBitIdx / height )  + (fontBitIdx % height) * width ;
    //console.log(Math.floor( fontBitIdx / height ) , (fontBitIdx % height) * width , fontBits[batch][idx]);
    if(fontBits[batch][idx] != '.') {
      byteBuilder++;
    }
    if(bitCounter++ >= 7) {
      //console.log('pushing ' + byteBuilder);
      font.push(byteBuilder);
      byteBuilder = 0;
      bitCounter = 0;
    } else {
      byteBuilder <<= 1;
    }
    //console.log('bitctr/bbldr = '+bitCounter +',' +byteBuilder);

  }

}
let widthStr = btoa(widths);
let fontStr = btoa(font);
console.log('let fontStr = "' + fontStr + '";');
console.log('let widthStr = "' + widthStr + '";');

let f2 = "AAAD/gECQIEIIIIIQIEgQD/gAAAAAABAACAAEAAP/4AAAAAADAYEAoIBIICIIEIEIIDwIAAAAAACAgEAQIIIIIIIIIEUQDjgAAAAAAADgAMgAwgDAgMAgAP4AAgAAAAAAPwgIQQIQIIQIIQIIIQIHgAAAAAAA/gDIQEQIIQIIQIIIQAHgAAAAAAIAAIAAIAAIA4IHAI4APAAAAAAAADjgEUQIIIIIIIIIEUQDjgAAAAAADwAEIIIEIIEIIEQEJgD+AAAAAAAAwYAAAAAAAAEAwYAAAAAAAEAAKAARAAggBAQAAAAAAARAARAARAARAARAARAARAAAAAAABAQAggARAAKAAEAAAAAAADAAEAAIAAIHYIIAEQADgAAAAAAAB/gCAQEeIEhIEhICSIB/QAAAAAAAB4AfADhAMBADhAAfAAB4AAAAAAP/4IQIIQIIQIIQIEoQDHgAAAAAAD/gEAQIAIIAIIAIEAQCAgAAA==";
let w2 = "CQYJCQkJCQkJCQMEBwkHCQkJCQkDBAcJCwkJCQkJCQk=";


//let f2 = fontStr;
//let w2 = widthStr;
/*
g.setFontCustom(E.toString(font), 48, E.toString(widths), 256 | height);
*/
g.setFontCustom(atob(f2), 48, atob(w2), 256 | height);

//g.drawString("0123456789:;<=>?@ABCDEF",20,20);
g.drawString(":A0;B1<C2=D3>E4?F5",10,40);




