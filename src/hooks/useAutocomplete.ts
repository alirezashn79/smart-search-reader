import { useMemo, useState } from 'react'

export default function useAutocomplete(suggestions: string[], maxSuggestions: number = 5) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) return []

    return suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, maxSuggestions)
  }, [inputValue, suggestions, maxSuggestions])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1))
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0) {
          selectSuggestion(filteredSuggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  return {
    inputValue,
    isOpen,
    selectedIndex,
    filteredSuggestions,
    setInputValue,
    handleKeyDown,
    selectSuggestion,
    setIsOpen,
  }
}
