APW == All Purpose Watch

Whatever, it's a name. This app funs under Espruino using minimal Bangle calls as it's intended to run on non-Bangle watches (see EWatches). Of course, steal and use it for whatever you like.

It is designed to run multiple faces via known functions (yes, could make it a class..) It sets up the timer for telling the watch face to redraw, and handles loading of text alarms (with special buzz sequence) and messages called tidbits. Alarms display on their set time and are dismissed with a long press of button 1. If no alarm is being displayed, then the tidbit engine will occassionally display a random tidbit at regular intervals (with 2 buzzes). The size of the tidbit list is limited only by memory/RAM. Special case: if tidbit[0] is set to anything, it's considered a message, and always displays if no alarm is displaying. I use this a shopping list when I'm out. Set this to empty to have random tidbits displayed.

It is screen agnostic as much as it can be so it can run on differnet EWatches and have the watch faces determine how they display.

Double tap BTN1 to change watch faces. Watch faces are a simple array (scrs) which you can set in apw.js or change via Web IDE. Nice thing about Espruino... very flexible.