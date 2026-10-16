/* Copyright (c) 2026. See the file LICENSE for copying permission.
 *
 * GDEM0122T61 — Espruino driver for Good Display 1.22" 176x192 B/W e-paper (SSD1681).
 *
 * Module: https://www.espruino.com/Modules
 * Panel:  GDEM0122T61 (SPI 4-wire)
 * IC:     SSD1681
 *
 * Required connect() options:
 *   spi, cs, dc, rst, busy
 *
 * Optional:
 *   bsPin       — driven LOW at init for 4-wire SPI (P2)
 *   powerPin    — MCU-gated panel supply; enables on()/off() (P2)
 *   busyTimeout — ms before busy wait rejects (default 6000) (X1)
 *
 * Features: full refresh (R1), partial/differential (R2+B1+B3), fast full (R5),
 * deep sleep (P1), Promise API, Graphics buffer via .g (G1).
 *
 * Methods (all update helpers return Promises unless noted):
 *   on() / off()     — powerPin only (P2)
 *   init()           — reset + SSD1681 setup
 *   flip()           — full refresh (R1), seeds both RAM planes (B1)
 *   flipFast()       — faster full-style update (R5, 0xC7); quality varies by panel
 *   flipPartial()    — differential update; uses setPartialWindow if set (R2+B3)
 *   setPartialWindow(x,y,w,h) — limit RAM transfer / refresh region (B3); omit/null = full
 *   sleep()          — deep sleep (P1); call init() before next use
 *   getWidth() / getHeight()
 *
 * Usage:
 *   var epd = require("GDEM0122T61").connect({ spi:SPI1, cs:CS, dc:DC, rst:RST, busy:BUSY, bsPin:BS1 });
 *   epd.init().then(() => {
 *     epd.g.setColor(0).drawString("Hello", 0, 0);
 *     return epd.flip();
 *   }).then(() => epd.sleep());
 *
 * Colour: Graphics 1 = white, 0 = black.
 * clear(0xFF) fills white; clear(0x00) fills black.
 * setPartialWindow aligns X/width to multiples of 8.
 * After several partials, call flip() to clear ghosting (Good Display recommends ~every 5).
 */
var WIDTH = 176;
var HEIGHT = 192;

function GDEM0122T61(options) {
  this.spi = options.spi;
  this.cs = options.cs;
  this.dc = options.dc;
  this.rst = options.rst;
  this.busy = options.busy;
  this.bsPin = options.bsPin;
  this.powerPin = options.powerPin;
  this.busyTimeout = options.busyTimeout || 6000;
  this._inited = false;
  this._partialReady = false; // old plane seeded (B1)
  this._win = null; // {x,y,w,h} or null = full frame (B3)
  this.g = Graphics.createArrayBuffer(WIDTH, HEIGHT, 1, { msb: true });
  digitalWrite(this.cs, 1);
  digitalWrite(this.dc, 0);
  digitalWrite(this.rst, 1);
}

/** Power on via optional powerPin (P2). */
GDEM0122T61.prototype.on = function () {
  if (this.powerPin) digitalWrite(this.powerPin, 1);
};

/** Power off via optional powerPin (P2). */
GDEM0122T61.prototype.off = function () {
  if (this.powerPin) digitalWrite(this.powerPin, 0);
};

GDEM0122T61.prototype._cmd = function (c) {
  digitalWrite(this.dc, 0);
  this.spi.write(c, this.cs);
};

GDEM0122T61.prototype._data = function (d) {
  digitalWrite(this.dc, 1);
  this.spi.write(d, this.cs);
  digitalWrite(this.dc, 0);
};

GDEM0122T61.prototype._cmdData = function (c, d) {
  this._cmd(c);
  this._data(d);
};

/** Wait until BUSY falls, or reject on timeout (X1). */
GDEM0122T61.prototype._waitBusy = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (!self.busy.read()) {
      resolve();
      return;
    }
    var watch, to;
    var done = false;
    function finish(ok, err) {
      if (done) return;
      done = true;
      if (watch) clearWatch(watch);
      if (to) clearTimeout(to);
      if (ok) resolve();
      else reject(err || new Error("EPD busy timeout"));
    }
    watch = setWatch(
      function () {
        finish(true);
      },
      self.busy,
      { repeat: false, edge: "falling" }
    );
    to = setTimeout(function () {
      finish(false);
    }, self.busyTimeout);
  });
};

GDEM0122T61.prototype._hwReset = function () {
  var self = this;
  return new Promise(function (resolve) {
    digitalWrite(self.rst, 0);
    setTimeout(function () {
      digitalWrite(self.rst, 1);
      setTimeout(resolve, 10);
    }, 10);
  });
};

/**
 * Set RAM window for subsequent buffer writes / partial refresh (B3).
 * x and w are aligned to multiples of 8.
 * Pass no args (or null) to use the full panel.
 */
GDEM0122T61.prototype.setPartialWindow = function (x, y, w, h) {
  if (x === undefined || x === null) {
    this._win = null;
    return;
  }
  var x1 = x & ~7;
  var w1 = w + (x - x1);
  if (w1 & 7) w1 += 8 - (w1 & 7);
  if (x1 < 0) x1 = 0;
  if (y < 0) y = 0;
  if (x1 + w1 > WIDTH) w1 = WIDTH - x1;
  if (y + h > HEIGHT) h = HEIGHT - y;
  if (w1 <= 0 || h <= 0) {
    this._win = null;
    return;
  }
  this._win = { x: x1, y: y, w: w1, h: h };
};

