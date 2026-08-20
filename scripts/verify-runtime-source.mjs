import fs from "node:fs";

const source = fs.readFileSync("src/scripts/time-reminder.ts", "utf8");
const readyStart = source.indexOf(
  'document.addEventListener("DOMContentLoaded"',
);
const readyEnd = source.indexOf("});", readyStart);
const readyBlock = source.slice(readyStart, readyEnd);

if (readyStart < 0 || readyEnd < 0)
  throw new Error("Missing DOM ready initializer");
for (const initializer of [
  "initializeReminderControls();",
  "initializeVolumeControls();",
  "initializeAlarmListeners();",
  "setInterval(getTime, 1000);",
]) {
  if (!readyBlock.includes(initializer)) {
    throw new Error(`Missing ready initializer: ${initializer}`);
  }
}
if (source.slice(readyEnd).includes("setInterval(getTime, 1000)")) {
  throw new Error("Clock interval starts outside DOM ready initializer");
}
if (source.includes('const reminderMinutes = ["00", "15", "30", "45"]')) {
  throw new Error("Reminder intervals are duplicated outside CONFIG");
}
const invalidStart = source.indexOf("if (savedRemindUntil)");
const inputStart = source.indexOf("const remindUntilInput", invalidStart);
if (!source.slice(invalidStart, inputStart).includes("saveRemindUntil()")) {
  throw new Error("Invalid remindUntil state is not rewritten");
}

console.log("Runtime source verification passed");
