
let pins = [
    D2, D3, D4, D5, D6, D7, D8, D9, D10,
    D11, D12, D13, D14, D15, D16, D17, D18, D19, D20,
    D21, D22, D23, D24, D25, D26, D27, D28, D29, D30,
    D31, D32, D33, D34, D35, D36, D37, D38, D39, D40,
    D41, D42, D43, D44, D45, D46, D47
    ];
  
  let plbl = 
    ' D2,  D3,  D4,  D5,  D6,  D7,  D8,  D9, D10, '+
    'D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, '+
    'D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, '+
    'D31, D32, D33, D34, D35, D36, D37, D38, D39, D40, '+
    'D41, D42, D43, D44, D45, D46, D47, D48            ';
  
  
let out1 = '';
let out2 = '';
let out3 = '';

function delay(ms) {
let t = Math.floor(Date().getTime())+ms;
while(t > Date().getTime()) {
    // something silly
    out3 = ' ';
}
}
  
function r() {
delay(3000);
for(let p=20; p < pins.length; p++) {
    let pin = plbl.substr(p*5,3);
    for(c=0; c<1; c++) {
    pins[p].set();
    print(`${pin} is SET`);
    delay(999);
    pins[p].reset();
    print(`${pin} is RESET`);
    delay(999);
    }
}
}

function t(p) {
    for(let c=0; c < 100; c++) {
        let pin = plbl.substr(p*5,3);
        pins[p].set();
        print(`${pin} is SET`);
        delay(999);
        pins[p].reset();
        print(`${pin} is RESET`);
        delay(999);
    }
}
  
  
    
function h() {
    out1 = '';
    out2 = '';
    out3 = '';
    for(let p=0; p < pins.length; p++) {
    if(p%4 == 0) {
        out1 += ' ';
        out2 += ' ';
        out3 += ' ';
    }
    out1 += plbl.charAt(p*5);
    out2 += plbl.charAt(p*5+1);
    out3 += plbl.charAt(p*5+2);

    }
    print (out1); print(out2); print(out3);
}

function d() {
    out1 = '';
    for(let p=0; p < pins.length; p++) {
    if(p%4 == 0) {
        out1 += ' ';
    }
    out1 += pins[p].read() ? '1' : '0';

    }
    print (out1);
}

