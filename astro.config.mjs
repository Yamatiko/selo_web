// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';

// Kept in sync with src/config/site.ts (build tooling can't import the TS module).
const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

// Most routes are prerendered (static). Keystatic injects `/keystatic` and
// `/api/keystatic` as on-demand routes, so we keep `output: 'static'` and let
// the Netlify adapter handle the few dynamic endpoints.
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // `devFeatures: false` keeps `astro dev` as a plain Astro server (no Netlify
  // edge/Deno emulation — it needs Deno and isn't needed for this site).
  adapter: netlify({ devFeatures: false, imageCDN: false }),
  integrations: [react(), keystatic(), sitemap()],
  // No server-side session state is used; skip the Netlify Blobs session store.
  session: false,
  markdown: {
    shikiConfig: { theme: 'css-variables' },
  },
});
