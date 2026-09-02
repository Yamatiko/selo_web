/**
 * Build-time constants. Values that rarely change and are needed before any
 * content is read. Keep in sync with the mirror in `astro.config.mjs`.
 */
export const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

/** Fallback used for <title> and OG tags until Site Settings are filled in. */
export const FALLBACK_TITLE = 'Academic Site';

/** Where uploaded media lives under /public. */
export const MEDIA_BASE = '/media';
