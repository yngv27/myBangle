# m_vatch module

This is the common code used by all my Bangle.js watch faces; it handles:
- setting intervals for calling time / data draw functions
- loadings, scheduling and displaying alamrs (from a file yngv.alarms.json)
- loading and displaying a notes file (yngv.notes.json)
- managing the step counter across app starts and day changes
- allows for "night mode": a separate visual for the watch face activated by BTN1

## Step Counter
The Bangle's step counter resets to zero every time you launch an app, so you lose your count up to that point. Also, it doesn't recognize a change in date, so it 
may report your previous day's count first thing in the morning. The internals of m_vatch save the current count to storage regularly to read them in again when any watch
face using m_vatch is relaunched. It also checks the date and resets to zero if the date has changed

## Night Mode
This is used for when your Bangle is at your bedside table. When you press BTN1, it will rotate the screen so it is readable with the buttons facing up (a normal position when it's not 
on your wrist, sitting on a table) and passed a flag to all routines so colours can be adjusted for darkness. Also, the DrawData() function is NOT called. It's night time, don't worry about it...

## Usage
Copy it into your Bangle's Storage area, and name it "m_vatch" (remove the .js extension). 
