import { collection, fields } from '@keystatic/core';
import { coauthors, draft, externalLinks, order, richText, year } from '../fields/shared';

export const workInProgress = collection({
  label: 'Research · Work in progress',
  path: 'content/research/work-in-progress/*',
  slugField: 'title',
  format: { contentField: 'summary' },
  columns: ['title', 'year'],
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    year,
    status: fields.text({
      label: 'Status',
      description: 'e.g. "Data collection", "Draft in progress"',
    }),
    coauthors,
    links: externalLinks,
    summary: richText('Summary'),
    order,
    draft,
  },
});
