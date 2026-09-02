/**
 * Domain types for the presentation layer. Deliberately independent of Keystatic:
 * pages and components import only from here (and `./index.ts`).
 */

/** Rendered, sanitised HTML ready for `set:html`. */
export type RichText = string;

export interface Person {
  name: string;
  url?: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface SocialLink {
  key: string;
  label: string;
  url: string;
}

export interface HomeContent {
  name: string;
  role: string;
  affiliation: string;
  location?: string;
  photo?: string;
  photoAlt: string;
  intro: RichText;
  showNews: boolean;
  newsLimit: number;
}

export interface NewsEntry {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  body: RichText;
}

export type PaperKind = 'work-in-progress' | 'working-paper' | 'publication';

export interface Paper {
  slug: string;
  kind: PaperKind;
  title: string;
  year?: number;
  authors: Person[];
  body: RichText;
  hasBody: boolean;
  links: ExternalLink[];
  pdfUrl?: string;
  /** work-in-progress only */
  status?: string;
  /** working-paper only */
  updatedLabel?: string;
  /** publication only */
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
}

export interface PaperSection {
  id: 'work-in-progress' | 'working-papers' | 'publications';
  label: string;
  papers: Paper[];
}

export interface CVEntry {
  title: string;
  organization: string;
  period: string;
  note?: string;
}

export interface CVSectionData {
  id: string;
  label: string;
  entries: CVEntry[];
}

export interface CVContent {
  pdfUrl?: string;
  intro: RichText;
  hasIntro: boolean;
  sections: CVSectionData[];
}

export interface Hobby {
  slug: string;
  title: string;
  cover?: string;
  body: RichText;
}

export interface PageIntro {
  heading: string;
  intro: RichText;
  hasIntro: boolean;
}

export interface ContactContent {
  intro: RichText;
  hasIntro: boolean;
  email?: string;
  office?: string;
  socials: SocialLink[];
  enableForm: boolean;
  formIntro?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  navItems: NavItem[];
  accentLight: string;
  accentDark: string;
  footerText: string;
}
