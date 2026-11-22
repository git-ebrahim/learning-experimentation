import { useEffect, useState, type ChangeEvent, type DragEvent } from 'react'
import diagramUrl from '../assets/sample-diagram.svg'
import { UploadIcon } from '../components/icons.tsx'
import { PageHeader, Panel } from '../components/layout.tsx'
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
    <Panel
      index={1}
      title="Media that ships with the site"
      description="Imported from web/src/assets/. Vite copies it into the build with a content hash in its name."
    >
      <figure className="media-frame">
        <img
          src={diagramUrl}
          width={480}
          height={160}
          alt="Diagram: the browser loads the site from GitHub Pages and calls the NestJS API, which stores files."
        />
      </figure>
      <p className="muted">
        MP3 and MP4 files work the same way, but large media belongs on a media
        host, not in Git.
      </p>
    </Panel>
  )
}

function LocalFilePreview() {
  const [preview, setPreview] = useState<Preview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // An object URL keeps the file in memory until it's revoked. Revoke the old
  // one whenever the preview changes, and when the user leaves the page.
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview.url)
  }, [preview])

  async function processFile(file: File | undefined) {
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
      setError(`${file.name} isn't a supported image, MP3, or MP4 file, whatever its name says.`)
      return
    }

    // Use the detected type, not file.type, which only reflects the file name.
    const blob = new Blob([file], { type: detected.mimeType })
    setPreview({ ...detected, url: URL.createObjectURL(blob), name: file.name, size: file.size })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Clear the input so choosing the same file again still fires onChange.
    event.target.value = ''
    void processFile(file)
  }

  // Dragging a file over the page would normally open it in the browser.
  // preventDefault on dragover and drop keeps it on the page.
  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)
    void processFile(event.dataTransfer.files[0])
  }

  return (
    <Panel
      index={2}
      title="Preview a file from your device"
      description="The file stays in your browser. Nothing is uploaded."
    >
      <label
        htmlFor="media-input"
        className={isDragging ? 'dropzone is-dragging' : 'dropzone'}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className="dropzone-icon">
          <UploadIcon />
        </span>
        <span className="dropzone-title">
          Drop a file here or <span>browse</span>
        </span>
        <span className="muted">PNG, JPEG, GIF, WebP, MP3, or MP4 · up to {formatSize(MAX_BYTES)}</span>
        <input
          id="media-input"
          type="file"
          className="visually-hidden"
          accept="image/png,image/jpeg,image/gif,image/webp,audio/mpeg,.mp3,video/mp4,.mp4"
          onChange={handleChange}
        />
      </label>

      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}

      {preview && (
        <figure className="media-frame">
          {preview.kind === 'image' && <img src={preview.url} alt={`Preview of ${preview.name}`} />}
          {preview.kind === 'audio' && <audio src={preview.url} controls />}
          {preview.kind === 'video' && <video src={preview.url} controls />}
          {/* React escapes the file name, so a name containing HTML stays plain text. */}
          <figcaption>
            <span>{preview.name}</span>
            <span>{preview.label}</span>
            <span>{formatSize(preview.size)}</span>
          </figcaption>
        </figure>
      )}
    </Panel>
  )
}

function RealUploads() {
  return (
    <Panel
      index={3}
      title="What a real upload needs"
      description="GitHub Pages only serves static files, so it can't receive or store uploads."
    >
      <ol className="steps">
        <li>
          <span>
            <strong>An API</strong> (the planned NestJS service) that checks the
            user is allowed to upload.
          </span>
        </li>
        <li>
          <span>
            <strong>Object storage</strong> such as Amazon S3 or Cloudflare R2.
            The API hands the browser a short-lived signed URL, so the file goes
            straight to storage.
          </span>
        </li>
        <li>
          <span>
            <strong>Checks on the server:</strong> size, real file type, and
            ideally a malware scan. Browser checks are only for a good
            experience, because anyone can bypass them.
          </span>
        </li>
        <li>
          <span>
            <strong>Random storage names</strong> instead of the user&apos;s file
            name, served from a separate domain from the app.
          </span>
        </li>
      </ol>
    </Panel>
  )
}

export function MediaPage() {
  return (
    <div className="container container-narrow">
      <PageHeader
        eyebrow="Experiment"
        title="Images, audio, and video"
        lede="Show media that ships with the site, preview files from your own device, and see what real uploads would need."
        journalSlug="media-and-uploads"
      />
      <div className="panel-stack">
        <BundledImage />
        <LocalFilePreview />
        <RealUploads />
      </div>
    </div>
  )
}
