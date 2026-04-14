// inverts the font data array B<->W
function Finvert(s) {
  let Z = E.toArrayBuffer(atob(s));
  for(let i=0; i < Z.length;i++) Z[i] = Z[i]^255;
  print(btoa(Z));
}

// good for inserting 0s into width array for unused characters
function widen(s) {
  let Z = E.toUint8Array(atob(s)).slice(0);
  // preset MISSING characters from range 32-127
  let unused = "!\"#$%&'()*+,-;<=>@[\]^_`{|}~";
  for(let c=0; c< unused.length; c++) {
    let i = unused.charCodeAt(c)-32;
    if(i >= Z.length) break;
    Z.splice(i,0,0); // insert width of zero
  }
  print(btoa(Z));
}

