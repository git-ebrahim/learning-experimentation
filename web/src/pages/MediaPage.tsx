import { useEffect, useState, type ChangeEvent, type DragEvent } from 'react'
import chimeUrl from '../assets/demo-chime.m4a'
import howtoPosterUrl from '../assets/howto/terminal-to-claude-code-poster.jpg'
import howtoCaptionsUrl from '../assets/howto/terminal-to-claude-code.vtt?url'
import howtoVideoUrl from '../assets/howto/terminal-to-claude-code.mp4'
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
      description="An image and a short audio clip bundled into the build. Vite adds a content hash to each file name."
    >
      <figure className="media-frame">
        <img
          src={diagramUrl}
          width={480}
          height={160}
          alt="Diagram: the browser loads the site from GitHub Pages and calls the NestJS API, which stores files."
        />
      </figure>
      <figure className="media-frame">
        {/* A 3.6-second chime generated for this site (23 KB, AAC in an .m4a file). */}
        <audio src={chimeUrl} controls preload="metadata" />
        <figcaption>
          <span>demo-chime.m4a</span>
          <span>M4A audio</span>
          <span>23 KB</span>
        </figcaption>
      </figure>
      <p className="muted">
        Both files are imported from <code>web/src/assets/</code>. Small media
        like this is fine in Git; large video belongs on a media host.
      </p>
    </Panel>
  )
}

// Each step of the how-to video, also shown as text under the player.
const howtoSteps = [
  { keys: '⌘ Space', text: 'opens Spotlight search. Type Terminal and press Return.' },
  { keys: 'cd ~/Documents', text: 'moves Terminal into your Documents folder. cd means "change directory".' },
  { keys: 'pwd', text: 'prints the folder you are in, so you can check.' },
  { keys: 'claude', text: 'starts Claude Code in that folder. It needs to be installed first.' },
]

function HowToVideo() {
  return (
    <Panel
      index={2}
      title="How-to video: open Terminal and start Claude Code"
      description="A 51-second walkthrough for macOS, with a voice-over and captions."
    >
      <figure className="media-frame">
        {/* The <track> adds captions. The browser shows them over the video,
            and they work with the sound off and with screen readers. */}
        <video
          className="howto-video"
          src={howtoVideoUrl}
          poster={howtoPosterUrl}
          width={1280}
          height={720}
          controls
          preload="metadata"
          playsInline
        >
          <track kind="captions" src={howtoCaptionsUrl} srcLang="en" label="English" default />
        </video>
        <figcaption>
          <span>terminal-to-claude-code.mp4</span>
          <span>H.264 + AAC</span>
          <span>1.8 MB</span>
        </figcaption>
      </figure>
      <ol className="steps">
        {howtoSteps.map((step) => (
          <li key={step.keys}>
            <span>
              <code>{step.keys}</code> {step.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="muted">
        This is an animation, not a screen recording. It was made with code:
        a web page draws each frame, macOS&apos;s built-in text-to-speech reads
        the script, and the frames and voice are joined into an MP4. AI coding
        tools helped write it. The script is in{' '}
        <code>web/scripts/howto-video/</code>, so the video can be rebuilt after
        any change.
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
      setError(`${file.name} isn't a supported image, audio, or video file, whatever its name says.`)
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
      index={3}
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
        <span className="muted">PNG, JPEG, GIF, WebP, MP3, M4A, or MP4 · up to {formatSize(MAX_BYTES)}</span>
        <input
          id="media-input"
          type="file"
          className="visually-hidden"
          accept="image/png,image/jpeg,image/gif,image/webp,audio/mpeg,.mp3,audio/mp4,.m4a,video/mp4,.mp4"
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
      index={4}
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
        lede="Show media that ships with the site, watch a short how-to video, preview files from your own device, and see what real uploads would need."
        journalSlug="media-and-uploads"
      />
      <div className="panel-stack">
        <BundledImage />
        <HowToVideo />
        <LocalFilePreview />
        <RealUploads />
      </div>
    </div>
  )
}
