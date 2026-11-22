import { describe, expect, it } from 'vitest'
import { detectMediaType } from './detectMediaType.ts'

// Builds a 16-byte header like the one MediaPage reads from a file:
// the given bytes first, then zeros.
function header(...parts: (number[] | string)[]) {
  const bytes = parts.flatMap((part) =>
    typeof part === 'string' ? [...part].map((char) => char.charCodeAt(0)) : part,
  )
  const result = new Uint8Array(16)
  result.set(bytes)
  return result
}

describe('detectMediaType', () => {
  it.each([
    ['PNG', header([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'image/png'],
    ['JPEG', header([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg'],
    ['GIF', header('GIF89a'), 'image/gif'],
    ['WebP', header('RIFF', [0, 0, 0, 0], 'WEBP'), 'image/webp'],
    ['MP3 with an ID3 tag', header('ID3'), 'audio/mpeg'],
    ['MP3 starting with a frame', header([0xff, 0xfb]), 'audio/mpeg'],
    ['M4A', header([0, 0, 0, 0x20], 'ftypM4A '), 'audio/mp4'],
    ['MP4', header([0, 0, 0, 0x20], 'ftypisom'), 'video/mp4'],
  ])('recognises %s from its first bytes', (_name, bytes, mimeType) => {
    expect(detectMediaType(bytes)?.mimeType).toBe(mimeType)
  })

  it('rejects a text file, whatever its name says', () => {
    expect(detectMediaType(header('hello, world'))).toBeNull()
  })

  it('rejects an empty file', () => {
    expect(detectMediaType(new Uint8Array(0))).toBeNull()
  })
})
