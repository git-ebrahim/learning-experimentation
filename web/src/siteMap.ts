// The site map: every top-level page, with its path and navigation label.
// The header builds its navigation from this list, App.tsx builds the routes
// from it, and the journal checks each entry's `demo:` path against it.
//
// This file has no components in it, so anything can import it without
// pulling in the pages (and without circular imports).
//
// To add a page: add it here, then give it a component in App.tsx.
// TypeScript reports an error until both are done.
export const sitePages = [
  { path: '/', label: 'Home' },
  { path: '/journal', label: 'Journal' },
  { path: '/interactivity', label: 'Interactivity' },
  { path: '/media', label: 'Media' },
  { path: '/design', label: 'Design' },
  { path: '/about', label: 'About' },
] as const

export type SitePath = (typeof sitePages)[number]['path']
