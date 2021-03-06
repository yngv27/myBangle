/* Copyright (c) 2021 John Vann */
/* 

Squared off Book font (easier to read at smaller sizes)

Usage:

```
require("blocky.fnt").add(Graphics);
g.setFontBlocky();
g.drawString("0123456789");
```
*/
let h = require("heatshrink");
let font = h.decompress(atob('ABEP8kf5AFBuEA8AEBgeAg4EBkECvEH+F/gHz4E/wf4g+QgIhCjkQskh//hiGCj4JBD4IEBkUQvlgueAhkAsEDzkMvkQxEB+EB4AjB98D/8EoUI4kf7Ec+EA4ED4EEwEAgkAhw7Cj/gv/hwFigFAgEIgMYg0f/AOBCQNsNgMD/AzBgw1CAAMCE4U+gF8OoIiCAAILBnBWBAwMQBwhCBAAMwBwaYCgEeMwMPwF4LQILBgP/g//hECiEEkEIv6mBB4JABBwMP/wkE8GPUgNCkGEoMPwR5DoCaBkIOCw4uBLoKGBwE/NQkIFgpxCDouEdAIdDJAPwBxR8E8MP4V8g/AJAcdDo5KGgF/iGCkLsCBwX8BwMMsEYSgVi4HHOQbVDBwMgXIVIgGQgMggVAggKCBwNjeYbgDbALOBw1BjmD8EDC4UH8Ef8FgsOeoV+wmFhP6iPkmFomHAUgIAB/+D/8EiEIkEQoE/+E/8DtCBwRrBwkRhAOBnZoC/8DBwMChAgCmEwkBQBDogOEFgQdBFhIoBv/g//BiECkEEOoUPDYPwoCFBoMIwcfgT5BYAP4BwMEgAiBiBKBg/+Bwp2CwEBAIMAgUAggOCOoJmB4P/wF4gOYg0YAAKJBBwodEGwRZD4DGBZ4LEBHYwdCwI+DwAOFv+B/+CgKVDBwLgBDomCQwUIDoMAjhnCDo8cj/8j/oDpf4jo7CuOB+eCkLCDjv4jI7COgSkDVYQ5D4B3BCIcCh45BFQV+HYMAg+AQYMebwMfwAOHg8H+gOBgF4gEwFgQTBgcDg+egfwS4MP4F58HAHYMD4EHAgP8gP4nwgCgEBg+Cj8EsRoBicInkQuEgMwXH/+ILYMAjEAnjVBgEPK4PAGwJ1BgU//l//AUD+EDwEMgEOC4MAgyICgAuBoCIEgEEBYNwgFgCIUmgHegMkgVIg/wg61BgP/wZ7BcYUD/EDYQRKBn+AoIODRwXgh/giFAkAdBaIJ/CFQPwhMgiVAnmAnAMCEwP4n/wpBICPYN/kGCoMEEYX8BgP/4P/wBpDWYQMBp/gz69BPYdJ/+TH4V/8H/4EIgE4gPegccBgI7BBwIFCwF/FgZ3BNYJoBeYIjCgH+UoaVELIaVJj5uCSoZZB+AMBg/Aj/AkCkCNwYsCUgRlCaoJ5BS4OQg+wUgc3wDgBUgQbC+EIDQJoBJQT8CJQIQBK4YOBgcAgyiBdosfQIKGCXgMMDoSCCjHAneAUAKmB7kDjAdCFgQqBgUgNAQMBgkwhHgidAlmAuMA4TWCQQP4vn4wB4Bg//97XBgEQgU+vigBgwXCwAvBZoMMAITrBmCRDAA4='))
let widths = h.decompress(atob('gcEg0IhENhUDgsFg0HgkFgkHhEFBwIAFgcDgwAChkIhIKBAwIOCAQMHBQQADEgMIhYECFgMEAoMDg8HHAMHgoCBIIICBhIGBAAYNCBIcFCQMJA=='))
exports.add = function(graphics) {
  graphics.prototype.setFontBlocky = function() {
    this.setFontCustom(E.toString(font), 32, E.toString(widths), 256 + 15);
  }
}