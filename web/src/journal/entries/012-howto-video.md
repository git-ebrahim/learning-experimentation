---
title: Make a how-to video with code
date: 2026-11-22
status: done
summary: A 30-second walkthrough of opening Terminal and starting Claude Code from Documents, drawn frame by frame and narrated by text-to-speech.
demo: /media
issues: 29
prs: 30
---

## Question

I wanted a short video on the Media page that shows someone how to open Terminal on a Mac and start Claude Code from their Documents folder. How do I make one that's accurate, small, accessible, and easy to remake when something changes?

## Approach

1. **Weigh the options in issue #29:**
   - **An AI video model:** these models often garble on-screen text, so the commands could come out wrong.
   - **A real screen recording:** authentic, but manual, and it can show personal files or notifications.
   - **An animation made with code:** the one I chose.
2. **Write the script as data.** `narration.json` holds each line twice: `speech` for the voice (which spells out "C D" and "tilde") and `caption` for the captions (`cd ~/Documents`).
3. **Let the voice set the pace.** macOS's `say` command speaks each line in the downloadable **Ava (Premium)** voice, chosen after comparing ten voices. The build script measures each clip, and each scene lasts as long as its line. Captions are written from the same timings, so they always line up with the voice.
4. **Draw each frame from the time.** `scene.html` is an ordinary web page with one function, `renderAt(t)`. It works out what's on screen at `t` seconds: the Spotlight bar, the text typed so far, the key being pressed, and the step label. Playwright drives Chrome to draw 919 frames at 30 per second and save each as a PNG.
5. **Encode with built-in tools.** A short Swift program uses Apple's AVFoundation to turn the frames into H.264 video, then adds the narration as AAC audio in one MP4.
6. **Add it to the page** with `<video controls preload="metadata">`, a poster image, and a `<track kind="captions">`, plus the steps written out as text underneath.

## Findings

- **Deterministic beats real time.** Recording a live animation drops frames when the computer is busy. Drawing each frame from `t` gives the same video on every run.
- **The voice needs different words from the captions.** Text-to-speech reads `cd ~/Documents` badly, so the spoken script spells it out while the captions show the real command.
- **Small files get inlined, and the CSP blocks them.** Vite turned the tiny caption file (under 1 KB) into a `data:` URL, which the Content Security Policy rejects for media. I added `.vtt` to the files Vite keeps separate, next to the fonts.
- **Bitrate is a dial.** Flat colours and text compress well. The first 51-second cut was 2.7 MB at 450 kbit/s and 1.8 MB at 260 kbit/s, with the text still sharp.
- **Shorter is better for a how-to.** I cut the first draft from 51 to 30 seconds by trimming every line to the action itself and shortening the pauses. The explanations (like what `cd` means) moved to the text under the video. Because the voice sets the timing, editing the words was enough: the scenes and captions followed.
- **A missing voice fails silently.** If a voice isn't installed, `say` uses the default voice without any error. The build script now checks that the voice is installed and stops if it isn't.
- **You don't always need the famous tool.** I planned to use ffmpeg, but couldn't install it here. macOS already had everything: `say`, `afconvert`, and AVFoundation.

## Evidence

- Browser checks on the production build, at 1280 px in Builder mode and 390 px in Friendly mode:
  - The video loads (30.6 s, 1280 × 720, 1.1 MB) and plays.
  - All 8 caption cues load.
  - Nothing scrolls sideways, and there are no console or CSP errors.
- I checked frames at key moments: the title card, ⌘ Space, typing "Terminal", `cd ~/Documents`, Claude Code's welcome screen, and the recap.
- [MDN: Adding captions and subtitles to HTML video](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video)
- [Apple: AVAssetWriter](https://developer.apple.com/documentation/avfoundation/avassetwriter)
