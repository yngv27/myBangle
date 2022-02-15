let font = "AAAAAAAAAAAAAAAAAAAAAAAD/mAAAAAAADAAAAAAMAAAAAAAAAASAAEgAP/AASAA/8ABIAASAAAAAAAADggBEEAgggf/8CCCAQRACDgAAAAAAAAAAAwGASGADGAAGMAGEgGAwAAAAAAAADgBzEAjAgI4IBxkAAGAAGYAAAAAAACAADAAAAAAAAAAfwA4DgQAEAAAAAAAQAEDgOAH8AAAAAAAAAQAAkgAFQAA4AAVAAJIAAQAAAAAAAAAQAAEAABAAD+AAEAABAAAQAAAAAAAAAAQAAYAAAAAAAAAAABAAAQAAEAABAAAQAAEAABAAAAAAAAAAGAAAAAAAAAGAAGAAGAAGAAGAAGAAAAAAAAAD/gBAkAgQgIIICECASBAD/gAAAAAAABAAAgAAQAAP/4AAAAAAADAYBAKAgEgICICBCAQggDwIAAAAAAACAgBAEAgggIIICCCARRADjgAAAAAAAADgADIADCADAgDAIAA/gAAgAAAAAAAPwgCEEAhAgIQICECAghAIHgAAAAAAAA/gAyEARAgIQICECAghAAHgAAAAAAAIAACAAAgAAIA4CBwAjgAPAAAAAAAAADjgBFEAgggIIICCCARRADjgAAAAAAADwABCCAgQgIEICBEAQmAD+AAAAAAAAAwYAAAAAAAAAEAMGAAAAAAAABAAAoAARAAIIAEBAAAAAAAABEAARAAEQABEAARAAEQABEAAAAAAAAEBAAggAEQAAoAAEAAAAAAAADAABAAAgAAIHYCCAARAADgAAAAAAAAB/gAgEAR4gEhIBISAJIgB/QAAAAAAAAB4AHwAOEAMBAA4QAB8AAB4AAAAAAAP/4CECAhAgIQICECAShADHgAAAAAAAD/gBAEAgAgIAICACAQBACAgAAAAAAAP/4CACAgAgIAICACAQBAD/gAAAAAAAP/4CCCAgggIIICCCAgAgIAIAAAAAAAP/4CCAAggAIIACCAAgAAIAAAAAAAAAD/gBAEAgAgIAICBCAQRACH4AAAAAAAP/4ACAAAgAAIAACAAAgAP/4AAAAAAAIAID/+AgAgAAAAAAAACAAAQAACAAAgAAIAAEA/+AAAAAAAA//gAIAAFAACIABBAAgIAwBgAAAAAAA//gAAIAACAAAgAAIAACAAAgAAAAAAA//gDAAAMAAAwAAwAAwAA//gAAAAAAA//gDAAAMAAAwAADAAAMA//gAAAAAAAP+AEAQCACAgAgIAIBAEAP+AAAAAAAA//gIEACBAAgQAIEABCAAPAAAAAAAAAP+AEAQCACAgAgIAoBAEAP+gAAAAAAA//gIEACBAAgQAIGABCYAPBgAAAAAAAOCAEQQCCCAgggIIIBBEAIOAAAAAAAAgAAIAACAAA//gIAACAAAgAAAAAAAAA/+AAAQAACAAAgAAIAAEA/+AAAAAAAA8AAA8AAA4AABgADgAPAA8AAAAAAAAA+AAAeAAAeAB4APgAAHgAAHgAeAD4AAAAAAAADAGAMGAA2AACAADYADBgDAGAAAAAAADAAAMAAAwAAD+ADAADAADAAAAAAAAACAeAgIgIEICCCAhAgIgIDwCAAAAAAAH//BAAQQAEAAAAAAAMAAAwAADAAAMAAAwAADAAAAAAABAAQQAEH//AAAAAAAAQAAIAAEAACAAAQAACAAAQAAAAAAAAAACAAAgAAIAACAAAgAAIAACAAAAAAADAAAIAAAAAAAAAAGAASQAJCACQgAkIAJEAB/gAAAAAAA//gAQQAICACAgAgIAEEAA+AAAAAAAAA+AAQQAICACAgAgIAICABBAAAAAAAAA+AAQQAICACAgAgIAEEA//gAAAAAAAA+AASQAIiACIgAiIAEiAA5AAAAAAAACAAAgAB/+AiAAIgACAAAAAAAAAAD4QBBCAgIgICICAiAQRAP/gAAAAAAD/+ABAAAgAAIAACAAAQAAD+AAAAAAAAIAAb/gAAAAAAAAAIAABAAAQb/4AAAAAAA//gACAAAgAAUAAIgAEEACAgAAAAAAAgAAP/wAACAAAgAAAAAAAD/gAgAAIAAB/gAgAAIAAB/gAAAAAAAD/gAQAAIAACAAAgAAEAAA/gAAAAAAAA+AAQQAICACAgAgIAEEAA+AAAAAAAAD/8AQQAICACAgAgIAEEAA+AAAAAAAAA+AAQQAICACAgAgIAEEAD/8AAAAAAAD/gAIAAEAACAAAgAAIAABAAAAAAAAABxAAiIAIiACIgAiIAIiABHAAAAAAAACAAAgAA/8ACAgAgIAACAAAAAAAAP4AABAAAIAACAAAgAAQAP+AAAAAAAAOAAAYAABgAAGAAGAAGAAOAAAAAAAAAPwAADgADAAHAAAMAAA4APwAAAAAAAAMGAAiAAFAAAgAAUAAIgAMGAAAAAAAAOAQAYEABmAAGAAGAAGAAOAAAAAAAAAIGACCgAhIAIiACQgAoIAMCAAAAAAAACAA/fgQAEAAAAAAAAAAD/+AAAAAAAAAABAAQP34ACAAAAAAAAAgAAQAAEAAAgAAEAABAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
let widths = "BgMFCQkJCQQFBQkJBAkDCQoGCQkJCQkJCQkDBAcJBwkJCQkJCQkJCQkFCQkJCQkJCQkJCQkJCQkJCQkFCAUJCQQJCQkJCQgJCQQGCQYJCQkJCQkJCAkJCQkJCQUFBQk=";

exports.add = function(graphics) {
  graphics.prototype.setFontKNXT = function() {
    this.setFontCustom(atob(font), 32, atob(widths), 256 + 20);
  };
};