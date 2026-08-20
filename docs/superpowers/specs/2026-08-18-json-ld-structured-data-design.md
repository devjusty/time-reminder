# JSON-LD Structured Data Design

## Goal

Improve search engines' understanding of TimeReminder as a browser-based utility app while keeping all structured data truthful and consistent with visible page content.

## Scope

Add one JSON-LD `WebApplication` node to `index.html`. The node will include:

- `@context`: `https://schema.org`
- `@type`: `WebApplication`
- `name`: `TimeReminder`
- `url`: `https://timeremind.info`
- `description`: the existing page description
- `applicationCategory`: `UtilitiesApplication`
- `operatingSystem`: `Web`
- `image`: the existing TimeReminder screenshot URL

No ratings, reviews, prices, download claims, or publisher claims will be added because the page does not currently expose those facts.

## Placement

Insert a `<script type="application/ld+json">` block in the document head near existing page metadata. Keep JSON valid, static, and free of JavaScript interpolation.

## Compatibility

The canonical URL, Open Graph URL, Twitter URL, and JSON-LD URL will use the existing no-trailing-slash convention. The schema describes the same page and application represented by the visible title and description.

## Validation

Validate JSON syntax locally and inspect the resulting HTML. Run the Google Rich Results Test after deployment; `WebApplication` improves semantic understanding but is not expected to qualify for the `SoftwareApplication` rich result until the site has visible, verifiable review or rating data.

## Future Extension

If the product later displays genuine user reviews or ratings, revisit whether adding `SoftwareApplication` properties is appropriate. Do not add those properties before the corresponding content is visible on the page.
