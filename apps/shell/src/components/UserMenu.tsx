import { useStore } from '@nanostores/react';
import {
  UserButton as ClerkUserButton,
  OrganizationSwitcher,
} from '@clerk/astro/react';
import { Sun, Moon, Monitor, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  $themePreference,
  $themeSaving,
  setTheme,
  initializeTheme,
  hydrateThemeFromServer,
  type ThemePreference,
} from '../stores/theme';
import { cn } from '@xentri/ui';

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function UserMenu() {
  const themePreference = useStore($themePreference);
  const themeSaving = useStore($themeSaving);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
    hydrateThemeFromServer();
  }, []);

  // Close theme menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

  const handleThemeChange = async (theme: ThemePreference) => {
    await setTheme(theme);
    setShowThemeMenu(false);
  };

  const CurrentThemeIcon = THEME_OPTIONS.find((t) => t.value === themePreference)?.icon || Moon;

  return (
    <div className="user-menu flex items-center gap-2">
      {/* Theme Toggle */}
      <div className="theme-toggle relative" ref={themeMenuRef}>
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className={cn(
            'touch-target flex items-center justify-center p-2 rounded-lg',
            'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            'hover:bg-[var(--color-surface)] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
            showThemeMenu && 'bg-[var(--color-surface)] text-[var(--color-text-primary)]'
          )}
          aria-label={`Theme: ${themePreference}. Click to change.`}
          aria-expanded={showThemeMenu}
          aria-haspopup="menu"
        >
          {themeSaving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <CurrentThemeIcon size={20} />
          )}
        </button>

        {/* Theme Menu */}
        {showThemeMenu && (
          <div
            className="theme-menu absolute right-0 top-full mt-2
              w-40 rounded-lg shadow-lg overflow-hidden
              bg-[var(--color-surface)] border border-[var(--color-surface-plus)]
              z-50"
            role="menu"
            aria-label="Theme options"
          >
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = themePreference === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5',
                    'text-sm text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]',
                    isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-chrome)] hover:text-[var(--color-text-primary)]'
                  )}
                  role="menuitem"
                  aria-current={isActive ? 'true' : undefined}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                  {isActive && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Organization Switcher */}
      <OrganizationSwitcher
        appearance={{
          elements: {
            rootBox: 'org-switcher-root',
            organizationSwitcherTrigger: cn(
              'touch-target rounded-lg px-2 py-1',
              'hover:bg-[var(--color-surface)] transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]'
            ),
          },
          variables: {
            colorPrimary: 'var(--color-primary)',
            colorBackground: 'var(--color-surface)',
            colorText: 'var(--color-text-primary)',
            colorTextSecondary: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-md)',
          },
        }}
        hidePersonal={true}
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
      />

      {/* User Avatar */}
      <ClerkUserButton
        appearance={{
          elements: {
            avatarBox: 'touch-target w-9 h-9',
            userButtonPopoverCard: 'bg-[var(--color-surface)]',
          },
          variables: {
            colorPrimary: 'var(--color-primary)',
            colorBackground: 'var(--color-surface)',
            colorText: 'var(--color-text-primary)',
            colorTextSecondary: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-md)',
          },
        }}
      />
    </div>
  );
}
