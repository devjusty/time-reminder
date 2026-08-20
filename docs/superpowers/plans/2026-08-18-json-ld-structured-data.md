# JSON-LD Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add truthful JSON-LD that identifies TimeReminder as a browser-based utility application and improves search-engine understanding.

**Architecture:** Add one static `application/ld+json` script to the existing document head in `index.html`. Use a single `WebApplication` node with values already supported by the page metadata and visible content; do not add fabricated ratings, reviews, prices, or publisher information.

**Tech Stack:** Static HTML, JSON-LD, Node.js for local validation.

---

### Task 1: Add WebApplication JSON-LD

**Files:**
- Modify: `index.html:10-12` near the existing title, description, and canonical metadata
- Test: no test file; this is static metadata configuration and will be validated by parsing the generated JSON-LD

- [ ] **Step 1: Add the JSON-LD block**

Insert this exact block in `<head>` after the canonical link:

```html
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "TimeReminder",
        "url": "https://timeremind.info",
        "description": "Keep track of time with an alternative to typical alarms and timers. Get audible reminders at the top of the hour, bottom of the hour, or the sides.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "image": "https://timeremind.info/src/time-reminder-screenshot.jpg"
      }
    </script>
```

- [ ] **Step 2: Validate JSON-LD syntax and required values**

Run:

```bash
node -e 'const fs=require("fs"); const html=fs.readFileSync("index.html","utf8"); const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); if (!match) throw new Error("JSON-LD block missing"); const data=JSON.parse(match[1]); for (const key of ["@context","@type","name","url","description","applicationCategory","operatingSystem","image"]) if (!(key in data)) throw new Error(`Missing ${key}`); if (data["@context"] !== "https://schema.org" || data["@type"] !== "WebApplication") throw new Error("Unexpected schema identity"); console.log("JSON-LD valid");'
```

Expected: `JSON-LD valid`

- [ ] **Step 3: Check formatting and diff**

Run:

```bash
npx prettier --check index.html
git diff --check
git diff -- index.html
```

Expected: Prettier reports no formatting issues, `git diff --check` is silent, and the diff contains only the new JSON-LD block.

- [ ] **Step 4: Validate after deployment**

Open the deployed page in Google's [Rich Results Test](https://search.google.com/test/rich-results) and confirm the JSON-LD is parseable. Treat any `SoftwareApplication` eligibility warning as expected because no review or rating data is present.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html
git commit -m "feat(seo): add WebApplication JSON-LD"
```

## Self-Review

- Spec coverage: one static `WebApplication` node, all eight specified properties, head placement, no unsupported claims, no-trailing-slash URL convention, local parsing, and post-deployment Rich Results validation are covered in Task 1.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: the plan uses `WebApplication` throughout and validates the same property names listed in the design.
- Scope: one HTML metadata change; no test framework or runtime code is needed.
