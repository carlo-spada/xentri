import { atom, computed } from 'nanostores';

/**
 * Category definition for the 7 Xentri capability categories.
 * Active categories are interactable; inactive ones show as locked.
 */
export interface Category {
  id: string;
  icon: string;
  label: string;
  active: boolean;
  modules?: Module[];
}

export interface Module {
  id: string;
  label: string;
  href: string;
}

/**
 * The 7 capability categories as defined in the PRD.
 * MVP: Only "management" is active.
 */
export const CATEGORIES: Category[] = [
  {
    id: 'management',
    icon: 'Target',
    label: 'Management & Strategy',
    active: true,
    modules: [
      { id: 'dashboard', label: 'Dashboard', href: '/' },
      { id: 'strategy', label: 'Strategy', href: '/strategy' },
      { id: 'brief', label: 'Universal Brief', href: '/strategy/brief/new' },
    ],
  },
  {
    id: 'brand',
    icon: 'Palette',
    label: 'Brand & Marketing',
    active: false,
    modules: [
      { id: 'website', label: 'Website', href: '/brand/website' },
      { id: 'cms', label: 'Content', href: '/brand/cms' },
    ],
  },
  {
    id: 'sales',
    icon: 'Users',
    label: 'Sales & Relationships',
    active: false,
    modules: [
      { id: 'leads', label: 'Leads', href: '/sales/leads' },
      { id: 'crm', label: 'CRM', href: '/sales/crm' },
    ],
  },
  {
    id: 'finance',
    icon: 'DollarSign',
    label: 'Finance & Accounting',
    active: false,
    modules: [
      { id: 'invoices', label: 'Invoices', href: '/finance/invoices' },
      { id: 'payments', label: 'Payments', href: '/finance/payments' },
    ],
  },
  {
    id: 'operations',
    icon: 'Truck',
    label: 'Operations & Delivery',
    active: false,
    modules: [
      { id: 'projects', label: 'Projects', href: '/operations/projects' },
      { id: 'tasks', label: 'Tasks', href: '/operations/tasks' },
    ],
  },
  {
    id: 'team',
    icon: 'UserCog',
    label: 'Team & Leadership',
    active: false,
    modules: [
      { id: 'members', label: 'Team Members', href: '/team/members' },
      { id: 'roles', label: 'Roles', href: '/team/roles' },
    ],
  },
  {
    id: 'legal',
    icon: 'Scale',
    label: 'Legal & Compliance',
    active: false,
    modules: [
      { id: 'contracts', label: 'Contracts', href: '/legal/contracts' },
      { id: 'compliance', label: 'Compliance', href: '/legal/compliance' },
    ],
  },
] as const;

/**
 * Currently expanded category in the sidebar.
 * Only one category can be expanded at a time (accordion behavior).
 */
export const $expandedCategory = atom<string | null>(null);

/**
 * Currently active module (for highlighting).
 */
export const $activeModule = atom<string | null>('dashboard');

/**
 * Sidebar collapsed state (for responsive behavior).
 * - expanded: Full sidebar with labels (desktop ≥1024px)
 * - collapsed: Icon-only mode (tablet 768-1023px)
 * - hidden: Mobile drawer mode (<768px)
 */
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';
export const $sidebarState = atom<SidebarState>('expanded');

/**
 * Mobile drawer open state.
 */
export const $mobileDrawerOpen = atom<boolean>(false);

/**
 * Computed: Get the currently expanded category object.
 */
export const $expandedCategoryData = computed($expandedCategory, (id) => {
  if (!id) return null;
  return CATEGORIES.find((c) => c.id === id) || null;
});

/**
 * Toggle category expansion (accordion behavior).
 * Clicking an expanded category collapses it.
 * Clicking a different category expands it and collapses others.
 */
export function toggleCategory(categoryId: string): void {
  const current = $expandedCategory.get();
  if (current === categoryId) {
    $expandedCategory.set(null);
  } else {
    $expandedCategory.set(categoryId);
  }
}

/**
 * Set the active module.
 */
export function setActiveModule(moduleId: string): void {
  $activeModule.set(moduleId);
}

/**
 * Toggle mobile drawer.
 */
export function toggleMobileDrawer(): void {
  $mobileDrawerOpen.set(!$mobileDrawerOpen.get());
}

/**
 * Close mobile drawer.
 */
export function closeMobileDrawer(): void {
  $mobileDrawerOpen.set(false);
}

/**
 * Update sidebar state based on viewport width.
 */
export function updateSidebarState(width: number): void {
  if (width >= 1024) {
    $sidebarState.set('expanded');
  } else if (width >= 768) {
    $sidebarState.set('collapsed');
  } else {
    $sidebarState.set('hidden');
  }
}
