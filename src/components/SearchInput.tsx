import useAutocomplete from '@/hooks/useAutocomplete'
import { Search, X } from 'lucide-react'
import { useEffect } from 'react'

interface IProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  suggestions: string[]
  isSearching: boolean
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  suggestions,
  isSearching,
}: IProps) {
  const autocomplete = useAutocomplete(suggestions)

  useEffect(() => {
    autocomplete.setInputValue(value)
  }, [value])

  useEffect(() => {
    onChange(autocomplete.inputValue)
  }, [autocomplete.inputValue, onChange])

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
          value={autocomplete.inputValue}
          onChange={(e) => {
            autocomplete.setInputValue(e.target.value)
            autocomplete.setIsOpen(e.target.value.trim().length > 0)
          }}
          onKeyDown={autocomplete.handleKeyDown}
          onFocus={() => autocomplete.setIsOpen(autocomplete.inputValue.trim().length > 0)}
          onBlur={() => setTimeout(() => autocomplete.setIsOpen(false), 150)}
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

      {autocomplete.isOpen && autocomplete.filteredSuggestions.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-700 shadow-lg">
          {autocomplete.filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => {
                autocomplete.selectSuggestion(suggestion)
                onChange(suggestion)
              }}
              className={`w-full px-4 py-2 text-right hover:bg-gray-800 ${
                index === autocomplete.selectedIndex ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
