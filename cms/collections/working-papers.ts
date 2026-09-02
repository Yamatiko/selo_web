import { collection, fields } from '@keystatic/core';
import { coauthors, draft, externalLinks, order, pdf, richText, year } from '../fields/shared';

export const workingPapers = collection({
  label: 'Research · Working papers',
  path: 'content/research/working-papers/*',
  slugField: 'title',
  format: { contentField: 'abstract' },
  columns: ['title', 'year'],
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    year,
    updated: fields.date({ label: 'Last updated (optional)' }),
    coauthors,
    pdf,
    links: externalLinks,
    abstract: richText('Abstract'),
    order,
    draft,
  },
});
