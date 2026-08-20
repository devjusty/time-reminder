# Terms of Service Design

## Context

Time Reminder is a free, anonymous browser timer operated personally by Justin Thompson. It has no accounts, payments, user-submitted content, AI features, or API. The site may use analytics, advertising, and affiliate links, as described in its Privacy Policy. Visitors may come from anywhere in the world. The Terms should identify the operator and provide an email contact without publishing a personal mailing address or naming a governing state or court.

## Goal

Add an indexable Terms of Service page that gives users clear rules for using Time Reminder and protects the operator against foreseeable misuse, availability expectations, and ordinary liability risks. Keep language concise and consistent with the existing Privacy Policy page.

## Proposed Changes

### New page: `src/pages/terms.astro`

Use `BaseLayout` with:

- Title: `Terms of Service | Time Reminder`
- A description explaining that the page covers use of the free Time Reminder service.
- A skip link and `main#main-content`.
- `Last updated: August 20, 2026`.
- A readable legal-page width and the same heading, link, list, border, and disclaimer styling used by `privacy.astro`.

Use these numbered sections:

1. **Agreement**: Access or use of `timeremind.info` means acceptance of the Terms; users who disagree must not use the service. Incorporate the Privacy Policy by reference for data practices.
2. **The Service and Eligibility**: Describe hourly and quarter-hour reminders, browser audio, local preferences, free access, and a minimum age of 13. Users confirm they may legally use the service in their location.
3. **No Accounts**: Explain that no registration is required, preferences may be stored locally in the browser, and users are responsible for browser/device settings and local-data loss.
4. **Acceptable Use**: Prohibit unlawful use, abuse, interference, unauthorized scraping or automation, attempts to bypass technical controls, malware, infringement, and actions that harm users or infrastructure. Reserve the right to investigate and block abusive traffic.
5. **Advertising and Affiliate Links**: State that the site may display third-party advertising and contain affiliate links, including Amazon links. Third parties control their own transactions, content, cookies, and terms; affiliate relationships do not guarantee or constitute endorsement of products.
6. **Intellectual Property**: Justin Thompson and/or licensors retain rights in the site name, design, code, interface, text, graphics, sounds, and other site materials. Grant only a limited right to use the service for personal or lawful ordinary use; prohibit copying, redistribution, modification, or reverse engineering except where law permits.
7. **Third-Party Services and Links**: Explain that browsers, hosting, analytics, advertising, affiliate providers, and linked sites are outside the operator's control and may have separate terms and policies.
8. **Free Service and Availability**: Provide the service free of charge on a best-effort basis. Do not promise uninterrupted operation, accurate time or audio delivery, compatibility, security, or continued availability. Permit rate limiting, feature changes, suspension, or discontinuation without prior notice.
9. **Disclaimer of Warranties**: Include an all-caps as-is/as-available disclaimer covering merchantability, fitness, title, non-infringement, errors, security, browser behavior, and reminder reliability.
10. **Limitation of Liability**: Exclude indirect, incidental, special, consequential, and punitive damages to the maximum extent permitted by law. Cap total liability at USD $100. Include the required jurisdictional carve-out for laws that do not permit certain exclusions or limitations.
11. **Termination and Enforcement**: Permit suspension or blocking of access for violations or abuse. State that provisions intended to survive remain effective after access ends.
12. **Changes to These Terms**: Permit updates, require a new last-updated date for material changes, and state that continued use after posting accepts the revised Terms.
13. **Contact and Copyright Complaints**: Identify “Justin Thompson, operating Time Reminder,” provide `hello@timeremind.info` for Terms and copyright complaints, and request sufficient detail for infringement notices. Do not publish a mailing address.

End with a short notice that the Terms are general information and should receive qualified legal review before publication, especially for operator jurisdiction, consumer rights, advertising, and copyright-notice requirements.

### Existing page: `src/components/Footer.astro`

Add an internal `/terms` link alongside the existing site links. Preserve all current links and external-link behavior.

## Explicit Non-Goals

- No account acceptance checkbox or signup flow.
- No payment, subscription, refund, or SLA terms.
- No AI-generated output clauses.
- No user-content license or content-retention claims.
- No named governing law, venue, arbitration forum, personal mailing address, or business entity claim.
- No unrelated Privacy Policy rewrite.

## Verification

- Run `pnpm check`.
- Run `pnpm build`.
- Run `pnpm format:check`.
- Confirm `/terms` builds and footer link points to `/terms`.
- Confirm no unresolved placeholders remain in the new page.
- Review generated page for headings, skip-link target, contact email, and Last updated date.

## Legal Boundary

This is product copy and implementation, not legal advice. A qualified attorney should review the final Terms for the operator's actual location, global visitors, advertising and affiliate activity, age language, liability cap, and copyright complaint process before publication.