GDEM0122T61.prototype._applyWindow = function (win) {
  var x = win ? win.x : 0;
  var y = win ? win.y : 0;
  var w = win ? win.w : WIDTH;
  var h = win ? win.h : HEIGHT;
  this._cmdData(0x11, 0x03); // X/Y increment
  this._cmdData(0x44, [x >> 3, (x + w - 1) >> 3]);
  this._cmdData(0x45, [
    y & 255,
    y >> 8,
    (y + h - 1) & 255,
    (y + h - 1) >> 8,
  ]);
  this._cmdData(0x4e, x >> 3);
  this._cmdData(0x4f, [y & 255, y >> 8]);
};

/** Extract window bytes from the MSB Graphics buffer (row-major, WIDTH/8 bytes per row). */
GDEM0122T61.prototype._windowBytes = function (win) {
  var buf = new Uint8Array(this.g.buffer);
  if (!win) return buf;
  var rowBytes = WIDTH >> 3;
  var xByte = win.x >> 3;
  var wBytes = win.w >> 3;
  var out = new Uint8Array(wBytes * win.h);
  var o = 0;
  for (var row = 0; row < win.h; row++) {
    var base = (win.y + row) * rowBytes + xByte;
    for (var col = 0; col < wBytes; col++) out[o++] = buf[base + col];
  }
  return out;
};

GDEM0122T61.prototype._writePlane = function (cmd, win) {
  this._applyWindow(win);
  this._cmdData(cmd, this._windowBytes(win));
};

GDEM0122T61.prototype._update = function (mode) {
  this._cmdData(0x22, mode);
  this._cmd(0x20);
  return this._waitBusy();
};

/**
 * Hardware + soft reset, SSD1681 init for 176x192.
 * Returns a Promise.
 */
GDEM0122T61.prototype.init = function () {
  var self = this;
  if (this.bsPin) digitalWrite(this.bsPin, 0); // 4-wire SPI (P2)
  this.on();
  return this._hwReset()
    .then(function () {
      return self._waitBusy();
    })
    .then(function () {
      self._cmd(0x12); // soft reset
      return new Promise(function (resolve) {
        setTimeout(resolve, 10);
      });
    })
    .then(function () {
      return self._waitBusy();
    })
    .then(function () {
      // Driver output control: (HEIGHT-1)
      self._cmdData(0x01, [(HEIGHT - 1) & 255, (HEIGHT - 1) >> 8, 0x00]);
      self._cmdData(0x3c, 0x05); // border
      self._cmdData(0x18, 0x80); // internal temperature sensor
      self._cmdData(0x21, [0x00, 0x80]); // display update control
      self._applyWindow(null);
      self._inited = true;
      self._partialReady = false;
      self._win = null;
    });
};

/**
 * Full refresh (R1). Writes both RAM planes on first useful update so
 * later partials have a valid "old" image (B1).
 */
GDEM0122T61.prototype.flip = function () {
  var self = this;
  if (!this._inited) {
    return this.init().then(function () {
      return self.flip();
    });
  }
  this._win = null;
  this._writePlane(0x26, null);
  this._writePlane(0x24, null);
  return this._update(0xf7).then(function () {
    self._partialReady = true;
  });
};

/**
 * Fast full refresh (R5) — Display Mode 1 with shorter sequence (0xC7).
 * May look similar to full or be limited on some GDEM0122T61 panels.
 */
GDEM0122T61.prototype.flipFast = function () {
  var self = this;
  if (!this._inited) {
    return this.init().then(function () {
      return self.flipFast();
    });
  }
  this._win = null;
  this._writePlane(0x26, null);
  this._writePlane(0x24, null);
  return this._update(0xc7).then(function () {
    self._partialReady = true;
  });
};

/**
 * Partial / differential refresh (R2) using optional window from setPartialWindow (B3).
 * First call after sleep/init without a prior flip() performs a full refresh instead.
 */
GDEM0122T61.prototype.flipPartial = function () {
  var self = this;
  if (!this._inited) {
    return this.init().then(function () {
      return self.flipPartial();
    });
  }
  if (!this._partialReady) return this.flip();
  var win = this._win;
  // Write new image into BW RAM for the window only; controller diffs vs previous.
  this._writePlane(0x24, win);
  return this._update(0xfc).then(function () {
    // Keep previous plane in sync for next differential (B1: controller often
    // copies, but rewriting previous for the same window is safer on partial).
    self._writePlane(0x26, win);
  });
};

/** Enter deep sleep (P1). Next update requires init()/hw reset. */
GDEM0122T61.prototype.sleep = function () {
  this._cmdData(0x10, 0x01);
  this._inited = false;
  this._partialReady = false;
};

/** Module width / height (read-only helpers). */
GDEM0122T61.prototype.getWidth = function () {
  return WIDTH;
};
GDEM0122T61.prototype.getHeight = function () {
  return HEIGHT;
};

exports.connect = function (options) {
  return new GDEM0122T61(options);
};
