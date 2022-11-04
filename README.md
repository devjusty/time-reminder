# TimeReminder

TimeReminder is a simple productivity tool that offers an alternative to typical timers and alarms. Receive an audiable chime at the top of the hour, bottom of the hour, or on the sides (a quarter past the hour, or a quarter before the hour). Use the buttons to toggle when to receive these reminders.

[TimeReminder on Github Pages](https://devjusty.github.io/TimeReminder/)

![TimeReminder Screenshot](/src/time-reminder-screenshot.jpg)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript

After trying out the [Promodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique), I found it hard to stick to the set start and stop times when I found my way into the flow state, so I searched for a simple tool to just remind me of the time. I couldn't find one, so I built it myself.

I added localStorage so that you can re-open TimeReminder and it will keep your previously active alarm toggles active.

I have already found it quite useful and hope you do too.

## Optimizations

I'd like to eventually rewrite this as an electron desktop app, or possibly port it React Native, but before that I think there are some other optimizations that can be made.

- Add an area for additional settings
- extra sound options
- A visual notification during reminder
- Reduce re-used code in script
- Add other reminder intervals, custom reminder timers
- Add active hours to settings (remind from 9-5 e.g.)

## Lessons Learned

I had only previously dabbled with localStorage, so it was fun to create my own project that used it. My earlier iterations had code that was even more repetitive, but I learned more about Object Oriented Programming along the way and will continue to refactor the implementations as I add extra functionality later.

### Contact Me

If you have any feedback or ideas, feel free to reach out to me, I'd love to hear what you think.
