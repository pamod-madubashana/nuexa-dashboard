import type { CSSProperties } from 'react'

type IconName =
  | 'spark'
  | 'grid'
  | 'revenue'
  | 'history'
  | 'profits'
  | 'transactions'
  | 'logout'
  | 'filter'
  | 'chevDown'
  | 'pencil'

type Props = {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
  title?: string
}

export function Icon({ name, size = 18, className, style, title }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    style,
  } as const

  switch (name) {
    case 'spark':
      return (
        <svg {...common} viewBox="0 0 28 28" aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <rect x="2" y="2" width="24" height="24" rx="7" stroke="currentColor" opacity="0.75" />
          <path
            d="M14 6l1.4 4.2L20 12l-4.6 1.8L14 18l-1.4-4.2L8 12l4.6-1.8L14 6z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'grid':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'revenue':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M6 20V9m6 11V4m6 16v-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M4 20h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      )
    case 'history':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M7 7h10M7 12h10M7 17h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M4 6.5c0-1.38 1.12-2.5 2.5-2.5h11C19.88 4 21 5.12 21 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11z"
            stroke="currentColor"
            opacity="0.35"
          />
        </svg>
      )
    case 'profits':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M5 16l5-5 4 4 5-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          <path
            d="M19 8h-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      )
    case 'transactions':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M7 7h11M7 7l2-2M7 7l2 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          <path
            d="M17 17H6m11 0-2-2m2 2-2 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
        </svg>
      )
    case 'logout':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M10 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M3 12h10m0 0-3-3m3 3-3 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </svg>
      )
    case 'filter':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M4 6h16l-6 7v5l-4 2v-7L4 6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      )
    case 'chevDown':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      )
    case 'pencil':
      return (
        <svg {...common} aria-hidden={title ? undefined : true}>
          {title ? <title>{title}</title> : null}
          <path
            d="M12 20h9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </svg>
      )
  }
}
