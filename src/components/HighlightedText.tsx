import type { HighlightedText } from '@/hooks/useTextHighlight'

interface IProps {
  parts: HighlightedText[]
  onMatchRef: (index: number, element: HTMLElement | null) => void
}

export default function HighlightedText({ parts, onMatchRef }: IProps) {
  return (
    <div className="leading-relaxed whitespace-pre-wrap" dir="rtl">
      {parts.map((part, index) => {
        if (part.isHighlighted) {
          return (
            <span
              key={index}
              ref={(el) =>
                part.matchIndex !== undefined ? onMatchRef(part.matchIndex, el) : undefined
              }
              className={`rounded px-1 py-0.5 transition-all duration-300 ${
                part.isCurrent
                  ? 'animate-pulse bg-purple-500 text-black shadow-md'
                  : 'bg-yellow-200 text-black'
              }`}
            >
              {part.text}
            </span>
          )
        }
        return <span key={index}>{part.text}</span>
      })}
    </div>
  )
}
