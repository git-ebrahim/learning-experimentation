---
title: Keep a visual history of the design
date: 2026-11-22
status: done
summary: A Design page shows every version of the site, side by side, with why each one changed.
demo: /design
issues: 19
prs: 22
---

## Question

The site's look has changed four times in one day. Old versions only exist in Git, where you can't see them. How do I show the evolution so anyone can follow it?

## Approach

1. **Weigh the options in issue #19:**
   - **Storybook:** great for documenting today's components, but it can't show past versions of the whole site.
   - **Hosting old builds:** heavy, and old dependencies would need security patches.
   - **A screenshot gallery:** the one I chose.
2. **Recreate v1 faithfully.** I exported the original starter commit with `git archive edd151e web`, then installed (`npm ci --ignore-scripts`), built, and ran it in a scratch folder, so the screenshot is the real thing.
3. **Capture each version's home page** at 1280 × 800 and 390 × 844. For v4 I captured both modes.
4. **Compress the screenshots** with macOS `sips`: desktop shots scaled to 1024 px wide and every image saved as a JPEG at quality 72. That's 10 images, 688 KB in total.
5. **Store the versions as data** in `web/src/design/versions.ts`: number, name, date, issues, PRs, and what changed, why, and the lesson. The **Design** page renders a left-to-right strip of thumbnails, then one card per version with desktop and phone screenshots.

## Findings

- **Screenshots are the cheapest honest record.** They can't drift the way a rebuilt old version might, and they cost about 70 KB each.
- **Old code shows old bugs.** Rebuilding v1 showed its social icons never appeared, because they pointed at `/icons.svg` and ignored the `/learning-experimentation/` base path. That's the same lesson as entry #1.
- **Check generated images by eye.** `sips -c` crops from the *center*, so my first v3 screenshot showed the middle of the page instead of the top. Cropping in the browser with Playwright's `clip` option fixed it.
- **`loading="lazy"` plus explicit `width` and `height`** keep the page fast and stop the layout jumping while images load.
- **"Why it changed" matters more than "what changed".** Each card ends with a lesson, which turns the gallery into a record of my design thinking instead of a slideshow.
- **Keeping it up to date is part of the workflow.** Any PR that changes the look adds a version here, with the issue and PR linked.

## Evidence

- The Design page shows v1 to v4, including both v4 modes. Every screenshot has `alt` text, loads lazily, and opens full size when selected.
- No horizontal scroll at 390 px in either mode, and no console errors.
