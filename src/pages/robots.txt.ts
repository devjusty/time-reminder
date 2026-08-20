import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response("User-agent: *\nAllow: /\n", {
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response(getRobotsTxt(new URL("sitemap-index.xml", site)), {
    headers: { "Content-Type": "text/plain" },
  });
};
