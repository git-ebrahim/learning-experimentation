// Builds the "open Terminal and start Claude Code" video for the Media page.
//
//   node scripts/howto-video/build.mjs      (run from web/, on macOS)
//
// 1. Speaks each line of narration.json with macOS's `say` voice.
// 2. Times each scene to fit its line, then writes the captions (WebVTT).
// 3. Draws every frame of scene.html in Chrome and saves it as a PNG.
// 4. Joins the frames and the narration into an MP4 with encode.swift.
//
// Needs macOS (for `say`, `afconvert`, and Swift) and Google Chrome.
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '../../src/assets/howto')
const name = 'terminal-to-claude-code'
const voice = 'Samantha'
const fps = 30
const sampleRate = 22050
const lead = 0.3 // seconds of quiet before each line
const tail = 0.7 // seconds of quiet after each line

const work = mkdtempSync(join(tmpdir(), 'howto-video-'))
const framesDir = join(work, 'frames')
mkdirSync(framesDir)
mkdirSync(outDir, { recursive: true })
const run = (command, args) => execFileSync(command, args, { stdio: ['ignore', 'pipe', 'inherit'] })

// 1. Speak each line as 16-bit mono PCM, so the samples are easy to place.
const cues = JSON.parse(readFileSync(join(here, 'narration.json'), 'utf8'))
const voices = cues.map((cue) => {
  const aiff = join(work, `${cue.id}.aiff`)
  const wav = join(work, `${cue.id}.wav`)
  run('say', ['-v', voice, '-o', aiff, cue.speech])
  run('afconvert', ['-f', 'WAVE', '-d', `LEI16@${sampleRate}`, '-c', '1', aiff, wav])
  const data = readWavSamples(wav)
  return { cue, data, seconds: data.length / sampleRate }
})

// 2. Lay the lines end to end; each scene lasts as long as its line.
let clock = 0
const timeline = {}
for (const { cue, seconds } of voices) {
  const extra = cue.id === 'outro' ? 2 : 0
  timeline[cue.id] = {
    start: clock,
    duration: lead + seconds + tail + extra,
    speechStart: lead,
    speech: seconds,
    typeAt: cue.typeAt ?? 0,
    enterAt: cue.enterAt ?? 1,
  }
  clock += timeline[cue.id].duration
}
const total = clock

const samples = new Int16Array(Math.ceil(total * sampleRate))
for (const { cue, data } of voices) {
  samples.set(data, Math.round((timeline[cue.id].start + lead) * sampleRate))
}
const fullWav = join(work, 'narration.wav')
writeFileSync(fullWav, wavFile(samples))
const narration = join(work, 'narration.m4a')
run('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '48000', fullWav, narration])

const stamp = (s) => new Date(s * 1000).toISOString().slice(11, 23)
const vtt = ['WEBVTT', '']
cues.forEach((cue, index) => {
  const { start, speech } = timeline[cue.id]
  vtt.push(String(index + 1), `${stamp(start + lead)} --> ${stamp(start + lead + speech)}`, cue.caption, '')
})
writeFileSync(join(outDir, `${name}.vtt`), vtt.join('\n'))

// 3. Draw every frame. renderAt(t) depends only on t, so frames are exact.
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto(pathToFileURL(join(here, 'scene.html')).href)
await page.evaluate((value) => window.setTimeline(value), timeline)
const frameCount = Math.ceil(total * fps)
for (let frame = 0; frame < frameCount; frame++) {
  await page.evaluate((t) => window.renderAt(t), frame / fps)
  await page.screenshot({ path: join(framesDir, `${String(frame).padStart(5, '0')}.png`) })
}
// The poster is the picture shown before the video plays: the moment Claude Code opens.
await page.evaluate((t) => window.renderAt(t), timeline.claude.start + lead + timeline.claude.speech * 0.75)
await page.screenshot({ path: join(outDir, `${name}-poster.jpg`), type: 'jpeg', quality: 80 })
await browser.close()

// 4. Encode. 260 kbit/s is plenty for flat colours and text.
run('swift', [join(here, 'encode.swift'), framesDir, String(fps), narration, join(outDir, `${name}.mp4`), '260000'])
// Set KEEP_FRAMES=1 to keep the frames for checking.
if (process.env.KEEP_FRAMES) console.log(`Frames kept in ${framesDir}`)
else rmSync(work, { recursive: true, force: true })
console.log(`Done: ${total.toFixed(1)} s, ${frameCount} frames, written to ${outDir}`)

// Reads the 16-bit samples from the "data" chunk of a WAV file.
function readWavSamples(path) {
  const file = readFileSync(path)
  let offset = 12
  while (offset < file.length) {
    const id = file.toString('ascii', offset, offset + 4)
    const size = file.readUInt32LE(offset + 4)
    if (id === 'data') {
      const bytes = file.subarray(offset + 8, offset + 8 + size)
      return new Int16Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length))
    }
    offset += 8 + size + (size % 2)
  }
  throw new Error(`No audio data in ${path}`)
}

// Wraps 16-bit mono samples in a WAV header.
function wavFile(data) {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.byteLength, 4)
  header.write('WAVEfmt ', 8)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(1, 22) // mono
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(sampleRate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(data.byteLength, 40)
  return Buffer.concat([header, Buffer.from(data.buffer, data.byteOffset, data.byteLength)])
}
