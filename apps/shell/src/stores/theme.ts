import { atom, computed } from 'nanostores';

/**
 * Theme preference values.
 * - light: Force light mode
 * - dark: Force dark mode
 * - system: Follow system preference
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Resolved theme (actual applied theme).
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * User's theme preference.
 */
export const $themePreference = atom<ThemePreference>('dark');

/**
 * System's color scheme preference.
 */
export const $systemTheme = atom<ResolvedTheme>('dark');

/**
 * Resolved theme based on preference and system setting.
 */
export const $resolvedTheme = computed(
  [$themePreference, $systemTheme],
  (preference, system): ResolvedTheme => {
    if (preference === 'system') {
      return system;
    }
    return preference;
  }
);

/**
 * Key for localStorage persistence.
 */
const THEME_STORAGE_KEY = 'xentri-theme';

/**
 * Whether theme is currently being saved to server.
 */
export const $themeSaving = atom<boolean>(false);

function persistLocalTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

/**
 * Set theme preference and optionally persist to server.
 */
export async function setTheme(
  theme: ThemePreference,
  persist: boolean = true
): Promise<void> {
  $themePreference.set(theme);
  applyTheme($resolvedTheme.get());
  if (typeof window !== 'undefined') {
    persistLocalTheme(theme);
  }

  if (persist) {
    await persistTheme(theme);
  }
}

/**
 * Apply theme to document.
 * Adds/removes 'dark' class on <html> element.
 */
export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

/**
 * Initialize theme from system preference and optionally from user preference.
 */
export function initializeTheme(userPreference?: ThemePreference): void {
  // Detect system preference
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    $systemTheme.set(mediaQuery.matches ? 'dark' : 'light');

    // Listen for system preference changes
    mediaQuery.addEventListener('change', (e) => {
      $systemTheme.set(e.matches ? 'dark' : 'light');
      if ($themePreference.get() === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Set user preference if provided
  if (userPreference) {
    $themePreference.set(userPreference);
    persistLocalTheme(userPreference);
  }

  // Apply initial theme
  applyTheme($resolvedTheme.get());
}

/**
 * Persist theme preference to server.
 */
async function persistTheme(theme: ThemePreference): Promise<void> {
  $themeSaving.set(true);
  try {
    const response = await fetch('/api/v1/users/me/preferences', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to persist theme preference');
    }
  } catch (error) {
    console.error('Error persisting theme preference:', error);
  } finally {
    $themeSaving.set(false);
  }
}

/**
 * Load theme preference from user data.
 * Called on app initialization.
 */
export function loadThemeFromUser(theme?: string): void {
  if (theme && ['light', 'dark', 'system'].includes(theme)) {
    $themePreference.set(theme as ThemePreference);
    persistLocalTheme(theme as ThemePreference);
    applyTheme($resolvedTheme.get());
  }
}

/**
 * Hydrate theme preference from server if available, then apply and cache locally.
 * Falls back silently on errors/unauthenticated state.
 */
export async function hydrateThemeFromServer(): Promise<void> {
  try {
    const response = await fetch('/api/v1/users/me/preferences', {
      credentials: 'include',
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const theme = data?.preferences?.theme as ThemePreference | undefined;

    if (theme && ['light', 'dark', 'system'].includes(theme)) {
      $themePreference.set(theme);
      persistLocalTheme(theme);
      applyTheme($resolvedTheme.get());
    }
  } catch {
    // Ignore failures; fallback to existing preference/system
  }
}
