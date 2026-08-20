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

const sitemapFile = path.join(dist, sitemapPath);
if (!fs.existsSync(sitemapFile)) {
  throw new Error(`robots.txt points to missing sitemap: ${sitemapPath}`);
}

const sitemapIndex = fs.readFileSync(sitemapFile, "utf8");
const childSitemaps = [
  ...sitemapIndex.matchAll(/<loc>[^<]+\/(sitemap-[^<]+\.xml)<\/loc>/g),
].map(([, file]) => file);
const sitemap = [
  sitemapIndex,
  ...childSitemaps.map((file) => {
    const childPath = path.join(dist, file);
    if (!fs.existsSync(childPath)) throw new Error(`Missing ${file}`);
    return fs.readFileSync(childPath, "utf8");
  }),
].join("\n");
for (const route of ["/", "/about", "/contact", "/privacy", "/terms"]) {
  if (!sitemap.includes(route)) throw new Error(`Sitemap missing ${route}`);
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
