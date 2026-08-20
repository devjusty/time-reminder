import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync("src/scripts/time-reminder.ts", "utf8");
const componentMarkup = fs
  .readdirSync("src/components")
  .filter((file) => file.endsWith(".astro"))
  .map((file) => fs.readFileSync(`src/components/${file}`, "utf8"))
  .join("\n");
const syntaxTree = ts.createSourceFile(
  "time-reminder.ts",
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
let readyCallback = null;
let readyCallbackNode = null;
let intervalCallCount = 0;
function findReadyCallback(node) {
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(syntaxTree) === "setInterval" &&
    node.arguments[0]?.getText(syntaxTree) === "getTime" &&
    node.arguments[1]?.getText(syntaxTree) === "1000"
  ) {
    intervalCallCount += 1;
  }
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(syntaxTree) === "document.addEventListener" &&
    node.arguments[0]?.getText(syntaxTree) === '"DOMContentLoaded"'
  ) {
    const callback = node.arguments[1];
    if (ts.isArrowFunction(callback)) {
      readyCallback = callback.body.getText(syntaxTree);
      readyCallbackNode = callback.body;
    }
  }
  ts.forEachChild(node, findReadyCallback);
}
findReadyCallback(syntaxTree);
if (!readyCallback || !readyCallbackNode || !ts.isBlock(readyCallbackNode))
  throw new Error("Missing DOM ready initializer");
const readyStatements = readyCallbackNode.statements.map((statement) =>
  statement.getText(syntaxTree),
);
for (const initializer of [
  "initializeReminderControls();",
  "initializeVolumeControls();",
  "initializeAlarmListeners();",
  "setInterval(getTime, 1000);",
]) {
  if (!readyStatements.includes(initializer)) {
    throw new Error(`Missing ready initializer: ${initializer}`);
  }
}
if (
  readyStatements.filter((statement) =>
    /^setInterval\s*\(\s*getTime\s*,\s*1000\s*\);?$/.test(statement),
  ).length !== 1 ||
  intervalCallCount !== 1
) {
  throw new Error("Clock interval must be declared once");
}
if (source.includes('const reminderMinutes = ["00", "15", "30", "45"]')) {
  throw new Error("Reminder intervals are duplicated outside CONFIG");
}
const invalidStart = source.indexOf("if (savedRemindUntil)");
const inputStart = source.indexOf("const remindUntilInput", invalidStart);
if (!source.slice(invalidStart, inputStart).includes("saveRemindUntil()")) {
  throw new Error("Invalid remindUntil state is not rewritten");
}
for (const contract of [
  /(?:const|let|var)\s+\w+\s*=\s*document\.getElementById\(["']schedule-status["']\)/,
  /(?:const|let|var)\s+\w+\s*=\s*document\.getElementById\(["']audio-error["']\)/,
  /No reminders selected\. Select at least one time\./,
  /Unable to play reminder sound\. Check your browser audio permission\./,
]) {
  if (!contract.test(source)) {
    throw new Error(`Missing runtime contract: ${contract}`);
  }
}
const digitalClockTags = [...componentMarkup.matchAll(/<[^>]+>/g)].filter(
  (match) => /\bid\s*=\s*["']digital-clock["']/i.test(match[0]),
);
if (
  digitalClockTags.some(([tag]) =>
    /\baria-live\s*=\s*(?:["']polite["']|polite)/i.test(tag),
  )
) {
  throw new Error('Digital clock must not use aria-live="polite"');
}

console.log("Runtime source verification passed");
