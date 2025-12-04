import { atom, computed } from 'nanostores'

/**
 * Notification type.
 */
export interface Notification {
  id: string
  type: 'lead_created' | 'system' | 'info' | 'warning'
  title: string
  body?: string
  read: boolean
  createdAt: string
}

/**
 * All notifications.
 */
export const $notifications = atom<Notification[]>([])

/**
 * Loading state.
 */
export const $notificationsLoading = atom<boolean>(false)

/**
 * Dropdown open state.
 */
export const $notificationDropdownOpen = atom<boolean>(false)

/**
 * Unread notifications count.
 */
export const $unreadCount = computed($notifications, (notifications) => {
  return notifications.filter((n) => !n.read).length
})

/**
 * Toggle notification dropdown.
 */
export function toggleNotificationDropdown(): void {
  $notificationDropdownOpen.set(!$notificationDropdownOpen.get())
}

/**
 * Close notification dropdown.
 */
export function closeNotificationDropdown(): void {
  $notificationDropdownOpen.set(false)
}

/**
 * Mark a notification as read.
 */
export async function markAsRead(notificationId: string): Promise<void> {
  // Optimistic update
  const notifications = $notifications.get()
  const updated = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
  $notifications.set(updated)

  try {
    await fetch(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    // Revert on error
    $notifications.set(notifications)
  }
}

/**
 * Mark all notifications as read.
 */
export async function markAllAsRead(): Promise<void> {
  const notifications = $notifications.get()
  const updated = notifications.map((n) => ({ ...n, read: true }))
  $notifications.set(updated)

  try {
    await fetch('/api/v1/notifications/read-all', {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    $notifications.set(notifications)
  }
}

/**
 * Fetch notifications from server.
 */
export async function fetchNotifications(): Promise<void> {
  $notificationsLoading.set(true)
  try {
    const response = await fetch('/api/v1/notifications?limit=10', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Notifications request failed with ${response.status}`)
    }

    const data = await response.json()
    const parsed = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.notifications)
        ? data.notifications
        : []

    $notifications.set(parsed)
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    $notifications.set([])
  } finally {
    $notificationsLoading.set(false)
  }
}
