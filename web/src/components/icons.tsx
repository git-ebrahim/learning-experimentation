// Small inline SVG icons. They inherit the text color through currentColor
// and are hidden from screen readers because the text beside them says the same.
type IconProps = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function BookIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2.5Z" />
      <path d="M8 7h7M8 11h5" />
    </svg>
  )
}

export function CursorIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="m5 3 14 7-6 2-2 6Z" />
      <path d="m13 12 5 5" />
    </svg>
  )
}

export function MediaIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="m10 9 5 3-5 3Z" />
    </svg>
  )
}

export function UploadIcon({ size = 28 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

export function TerminalIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </svg>
  )
}

export function SmileIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" />
    </svg>
  )
}

export function GitHubIcon({ size = 20 }: IconProps) {
  // The GitHub mark is a filled shape, so it doesn't use the stroke settings.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}
