import { Search, X } from 'lucide-react'

interface IProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  suggestions: string[]
  isSearching: boolean
  onNext: () => void
}

export default function SearchInput({ value, onClear, isSearching }: IProps) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center gap-2">
          {isSearching && (
            <div className="size-4 animate-spin rounded-full border-b-2 border-blue-500" />
          )}
          <Search className="size-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="جستجو کنید..."
          className="w-full rounded-lg border border-gray-300 bg-slate-900 py-2 pe-20 pr-10 text-right focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          dir="rtl"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
