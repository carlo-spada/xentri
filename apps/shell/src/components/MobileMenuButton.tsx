import { Menu } from 'lucide-react'
import { toggleMobileDrawer } from '../stores/navigation'

export default function MobileMenuButton() {
  return (
    <button
      onClick={toggleMobileDrawer}
      className="touch-target flex items-center justify-center p-2 rounded-lg
        text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
        hover:bg-[var(--color-surface)] transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      aria-label="Open navigation menu"
    >
      <Menu size={24} />
    </button>
  )
}
