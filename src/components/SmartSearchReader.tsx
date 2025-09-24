import HighlightedText from '@/components/HighlightedText'
import { SAMPLE_TEXT, SUGGESTIONS } from '@/constants'
import { useScrollToMatch } from '@/hooks/useScrollToMatch'
import { useSearch } from '@/hooks/useSearch'
import { useTextHighlight } from '@/hooks/useTextHighlight'
import { Github } from 'lucide-react'
import { useRef } from 'react'
import NavigationControls from './NavigationControls'
import SearchInput from './SearchInput'

export default function SmartSearchReader() {
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useSearch(SAMPLE_TEXT, 300)
  const highlightedParts = useTextHighlight(
    SAMPLE_TEXT,
    search.searchResult.matches,
    search.searchResult.currentMatchIndex
  )

  const { setMatchRef } = useScrollToMatch(
    search.searchResult.matches,
    search.searchResult.currentMatchIndex,
    containerRef
  )

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
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-300">جستجو و هایلایت هوشمند متن</p>
            <a
              href="https://github.com/alirezashn79/smart-search-reader"
              target="_blank"
              className="flex items-center gap-2 rounded-full border-2 border-gray-100 bg-gray-100 p-1 text-xs text-gray-800 hover:bg-gray-800 hover:text-gray-100"
            >
              <Github />
            </a>
          </div>
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

            <NavigationControls
              currentMatch={search.searchResult.currentMatchIndex}
              totalMatches={search.searchResult.totalMatches}
              onNext={search.goToNextMatch}
              onPrev={search.goToPrevMatch}
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
            className="h-[470px] overflow-y-auto p-8 text-lg leading-8 text-gray-100 lg:h-96"
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
