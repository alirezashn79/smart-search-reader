import { useState, useMemo } from 'react'
import { useDebounce } from './useDebounce'

export interface SearchMatch {
  index: number
  text: string
  startPos: number
  endPos: number
}

export interface SearchResult {
  matches: SearchMatch[]
  totalMatches: number
  currentMatchIndex: number
}

export function useSearch(text: string, delay: number = 300) {
  const [query, setQuery] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const debouncedQuery = useDebounce(query, delay)

  const searchResult: SearchResult = useMemo(() => {
    if (!debouncedQuery.trim() || !text) {
      return {
        matches: [],
        totalMatches: 0,
        currentMatchIndex: 0,
      }
    }

    const matches: SearchMatch[] = []
    const searchTerm = debouncedQuery.toLowerCase()
    const textLower = text.toLowerCase()
    let startIndex = 0
    let matchIndex = 0

    while (startIndex < textLower.length) {
      const foundIndex = textLower.indexOf(searchTerm, startIndex)
      if (foundIndex === -1) break

      matches.push({
        index: matchIndex,
        text: text.substring(foundIndex, foundIndex + debouncedQuery.length),
        startPos: foundIndex,
        endPos: foundIndex + debouncedQuery.length,
      })

      matchIndex++
      startIndex = foundIndex + 1
    }

    return {
      matches,
      totalMatches: matches.length,
      currentMatchIndex: matches.length > 0 ? Math.min(currentMatchIndex, matches.length - 1) : 0,
    }
  }, [debouncedQuery, text, currentMatchIndex])

  const goToNextMatch = () => {
    if (searchResult.totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % searchResult.totalMatches)
    }
  }

  const goToPrevMatch = () => {
    if (searchResult.totalMatches > 0) {
      setCurrentMatchIndex(
        (prev) => (prev - 1 + searchResult.totalMatches) % searchResult.totalMatches
      )
    }
  }

  const goToMatch = (index: number) => {
    if (index >= 0 && index < searchResult.totalMatches) {
      setCurrentMatchIndex(index)
    }
  }

  return {
    query,
    setQuery,
    searchResult,
    goToNextMatch,
    goToPrevMatch,
    goToMatch,
    isSearching: query !== debouncedQuery,
  }
}
