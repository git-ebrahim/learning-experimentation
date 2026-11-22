# Glossary

The words this project uses, so code, issues, and pull requests mean the same thing.

**Journal**: the site's record of everything I learn. It's the set of entries, shown newest first on the Journal page. _Avoid_: log, blog.

**Entry**: one journal post, written as a Markdown file in `web/src/journal/entries/` named `NNN-slug.md`. The number orders entries, and the slug becomes its address (`#/journal/<slug>`). _Avoid_: post, article.

**Status**: how far an entry's work has got: `planned`, `in-progress`, or `done`.

**Demo**: the page on this site that shows an entry's work running, given as `demo:` in the entry's frontmatter. It must be a page in the site map.

**Site map**: the list of the site's top-level pages, each with a path and a label. The navigation and the routes are both built from it. Entry pages (`/journal/<slug>`) aren't in it.

**Mode**: one of the site's two looks: **Builder** (the default terminal style) or **Friendly** (the hand-made notebook style).
