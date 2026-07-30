/**
 * Domain types for the portfolio.
 *
 * The reference site is a photographer/illustrator portfolio; this build points
 * the same structural patterns at software-engineering content (see
 * docs/implementation-plan.md). Type names follow the content they now describe;
 * the original names from the brief are noted where they differ.
 */

export interface NavigationItem {
  /** Zero-padded ordinal shown before the label, e.g. "01". */
  index: string;
  /** Key into the `nav` namespace of the message files. */
  labelKey: string;
  /** In-page anchor, without the leading hash. */
  target: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Handle or address shown as the visible value. */
  handle: string;
}

/** Publication or credential. (Brief: `Certificate`.) */
export interface Credential {
  id: string;
  title: string;
  issuer: string;
  year: string;
  /** e.g. "Presented", "Under review", "Published". */
  status: string;
  description: string;
  /** Verification or paper URL, when one is public. */
  href?: string;
  image: ImageAsset;
  tags: string[];
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Used for the blur placeholder and the archive preview background. */
  dominantColor?: string;
}

/** Engineering case study. (Brief: `ArtDirectionProject`.) */
export interface CaseStudy {
  slug: string;
  title: string;
  /** Client, employer, or "Personal" / "Academic". */
  client: string;
  year: string;
  category: string;
  role: string;
  /** What the work actually involved. (Brief: `services`.) */
  contributions: string[];
  shortDescription: string;
  fullDescription: string;
  stack: string[];
  cover: ImageAsset;
  gallery: ImageAsset[];
  videoUrl?: string;
  /** Accent used for this study's detail view. */
  colorTheme: string;
  credits: Array<{ role: string; name: string }>;
  externalUrl?: string;
}

/** Archive entry. (Brief: `Photograph`.) */
export interface ArchiveEntry {
  id: string;
  slug: string;
  title: string;
  /** Matches an `ArchiveCategory.slug`. */
  category: string;
  /** Where the work was done. */
  city: string;
  country: string;
  /** Primary language or runtime. (Brief: `camera`.) */
  language: string;
  /** Framework or major library. (Brief: `lens`.) */
  framework: string;
  /** Scope marker, e.g. "Capstone", "Production". (Brief: `focalLength`.) */
  scope: string;
  year: string;
  orientation: 'landscape' | 'portrait' | 'square';
  image: ImageAsset;
  thumbnail: ImageAsset;
  story?: string;
  repoUrl?: string;
}

/** Archive category. (Brief: `PhotographyCategory`.) */
export interface ArchiveCategory {
  slug: string;
  title: string;
  description: string;
  count: number;
}

/** One frame of the scroll-driven research story. (Brief: `IllustrationProject`.) */
export interface StoryChapter {
  id: string;
  year: string;
  title: string;
  description: string;
  metadata: Array<{ label: string; value: string }>;
  image: ImageAsset;
}

export interface Service {
  index: string;
  title: string;
  description: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface SpokenLanguage {
  name: string;
  level: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot. Must stay empty; bots fill it. */
  company?: string;
}

export type ContactFormState = 'ready' | 'sending' | 'sent' | 'error';
