import { SAMPLE_TEXT, SUGGESTIONS } from '@/constants'
import { useSearch } from '@/hooks/useSearch'
import { useRef } from 'react'
import SearchInput from './SearchInput'

export default function SmartSearchReader() {
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useSearch(SAMPLE_TEXT, 300)

  const handleClearSearch = () => {
    search.setQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-800 via-stone-950 to-gray-900 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
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
              onNext={search.goToNextMatch}
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo voluptate excepturi
            doloribus voluptatibus culpa. Voluptates iure fuga consequuntur repudiandae quas, magnam
            numquam cum est veritatis eligendi animi? Tempore, id dolores?
          </div>
        </div>
      </div>
    </div>
  )
}
