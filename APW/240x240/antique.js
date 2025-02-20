_S=require("Storage");
function init() {
    const _C = {
      CYAN: "#80FFFF",
      WHITE: "#FFFFFF",
      YHT: g.getHeight(),
      XWID: g.getWidth(),
      XMID: g.getWidth() / 2,
      YMID: g.getHeight() / 2,
      fgColor: "#fff5d9",
      BKGD: "#181818",
    };
    let curMsg;

 g.setFontDefault = function () {
   this.setFontCustom(atob("AAAAAAAAAAAAAAAAAAAAAAAD/mAAAAAAADAAAAAAMAAAAAAAAAASAAEgAP/AASAA/8ABIAASAAAAAAAADggBEEAgggf/8CCCAQRACDgAAAAAAAAAAAwGASGADGAAGMAGEgGAwAAAAAAAADgBzEAjAgI4IBxkAAGAAGYAAAAAAACAADAAAAAAAAAAfwA4DgQAEAAAAAAAQAEDgOAH8AAAAAAAAAQAAkgAFQAA4AAVAAJIAAQAAAAAAAAAQAAEAABAAD+AAEAABAAAQAAAAAAAAAAQAAYAAAAAAAAAAABAAAQAAEAABAAAQAAEAABAAAAAAAAAAGAAAAAAAAAGAAGAAGAAGAAGAAGAAAAAAAAAD/gBAkAgQgIIICECASBAD/gAAAAAAABAAAgAAQAAP/4AAAAAAADAYBAKAgEgICICBCAQggDwIAAAAAAACAgBAEAgggIIICCCARRADjgAAAAAAAADgADIADCADAgDAIAA/gAAgAAAAAAAPwgCEEAhAgIQICECAghAIHgAAAAAAAA/gAyEARAgIQICECAghAAHgAAAAAAAIAACAAAgAAIA4CBwAjgAPAAAAAAAAADjgBFEAgggIIICCCARRADjgAAAAAAADwABCCAgQgIEICBEAQmAD+AAAAAAAAAwYAAAAAAAAAEAMGAAAAAAAABAAAoAARAAIIAEBAAAAAAAABEAARAAEQABEAARAAEQABEAAAAAAAAEBAAggAEQAAoAAEAAAAAAAADAABAAAgAAIHYCCAARAADgAAAAAAAAB/gAgEAR4gEhIBISAJIgB/QAAAAAAAAB4AHwAOEAMBAA4QAB8AAB4AAAAAAAP/4CECAhAgIQICECAShADHgAAAAAAAD/gBAEAgAgIAICACAQBACAgAAAAAAAP/4CACAgAgIAICACAQBAD/gAAAAAAAP/4CCCAgggIIICCCAgAgIAIAAAAAAAP/4CCAAggAIIACCAAgAAIAAAAAAAAAD/gBAEAgAgIAICBCAQRACH4AAAAAAAP/4ACAAAgAAIAACAAAgAP/4AAAAAAAIAID/+AgAgAAAAAAAACAAAQAACAAAgAAIAAEA/+AAAAAAAA//gAIAAFAACIABBAAgIAwBgAAAAAAA//gAAIAACAAAgAAIAACAAAgAAAAAAA//gDAAAMAAAwAAwAAwAA//gAAAAAAA//gDAAAMAAAwAADAAAMA//gAAAAAAAP+AEAQCACAgAgIAIBAEAP+AAAAAAAA//gIEACBAAgQAIEABCAAPAAAAAAAAAP+AEAQCACAgAgIAoBAEAP+gAAAAAAA//gIEACBAAgQAIGABCYAPBgAAAAAAAOCAEQQCCCAgggIIIBBEAIOAAAAAAAAgAAIAACAAA//gIAACAAAgAAAAAAAAA/+AAAQAACAAAgAAIAAEA/+AAAAAAAA8AAA8AAA4AABgADgAPAA8AAAAAAAAA+AAAeAAAeAB4APgAAHgAAHgAeAD4AAAAAAAADAGAMGAA2AACAADYADBgDAGAAAAAAADAAAMAAAwAAD+ADAADAADAAAAAAAAACAeAgIgIEICCCAhAgIgIDwCAAAAAAAH//BAAQQAEAAAAAAAMAAAwAADAAAMAAAwAADAAAAAAABAAQQAEH//AAAAAAAAQAAIAAEAACAAAQAACAAAQAAAAAAAAAACAAAgAAIAACAAAgAAIAACAAAAAAADAAAIAAAAAAAAAAGAASQAJCACQgAkIAJEAB/gAAAAAAA//gAQQAICACAgAgIAEEAA+AAAAAAAAA+AAQQAICACAgAgIAICABBAAAAAAAAA+AAQQAICACAgAgIAEEA//gAAAAAAAA+AASQAIiACIgAiIAEiAA5AAAAAAAACAAAgAB/+AiAAIgACAAAAAAAAAAD4QBBCAgIgICICAiAQRAP/gAAAAAAD/+ABAAAgAAIAACAAAQAAD+AAAAAAAAIAAb/gAAAAAAAAAIAABAAAQb/4AAAAAAA//gACAAAgAAUAAIgAEEACAgAAAAAAAgAAP/wAACAAAgAAAAAAAD/gAgAAIAAB/gAgAAIAAB/gAAAAAAAD/gAQAAIAACAAAgAAEAAA/gAAAAAAAA+AAQQAICACAgAgIAEEAA+AAAAAAAAD/8AQQAICACAgAgIAEEAA+AAAAAAAAA+AAQQAICACAgAgIAEEAD/8AAAAAAAD/gAIAAEAACAAAgAAIAABAAAAAAAAABxAAiIAIiACIgAiIAIiABHAAAAAAAACAAAgAA/8ACAgAgIAACAAAAAAAAP4AABAAAIAACAAAgAAQAP+AAAAAAAAOAAAYAABgAAGAAGAAGAAOAAAAAAAAAPwAADgADAAHAAAMAAA4APwAAAAAAAAMGAAiAAFAAAgAAUAAIgAMGAAAAAAAAOAQAYEABmAAGAAGAAGAAOAAAAAAAAAIGACCgAhIAIiACQgAoIAMCAAAAAAAACAA/fgQAEAAAAAAAAAAD/+AAAAAAAAAABAAQP34ACAAAAAAAAAgAAQAAEAAAgAAEAABAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="), 32, atob("BgMFCQkJCQQFBQkJBAkDCQoGCQkJCQkJCQkDBAcJBwkJCQkJCQkJCQkFCQkJCQkJCQkJCQkJCQkJCQkFCAUJCQQJCQkJCQgJCQQGCQYJCQkJCQkJCAkJCQkJCQUFBQk="), 256 + 20);

  };

  
    g.setFont("Default");
  let pRad = Math.PI / 180;
    //if(!_C) let _C = {};
  let rotatePoly = (pArr, angle, xoff, yoff) => {
    let newArr = [];
    let a = angle;// * pRad;
    for(let i=0; i<pArr.length ; i+= 2) {
      newArr[i] = xoff + Math.cos(a)*pArr[i] + Math.sin(a)*pArr[i+1];
      newArr[i+1] = yoff + Math.sin(a)*pArr[i] - Math.cos(a)*pArr[i+1];
    }
    return newArr;
  };
  let r1 = 2, r2 = 1, r3 = 63, r4 = 100;
  let hrHand = [ -1,r1, 0-r1,r1*2, 0,r3, r1,r1*2, 1,r1 ];
  let minHand = [ -1,r1, 0-r2,r2+r1, 0,r4, r2,r2+r1, 1,r1];

  let start = () => {
    g.setBgColor(_C.BKGD);
    //g.clear();
    let img = _S.read("WF3.png");
    if (img) g.drawImage(img, -2, -2);
  };
  
  let drawClock = (d) => {
    //g.setColor(_C.BKGD).fillCircle(120, 120, 90);
    start();
      //let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
      //let minAngle = d.min / 30 * Math.PI;
      //g.drawImage(_S.read("minHand.png"), _C.XMID, _C.YMID, { rotate: minAngle });
      //g.drawImage(_S.read("hourHand.png"), _C.XMID, _C.YMID, { rotate: hrAngle });
    let hrAngle = (d.hr * 60 + d.min) * Math.PI / 360;
    let minAngle = d.min / 30 * Math.PI;
    //g.setColor(0);
    //g.fillPolyAA(rotatePoly(minHand, minAngle, 120, 122));
    //g.fillPolyAA(rotatePoly(hrHand, hrAngle, 120, 122)); 
    g.setColor( _C.fgColor);
    g.fillPolyAA(rotatePoly(minHand, minAngle, 120, 119));
    g.fillPolyAA(rotatePoly(hrHand, hrAngle, 120, 119)); 

    hcoords = rotatePoly([0,r3-20], hrAngle, 120, 120);
    mcoords = rotatePoly([0,r4-20], minAngle, 120, 120);
    //print(hcoords);
    //print(mcoords);
    g.setColor(_C.BKGD);
    g.fillCircle(hcoords[0],hcoords[1],4);
    g.fillCircle(mcoords[0],mcoords[1],4);
    g.fillCircle(120,120,7);
       g.setColor( _C.fgColor);
    g.drawCircleAA(hcoords[0],hcoords[1],4);
    g.drawCircleAA(mcoords[0],mcoords[1],4);
    g.drawCircleAA(120,120,8);
  };
  
  let drawData = (d) => {
    // STATUS

    g.setFontAlign(0, -1).setColor(_C.fgColor);
    let batt = E.getBattery(); //process.env.VERSION; //battInfo();
    for (let x = 0; x < 5; x++) {
      if (batt < x * 20) g.setColor("#d6825e");
      //g.fillRect(24-x*4,  165- x * 7, 35-x*5, 170-x * 7 );
    }
    //g.clearRect(30, 133, 100, 146);
    let dow = d.niceDate.substring(0,3);
    let dt = d.niceDate.substring(7);
    g.setColor( _C.fgColor).setFontAlign(1, 0);
    //g.drawString(` ${dow} `, _C.XWID-12, 150, true);
    g.drawString(` ${dt} `, _C.XWID-28, 120, true);
    
    if(curMsg) {
      //showMsg(this.curMsg);
      g.setColor("#80A080").setFontAlign(0,0);
      g.drawString(g.wrapString(curMsg.text, 120).join("\n"), _C.XMID, _C.YMID);
      setTimeout(()=>{curMsg="";}, 5000);
    } else {
      //debug("WHOPS");
    }
  };

  let showMsg = (msgobj) => {
    curMsg = msgobj;
    //debug(curMsg);
  };

  return {
    start: start,
    drawClock: drawClock,
    drawData: drawData,
    showMsg: showMsg,
  };
}
  exports = init();
  const _C = {
    CYAN: "#80FFFF",
    WHITE: "#FFFFFF",
    YHT: g.getHeight(),
    XWID: 130,
    XMID: 130 / 2,
    YMID: g.getHeight() / 2,
  };
if(process.env.BOARD != "EMSCRIPTEN") {
  wOS.BKL.reset();
}
//debug=print;
exports.start();
let dt = { hr: 7, min: 17, niceDate: "Sun Jul 12" };
exports.drawClock(dt);
exports.drawData(dt);
exports.showMsg({title:"Title", text:"This would be message 1"});