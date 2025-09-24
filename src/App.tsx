import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import SmartSearchReader from './components/SmartSearchReader'

export default function App() {
  return (
    <>
      <SmartSearchReader />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </>
  )
}
