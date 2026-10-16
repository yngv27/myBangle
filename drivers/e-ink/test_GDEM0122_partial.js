/* GDEM0122T61 partial-refresh example for LilyGO T-Echo-Lite (nRF52840).
 *
 * Upload GDEM0122T61.js as a module (Storage / Web IDE Modules), then run this.
 * Pin map from LilyGO t_echo_lite_config.h — adjust if your board differs.
 *
 * Demonstrates: full refresh (R1), partial window updates (R2+B3), deep sleep (P1).
 */
var SCLK = D19;
var MOSI = D20;
var CS = D22;
var DC = D21;
var RST = D28;
var BUSY = D3;
var BS1 = D44; // P1.12 — 4-wire SPI select (P2)

SPI1.setup({ sck: SCLK, mosi: MOSI, baud: 4000000, order: "msb", bits: 8 });

var epd = require("GDEM0122T61.js").connect({
  spi: SPI1,
  cs: CS,
  dc: DC,
  rst: RST,
  busy: BUSY,
  bsPin: BS1,
  busyTimeout: 8000,
});

function drawBase() {
  epd.g.clear(0xff); // white
  epd.g.setColor(0);
  epd.g.setFont("8x12", 2);
  epd.g.drawString("GDEM0122T61", 8, 8);
  epd.g.drawString("full refresh", 8, 32);
  epd.g.drawRect(0, 0, epd.getWidth() - 1, epd.getHeight() - 1);
}

function drawCount(n) {
  // Only the counter region changes — use a partial window.
  epd.g.setColor(1).fillRect(8, 80, 120, 120); // clear area (white)
  epd.g.setColor(0);
  epd.g.setFont("8x12", 3);
  epd.g.drawString("n=" + n, 8, 88);
}

epd
  .init()
  .then(function () {
    drawBase();
    return epd.flip(); // R1 full
  })
  .then(function () {
    epd.setPartialWindow(0, 72, 128, 56); // B3 — X aligned to 8
    var n = 0;
    function step() {
      if (n >= 5) {
        return epd.flip().then(function () {
          // periodic full refresh recommended after several partials
          epd.sleep();
          print("done — slept");
        });
      }
      drawCount(n);
      n++;
      return epd.flipPartial().then(function () {
        return new Promise(function (resolve) {
          setTimeout(resolve, 200);
        }).then(step);
      });
    }
    return step();
  })
  .catch(function (e) {
    print("EPD error:", e);
  });
