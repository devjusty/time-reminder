# Medium Migration Findings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve remaining medium migration findings across runtime initialization, page metadata, navigation, sitemap output, generated text, and persisted reminder state.

**Architecture:** Keep runtime behavior in `src/scripts/time-reminder.ts`, but move all DOM-dependent work into one `DOMContentLoaded` initialization path. Keep public metadata in Astro components and static API routes, derive generated URLs from Astro's configured `site`, and extend the existing build verifier rather than adding a test framework.

**Tech Stack:** Astro 7, TypeScript, Astro API routes, Netlify static output, pnpm, Node verification scripts.

---

## Files And Responsibilities

- Modify `src/scripts/time-reminder.ts`: centralize DOM/runtime initialization, use configured reminder intervals, rewrite malformed reminder storage.
- Modify `src/pages/index.astro`: pass explicit homepage title and description.
- Modify `src/components/Footer.astro`: add About and Contact navigation links.
- Modify `src/pages/robots.txt.ts`: preserve the existing `sitemap-index.xml` target and no-site fallback.
- Modify `src/pages/llms.txt.ts`: derive all first-party URLs from configured `site` instead of hardcoding the production origin.
- Modify `scripts/verify-build.mjs`: verify robots points to the deployed sitemap file and generated text includes configured-origin URLs.
- Add `scripts/verify-runtime-source.mjs`: assert DOM-dependent listeners/timer are initialized from the ready handler and runtime interval configuration is not duplicated.
- Modify `package.json`: add a `verify:runtime` script.

## Task 1: Centralize Runtime Initialization

**Files:**
- Modify: `src/scripts/time-reminder.ts:94-154,264-270`
- Add: `scripts/verify-runtime-source.mjs`
- Modify: `package.json:6-17`

- [ ] **Step 1: Write source-level regression checks.**

Create `scripts/verify-runtime-source.mjs`:

```js
import fs from "node:fs";

const source = fs.readFileSync("src/scripts/time-reminder.ts", "utf8");
const readyStart = source.indexOf('document.addEventListener("DOMContentLoaded"');
const readyEnd = source.indexOf("});", readyStart);
const readyBlock = source.slice(readyStart, readyEnd);

if (readyStart < 0 || readyEnd < 0) throw new Error("Missing DOM ready initializer");
if (!readyBlock.includes("setInterval(getTime, 1000)")) {
  throw new Error("Clock interval is not initialized after DOM ready");
}
if (!readyBlock.includes('button.addEventListener("click", toggleAlarm)')) {
  throw new Error("Alarm listeners are not initialized after DOM ready");
}
if (source.slice(readyEnd).includes('setInterval(getTime, 1000)')) {
  throw new Error("Clock interval starts outside DOM ready initializer");
}
if (source.slice(readyEnd).includes('button.addEventListener("click", toggleAlarm)')) {
  throw new Error("Alarm listener starts outside DOM ready initializer");
}
if (source.includes('const reminderMinutes = ["00", "15", "30", "45"]')) {
  throw new Error("Reminder intervals are duplicated outside CONFIG");
}

console.log("Runtime source verification passed");
```

- [ ] **Step 2: Run the regression check before implementation.**

Run: `node scripts/verify-runtime-source.mjs`

Expected: FAIL because the current timer and alarm listeners are outside the `DOMContentLoaded` handler.

- [ ] **Step 3: Move DOM-dependent setup into one initializer.**

Inside the existing `DOMContentLoaded` callback, keep this order:

```ts
initializeAlarms();
initializeRemindUntil();
initializeReminderControls();
initializeVolumeControls();
getTime();
setInterval(getTime, 1000);
```

Move the current reminder input/toggle listeners, volume query/setup, and `ALARM_KEYS.forEach` button listener registration into named functions called by that callback. Remove their top-level execution. Keep `alarmSound` and `endSound` construction at module scope because they do not query DOM.

- [ ] **Step 4: Use `CONFIG.REMINDER_INTERVALS` for alarm processing.**

Replace the duplicate local array in `timeReminder` with:

```ts
CONFIG.REMINDER_INTERVALS.forEach((time, index) => {
  const alarmKey = ALARM_KEYS[index];
  // existing alarm processing
});
```

Keep `CONFIG.REMINDER_INTERVALS` as the sole interval definition.

- [ ] **Step 5: Run runtime regression checks.**

Run: `node scripts/verify-runtime-source.mjs`

Expected: `Runtime source verification passed`.

- [ ] **Step 6: Add package command.**

Add to `package.json`:

```json
"verify:runtime": "node scripts/verify-runtime-source.mjs"
```

## Task 2: Rewrite Invalid Reminder Storage

**Files:**
- Modify: `src/scripts/time-reminder.ts:294-339`
- Modify: `scripts/verify-runtime-source.mjs`

- [ ] **Step 1: Extend source regression check.**

Require the invalid-state branch to call the existing persistence helper with the default object:

