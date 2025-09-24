import { useMemo } from 'react'
import type { SearchMatch } from './useSearch'

export interface HighlightedText {
  text: string
  isHighlighted: boolean
  isCurrent?: boolean
  matchIndex?: number
}

export function useTextHighlight(text: string, matches: SearchMatch[], currentMatchIndex: number) {
  const highlightedParts: HighlightedText[] = useMemo(() => {
    if (!matches.length) {
      return [{ text, isHighlighted: false }]
    }

    const parts: HighlightedText[] = []
    let lastIndex = 0

    matches.forEach((match, index) => {
      if (match.startPos > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.startPos),
          isHighlighted: false,
        })
      }

      parts.push({
        text: text.substring(match.startPos, match.endPos),
        isHighlighted: true,
        isCurrent: index === currentMatchIndex,
        matchIndex: index,
      })

      lastIndex = match.endPos
    })

    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        isHighlighted: false,
      })
    }

    return parts
  }, [text, matches, currentMatchIndex])

  return highlightedParts
}
