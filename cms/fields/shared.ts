import { fields } from '@keystatic/core';

/**
 * Reusable field fragments shared across collections.
 * Keep every schema piece that repeats here so a change lands in one place.
 */

/** Markdoc rich-text with a consistent image upload location. */
export const richText = (label: string) =>
  fields.markdoc({
    label,
    options: {
      image: {
        directory: 'public/media/content',
        publicPath: '/media/content/',
      },
    },
  });

export const coauthors = fields.array(
  fields.object({
    name: fields.text({ label: 'Name' }),
    url: fields.text({ label: 'URL (optional)' }),
  }),
  {
    label: 'Co-authors',
    itemLabel: (props) => props.fields.name.value || 'Co-author',
  },
);

export const externalLinks = fields.array(
  fields.object({
    label: fields.text({ label: 'Label', description: 'e.g. SSRN, Slides, DOI, Journal' }),
    url: fields.url({ label: 'URL' }),
  }),
  {
    label: 'Links',
    itemLabel: (props) => props.fields.label.value || 'Link',
  },
);

/** A PDF the visitor can download: either an uploaded file or an external URL. */
export const pdf = fields.object(
  {
    file: fields.file({
      label: 'PDF file',
      directory: 'public/media/papers',
      publicPath: '/media/papers/',
    }),
    url: fields.text({ label: 'External PDF URL (used if no file is uploaded)' }),
  },
  { label: 'PDF' },
);

export const year = fields.integer({
  label: 'Year',
  validation: { min: 1900, max: 2100 },
});

export const order = fields.integer({
  label: 'Manual order',
  description: 'Lower numbers show first. Ties fall back to year (newest first).',
  defaultValue: 0,
});

export const draft = fields.checkbox({
  label: 'Draft',
  description: 'Hidden from the published site.',
  defaultValue: false,
});
