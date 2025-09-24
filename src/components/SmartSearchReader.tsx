import { useSearch } from '@/hooks/useSearch'
import { useTextHighlight } from '@/hooks/useTextHighlight'
import { useCallback, useEffect, useRef } from 'react'
import SearchInput from './SearchInput'
import HighlightedText from '@/components/HighlightedText'
import { SAMPLE_TEXT, SUGGESTIONS } from '@/constants'

export default function SmartSearchReader() {
  const search = useSearch(SAMPLE_TEXT, 300)

  const containerRef = useRef<HTMLDivElement>(null)
  const matchRefs = useRef<(HTMLElement | null)[]>([])

  const highlightedParts = useTextHighlight(
    SAMPLE_TEXT,
    search.searchResult.matches,
    search.searchResult.currentMatchIndex
  )

  const setMatchRef = useCallback((index: number, element: HTMLElement | null) => {
    matchRefs.current[index] = element
  }, [])

  const smoothScrollTo = useCallback((targetScrollTop: number) => {
    const container = containerRef.current
    if (!container) return

    const startScrollTop = container.scrollTop
    const distance = targetScrollTop - startScrollTop
    const duration = 500
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }

      const easedProgress = easeInOutCubic(progress)
      container.scrollTop = startScrollTop + distance * easedProgress

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }, [])

  useEffect(() => {
    if (
      search.searchResult.matches.length > 0 &&
      matchRefs.current[search.searchResult.currentMatchIndex]
    ) {
      const element = matchRefs.current[search.searchResult.currentMatchIndex]

      if (element && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()

        const scrollTop =
          elementRect.top -
          containerRect.top +
          containerRef.current.scrollTop -
          containerRect.height / 2 +
          elementRect.height / 2

        smoothScrollTo(scrollTop)
      }
    }
  }, [search.searchResult.currentMatchIndex, search.searchResult.matches, smoothScrollTo])

  useEffect(() => {
    matchRefs.current = new Array(search.searchResult.matches.length).fill(null)
  }, [search.searchResult.matches.length])

  const handleClearSearch = () => {
    search.setQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-800 via-stone-950 to-gray-900 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-cyan-100 via-blue-500 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
            جستجوی هوشمند
          </h1>
          <p className="text-gray-300">جستجو و هایلایت هوشمند متن</p>
        </div>

        <div className="mb-6 rounded-xl bg-gray-800 p-6 shadow-lg">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <SearchInput
              value={search.query}
              onChange={search.setQuery}
              onClear={handleClearSearch}
              suggestions={SUGGESTIONS}
              isSearching={search.isSearching}
            />
          </div>

          {search.query && !search.isSearching && (
            <div className="mt-4 text-center text-sm text-gray-300">
              {search.searchResult.totalMatches > 0
                ? `${search.searchResult.totalMatches} نتیجه یافت شد`
                : 'نتیجه‌ای یافت نشد'}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl bg-slate-800 shadow-lg">
          <div
            ref={containerRef}
            className="h-96 overflow-y-auto p-8 text-lg leading-8 text-gray-100"
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            <HighlightedText parts={highlightedParts} onMatchRef={setMatchRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
