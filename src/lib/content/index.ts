import { reader } from './reader';
import { renderRichText } from './markdoc';
import type {
  ContactContent,
  CVContent,
  CVEntry,
  ExternalLink,
  Hobby,
  HomeContent,
  NewsEntry,
  PageIntro,
  Paper,
  PaperKind,
  PaperSection,
  Person,
  SiteSettings,
  SocialLink,
} from './types';

// Re-export the domain types so the app imports everything from `@content`.
export type * from './types';

/* -------------------------------------------------------------------------- */
/*  small helpers                                                              */
/* -------------------------------------------------------------------------- */

type ContentThunk = () => Promise<{ node: import('@markdoc/markdoc').Node }>;

const str = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

/** Allow only safe CSS colour tokens (these are interpolated into a <style> tag). */
const COLOR_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$|^[a-z]{3,20}$|^(?:rgb|hsl)a?\([0-9.,%\s/]+\)$/i;
const color = (value: unknown, fallback: string): string => {
  const s = str(value);
  return s && COLOR_RE.test(s) ? s : fallback;
};

async function rich(thunk: ContentThunk | undefined): Promise<{ html: string; isEmpty: boolean }> {
  if (!thunk) return { html: '', isEmpty: true };
  const { node } = await thunk();
  const html = renderRichText(node);
  return { html, isEmpty: html.trim().length === 0 };
}

function mapPeople(raw: readonly { name?: unknown; url?: unknown }[] | undefined): Person[] {
  return (raw ?? [])
    .map((p) => ({ name: str(p.name) ?? '', url: str(p.url) }))
    .filter((p) => p.name.length > 0);
}

function mapLinks(raw: readonly { label?: unknown; url?: unknown }[] | undefined): ExternalLink[] {
  return (raw ?? [])
    .map((l) => ({ label: str(l.label) ?? '', url: str(l.url) ?? '' }))
    .filter((l) => l.label.length > 0 && l.url.length > 0);
}

function pdfUrl(raw: { file?: unknown; url?: unknown } | undefined): string | undefined {
  return str(raw?.file) ?? str(raw?.url);
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

function formatDate(iso: string | null | undefined, style: 'full' | 'month' = 'full'): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return (style === 'month' ? monthFormatter : dateFormatter).format(d);
}

/* -------------------------------------------------------------------------- */
/*  site settings + navigation                                                 */
/* -------------------------------------------------------------------------- */

const DEFAULT_NAV: SiteSettings['navItems'] = [
  { label: 'Home', href: '/' },
  { label: 'CV', href: '/cv' },
  { label: 'Research', href: '/research' },
  { label: 'Hobbies', href: '/hobbies' },
  { label: 'Contact', href: '/contact' },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await reader.singletons.siteSettings.read();
  const navItems = (raw?.navItems ?? [])
    .map((n) => ({ label: str(n.label) ?? '', href: str(n.href) ?? '' }))
    .filter((n) => n.label.length > 0 && n.href.length > 0);

  return {
    siteTitle: str(raw?.siteTitle) ?? 'Academic Site',
    tagline: str(raw?.tagline) ?? '',
    navItems: navItems.length > 0 ? navItems : DEFAULT_NAV,
    accentLight: color(raw?.accentLight, '#2f5d50'),
    accentDark: color(raw?.accentDark, color(raw?.accentLight, '#8fb8ac')),
    footerText: str(raw?.footerText) ?? '',
  };
}

/* -------------------------------------------------------------------------- */
/*  home                                                                       */
/* -------------------------------------------------------------------------- */

