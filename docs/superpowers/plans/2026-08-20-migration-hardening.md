# Astro Migration Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Google's CMP, gate Analytics and AdSense on consent, resolve remaining Astro migration bugs, and verify metadata, accessibility, robots, and sitemap generation.

**Architecture:** Keep current Astro component structure and global CSS. Load Google's account-generated CMP configuration first, let its consent signal control Analytics and AdSense injection, harden browser-only runtime code at its existing entry point, add semantic attributes in Astro components, make layout metadata resilient to missing site configuration, and verify generated static artifacts directly from `dist/`.

**Tech Stack:** Astro 7, TypeScript, Netlify adapter, `@astrojs/sitemap`, `astro-seo`, pnpm.

---

## Files And Responsibilities

- Modify `src/scripts/time-reminder.ts`: validate persisted alarm data, synchronize button state, safely restore reminder controls, handle audio promise failures.
- Modify `src/components/TimeToggles.astro`: expose reminder group semantics and pressed state.
- Modify `src/components/Clock.astro`: provide accessible clock labeling and live output.
- Modify `src/components/RemindUntil.astro`: keep native checkbox semantics and improve labeling.
- Modify `src/components/Volume.astro`: associate range output and expose updates.
- Modify `src/layouts/BaseLayout.astro`: make canonical and social URLs safe, use a real social image asset.
- Modify `src/components/GoogleAnalytics.astro`, add Google CMP and AdSense integration components, and preserve privacy copy while keeping both scripts behind Google's consent signal.
- Modify `src/pages/robots.txt.ts`: safely generate sitemap URL when `site` exists.
- Modify `astro.config.mjs` only if sitemap verification proves configuration needs change.
- Add `scripts/verify-build.mjs`: assert required routes, sitemap references, robots output, footer, and social image after build.

## Task 1: Harden Persisted Runtime State

**Files:**
- Modify: `src/scripts/time-reminder.ts:5-10, 201-253, 267-307, 314-334`

- [ ] **Step 1: Define validation behavior before editing.**

Use these rules:

```ts
const ALARM_KEYS = ["alarm1", "alarm2", "alarm3", "alarm4"] as const;
type AlarmKey = (typeof ALARM_KEYS)[number];
type AlarmState = Record<AlarmKey, boolean>;

function isAlarmState(value: unknown): value is AlarmState {
  return (
    typeof value === "object" &&
    value !== null &&
    ALARM_KEYS.every(
      (key) => typeof (value as Record<string, unknown>)[key] === "boolean",
    )
  );
}
```

Invalid or partial storage must fall back to `{ alarm1: true, alarm2: false, alarm3: false, alarm4: false }` and overwrite storage with that valid state.

- [ ] **Step 2: Update alarm initialization and toggle rendering.**

Use `isAlarmState` before assigning parsed storage. Ensure `restoreAlarms()` iterates `ALARM_KEYS`, and update the clicked button through `event.currentTarget`:

```ts
const button = event.currentTarget as HTMLButtonElement;
const alarmId = button.id as AlarmKey;
alarms[alarmId] = !alarms[alarmId];
button.classList.toggle("active", alarms[alarmId]);
button.setAttribute("aria-pressed", String(alarms[alarmId]));
```

- [ ] **Step 3: Restore reminder controls from validated state only.**

When saved data fails validation, leave `remindUntil` at its default. Always populate controls from `remindUntil.time` and `remindUntil.enabled`, never directly from `savedRemindUntil`.

- [ ] **Step 4: Handle end sound rejection.**

Replace bare `endSound.play()` with:

```ts
void endSound.play().catch((error: unknown) => {
  Logger.error("Error playing end sound:", error);
});
```

- [ ] **Step 5: Run checks.**

Run `pnpm run check` and `pnpm run lint`. Expected: zero diagnostics and zero ESLint output.

## Task 2: Improve Homepage Accessibility

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/TimeToggles.astro`
- Modify: `src/components/Clock.astro`
- Modify: `src/components/RemindUntil.astro`
- Modify: `src/components/Volume.astro`
- Modify: `src/scripts/time-reminder.ts`

- [ ] **Step 1: Add named main landmark.**

In `index.astro`, add a visually-hidden heading and reference it:

```astro
<main class="app" aria-labelledby="app-title">
  <h1 id="app-title" class="visually-hidden">TimeReminder</h1>
