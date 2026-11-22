import v1Desktop from '../assets/design-history/v1-desktop.jpg'
import v1Mobile from '../assets/design-history/v1-mobile.jpg'
import v2Desktop from '../assets/design-history/v2-desktop.jpg'
import v2Mobile from '../assets/design-history/v2-mobile.jpg'
import v3Desktop from '../assets/design-history/v3-desktop.jpg'
import v3Mobile from '../assets/design-history/v3-mobile.jpg'
import v4BuilderDesktop from '../assets/design-history/v4-builder-desktop.jpg'
import v4BuilderMobile from '../assets/design-history/v4-builder-mobile.jpg'
import v4FriendlyDesktop from '../assets/design-history/v4-friendly-desktop.jpg'
import v4FriendlyMobile from '../assets/design-history/v4-friendly-mobile.jpg'

// Every version of the site's look, newest first. Add a new version here
// (with desktop and mobile screenshots of the home page) whenever a pull
// request changes the design.
export type Screenshot = { label?: string; desktop: string; mobile: string }

export type DesignVersion = {
  version: string
  name: string
  date: string
  issues: number[]
  prs: number[]
  changed: string
  why: string
  lesson: string
  screenshots: Screenshot[]
}

export const designVersions: DesignVersion[] = [
  {
    version: 'v4',
    name: 'Builder and Friendly',
    date: '2026-11-22',
    issues: [18],
    prs: [21],
    changed:
      'A dark terminal-style Builder look by default, and a header toggle to a hand-made Friendly notebook. The site names me only by my GitHub handle.',
    why: 'v3 was tidy but anonymous. It could have been anyone’s site, and it only spoke to engineers.',
    lesson:
      'Identity comes from choices a template would never make: prompts, a cursor, tape on the cards, handwriting.',
    screenshots: [
      { label: 'Builder (default)', desktop: v4BuilderDesktop, mobile: v4BuilderMobile },
      { label: 'Friendly', desktop: v4FriendlyDesktop, mobile: v4FriendlyMobile },
    ],
  },
  {
    version: 'v3',
    name: 'Editorial notebook',
    date: '2026-11-22',
    issues: [],
    prs: [13],
    changed:
      'Design tokens with dark mode, serif headlines, a warm paper background, a home hero, a journal timeline, and numbered demo panels.',
    why: 'v2 looked like browser defaults: boxed buttons, bordered cards everywhere, and no hierarchy.',
    lesson: 'Polish isn’t personality. A clean, well-tested design can still feel generic.',
    screenshots: [{ desktop: v3Desktop, mobile: v3Mobile }],
  },
  {
    version: 'v2',
    name: 'First real pages',
    date: '2026-11-22',
    issues: [],
    prs: [4, 5, 7, 9],
    changed:
      'Replaced the starter with my own pages: navigation buttons, the interactivity and media demos, and the journal.',
    why: 'The starter template only showed off Vite. The site needed to show what I was learning.',
    lesson: 'Getting things working first was right, but default styles made it look unfinished.',
    screenshots: [{ desktop: v2Desktop, mobile: v2Mobile }],
  },
  {
    version: 'v1',
    name: 'Vite starter',
    date: '2026-11-22',
    issues: [],
    prs: [2],
    changed: 'The template that create-vite generates, published to GitHub Pages.',
    why: 'A first deploy to prove the pipeline worked before building anything real.',
    lesson:
      'Even the starter had a bug: its social icons pointed to /icons.svg, which ignores the /learning-experimentation/ base path, so they never appeared.',
    screenshots: [{ desktop: v1Desktop, mobile: v1Mobile }],
  },
]
