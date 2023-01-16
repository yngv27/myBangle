// MIT License (c) 2020 fanoush https://github.com/fanoush
// see full license text at https://choosealicense.com/licenses/mit/
// compiled with options LCD_BPP=16,SHARED_SPIFLASH
var SPI2 = (function(){
    var bin=atob("//////////8AAAAAAAAAAP////8AAAAAAAAAAAAAAL8QtQZMfETE6QABIDsBIQH6AvKZQKJg4WAQvQC/2P///wZLACLD+AAlw/gIIQEiWmDT+AQjCrHD+AgjcEcA8AJAEkvT+AAlELXqudP4BCMKscP4CCMOSnpEAAYUaMP4CEVUaMP4DEUSacP4ECVJAE/w/zLD+BQlw/hsJcP4JAXD+FQVASAQvU/w/zD75wDwAkCG////CEt7RJuKU7EFStL4GDEAK/vQACPC+BgxA0p6RJOCcEcA8AJARv///y7///8QtQNMfETigiCDYYOjgxC9GP////i1FUb/99z/FEsAJMP4NEX/J8P4OEUBIsP4GEEmRv8pAOsEDMP4RMWLv/80w/hIFcP4SHUAIYi//zkaYSWxGbkHS3tEmoL4vdP4GMG88QAP+tDD+BhhACnh0fTnAPACQMb+//8bSnpEOLUMRtFoWbMXTQcjxfgANU/woEPD+AwYkmgKscP4DCUAIgEh//e4/xFLe0QBLNpoT/CgQ8P4CCgE3QAiYR4BMP/3qv8LS3tEm2gbsU/woELC+Ag1ACABI8X4AAVrYDi9T/D/MPvnAL8A8AJAov7//3b+//9a/v//cLUERoixRhgAJSBGEPgBGxmxRBi0QgLZbUIoRnC9//ex/wAo+dEBNe/nBUb15xO1ACgd2wAppr+N+AUQAiQBJAAqob8CqQkZATQB+AQsACuivwKqEhkBNI34BACovwL4BDwhRgGo//eN/yBGArAQvQAk+uct6fBPn7CRRgCRS0l5RAdGi30AKADwi4AAmgAqAPCHgFoeByoA8oOAASKaQAE60rIFRkBIAZIHIjX4Akux+BqAwPgAJYpoRPoJ9KSyGrFP8KBBwfgMJTlKekQSqAKSBqrN6QMgT/AAClFGApqy+BiwTkYBmh5E9rIHLgLqBAwAmoi/CD4y+BzAgb8V+AEr9rLG8QgOAvoO8kT6A/RP6hwuiL8UQwD4AeBKHAIxC/H/Oy8pAPgCwKSyH/qL+wvdASIFk//38/7a8QEKBZsLvwSYA5hRRgAhu/EAD8rRGEp6RAjx/ziSixdEPUYf+oj4NfgCS0T6CfSksrjxAA+10ZmxQkb/99P+D0t7RJtoG7FP8KBCwvgINQdKACABI8L4AAVTYB+wvejwj//3oP7r50/w/zD25wDwAkCo/f//XP3//9b8//+s/P//");
    return {
      cmd:E.nativeCall(345, "int(int,int)", bin),
      cmds:E.nativeCall(469, "int(int,int)", bin),
      cmd4:E.nativeCall(515, "int(int,int,int,int)", bin),
      setpins:E.nativeCall(33, "void(int,int,int,int)", bin),
      enable:E.nativeCall(97, "int(int,int)", bin),
      disable:E.nativeCall(65, "void()", bin),
      blit_setup:E.nativeCall(225, "void(int,int,int,int)", bin),
      blt_pal:E.nativeCall(585, "int(int,int,int)", bin),
    };
  })();