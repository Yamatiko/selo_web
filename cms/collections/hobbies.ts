import { collection, fields } from '@keystatic/core';
import { order, richText } from '../fields/shared';

export const hobbies = collection({
  label: 'Hobbies',
  path: 'content/hobbies/*',
  slugField: 'title',
  format: { contentField: 'body' },
  columns: ['title'],
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    cover: fields.image({
      label: 'Cover image (optional)',
      directory: 'public/media/hobbies',
      publicPath: '/media/hobbies/',
    }),
    body: richText('Body'),
    order,
  },
});
