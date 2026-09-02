import { singleton, fields } from '@keystatic/core';
import { richText } from '../fields/shared';

const entry = fields.object(
  {
    title: fields.text({ label: 'Title' }),
    organization: fields.text({ label: 'Organization / Institution' }),
    period: fields.text({ label: 'Period', description: 'e.g. 2021–present, 2019' }),
    note: fields.text({ label: 'Note (optional)', multiline: true }),
  },
  { label: 'Entry' },
);

const list = (label: string) =>
  fields.array(entry, {
    label,
    itemLabel: (props) => props.fields.title.value || props.fields.organization.value || label,
  });

export const cv = singleton({
  label: 'Page · CV',
  path: 'content/pages/cv/',
  format: { contentField: 'intro' },
  schema: {
    pdf: fields.file({
      label: 'CV PDF (for the Download button)',
      directory: 'public/media/cv',
      publicPath: '/media/cv/',
    }),
    intro: richText('Intro (optional)'),
    education: list('Education'),
    positions: list('Positions & Employment'),
    awards: list('Awards, Grants & Fellowships'),
    teaching: list('Teaching'),
    service: list('Service & Affiliations'),
  },
});
