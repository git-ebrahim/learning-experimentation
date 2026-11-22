---
title: Show images, MP3, and MP4 files, and understand uploads
date: 2026-11-22
status: done
summary: Bundle and preview images, audio, and video, and learn why a static site can't store uploads.
demo: /media
prs: 7
---

## Question

How does a site show images, audio, and video? Can a GitHub Pages site accept uploads?

## Approach

A new **Media** page (`web/src/pages/MediaPage.tsx`) has three parts:
1. **Bundled media:** an SVG in `web/src/assets/`, imported in code (`import diagramUrl from '../assets/sample-diagram.svg'`).
2. **Local preview:** a file picker accepts PNG, JPEG, GIF, WebP, MP3, and MP4 up to 50 MB. It checks the file's first bytes (`web/src/media/detectMediaType.ts`), then shows it with `<img>`, `<audio controls>`, or `<video controls>` through `URL.createObjectURL`. Nothing leaves the browser.
3. **Real uploads:** a short explanation of what a server-backed upload needs.

## Findings

- **Two places for media files:**
  - `src/assets/` plus an `import`: Vite adds a content hash to the file name, so browsers can cache it, and the build fails if the file is missing.
  - `public/`: files are copied as-is and referenced by path. Use this for files that need a fixed name, such as `favicon.svg`.
- **Keep big media out of Git.** GitHub rejects files over 100 MB, Pages sites have a 1 GB limit, and every version of a binary stays in the repo's history forever. Host video on YouTube, Vimeo, or object storage instead.
- **GitHub Pages can't receive uploads.** It only serves static files, so there's nowhere to send or save one. The file picker here only previews files on the visitor's own device. Real uploads need the NestJS API plus object storage such as S3 or R2, usually through a short-lived signed URL.
- **Don't trust the file name or `file.type`.** Both come from the file's extension, so renaming `notes.txt` to `photo.png` fools them. The first bytes ("magic numbers") are harder to fake: PNG starts with `89 50 4E 47`, MP3 with `ID3`, and MP4 has `ftyp` at byte 4. A server must repeat every check, because anyone can bypass browser code.
- **Free object URLs when you're done.** `URL.createObjectURL` keeps the file in memory until `URL.revokeObjectURL` runs. A `useEffect` cleanup handles that when the preview changes or the page closes.
- **Leave SVG out of user uploads.** An SVG can contain scripts. It's safe as an `<img>` you wrote yourself, but not as a file a stranger sends you.
- **Write `alt` text for images,** and use the browser's built-in `controls` for audio and video so they work with a keyboard.

## Evidence

Playwright drove the built site at 375 px width:
- The bundled SVG loads.
- A real PNG shows as an image, an MP3 header shows an audio player, and an MP4 header shows a video player.
- A text file renamed `notes.png` is rejected.
- A file named `<img src=x onerror=alert(1)>.png` shows as plain text.
- A 51 MB file is rejected with the size limit.
- There are no console errors.

[MDN: Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications) · [Vite: Static asset handling](https://vite.dev/guide/assets)
