import { UserButton as ClerkUserButton, OrganizationSwitcher } from '@clerk/astro/react';

/**
 * User button component for the shell header.
 *
 * Displays:
 * - Organization switcher (for multi-org users)
 * - User avatar with dropdown menu
 */
export function UserButton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <OrganizationSwitcher
        appearance={{
          elements: {
            rootBox: 'org-switcher-root',
            organizationSwitcherTrigger: 'org-switcher-trigger',
          },
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#18181b',
            colorText: '#fafafa',
            colorTextSecondary: '#a1a1aa',
            borderRadius: '0.5rem',
          },
        }}
        hidePersonal={true}
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
      />
      <ClerkUserButton
        appearance={{
          elements: {
            avatarBox: 'user-avatar',
            userButtonPopoverCard: 'user-popover',
          },
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#18181b',
            colorText: '#fafafa',
            colorTextSecondary: '#a1a1aa',
            borderRadius: '0.5rem',
          },
        }}
      />
    </div>
  );
}
