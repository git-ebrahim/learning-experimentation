---
title: Add a real audio file to the media demo
date: 2026-11-22
status: done
summary: Generate a short original chime, encode it as AAC, ship it with the site, and teach the file checker to recognise M4A.
demo: /media
issues: 17
prs: 14
---

## Question

The media page could preview audio from your own device, but it shipped none of its own. How do I add a demo audio file without borrowing someone else's music?

## Approach

1. **Make the sound myself.** A short Python script adds four sine-wave notes (C, E, G, C) with a quick attack and a bell-like fade, and writes a 3.6-second mono WAV file.
2. **Encode it** with macOS's built-in `afconvert`: `afconvert -f m4af -d aac -b 96000 chime.wav demo-chime.m4a`. The result is 23 KB.
3. **Ship it** from `web/src/assets/` and import it in `MediaPage.tsx`, the same way as the diagram. Vite adds a content hash to the file name.
4. **Recognise M4A uploads.** `detectMediaType.ts` now reads the brand after `ftyp`. `M4A ` means audio, and anything else in that family is treated as MP4 video.

## Findings

- **Generating your own media avoids licensing questions.** Even a "free" sound clip comes with terms. A synthesized chime is mine to publish.
- **This machine has no MP3 encoder** (no `lame` or `ffmpeg`), but macOS includes `afconvert`, which writes AAC. AAC in an `.m4a` file plays in every current browser and is smaller than an MP3 of the same quality.
- **M4A and MP4 share a container.** Both start with `ftyp` at byte 4, so the brand that follows tells them apart. Before this change, an `.m4a` upload would have been shown in a video player.
- **The supported formats are written in four places:** the byte signatures, the file picker's `accept` attribute, the hint text, and the error message. Adding M4A meant editing all four. The architecture review lists this as something to bring into one module.
- **Keep bundled media small.** At 23 KB, the chime is fine in Git. Long recordings or video should live on a media host.

## Evidence

- In the built site, the bundled chime loads from `/learning-experimentation/assets/demo-chime-<hash>.m4a` and reports a duration of 3.67 seconds.
- Uploading the same file through the picker shows "M4A audio · 23.3 KB" in an audio player, not a video player.
- The CSP needs no change, because `media-src 'self'` already allows files from the site.
