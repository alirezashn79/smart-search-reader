import { ChevronDown, ChevronUp } from 'lucide-react'

interface IProps {
  currentMatch: number
  totalMatches: number
  onNext: () => void
  onPrev: () => void
}

export default function NavigationControls({ currentMatch, totalMatches, onNext, onPrev }: IProps) {
  if (totalMatches === 0) return null

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-slate-900 px-3 py-2 shadow-sm">
      <span className="text-sm font-medium text-gray-300">
        {currentMatch + 1} از {totalMatches}
      </span>
      <div className="flex gap-1">
        <button
          onClick={onNext}
          disabled={totalMatches === 0}
          className="rounded p-1 transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          title="بعدی"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          onClick={onPrev}
          disabled={totalMatches === 0}
          className="rounded p-1 transition-colors hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          title="قبلی"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
