import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';

/**
 * The ONLY module in `src/` that imports from `@keystatic/*` or the CMS config.
 * Everything else in the app talks to `./index.ts` (the public content API).
 * Swapping the CMS later means rewriting this folder and nothing else.
 */
export const reader = createReader(process.cwd(), keystaticConfig);

export type KeystaticReader = typeof reader;
