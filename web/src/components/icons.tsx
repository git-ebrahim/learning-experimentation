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
