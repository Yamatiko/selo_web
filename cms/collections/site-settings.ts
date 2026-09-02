import { singleton, fields } from '@keystatic/core';

export const siteSettings = singleton({
  label: 'Settings · Site',
  path: 'content/settings/site/',
  schema: {
    siteTitle: fields.text({ label: 'Site title', description: 'Shown in the header and browser tab' }),
    tagline: fields.text({ label: 'Tagline / meta description', multiline: true }),

    navItems: fields.array(
      fields.object({
        label: fields.text({ label: 'Label' }),
        href: fields.text({ label: 'Link', description: 'e.g. /research or /research#publications' }),
      }),
      {
        label: 'Navigation',
        description: 'Order and labels of the top menu. Sub-items of Research use #anchors.',
        itemLabel: (props) => `${props.fields.label.value} → ${props.fields.href.value}`,
      },
    ),

    accentLight: fields.text({
      label: 'Accent colour (light theme)',
      description: 'CSS colour, e.g. #2f5d50',
      defaultValue: '#2f5d50',
    }),
    accentDark: fields.text({
      label: 'Accent colour (dark theme)',
      description: 'CSS colour, e.g. #8fb8ac',
      defaultValue: '#8fb8ac',
    }),

    footerText: fields.text({ label: 'Footer text', multiline: true }),
  },
});
