// URBANIST 18
let WRITE = true;
let offset=0;
let cnt=0;
let filename = "Urbanist18";
let filesize = 1104;
let offstr = "";
let lenstr = "";
_S = require("Storage");
let 
digit = atob("CxDE/wAA+96CEHnObWsMY+97BCH3vQhC85xxjHWthjF972lKAAAAAAAAAFg80AAArJdRQABqAABxcAFwAABLCYAAAAIQWwAAAAEmYAAAADdGAAAAA3+gAAAA4C4AAACYAIQAAApQBxUAC4AABxOOwgAAANkgAAAAAAAAAA==");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset, filesize);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("BRDE/wAA85yGMYpSDGPrWghCAAAAAAAAAAAAAAAAAAAAAAAAAAADFAAhEABBAAQQAEEABBAAQQAEEABBAAQQAEEABBAAQQYAAAAAAA==");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("CRDE/wAA+951rYIQ73sQhIpSDGN9745zBCH///e961rznAhCAAAAAACuHHAAoVrxUAxwADigEAAA5wAAAAJgAAAKEwAAAMkAAABSAAAAUaAAAFGgAABRoAAAUaAAAAu7u7vgAAAAAAAAAAAA");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("CRDE/wAAec7ve/veghCGMQhCcYwEIQxj85z3vYpSfe9ta45zAAAAAABCESQAAaZaEAmgAAvAZgAAIgAAAAqQAACHEAAALdYAAAAFNgAAAAawmAAAAwfwAAYQY4AIOQDDsd8AAAZUAAAAAAAA");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("CRDE/wAA85x5zgxjbWv73utaBCH3vRCECELve///AAAAAAAAAAAAAAAAAEMAAAA8EAAAdZEAAAGTEAADUDEAB1cDEAAZADEANQADEAghEYUQozMxgwAAADEAAAADEAAAADEAAAAAAAAAAAAA");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("ChDE/wAA85x5zoIQDGP73nGM61oEIYYxCEKOc///971ta+97AAAAAAAAgRERQABNRESgAGQAAAAA2QAAAADAAAAACcVSswADiIkVMAAAAAbwAAAACCChAAAJIDUwAAQQCygApYAA/NJZAAADqAAAAAAAAAA=");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("ChDE/wAA+973vYIQec5ta4pSda3rWgQhCELznAxj//9xjJKUAAAAAAAAAGYAAwAJGQADAAvwAAAAkZAAAAB1agAADNK3HAAB4ACRoMsAAAog9QAAAND1AAAA0KIAAAwgAuAAoZADvSRJAAADqQAAAAAAAAA=");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("ChDE/wAA85yCEAxjbWv73gQhEIT3ve97AAAAAAAAAAAAAAAAAAAAAAAhERERFCMzMzOBAAAABlYAAAABcAAAAGUgAAAAgwAAAANQAAAABWAAAABxAAAABlYAAAABcAAAAGUAAAAAUwAAAAAAAAAAAAAAAAA=");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("ChDE/wAA+955zm1rghDznBCEBCEIQu97cYx1rfe9fe+GMf//AAAAAAAAehwwAAcWeLUABWAAAoACgAAFMAtgAAGABxPotQAAPx0XAAYYADFwAXAABqBxAAAIwE1AAANQCicAjXAAb8IYAAAEjgAAAAAAAAA=");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
digit = atob("ChDE/wAA+96GMXnODGPznHGMBCEIQve9ghDvexCEilL//5KUAAAAAAAArJNXAAo/gkEgD8AACBABcAAAkg4AAACYCYAAABcNNwAMUADB/J5wAAfUXAAAAAcaAAAABUAAAABBAAAAABIAAAAAAAAAAAAAAAA=");
E.toArrayBuffer(digit)[3]=0;
if(WRITE)_S.write(filename, digit, offset);
print(`_S.read('${filename}', ${offset}, ${digit.length}); //${cnt++}`);
offstr += `${offset}, `;lenstr += `${digit.length}, `;offset += digit.length;
print(`Filesize: ${offset}`);
print(`Offsets: [${offstr}]`);
print(`Lengths: [${lenstr}]`);
/*
Urb18 = {
  xpos: 0,
  getDigit: (d,x,y) => {
    return(_S.read("Urbanist18",
      [0, 124, 200, 308, 416, 524, 640, 756, 872, 988, ][d],
      [124, 76, 108, 108, 108, 116, 116, 116, 116, 116, ][d]));
  }
}
*/
