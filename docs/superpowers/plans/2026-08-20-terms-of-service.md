# Terms of Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an indexable Terms of Service page for Time Reminder and link it from the shared footer.

**Architecture:** Add one Astro page using existing `BaseLayout` and legal-page styling patterns from `privacy.astro`. Add one internal footer link without changing existing navigation or privacy behavior.

**Tech Stack:** Astro 7, TypeScript, Prettier, Astro check, pnpm.

---

### Task 1: Add Terms page

**Files:**
- Create: `src/pages/terms.astro`

- [ ] **Step 1: Create page metadata and document shell**

Use `BaseLayout`, title `Terms of Service | Time Reminder`, a service-specific description, skip link, `main#main-content`, and `Last updated: August 20, 2026`.

- [ ] **Step 2: Add substantive Terms sections**

Add numbered sections covering agreement, free service and eligibility, no accounts, acceptable use, advertising and affiliates, intellectual property, third-party services, availability, warranties, liability, termination, changes, and contact/copyright complaints. Identify “Justin Thompson, operating Time Reminder,” use `hello@timeremind.info`, omit a mailing address and governing-law venue, and include the USD $100 liability cap plus jurisdictional carve-out.

- [ ] **Step 3: Add page-local responsive styling**

Match `privacy.astro` with a constrained readable width, spaced sections, existing color variables, visible link focus/hover behavior inherited from project conventions, readable lists, and a legal-review notice.

- [ ] **Step 4: Check page content for unresolved placeholders**

Run:

```bash
rg -n "TBD|TODO|\[.*\]" src/pages/terms.astro
```

Expected: no output.

### Task 2: Link Terms in footer

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Add internal Terms link**

Add `<a href="/terms">Terms of Service</a>` to the existing `.footer-links` list. Preserve all existing external links and their `target` and `rel` attributes.

### Task 3: Verify page and integration

**Files:**
- Verify: `src/pages/terms.astro`
- Verify: `src/components/Footer.astro`

- [ ] **Step 1: Run Astro type/content checks**

Run `pnpm check`.

Expected: command exits 0 with no errors.

- [ ] **Step 2: Run production build**

Run `pnpm build`.

Expected: command exits 0 and generates `dist/terms/index.html`.

- [ ] **Step 3: Run formatting verification**

Run `pnpm format:check`.

Expected: command exits 0.

- [ ] **Step 4: Confirm generated route and key copy**

Run:

```bash
test -f dist/terms/index.html
rg -n "Terms of Service|August 20, 2026|hello@timeremind.info|Justin Thompson|\$100" dist/terms/index.html
```

Expected: route exists and all key Terms content is present.

- [ ] **Step 5: Review final diff**

Run `git diff --check` and `git status --short`. Confirm only the planned page, footer, and plan files are newly changed; do not modify unrelated existing worktree changes.
