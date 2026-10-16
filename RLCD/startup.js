/* Waveshare ESP32-S3-RLCD-4.2 bring-up on stock Espruino ESP32S3 image.
 *
 * Upload modules to Storage (or Web IDE Modules):
 *   ST7305.js, SHTC3.js, PCF85063.js
 * then run this file.
 *
 * Exercises: ST7305 RLCD, SHTC3, PCF85063, KEY/BOOT, battery ADC.
 * Does not use TF (SDMMC) or audio (I2S) — those need custom C.
 *
 * Flash: BOARD=ESP32S3_IDF4 (espruino_*_esp32s3.bin)
 * Console: USB Serial/JTAG on the board Type-C port.
 */
var PIN = {
  // Display (ST7305)
  SCK: D11,
  MOSI: D12,
  DC: D5,
  CS: D40,
  RST: D41,
  // I2C (SHTC3 + PCF85063 + audio codecs)
  SDA: D13,
  SCL: D14,
  // Buttons (active low)
  BOOT: D0,
  KEY: D18,
  // Battery sense (÷3 divider)
  BAT: D4,
  // Speaker amp (left off — no I2S audio on stock image)
  SPK_EN: D46,
};

digitalWrite(PIN.SPK_EN, 0);


I2C1.setup({ sda: PIN.SDA, scl: PIN.SCL, bitrate: 100000 });


var sht = require("SHTC3.js").connect({ i2c: I2C1 });
var rtc = require("PCF85063.js").connect({ i2c: I2C1 });

function batteryVolts() {
  // ESP32 analogRead → ~0..1 over the configured attenuation range.
  // ESPHome uses 12 dB (~0–3.3 V full scale) and a ×3 divider.
  try {
    if (typeof ESP32 !== "undefined" && ESP32.setAtten)
      ESP32.setAtten(PIN.BAT, 3); // 11/12 dB if available
  } catch (e) {}
  var v = analogRead(PIN.BAT);
  if (v == null || isNaN(v)) return null;
  return v * 3.3 * 3;
}

function fmt1(n) {
  return (Math.round(n * 10) / 10).toFixed(1);
}

function drawScreen(env, batV, note) {
  
  var w = lcd.getWidth();
  var h = lcd.getHeight();
  g.clear();
  g.setColor(1);
  g.drawRect(0, 0, w - 1, h - 1);
  g.setFont("6x8", 2);
  g.drawString("ESP32-S3-RLCD-4.2", 12, 12);
  g.setFont("6x8", 1);
  g.drawString("Espruino stock bring-up", 12, 36);

  var now = rtc.getDate() || new Date();
  g.setFont("6x8", 3);
  g.drawString(
    ("0" + now.getHours()).slice(-2) +
      ":" +
      ("0" + now.getMinutes()).slice(-2) +
      ":" +
      ("0" + now.getSeconds()).slice(-2),
    12,
    70
  );
  g.setFont("6x8", 2);
  g.drawString(
    now.getFullYear() +
      "-" +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + now.getDate()).slice(-2),
    12,
    110
  );

  g.setFont("6x8", 2);
  if (env) {
    g.drawString("Temp  " + fmt1(env.temp) + " C", 12, 150);
    g.drawString("RH    " + fmt1(env.humidity) + " %", 12, 174);
  } else {
    g.drawString("SHTC3 unavailable", 12, 150);
  }

  if (batV != null)
    g.drawString("Batt  " + fmt1(batV) + " V", 12, 206);
  else g.drawString("Batt  n/a", 12, 206);

  g.setFont("6x8", 1);
  g.drawString(note || "KEY=refresh  BOOT=set RTC from Date()", 12, h - 20);
}

var refreshing = false;

function refresh(note) {
  if (refreshing) return Promise.resolve();
  refreshing = true;
  var env = null;
  var batV = 0; //batteryVolts();
  return sht
    .read()
    .then(function (r) {
      env = r;
    })
    .catch(function (e) {
      print("SHTC3:", e);
    })
    .then(function () {
      try {
        lcd.highPower();
      } catch (e) {}
      drawScreen(env, batV, note);
      var t0 = getTime();
      return lcd.flip().then(function () {
        print("flip", Math.round((getTime() - t0) * 1000), "ms");
      });
    })
    .catch(function (e) {
      print("refresh error:", e);
    })
    .then(function () {
      refreshing = false;
      try {
        lcd.lowPower();
      } catch (e) {}
    });
}

function wireButtons() {
  pinMode(PIN.KEY, "input_pullup");
  pinMode(PIN.BOOT, "input_pullup");

  setWatch(
    function () {
      refresh("KEY pressed");
    },
    PIN.KEY,
    { repeat: true, edge: "falling", debounce: 50 }
  );

  setWatch(
    function () {
      // Seed RTC from Espruino's current Date (set via IDE or NTP later)
      rtc.setDate(new Date());
      refresh("RTC set from Date()");
    },
    PIN.BOOT,
    { repeat: true, edge: "falling", debounce: 50 }
  );
}

