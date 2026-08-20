// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import astroMetaTags from "astro-meta-tags";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
// https://astro.build/config
export default defineConfig({
  site: "https://timeremind.info",
  adapter: netlify(),
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Satoshi",
      cssVariable: "--font-satoshi",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/satoshi-regular-webfont.woff2"],
            weight: "normal",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/satoshi-light-webfont.woff2"],
            weight: "300",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/satoshi-bold-webfont.woff2"],
            weight: "700",
            style: "normal",
          },
        ],
      },
    },
  ],
  integrations: [astroMetaTags(), sitemap()],
});
