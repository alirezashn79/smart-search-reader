import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone: boolean }).standalone === true

    setIsStandalone(isInStandaloneMode)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  if (isStandalone) return null

  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="animate-slide-up fixed right-4 bottom-4 left-4 z-50">
        <div className="mx-auto max-w-sm rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-white">نصب اپلیکیشن</h3>
              <p className="mb-3 text-xs text-gray-300">
                برای دسترسی سریع‌تر، اپ رو روی دستگاهت نصب کن
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Download className="h-3 w-3" />
                  نصب
                </button>
                <button
                  onClick={handleDismiss}
                  className="rounded px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-gray-300"
                >
                  بعداً
                </button>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isIOS && !isStandalone) {
    return (
      <div className="animate-slide-up fixed right-4 bottom-4 left-4 z-50">
        <div className="mx-auto max-w-sm rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-white">نصب اپلیکیشن</h3>
              <p className="mb-2 text-xs text-gray-300">برای نصب:</p>
              <ol className="mb-3 list-inside list-decimal space-y-1 text-xs text-gray-300">
                <li>روی دکمه Share بزن</li>
                <li>"Add to Home Screen" انتخاب کن</li>
              </ol>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                متوجه شدم
              </button>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="p-1 text-gray-400 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
