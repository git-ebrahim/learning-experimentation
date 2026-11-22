import { JournalNote } from '../journal/JournalNote.tsx'
import { useEffect, useState, type ChangeEvent } from 'react'
import diagramUrl from '../assets/sample-diagram.svg'
import { detectMediaType, type DetectedMedia } from '../media/detectMediaType.ts'

// Big files slow the page and can exhaust memory, so set a limit up front.
const MAX_BYTES = 50 * 1024 * 1024

type Preview = DetectedMedia & { url: string; name: string; size: number }

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function BundledImage() {
  return (
    <div className="demo">
      <h2>1. Media that ships with the site</h2>
      <p>
        This image lives in <code>web/src/assets/</code> and is imported in the
        code. Vite copies it into the build with a content hash in its name,
        so browsers can cache it safely. MP3 and MP4 files work the same way,
        but large media belongs on a media host, not in Git.
      </p>
      <img
        src={diagramUrl}
        width={480}
        height={160}
        className="responsive-media"
        alt="Diagram: the browser loads the site from GitHub Pages and calls the NestJS API, which stores files."
      />
    </div>
  )
}

function LocalFilePreview() {
  const [preview, setPreview] = useState<Preview | null>(null)
  const [error, setError] = useState<string | null>(null)

  // An object URL keeps the file in memory until it's revoked. Revoke the old
  // one whenever the preview changes, and when the user leaves the page.
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview.url)
  }, [preview])

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Clear the input so choosing the same file again still fires onChange.
    event.target.value = ''
    setPreview(null)
    setError(null)
    if (!file) return

    if (file.size > MAX_BYTES) {
      setError(`${file.name} is ${formatSize(file.size)}. The limit is ${formatSize(MAX_BYTES)}.`)
      return
    }

    // Read only the first 16 bytes to identify the file.
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    const detected = detectMediaType(header)
    if (!detected) {
      setError(
        `${file.name} isn't a supported image, MP3, or MP4 file, whatever its name says.`,
      )
      return
    }

    // Use the detected type, not file.type, which only reflects the file name.
    const blob = new Blob([file], { type: detected.mimeType })
    setPreview({ ...detected, url: URL.createObjectURL(blob), name: file.name, size: file.size })
  }

  return (
    <div className="demo">
      <h2>2. Preview a file from your device</h2>
      <p>
        Choose an image (PNG, JPEG, GIF, WebP), an MP3, or an MP4 up to{' '}
        {formatSize(MAX_BYTES)}. The file stays in your browser and is never
        sent anywhere.
      </p>
      <label htmlFor="media-input" className="file-label">
        Choose a file
      </label>
      <input
        id="media-input"
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,audio/mpeg,.mp3,video/mp4,.mp4"
        onChange={handleFile}
      />

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      {preview && (
        <figure className="media-preview">
          {preview.kind === 'image' && (
            <img src={preview.url} alt={`Preview of ${preview.name}`} className="responsive-media" />
          )}
          {preview.kind === 'audio' && <audio src={preview.url} controls />}
          {preview.kind === 'video' && (
            <video src={preview.url} controls className="responsive-media" />
          )}
          {/* React escapes the file name, so a name containing HTML stays plain text. */}
          <figcaption>
            {preview.name} · {preview.label} · {formatSize(preview.size)}
          </figcaption>
        </figure>
      )}
    </div>
  )
}

function RealUploads() {
  return (
    <div className="demo">
      <h2>3. What a real upload needs</h2>
      <p>
        GitHub Pages only serves static files, so it can&apos;t receive or
        store uploads. Saving a file that other people can see needs:
      </p>
      <ol>
        <li>
          An API (the planned NestJS service) that checks the user is allowed
          to upload.
        </li>
        <li>
          Object storage such as Amazon S3 or Cloudflare R2. The API usually
          hands the browser a short-lived signed URL, so the file goes straight
          to storage.
        </li>
        <li>
          Checks on the server: size, real file type, and ideally a malware
          scan. The checks on this page are for a good experience only, because
          anyone can bypass browser code.
        </li>
        <li>
          Random storage names instead of the user&apos;s file name, and serving
          files from a separate domain from the app.
        </li>
      </ol>
    </div>
  )
}

export function MediaPage() {
  return (
    <section>
      <h1>Images, audio, and video</h1>
      <JournalNote slug="media-and-uploads" />
      <BundledImage />
      <LocalFilePreview />
      <RealUploads />
    </section>
  )
}
