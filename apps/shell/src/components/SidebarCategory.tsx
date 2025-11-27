import { useStore } from '@nanostores/react';
import {
  Target,
  Palette,
  Users,
  DollarSign,
  Truck,
  UserCog,
  Scale,
  ChevronDown,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import {
  type Category,
  $expandedCategory,
  $activeModule,
  $sidebarState,
  toggleCategory,
  setActiveModule,
} from '../stores/navigation';
import { cn } from '@xentri/ui';

// Icon mapping
const ICONS: Record<string, LucideIcon> = {
  Target,
  Palette,
  Users,
  DollarSign,
  Truck,
  UserCog,
  Scale,
};

interface SidebarCategoryProps {
  category: Category;
}

export default function SidebarCategory({ category }: SidebarCategoryProps) {
  const expandedCategory = useStore($expandedCategory);
  const activeModule = useStore($activeModule);
  const sidebarState = useStore($sidebarState);

  const isExpanded = expandedCategory === category.id;
  const isCollapsed = sidebarState === 'collapsed';
  const Icon = ICONS[category.icon] || Target;

  const handleCategoryClick = () => {
    if (!category.active) return;
    toggleCategory(category.id);
  };

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick();
    }
  };

  return (
    <div className="sidebar-category">
      {/* Category Button */}
      <button
        onClick={handleCategoryClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'category-button touch-target',
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
          'text-left transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
          category.active
            ? 'hover:bg-[var(--color-surface)] cursor-pointer'
            : 'opacity-50 cursor-not-allowed',
          isExpanded && 'bg-[var(--color-surface)]'
        )}
        disabled={!category.active}
        aria-expanded={isExpanded}
        aria-controls={`modules-${category.id}`}
        title={isCollapsed ? category.label : undefined}
        data-astro-prefetch="hover"
      >
        <span className="category-icon shrink-0">
          <Icon
            size={20}
            className={cn(
              'transition-colors',
              isExpanded
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)]'
            )}
          />
        </span>

        {!isCollapsed && (
          <>
            <span
              className={cn(
                'category-label flex-1 text-sm font-medium truncate sidebar-label',
                isExpanded
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)]'
              )}
            >
              {category.label}
            </span>

            {/* Expand/Lock indicator */}
            {category.active ? (
              <ChevronDown
                size={16}
                className={cn(
                  'shrink-0 transition-transform duration-200',
                  'text-[var(--color-text-muted)]',
                  isExpanded && 'rotate-180'
                )}
              />
            ) : (
              <Lock
                size={14}
                className="shrink-0 text-[var(--color-text-muted)]"
              />
            )}
          </>
        )}
      </button>

      {/* Modules List (Accordion Content) */}
      {!isCollapsed && isExpanded && category.modules && (
        <div
          id={`modules-${category.id}`}
          className="modules-list mt-1 ml-2 pl-5 border-l border-[var(--color-surface-plus)]"
          role="group"
          aria-label={`${category.label} modules`}
        >
          {category.modules.map((module) => {
            const isActive = activeModule === module.id;

            return (
              <a
                key={module.id}
                href={module.href}
                onClick={() => handleModuleClick(module.id)}
                className={cn(
                  'module-link touch-target',
                  'block px-3 py-2 rounded-md text-sm',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                  isActive
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                )}
                aria-current={isActive ? 'page' : undefined}
                data-astro-prefetch="hover"
              >
                {module.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
