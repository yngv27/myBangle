  // MANAGE EVENTS
  let btnSrc = D28; // normally BTN1

  let BUTTON = {
    lastUp: 0,
    longpressTO: 0,
    tapTO: 0,
    longTime: 1000,
    tapTime: 250,
    dbltap: false,
    watchUp: false,
    // switch if BTN is not inverted
    upOpts: { repeat:false, edge:'falling', debounce:25},
    dnOpts: { repeat:false, edge:'rising', debounce:25},
  };
    
  const btnDown = (b) => {
    //longpress = b.time;
    if(BUTTON.tapTO) {
      clearTimeout(BUTTON.tapTO);
      BUTTON.tapTO = 0;
      BUTTON.dbltap = true;
    }
    BUTTON.longpressTO = setTimeout(function(){
      // long press behaviour
      //BUTTON.emit('longpress');
      wOS.UI.emit('longpress');
      BUTTON.longpressTO = 0;
      // ignore button up
      BUTTON.watchUp = false;
    }, BUTTON.longTime);
    //logD(`lpto=${BUTTON.longpressTO}`);
    BUTTON.watchUp = true;
    setWatch(btnUp, btnSrc, BUTTON.upOpts);
  };
  
  const btnUp = (b) => {
    if(BUTTON.longpressTO) {
      clearTimeout(BUTTON.longpressTO);
      BUTTON.longpressTO = 0;
    } 
    if(BUTTON.dbltap) {
      //BUTTON.emit('dbltap');
      wOS.UI.emit('dbltap');
      BUTTON.dbltap = false;
    } else if (BUTTON.watchUp) {
      BUTTON.tapTO = setTimeout(function(){
        // long press behaviour
        //BUTTON.emit('tap');
        wOS.UI.emit('tap');
        BUTTON.tapTO = 0;
        BUTTON.dbltap = false;
      }, BUTTON.tapTime);
      //logD(`lpto=${BUTTON.tapTO}`);
    }
    BUTTON.lastUp = b.time;
    setWatch(btnDown, btnSrc, BUTTON.downOpts);
  };
  
  setWatch(btnDown, btnSrc, BUTTON.downOpts);