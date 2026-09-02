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
 * Storage:
 *  - dev             → local mode (writes files straight to the working tree)
 *  - prod + repo env  → GitHub mode (the /keystatic admin commits via a GitHub App)
 *  - prod, no env     → falls back to local mode (reads still work at build time)
 */
const repo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;
const useGitHub = import.meta.env.PROD && !!repo;

export default config({
  storage: useGitHub ? { kind: 'github', repo: repo! } : { kind: 'local' },
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
