import { singleton, fields } from '@keystatic/core';
import { richText } from '../fields/shared';

export const contact = singleton({
  label: 'Page · Contact',
  path: 'content/pages/contact/',
  format: { contentField: 'intro' },
  schema: {
    intro: richText('Intro (optional)'),
    email: fields.text({ label: 'Email' }),
    office: fields.text({ label: 'Office / Mailing address', multiline: true }),

    googleScholar: fields.url({ label: 'Google Scholar' }),
    orcid: fields.url({ label: 'ORCID' }),
    linkedin: fields.url({ label: 'LinkedIn' }),
    github: fields.url({ label: 'GitHub' }),
    twitter: fields.url({ label: 'X / Twitter' }),
    bluesky: fields.url({ label: 'Bluesky' }),

    enableForm: fields.checkbox({
      label: 'Show a contact form (handled by Netlify Forms)',
      defaultValue: true,
    }),
    formIntro: fields.text({ label: 'Text above the form', multiline: true }),
  },
});