export async function getHome(): Promise<HomeContent> {
  const raw = await reader.singletons.home.read();
  const intro = await rich(raw?.intro as ContentThunk | undefined);

  return {
    name: str(raw?.name) ?? 'Your Name',
    role: str(raw?.role) ?? '',
    affiliation: str(raw?.affiliation) ?? '',
    location: str(raw?.location),
    photo: str(raw?.photo),
    photoAlt: str(raw?.photoAlt) ?? str(raw?.name) ?? 'Portrait',
    intro: intro.html,
    showNews: raw?.showNews ?? true,
    newsLimit: typeof raw?.newsLimit === 'number' && raw.newsLimit > 0 ? raw.newsLimit : 4,
  };
}

/* -------------------------------------------------------------------------- */
/*  news                                                                       */
/* -------------------------------------------------------------------------- */

export async function getNews(limit?: number): Promise<NewsEntry[]> {
  const entries = await reader.collections.news.all();
  const mapped = await Promise.all(
    entries.map(async ({ slug, entry }) => {
      const body = await rich(entry.body as ContentThunk);
      return {
        slug,
        title: str(entry.title) ?? slug,
        date: entry.date ?? '',
        dateLabel: formatDate(entry.date, 'month'),
        body: body.html,
      } satisfies NewsEntry;
    }),
  );

  mapped.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
}

/* -------------------------------------------------------------------------- */
/*  research                                                                   */
/* -------------------------------------------------------------------------- */

type RawPaperEntry = Record<string, unknown> & {
  title?: unknown;
  year?: unknown;
  coauthors?: readonly { name?: unknown; url?: unknown }[];
  links?: readonly { label?: unknown; url?: unknown }[];
  order?: unknown;
  draft?: unknown;
};

async function readPapers(
  kind: PaperKind,
  entries: { slug: string; entry: RawPaperEntry }[],
): Promise<Paper[]> {
  const papers = await Promise.all(
    entries.map(async ({ slug, entry }) => {
      const bodyThunk = (entry.summary ?? entry.abstract) as ContentThunk | undefined;
      const body = await rich(bodyThunk);
      const yearNum = typeof entry.year === 'number' ? entry.year : undefined;

      return {
        slug,
        kind,
        title: str(entry.title) ?? slug,
        year: yearNum,
        authors: mapPeople(entry.coauthors),
        body: body.html,
        hasBody: !body.isEmpty,
        links: mapLinks(entry.links),
        pdfUrl: pdfUrl(entry.pdf as { file?: unknown; url?: unknown } | undefined),
        status: str(entry.status),
        updatedLabel: formatDate(entry.updated as string | undefined, 'month') || undefined,
        journal: str(entry.journal),
        volume: str(entry.volume),
        issue: str(entry.issue),
        pages: str(entry.pages),
        doi: str(entry.doi),
        _order: typeof entry.order === 'number' ? entry.order : 0,
        _draft: entry.draft === true,
      };
    }),
  );

  return papers
    .filter((p) => !p._draft)
    .sort((a, b) => {
      if (a._order !== b._order) return a._order - b._order;
      const ay = a.year ?? 0;
      const by = b.year ?? 0;
      if (ay !== by) return by - ay;
      return a.title.localeCompare(b.title);
    })
    .map(({ _order, _draft, ...paper }) => paper);
}

export async function getResearchSections(): Promise<PaperSection[]> {
  const [wip, wp, pubs] = await Promise.all([
    reader.collections.workInProgress.all(),
    reader.collections.workingPapers.all(),
    reader.collections.publications.all(),
  ]);

  const asEntries = (list: unknown) => list as { slug: string; entry: RawPaperEntry }[];
  const [wipPapers, wpPapers, pubPapers] = await Promise.all([
    readPapers('work-in-progress', asEntries(wip)),
    readPapers('working-paper', asEntries(wp)),
    readPapers('publication', asEntries(pubs)),
  ]);

  return [
    { id: 'work-in-progress', label: 'Work in Progress', papers: wipPapers },
    { id: 'working-papers', label: 'Working Papers', papers: wpPapers },
    { id: 'publications', label: 'Publications', papers: pubPapers },
  ];
}

