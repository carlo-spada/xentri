/**
 * Service Worker Registration
 *
 * Registers the service worker for offline functionality and PWA features.
 * Only registers in production or when explicitly enabled.
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  // Only register in production
  if (import.meta.env.DEV) {
    console.log('Service Worker registration skipped in development')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registered:', registration.scope)

    // Check for updates periodically
    setInterval(
      () => {
        registration.update()
      },
      60 * 60 * 1000
    ) // Every hour

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * Unregister all service workers.
 * Useful for debugging or when PWA features need to be disabled.
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()

    for (const registration of registrations) {
      await registration.unregister()
    }

    console.log('Service Workers unregistered')
    return true
  } catch (error) {
    console.error('Failed to unregister Service Workers:', error)
    return false
  }
}
