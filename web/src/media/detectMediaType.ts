// Identify a file from its first bytes ("magic numbers") instead of trusting
// its name or the type the browser reports. Renaming notes.txt to photo.png
// changes the name and the reported type, but not the bytes inside.

export type MediaKind = 'image' | 'audio' | 'video'

export type DetectedMedia = {
  kind: MediaKind
  mimeType: string
  label: string
}

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.slice(start, start + length))

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((value, index) => bytes[offset + index] === value)

export function detectMediaType(bytes: Uint8Array): DetectedMedia | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { kind: 'image', mimeType: 'image/png', label: 'PNG image' }
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { kind: 'image', mimeType: 'image/jpeg', label: 'JPEG image' }
  }
  if (ascii(bytes, 0, 6) === 'GIF87a' || ascii(bytes, 0, 6) === 'GIF89a') {
    return { kind: 'image', mimeType: 'image/gif', label: 'GIF image' }
  }
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
    return { kind: 'image', mimeType: 'image/webp', label: 'WebP image' }
  }
  // MP3 files usually start with an ID3 tag, or straight away with an
  // MPEG audio frame (11 set bits: 0xFF then 0xE0 or higher).
  if (ascii(bytes, 0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) {
    return { kind: 'audio', mimeType: 'audio/mpeg', label: 'MP3 audio' }
  }
  // MP4-family files have "ftyp" at byte 4, followed by a four-letter brand.
  // The brand "M4A " marks audio-only files (AAC in an MP4 container).
  if (ascii(bytes, 4, 4) === 'ftyp') {
    const brand = ascii(bytes, 8, 4)
    if (brand === 'M4A ' || brand === 'M4B ') {
      return { kind: 'audio', mimeType: 'audio/mp4', label: 'M4A audio' }
    }
    return { kind: 'video', mimeType: 'video/mp4', label: 'MP4 video' }
  }
  return null
}
