import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync("src/scripts/time-reminder.ts", "utf8");
const layout = fs.readFileSync("src/layouts/BaseLayout.astro", "utf8");
const analytics = fs.readFileSync(
  "src/components/GoogleAnalytics.astro",
  "utf8",
);
const netlifyConfig = fs.readFileSync("netlify.toml", "utf8");
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
let intervalCallCount = 0;
function inspectRuntime(node) {
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(syntaxTree) === "setInterval" &&
    node.arguments[0]?.getText(syntaxTree) === "getTime" &&
    node.arguments[1]?.getText(syntaxTree) === "1000"
  ) {
    intervalCallCount += 1;
  }
  ts.forEachChild(node, inspectRuntime);
}
inspectRuntime(syntaxTree);

if (intervalCallCount !== 1) {
  throw new Error("Clock interval must be declared once");
}
for (const contract of [
  /astro:page-load/,
  /runtimeStarted\s*=\s*true/,
  /initializeAlarms\(\);/,
  /initializeRemindUntil\(\);/,
  /bindHomepageView\(\);/,
  /getTime\(\);/,
  /toast\.config\(/,
  /toast\.success\(/,
  /toast\.error\(/,
  /(?:const|let|var)\s+\w+\s*=\s*document\.getElementById\(["']schedule-status["']\)/,
  /(?:const|let|var)\s+\w+\s*=\s*document\.getElementById\(["']audio-error["']\)/,
  /No reminders selected\. Select at least one time\./,
  /Unable to play reminder sound\. Check your browser audio permission\./,
]) {
  if (!contract.test(source)) {
    throw new Error(`Missing runtime contract: ${contract}`);
  }
}
if (!layout.includes("<ClientRouter />")) {
  throw new Error("Base layout must enable ClientRouter");
}
if (
  !layout.includes("data-sonner-toasters") ||
  !layout.includes("transition:persist") ||
  !layout.includes('attachShadow({ mode: "open" })')
) {
  throw new Error("Base layout must persist Sonner toaster host");
}
if (source.includes('const reminderMinutes = ["00", "15", "30", "45"]')) {
  throw new Error("Reminder intervals are duplicated outside CONFIG");
}
if (
  !/const initializationScript = `[\s\S]*window\.dataLayer = window\.dataLayer \|\| \[\];/.test(
    analytics,
  ) ||
  !/const initializationScript = `[\s\S]*window\.gtag\s*=/.test(analytics) ||
  !/const initializationScript = `[\s\S]*window\.gtag\("consent"/.test(
    analytics,
  )
) {
  throw new Error(
    "Partytown analytics initialization must define gtag in worker",
  );
}
if (!netlifyConfig.includes("https://*.adtrafficquality.google")) {
  throw new Error("CSP must allow AdSense SODAR connections");
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
