import { useStore } from '@nanostores/react'
import { X } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { CATEGORIES, $mobileDrawerOpen, closeMobileDrawer } from '../stores/navigation'
import SidebarCategory from './SidebarCategory'

export default function MobileDrawer() {
  const isOpen = useStore($mobileDrawerOpen)

  // Close on escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMobileDrawer()
    }
  }, [])

  // Handle outside click
  const handleBackdropClick = () => {
    closeMobileDrawer()
  }

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="mobile-drawer-container fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="backdrop fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="drawer-panel fixed left-0 top-0 bottom-0 w-72 max-w-[80vw]
          bg-[var(--color-chrome)] border-r border-[var(--color-surface)]
          flex flex-col animate-slide-in overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="drawer-header flex items-center justify-between p-4 border-b border-[var(--color-surface)]">
          <div className="brand flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              }}
              aria-hidden="true"
            />
            <span className="font-bold text-[var(--color-text-primary)]">Xentri</span>
          </div>

          <button
            onClick={closeMobileDrawer}
            className="touch-target flex items-center justify-center p-2 rounded-lg
              text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
              hover:bg-[var(--color-surface)] transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="drawer-nav flex-1 overflow-y-auto p-2">
          {CATEGORIES.map((category) => (
            <SidebarCategory key={category.id} category={category} />
          ))}
        </nav>
      </aside>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
