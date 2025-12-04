import { useStore } from '@nanostores/react'
import { Bell, Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import {
  $notifications,
  $unreadCount,
  $notificationDropdownOpen,
  $notificationsLoading,
  toggleNotificationDropdown,
  closeNotificationDropdown,
  markAsRead,
  markAllAsRead,
  fetchNotifications,
} from '../stores/notifications'
import { cn } from '@xentri/ui'

export default function NotificationBell() {
  const notifications = useStore($notifications)
  const unreadCount = useStore($unreadCount)
  const isOpen = useStore($notificationDropdownOpen)
  const isLoading = useStore($notificationsLoading)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeNotificationDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeNotificationDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="notification-bell relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleNotificationDropdown}
        className={cn(
          'touch-target flex items-center justify-center p-2 rounded-lg',
          'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
          'hover:bg-[var(--color-surface)] transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
          isOpen && 'bg-[var(--color-surface)] text-[var(--color-text-primary)]'
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 flex items-center justify-center
            min-w-[18px] h-[18px] px-1 rounded-full
            bg-[var(--color-error)] text-white text-xs font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="notification-dropdown absolute right-0 top-full mt-2
            w-80 max-h-96 overflow-hidden rounded-lg shadow-lg
            bg-[var(--color-surface)] border border-[var(--color-surface-plus)]
            z-50"
          role="menu"
        >
          {/* Header */}
          <div
            className="dropdown-header flex items-center justify-between
            px-4 py-3 border-b border-[var(--color-surface-plus)]"
          >
            <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Content */}
          <div className="dropdown-content overflow-y-auto max-h-72">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-[var(--color-text-muted)]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Bell size={32} className="text-[var(--color-text-muted)] mb-2" />
                <p className="text-sm text-[var(--color-text-muted)]">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-surface-plus)]">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={cn(
                      'notification-item px-4 py-3 cursor-pointer',
                      'hover:bg-[var(--color-chrome)] transition-colors',
                      !notification.read && 'bg-[var(--color-primary)]/5'
                    )}
                    onClick={() => markAsRead(notification.id)}
                    role="menuitem"
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread indicator */}
                      {!notification.read && (
                        <span className="mt-2 w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                      )}
                      {notification.read && <span className="w-2 shrink-0" />}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {notification.title}
                        </p>
                        {notification.body && (
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                            {notification.body}
                          </p>
                        )}
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="dropdown-footer px-4 py-2 border-t border-[var(--color-surface-plus)]">
              <a
                href="/notifications"
                className="text-xs text-[var(--color-primary)] hover:underline"
                onClick={closeNotificationDropdown}
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
