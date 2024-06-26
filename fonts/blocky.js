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
Graphics.prototype.setFontBlocky=function(scale){this.setFontCustom(atob("AAAAAAAD+QfyAAAAADgAcAAAAcADgAAAACACeAfwfwDzwD+D+AeQAQAAABwQZCH/4RCCHwAcAAAOAD4ARCD4wOcAGADABzgY+CEQA+ADgAAB3gf+CIQRiD+wOeABgAeACQAADQAcAAAAP8D/wwDEAIAAEAIwDD/wP8AAANgA4AfwA4ANgAAAAgAEAD4AfAAgAEAAAAAAAGgA4AAAEAAgAEAAgAAAAGAAwAAAAAADAB4B8A+AeADAAAAB/gf+CAQQCCAQf+B/gAACAAf+D/wAAAAAA8CPwRCCIQRCD4QOAAAAQCCIQRCCIQf+B3gAAAMADgA0AMgD/wf+AEAAAD4AfCCIQRCCIQR+AHgAAB/gf+CIQRCCIQR+AHgAACAAQACBwQ+CeAfADgAAAB3gf+CIQRCCIQf+B3gAAB4AfiCEQQiCEQf+B/gAAAxgGMAAAGNAxwAAAEABwAbAGMAggAAASACQASACQASAAAAggGMAbABwAEAAABAAYACGQRyD4AOAAAAH4B/gYGGeQn6EhQn6EeQwaDDAPwAAAP+D/wQQCCAQQD/wP+AAAf+D/wRCCIQRCD/wO8AAAP8D/wQCCAQQCDAwIEAAAf+D/wQCCAQQCD/wP8AAAf+D/wRCCIQRCAAAf+D/wRACIARAAAAP8D/wQCCAQQiDHwI+AAAf+D/wBAAIABAD/wf+AAAf+D/wAAAAgAGAAQACAAQf+D/gAAD/wf+AeAGYBhgYGCAQAAD/wf+AAQACAAQACAAAf+D/wGAAcADgAwAf+D/wAAD/wf+BgAGAAYAf+D/wAAB/gf+CAQQCCAQf+B/gAAD/wf+CIARACIAfABwAAAB/gf+CAQQCCBwf/B/oAAD/wf+CIARACIAf+B3wAABxgfOCIQRCCIQd+BngAACAAQAD/wf+CAAQAAAAf8D/wACAAQACD/wf8AAAfgD/AAeAAwAeD/AfgAAAfgD/AAeABwf0D/AAeAAwf8D/AAADAweeA/ABgA/AeeDAwAADwAfAAPwB+D4AeAAAAQeCHwRiCIQTCDwQcCAAA//H/4gBAAAYADwAHwAPgAPAAYAAEAI//H/4AAAYAPADgAwADgAPAAYAAAAAIABAAIABAAIABAAAcABgAAAAJgDeASQCSAfwB+AAAf+D/wCCAQQD+APgAAAPgD+AQQCCAQQAAAPgD+AQQCCD/wf+AAAB8AfwCSASQDyAOAAAAQAP+D/wSAAAAB8AfyCCQQSD/wf8AAD/wf+AQACAAfwB+AAAT+CfwAAAACAASf+T/gAAf+D/wAgAOAHeAxwAAD/wf+AAAD+AfwCAAfwD+AQAD+APwAAAfwD+AQACAAfwB+AAAB8AfwCCAQQD+APgAAAf+D/wQQCCAfwB8AAAB8AfwCCAQQD/wf+AAAfwD+AQACAAYABAAAABkAewCSASQDeAJgAAAQAH8A/wCCAAAD8AfwACAAQD+AfwAAAfAD8AAwAGAfgD4AAAD4AfgAGAfwD8AAwD+AfAAAAYwDuAHAA4AdwDGAAADwAfAAMAAiD/wf8AAAQwCOATQCyAcQDCAAAAwB/4fPiAEAAH/+//wAAQAj58P/AGAAAAgAMABAAMAAwACAAwAEAAAAAAAAAAAAAA"), 32, atob("AwQGCAgNCgMFBQYHBAUEBwgFCAcICAgICAgDAwYGBgcMCAgICAYGCAgDCAgHCQgICAgICAcICAsIBwgEBwQIBwMHBwYHBwUHBwMFBwMJBwcHBwcHBQcHCQcHBwUDBQk="), 15+(scale << 8)+(1 << 16));};
