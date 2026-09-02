import { collection, fields } from '@keystatic/core';
import { coauthors, draft, externalLinks, order, pdf, richText, year } from '../fields/shared';

export const publications = collection({
  label: 'Research · Publications',
  path: 'content/research/publications/*',
  slugField: 'title',
  format: { contentField: 'abstract' },
  columns: ['title', 'year'],
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    year,
    coauthors,
    journal: fields.text({ label: 'Journal / Publisher' }),
    volume: fields.text({ label: 'Volume' }),
    issue: fields.text({ label: 'Issue' }),
    pages: fields.text({ label: 'Pages' }),
    doi: fields.text({ label: 'DOI', description: 'Just the identifier, e.g. 10.1000/xyz123' }),
    pdf,
    links: externalLinks,
    abstract: richText('Abstract'),
    order,
    draft,
  },
});
