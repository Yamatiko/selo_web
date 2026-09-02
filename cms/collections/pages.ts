import { singleton, fields } from '@keystatic/core';
import { richText } from '../fields/shared';

/** Short intro blurbs that sit at the top of the Research and Hobbies pages. */

export const researchPage = singleton({
  label: 'Page · Research (intro)',
  path: 'content/pages/research/',
  format: { contentField: 'intro' },
  schema: {
    heading: fields.text({ label: 'Heading', defaultValue: 'Research' }),
    intro: richText('Intro'),
  },
});

export const hobbiesPage = singleton({
  label: 'Page · Hobbies (intro)',
  path: 'content/pages/hobbies/',
  format: { contentField: 'intro' },
  schema: {
    heading: fields.text({ label: 'Heading', defaultValue: 'Hobbies' }),
    intro: richText('Intro'),
  },
});