```js
const invalidBranch = source.slice(
  source.indexOf("if (savedRemindUntil)"),
  source.indexOf("const remindUntilInput", source.indexOf("if (savedRemindUntil)")),
);
if (!invalidBranch.includes("saveRemindUntil()")) {
  throw new Error("Invalid remindUntil state is not rewritten");
}
```

- [ ] **Step 2: Run check before implementation.**

Run: `node scripts/verify-runtime-source.mjs`

Expected: FAIL with `Invalid remindUntil state is not rewritten` after Task 1 passes.

- [ ] **Step 3: Persist the fallback state.**

In the invalid saved-data branch, assign the default state and immediately call `saveRemindUntil()` after assignment. Use `CONFIG.DEFAULT_REMIND_UNTIL` instead of repeating `"17:00"`:

```ts
remindUntil = {
  time: CONFIG.DEFAULT_REMIND_UNTIL,
  enabled: false,
};
saveRemindUntil();
```

Also initialize the module-level default with `CONFIG.DEFAULT_REMIND_UNTIL` only if declaration order permits; otherwise define a typed default constant after `CONFIG` and use it in both locations.

- [ ] **Step 4: Run runtime verification.**

Run: `pnpm run verify:runtime`

Expected: PASS.

## Task 3: Complete Homepage Metadata And Footer Navigation

**Files:**
- Modify: `src/pages/index.astro:9`
- Modify: `src/components/Footer.astro:7-20`
- Modify: `scripts/verify-build.mjs`

- [ ] **Step 1: Add explicit homepage metadata.**

Change the homepage layout invocation to:

```astro
<BaseLayout
  title="Time Reminder | Audible reminders every quarter hour"
  description="Set audible reminders at :00, :15, :30, or :45 and keep track of time in your browser."
>
```

- [ ] **Step 2: Add local footer navigation.**

Add these links to `.footer-links`, alongside Terms and Privacy:

```astro
<a href="/about">About</a>
<a href="/contact">Contact</a>
```

- [ ] **Step 3: Extend build verification.**

Require generated homepage HTML to contain the explicit title and footer links:

```js
const homepage = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const text of [
  "Time Reminder | Audible reminders every quarter hour",
  'href="/about"',
  'href="/contact"',
]) {
  if (!homepage.includes(text)) throw new Error(`Homepage missing ${text}`);
}
```

## Task 4: Keep Robots And `llms.txt` URL Sources Consistent

**Files:**
- Modify: `src/pages/robots.txt.ts:10-20`
- Modify: `src/pages/llms.txt.ts:3-24`
- Modify: `scripts/verify-build.mjs`

- [ ] **Step 1: Preserve the sitemap index target.**

Keep production output pointing to the sitemap index:

```ts
return new Response(getRobotsTxt(new URL("sitemap-index.xml", site)), {
```

Keep the existing no-site fallback without a sitemap line.

- [ ] **Step 2: Derive the live app URL in `llms.txt`.**

Change `getLlmsTxt` to use `siteURL` for the product link:

```ts
- [Time Reminder](${siteURL.href}): Use the live web app.
```

Keep repository and related-tool URLs unchanged. Continue requiring configured `site` because the endpoint cannot produce correct first-party absolute links without it.

- [ ] **Step 3: Verify sitemap index and child sitemap artifacts.**

Keep parsing the robots sitemap URL, verify it resolves to `dist/sitemap-index.xml`, then verify every child sitemap referenced by the index exists and contains the expected routes. Require `dist/llms.txt` to contain `https://timeremind.info/` only through the configured build output, not a source hardcode.

- [ ] **Step 4: Run generated artifact verification.**

Run: `pnpm run verify:build`

Expected: PASS with robots pointing to `sitemap-index.xml`, the index referencing existing child sitemaps, and generated `llms.txt` containing the configured site URL.

## Task 5: Final Verification

**Files:**
- No additional production files.

- [ ] **Step 1: Run all checks.**

```bash
pnpm run check
pnpm run lint
pnpm run format:check
git diff --check
pnpm run verify:runtime
pnpm run verify:build
```

Expected: all commands exit 0; Astro reports zero diagnostics; ESLint reports no findings; Prettier reports all files formatted; artifact and runtime verifiers pass.

- [ ] **Step 2: Inspect generated output.**

Confirm:

- `dist/index.html` contains explicit homepage title and description.
- `dist/index.html` contains About and Contact footer links.
- `dist/robots.txt` points to `/sitemap-index.xml`.
- `dist/sitemap-index.xml` references existing child sitemap files.
- `dist/llms.txt` uses configured site origin for the Time Reminder link and first-party pages.
- `dist/privacy/index.html` and `dist/terms/index.html` remain generated.

- [ ] **Step 3: Review scope.**

Run:

```bash
git status --short
git diff --stat
git diff -- src/scripts/time-reminder.ts src/pages/index.astro src/components/Footer.astro src/pages/robots.txt.ts src/pages/llms.txt.ts scripts/verify-runtime-source.mjs scripts/verify-build.mjs package.json
```

Ensure only the eight requested findings plus their verification coverage changed. Do not commit unless explicitly requested.
