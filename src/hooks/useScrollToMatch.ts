import { useCallback, useEffect, useRef } from 'react'
import type { SearchMatch } from './useSearch'

export function useScrollToMatch(
  matches: SearchMatch[],
  currentMatchIndex: number,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const matchRefs = useRef<(HTMLElement | null)[]>([])

  const setMatchRef = useCallback((index: number, element: HTMLElement | null) => {
    matchRefs.current[index] = element
  }, [])

  const smoothScrollTo = useCallback(
    (targetScrollTop: number) => {
      const container = containerRef.current
      if (!container) return

      const startScrollTop = container.scrollTop
      const distance = targetScrollTop - startScrollTop
      const duration = 300
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
    },
    [containerRef]
  )

  useEffect(() => {
    if (matches.length > 0 && matchRefs.current[currentMatchIndex]) {
      const element = matchRefs.current[currentMatchIndex]

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
  }, [currentMatchIndex, matches, smoothScrollTo, containerRef])

  useEffect(() => {
    matchRefs.current = new Array(matches.length).fill(null)
  }, [matches.length])

  return { setMatchRef }
}
