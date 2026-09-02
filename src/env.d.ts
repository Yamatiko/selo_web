/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** `owner/repo` — enables Keystatic GitHub mode in production. */
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO?: `${string}/${string}`;
  readonly PUBLIC_KEYSTATIC_GITHUB_APP_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