export async function getResearchIntro(): Promise<PageIntro> {
  const raw = await reader.singletons.researchPage.read();
  const intro = await rich(raw?.intro as ContentThunk | undefined);
  return {
    heading: str(raw?.heading) ?? 'Research',
    intro: intro.html,
    hasIntro: !intro.isEmpty,
  };
}

/* -------------------------------------------------------------------------- */
/*  CV                                                                         */
/* -------------------------------------------------------------------------- */

function mapCVEntries(raw: readonly Record<string, unknown>[] | undefined): CVEntry[] {
  return (raw ?? [])
    .map((e) => ({
      title: str(e.title) ?? '',
      organization: str(e.organization) ?? '',
      period: str(e.period) ?? '',
      note: str(e.note),
    }))
    .filter((e) => e.title.length > 0 || e.organization.length > 0);
}

export async function getCV(): Promise<CVContent> {
  const raw = await reader.singletons.cv.read();
  const intro = await rich(raw?.intro as ContentThunk | undefined);

  const sections: CVContent['sections'] = [
    { id: 'education', label: 'Education', entries: mapCVEntries(raw?.education) },
    { id: 'positions', label: 'Positions & Employment', entries: mapCVEntries(raw?.positions) },
    { id: 'awards', label: 'Awards, Grants & Fellowships', entries: mapCVEntries(raw?.awards) },
    { id: 'teaching', label: 'Teaching', entries: mapCVEntries(raw?.teaching) },
    { id: 'service', label: 'Service & Affiliations', entries: mapCVEntries(raw?.service) },
  ].filter((s) => s.entries.length > 0);

  return {
    pdfUrl: str(raw?.pdf),
    intro: intro.html,
    hasIntro: !intro.isEmpty,
    sections,
  };
}

/* -------------------------------------------------------------------------- */
/*  hobbies                                                                    */
/* -------------------------------------------------------------------------- */

export async function getHobbiesIntro(): Promise<PageIntro> {
  const raw = await reader.singletons.hobbiesPage.read();
  const intro = await rich(raw?.intro as ContentThunk | undefined);
  return {
    heading: str(raw?.heading) ?? 'Hobbies',
    intro: intro.html,
    hasIntro: !intro.isEmpty,
  };
}

export async function getHobbies(): Promise<Hobby[]> {
  const entries = await reader.collections.hobbies.all();
  const mapped = await Promise.all(
    entries.map(async ({ slug, entry }) => {
      const body = await rich(entry.body as ContentThunk);
      return {
        slug,
        title: str(entry.title) ?? slug,
        cover: str(entry.cover),
        body: body.html,
        _order: typeof entry.order === 'number' ? entry.order : 0,
      };
    }),
  );

  return mapped
    .sort((a, b) => a._order - b._order || a.title.localeCompare(b.title))
    .map(({ _order, ...hobby }) => hobby);
}

/* -------------------------------------------------------------------------- */
/*  contact                                                                    */
/* -------------------------------------------------------------------------- */

const SOCIAL_KEYS: { key: string; label: string }[] = [
  { key: 'googleScholar', label: 'Google Scholar' },
  { key: 'orcid', label: 'ORCID' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'github', label: 'GitHub' },
  { key: 'twitter', label: 'X' },
  { key: 'bluesky', label: 'Bluesky' },
];

export async function getContact(): Promise<ContactContent> {
  const raw = await reader.singletons.contact.read();
  const intro = await rich(raw?.intro as ContentThunk | undefined);

  const socials: SocialLink[] = SOCIAL_KEYS.map(({ key, label }) => ({
    key,
    label,
    url: str((raw as Record<string, unknown> | null)?.[key]) ?? '',
  })).filter((s) => s.url.length > 0);

  return {
    intro: intro.html,
    hasIntro: !intro.isEmpty,
    email: str(raw?.email),
    office: str(raw?.office),
    socials,
    enableForm: raw?.enableForm ?? false,
    formIntro: str(raw?.formIntro),
  };
}