```

Add `.visually-hidden` to global CSS using a clipped, absolutely positioned pattern that remains available to assistive technology.

- [ ] **Step 2: Name reminder controls.**

Wrap time buttons in `fieldset` with `legend>Remind at</legend>`, or use a labelled group. Add `aria-pressed="true"` to `alarm1` and `aria-pressed="false"` to others. Runtime restoration and toggling must synchronize this attribute.

- [ ] **Step 3: Label clock output.**

Add `role="timer"`, `aria-live="polite"`, and an accessible label to the digital clock. Keep visual text updates unchanged.

- [ ] **Step 4: Preserve native switch semantics.**

Keep the native checkbox as the interactive control, ensure its visible label clearly names it, and mark decorative slider span `aria-hidden="true"`.

- [ ] **Step 5: Associate volume output.**

Use `<output id="volume-value" for="volume">50</output>` and update its text in the existing input handler. Add `aria-valuetext` only if native output is insufficient after browser inspection.

- [ ] **Step 6: Run checks.**

Run `pnpm run check`, `pnpm run lint`, and `git diff --check`.

## Task 3: Fix Metadata And Asset References

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `astro.config.mjs` only if needed
- Add or move: social image into `public/` if source inspection confirms missing output

- [ ] **Step 1: Confirm missing social image.**

Run:

```bash
test -f public/time-reminder-screenshot.jpg && echo present || echo missing
test -f src/assets/time-reminder-screenshot.jpg && echo present || echo missing
```

- [ ] **Step 2: Make social image real.**

Use the existing screenshot source if available. Otherwise copy the intended tracked screenshot into `public/time-reminder-screenshot.jpg` using a non-destructive file operation. Keep `socialImage` as a root-relative public URL.

- [ ] **Step 3: Guard site-dependent URLs.**

Use `Astro.site` when configured. For local preview without a site, avoid throwing while rendering. Canonical and social URL generation must remain absolute in production and may be omitted or safely relative in local preview.

- [ ] **Step 4: Verify metadata output.**

Run `pnpm run build`, then assert every HTML route contains a title and that homepage metadata references an existing social image URL.

## Task 4: Prepare Consent-Gated Analytics And AdSense

**Files:**
- Modify: `src/components/GoogleAnalytics.astro`
- Create: `src/components/GoogleCmp.astro`
- Create: `src/components/GoogleAdSense.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/privacy.astro` only to correct implementation-specific wording, if needed

- [ ] **Step 1: Obtain Google's account-generated CMP configuration.**

From AdSense/Google Privacy & Messaging, obtain the site-specific publisher/property identifier and generated CMP snippet. Do not invent identifiers. Store non-secret public identifiers in environment variables or Astro config as appropriate.

- [ ] **Step 2: Load Google's CMP before consent-dependent scripts.**

Add `GoogleCmp.astro` in `<head>` using Google's exact account-generated snippet. Preserve current consent and opt-out claims. Do not load Google Analytics or AdSense unconditionally before CMP consent.

- [ ] **Step 3: Create consent-gated AdSense integration.**

Create `GoogleAdSense.astro` with the exact publisher script configuration, but inject it only after Google's CMP grants the advertising consent purpose:

```astro
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5245703105667775"
  crossorigin="anonymous"></script>
