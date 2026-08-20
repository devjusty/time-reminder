import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
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
  if (!fs.existsSync(path.join(dist, file))) {
    throw new Error(`Missing dist/${file}`);
  }
}

const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
const sitemapPath = robots.match(/^Sitemap:\s+https?:\/\/[^/]+\/(.+)$/m)?.[1];
if (!sitemapPath) throw new Error("robots.txt has no sitemap URL");
if (path.isAbsolute(sitemapPath) || sitemapPath.split("/").includes("..")) {
  throw new Error(`Invalid sitemap path: ${sitemapPath}`);
}

const sitemapFile = path.join(dist, sitemapPath);
if (!fs.existsSync(sitemapFile)) {
  throw new Error(`robots.txt points to missing sitemap: ${sitemapPath}`);
}

const sitemapIndex = fs.readFileSync(sitemapFile, "utf8");
const sitemapUrl = robots.match(/^Sitemap:\s+(https?:\/\/[^/]+)/m)?.[1];
const sitemapOrigin = new URL(sitemapUrl).origin;
const childSitemaps = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/gi)]
  .map(([, value]) => {
    try {
      const url = new URL(value, `${sitemapOrigin}/`);
      if (url.origin !== sitemapOrigin) return null;
      return url.pathname.replace(/^\//, "");
    } catch {
      return null;
    }
  })
  .filter((file) => file?.startsWith("sitemap-") && file.endsWith(".xml"));
const sitemap = [
  sitemapIndex,
  ...childSitemaps.map((file) => {
    const childPath = path.join(dist, file);
    if (!fs.existsSync(childPath)) throw new Error(`Missing ${file}`);
    return fs.readFileSync(childPath, "utf8");
  }),
].join("\n");
for (const route of ["/", "/about", "/contact", "/privacy", "/terms"]) {
  const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(
    ([, value]) => {
      try {
        const url = new URL(value, `${sitemapOrigin}/`);
        if (url.origin !== sitemapOrigin) return "";
        const pathname = url.pathname;
        return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
      } catch {
        return value === route ? value : "";
      }
    },
  );
  if (!sitemapRoutes.includes(route))
    throw new Error(`Sitemap missing ${route}`);
}

const homepage = fs
  .readFileSync(path.join(dist, "index.html"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<script\b[\s\S]*?<\/script>/gi, "");
const normalizeText = (html) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const parseAttributes = (attrs) =>
  Object.fromEntries(
    [...attrs.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, key, double, single]) => [key.toLowerCase(), double ?? single ?? ""],
    ),
  );
const controls = [
  ...homepage.matchAll(
    /<(input|button|select|textarea|output|meter|progress)\b([^>]*)>/gi,
  ),
].map(([, tag, attrs]) => ({
  tag: tag.toLowerCase(),
  attrs,
  attributes: parseAttributes(attrs),
  id: parseAttributes(attrs).id,
}));
const labels = [
  ...homepage.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi),
].map(([, attrs, content]) => ({
  text: normalizeText(content),
  forId: parseAttributes(attrs).for,
  content,
}));
const requireAssociatedLabel = (text) => {
  const label = labels.find((candidate) => candidate.text === text);
  const associatedByFor =
    label?.forId && controls.some(({ id }) => id === label.forId);
  const associatedImplicitly =
    label?.content &&
    /<(?:input|button|select|textarea|output|meter|progress)\b/i.test(
      label.content,
    );
  if (!label || (!associatedByFor && !associatedImplicitly)) {
    throw new Error(`Homepage missing associated label: ${text}`);
  }
};
for (const pattern of [
  /<title>\s*Time Reminder \| Audible reminders every quarter hour\s*<\/title>/i,
]) {
  if (!pattern.test(homepage)) throw new Error(`Homepage missing ${pattern}`);
}
const links = [...homepage.matchAll(/<a\b([^>]*)>/gi)].map(([, attrs]) =>
  parseAttributes(attrs),
);
for (const href of ["/about", "/contact", "#main-content"]) {
  if (!links.some((attributes) => attributes.href === href)) {
    throw new Error(`Homepage missing link: ${href}`);
  }
}
requireAssociatedLabel("Remind me at");
requireAssociatedLabel("Stop reminders at");
requireAssociatedLabel("Enable end time");

const llms = fs.readFileSync(path.join(dist, "llms.txt"), "utf8");
if (!llms.includes("https://timeremind.info/")) {
  throw new Error("llms.txt missing configured site URL");
}

for (const route of [
  "index.html",
  "about/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
]) {
  const html = fs.readFileSync(path.join(dist, route), "utf8");
  if (!html.match(/<title>[^<]+<\/title>/))
    throw new Error(`Missing title in dist/${route}`);
}

console.log("Build artifact verification passed");
