import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function PWAUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })
      })

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      setUpdateAvailable(false)
    }
  }

  if (!updateAvailable) return null

  return (
    <div className="animate-slide-down fixed top-4 right-4 left-4 z-50">
      <div className="mx-auto max-w-sm rounded-lg bg-green-600 p-4 shadow-lg">
        <div className="flex items-center justify-between text-white">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold">بروزرسانی موجود است</h3>
            <p className="mb-2 text-xs opacity-90">نسخه جدید اپلیکیشن آماده نصب است</p>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-gray-100"
            >
              <RefreshCw className="h-3 w-3" />
              بروزرسانی
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