```

Do not include this component in `BaseLayout` until CMP consent state is available.

- [ ] **Step 4: Gate Analytics through Google's consent signal.**

Change `GoogleAnalytics.astro` so it does not emit its network script before analytics consent. Register the CMP callback/listener supplied by Google's generated snippet and inject the existing `gtag`/Partytown scripts only after consent. Preserve measurement ID handling.

- [ ] **Step 5: Define opt-out control behavior.**

Wire the privacy page's `data-do-not-sell` control to Google's CMP privacy/options UI or generated opt-out API. It must be visibly rendered when applicable, keyboard accessible, and must not remain a permanently hidden dead link.

- [ ] **Step 6: Verify generated privacy page and consent gating.**

Run `pnpm run build`; assert generated privacy HTML preserves consent copy and Google settings links. Assert CMP snippet appears before consent-dependent integrations and AdSense/Analytics network scripts are not emitted as unconditional static scripts. Test accept, reject, and settings flows in browser.

## Task 5: Verify Robots And Sitemap Generation

**Files:**
- Modify: `src/pages/robots.txt.ts` only if guard is needed
- Add: `scripts/verify-build.mjs`
- Modify: `package.json` to add `verify:build`

- [ ] **Step 1: Inspect generated sitemap artifacts.**

After `pnpm run build`, run:

```bash
ls dist/sitemap*.xml
node -e 'const fs=require("fs"); console.log(fs.readFileSync("dist/robots.txt","utf8"))'
```

Confirm whether `dist/sitemap-index.xml` exists and whether it references generated child sitemap files.

- [ ] **Step 2: Verify robots target.**

`dist/robots.txt` must contain exactly one absolute sitemap URL pointing to an existing generated sitemap file. If Astro emits `sitemap-index.xml`, keep current URL. If it emits only `sitemap-0.xml`, update route generation to that actual file.

- [ ] **Step 3: Add deterministic build verification script.**

`scripts/verify-build.mjs` should:

```js
import fs from "node:fs";
import path from "node:path";

const required = [
  "index.html",
  "about/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "robots.txt",
  "llms.txt",
];

for (const file of required) {
  if (!fs.existsSync(path.join("dist", file))) throw new Error(`Missing dist/${file}`);
}

const robots = fs.readFileSync("dist/robots.txt", "utf8");
const sitemapPath = robots.match(/^Sitemap:\s+https?:\/\/[^/]+\/(.+)$/m)?.[1];
if (!sitemapPath || !fs.existsSync(path.join("dist", sitemapPath))) {
  throw new Error(`robots.txt points to missing sitemap: ${sitemapPath ?? "none"}`);
}

const sitemap = fs.readFileSync(path.join("dist", sitemapPath), "utf8");
for (const route of ["/", "/about", "/contact", "/privacy", "/terms"]) {
  if (!sitemap.includes(route)) throw new Error(`Sitemap missing ${route}`);
}

console.log("Build artifact verification passed");
```

Adapt child-sitemap handling if the index references `sitemap-0.xml`; verify all referenced files and check route URLs in child files.

- [ ] **Step 4: Add package script.**

Add:

```json
"verify:build": "pnpm run build && node scripts/verify-build.mjs"
```

- [ ] **Step 5: Run verification.**

Run `pnpm run verify:build`. Expected: build succeeds, all required artifacts exist, robots points to an existing sitemap, and sitemap contains all public routes.

## Task 6: Final Verification And Review

**Files:**
- No new production files beyond tasks above.

- [ ] **Step 1: Run full checks.**

```bash
pnpm run check
pnpm run lint
pnpm run format:check
git diff --check
pnpm run verify:build
```

- [ ] **Step 2: Inspect generated output.**

Confirm:

- Homepage has one named main landmark.
- About and Contact render through `BaseLayout`.
- Privacy and Terms retain footer and skip-link behavior.
- Social image URL resolves to a built file.
- Robots sitemap URL resolves to a generated sitemap.
- Sitemap includes `/`, `/about`, `/contact`, `/privacy`, and `/terms`.

- [ ] **Step 3: Review diff for scope.**

Run `git status --short` and `git diff --stat`. Ensure only migration-hardening files changed. Do not revert unrelated user changes.

- [ ] **Step 4: Commit in focused units.**

Use separate commits for runtime/accessibility, metadata/privacy, and sitemap verification:

```bash
git add src/scripts/time-reminder.ts src/components src/pages/index.astro src/styles/global.css
git commit -m "fix: harden migrated app runtime and accessibility"

git add src/layouts/BaseLayout.astro src/components/GoogleAnalytics.astro src/pages/privacy.astro public/time-reminder-screenshot.jpg
git commit -m "fix: align migrated metadata and privacy behavior"

git add src/pages/robots.txt.ts scripts/verify-build.mjs package.json
git commit -m "test: verify sitemap build artifacts"
```
