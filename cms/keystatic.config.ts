import { config } from '@keystatic/core';

import { home } from './collections/home';
import { cv } from './collections/cv';
import { researchPage, hobbiesPage } from './collections/pages';
import { contact } from './collections/contact';
import { siteSettings } from './collections/site-settings';
import { news } from './collections/news';
import { workInProgress } from './collections/work-in-progress';
import { workingPapers } from './collections/working-papers';
import { publications } from './collections/publications';
import { hobbies } from './collections/hobbies';

/**
 * CMS layer (isolated). This module and everything it imports depends only on
 * `@keystatic/core` — never on `src/`. The Astro side reads content exclusively
 * through `src/lib/content/`.
 *
 * This file is bundled for the browser (the /keystatic admin), so it must use
 * `import.meta.env` — never `process.env`.
 *
 * Storage is decided purely by whether PUBLIC_KEYSTATIC_GITHUB_REPO is set:
 *  - not set  → local mode (admin writes files straight to the working tree)
 *  - set      → GitHub mode (admin commits via a GitHub App)
 *
 * It is deliberately NOT gated on `import.meta.env.PROD` so the one-time
 * "Create GitHub App" setup wizard can be run locally (`.env` with the repo var),
 * which is the only place it can write the generated secrets to `.env`.
 */
const repo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

export default config({
  storage: repo ? { kind: 'github', repo } : { kind: 'local' },
  ui: {
    brand: { name: 'Site admin' },
    navigation: {
      Pages: ['home', 'cv', 'researchPage', 'hobbiesPage', 'contact'],
      Research: ['workInProgress', 'workingPapers', 'publications'],
      Content: ['news', 'hobbies'],
      Settings: ['siteSettings'],
    },
  },
  singletons: { home, cv, researchPage, hobbiesPage, contact, siteSettings },
  collections: { news, workInProgress, workingPapers, publications, hobbies },
});
