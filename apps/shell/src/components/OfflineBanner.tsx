import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { cn } from '@xentri/ui'

/**
 * Offline Banner Component
 *
 * Displays a graceful banner when the user loses network connectivity.
 * Uses navigator.onLine and online/offline events for detection.
 */
export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Initialize with current state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)

    // Try a simple fetch to verify connectivity
    try {
      const response = await fetch('/api/v1/health', {
        method: 'HEAD',
        cache: 'no-store',
      })

      if (response.ok) {
        setIsOnline(true)
      }
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false)
    }
  }

  // Don't render if online
  if (isOnline) return null

  return (
    <div
      className={cn(
        'offline-banner fixed bottom-0 left-0 right-0 z-50',
        'bg-[var(--color-warning)]/90 backdrop-blur-sm',
        'px-4 py-3 flex items-center justify-center gap-3',
        'animate-slide-up'
      )}
      role="alert"
      aria-live="polite"
    >
      <WifiOff size={20} className="text-[var(--color-base)] shrink-0" />

      <p className="text-sm font-medium text-[var(--color-base)]">
        You're offline. Some features may be limited.
      </p>

      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
          'text-sm font-medium transition-colors',
          'bg-[var(--color-base)]/20 hover:bg-[var(--color-base)]/30',
          'text-[var(--color-base)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-base)]',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Retry connection"
      >
        <RefreshCw size={14} className={cn(isRetrying && 'animate-spin')} />
        Retry
      </button>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
