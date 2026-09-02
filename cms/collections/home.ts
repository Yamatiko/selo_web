import { singleton, fields } from '@keystatic/core';
import { richText } from '../fields/shared';

export const home = singleton({
  label: 'Page · Home',
  path: 'content/pages/home/',
  format: { contentField: 'intro' },
  schema: {
    name: fields.text({ label: 'Full name' }),
    role: fields.text({ label: 'Role', description: 'e.g. PhD Candidate in Economics' }),
    affiliation: fields.text({ label: 'Affiliation', description: 'University / department' }),
    location: fields.text({ label: 'Location (optional)' }),
    photo: fields.image({
      label: 'Portrait (optional)',
      directory: 'public/media/site',
      publicPath: '/media/site/',
    }),
    photoAlt: fields.text({ label: 'Portrait alt text' }),
    intro: richText('Introduction'),
    showNews: fields.checkbox({ label: 'Show a "News" list on the home page', defaultValue: true }),
    newsLimit: fields.integer({ label: 'How many news items to show', defaultValue: 4 }),
  },
});
