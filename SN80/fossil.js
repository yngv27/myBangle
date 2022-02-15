function getMin() {
    return  {
    width : 18, height : 240, bpp : 8,
    transparent : 254,
    buffer : require("heatshrink").decompress(atob("/wA/AH4A/AH4A/AF2AvQQOq1PAAIQMwNVq1Vp9WGZlV0ulCQI0MvWr1d6p+ACBN6quB5/PwFPqoiKq2lCIOrGxdVvQQBCII2BQJF6EQY2MK4QRD0qUBGhGACInQGwOBGhgkCUg5XBEQgRCNo4RIP4MrCIp0BCI9WCP4RpYwJH0WaBHRLMj7jqtPEaARGqojQCKVWCAoRBp4jaI7JrII5CPaI6AjRCJGldKIRjqoRPI6JZkI6AjTdLIjQCKVWCAoRBp4jaI7JrII5CPaI6AjRp5Hip9VEaBZRCJFWlY1HEZARHEcYRH0oRQEbUrCInQAIIjIlbGB0mA0oBBAQNPCI4SBAAwJBCI4SBAYQAECJAAHlQR0I8Zr/R+TmIeIQRF1YQJ0oRF/1WCI9WCAxJJCBARjNgUqNRf+qp9Pp6PKHAlVCBgSDCBzZBIhQAGCMZGOCO5+BCJ73JERASOCAbHClQABCBgABvQSCCglWCAwnEDwNV1gPKAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A//wA="))
  };
  }
  
  function getHr() {
    return  {
    width : 18, height : 240, bpp : 8,
    transparent : 254,
    buffer : require("heatshrink").decompress(atob("/wA/AH4A/AH4A/AH4A/AH4A/AH4A/AFGAvQQOq1Pp9VCBmBqtWCYNWGZlV0ulqtPGhl61ervVPwAQJvVVwPP5+AJJZEB0oRB1Y2Lqt6CAIRBGwKBIvQiDGxhXCCIelQAI0IwARE6A2BwI0MEgSkHK4IiECIRtHCJB/BlYRFOgIRHqwR/CNLGBI+iziLMj7jqtPEaARGqojQCKVWCAoRBp4jaI7JrII5CPaI6AjRp5Hip9VWZ41BLKARIq0rGo4jICI4jjCI+lCKAjalYRE6ABBEZErYwOkwGlAIICBp4RHCQIAGBIIRHCQQECAAYRIAA8qCOhHjNf6Pyco7xDCIurCBOlCIv+qwRHqwQGJJIQICMZsClRqL/1VPp9PR5Q4EqoQMCQYQObIJEKAAwRjIxwR3PwIRPe5IiICRwQDY4UqAAIQMAAN6CQQUEqwQGE4geBqoOKAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AAI="))
    };
    
  }
  
  function getTics() {
    return {
   width : 21, height : 240, bpp : 8,
    transparent : 254,
    buffer : require("heatshrink").decompress(atob("lYAUp9WAB1PCodVCiUqlYUTlRADp4ABqoyGKggqBBoNVvWl0ur0oVFCYgqCqtP0vQAAOlFgopFCgIAB0vPAAIUOFIQUIqoUMHwwURHoQUHPwIUKaAgUMCoQUD/wUINAwUC/wUCkgUMFAYpQCkyRFFKAUGCoIUG1YUTFIimECglPClxTEChEqChQTCCgQVDChoTCVAYUJSIopOCiITCCiZ8GSYwUZKYIpUqoUN6AUFXYwUEqur6AAB1d6A4IUHGIK9BleB0oACZwIULBQYAEKQdPHwoANCggqCABgTECn4U3lQUFU5wUFAH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AHFPAAkqAgkqlYTFlYANqoUGD4QEDAoYGBFQoHBkgQCBgIEDAoYULAA4pFB5IcFCYdVBgQADAowABp49EA4VVAIIADq1WBoYUCqwGCBgIAHp4rCHwiHBp4NBvQADFJBTCCoINB6HQ5/QwIpCChQqBCYIABwJbCChTcBCgeADgNPXooUNqoUFGAQUOqoUBQYQUOFQTuDNIQUPCYQUFwIUFlbmECiGBHxQUDVAdVfQYUQLAYUKc4KTDCh1VCAYtDPpGlCgwoGChNWCIoUQCQYULdwIpEHxoUCp8kCiYpTqoUmaQIULCYQUFPwaRFChrRIFJgUSVAY+ElYUeaQgUMlYUCKQ4UC6AABFIqoBkgrBMwdPlerAAQUBBALSBqwUFBQIMCAAQHDSYhVCCggAIFQJ+BFIQTMFQQUTL4Mk"))
  };
  }
  
  
  function drawTime(dt) {
    let min = dt.getMinutes();
    let hr = (dt.getHours() * 60 + min) / 360 * Math.PI;
  
    min = min / 30 * Math.PI;
    g.drawImage(getHr(), 120, 120, {rotate: hr});
    g.drawImage(getMin(), 120, 120, {rotate: min});
  
  }
  function drawDate(dt) {
    let mon = dt.getMonth() + 1;
    let day = dt.getDate();
  }
  
  function drawClock() {
    g.clear().setColor("#2b1b15").fillCircle(120,120,115).setColor(0).fillCircle(120,120, 80);
    let R = Math.random;
    g.setColor("#140d08");
    for(let c=10; c < 16; c++) {
      g.drawCircle(120, 120, Math.pow(c,1.75)+4); //100+R()*44, 100+R()*44, R()*32+28);
    }
  
    for(let a=-3; a < 3; a++) {
      g.drawImage(getTics(), 120, 120, {rotate: Math.PI/6*a});
    }
    
    g.setColor("#5d2c0a");
    for(let c=0; c < 8; c++) {
      g.drawCircle(100+R()*44, 100+R()*44, R()*32+28);
    }
    let dt=Date();
    drawTime(dt);
    //drawDate(dt);
  }
   
  
  setTimeout(drawClock, 1000);
  setInterval(drawClock, 60000);
      
      
      
  
  