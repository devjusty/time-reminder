// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import astroMetaTags from "astro-meta-tags";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
// https://astro.build/config
export default defineConfig({
  site: "https://timeremind.info",
  adapter: netlify(),
    fonts: [{
    provider: fontProviders.local(),
    name: "Satoshi",
    cssVariable: "--font-satoshi",
    options: {
      variants: [{
        src: ['./src/assets/fonts/satoshi-regular-webfont.woff2'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  }],
  integrations: [astroMetaTags(), sitemap()],
});
