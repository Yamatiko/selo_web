import { collection, fields } from '@keystatic/core';
import { richText } from '../fields/shared';

export const news = collection({
  label: 'News',
  path: 'content/news/*',
  slugField: 'title',
  format: { contentField: 'body' },
  columns: ['title', 'date'],
  parseSlugForSort: (slug) => slug,
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    date: fields.date({
      label: 'Date',
      defaultValue: { kind: 'today' },
    }),
    body: richText('Body'),
  },
});
