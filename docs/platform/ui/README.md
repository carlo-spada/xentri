# UI

> Design system - shared components, Tailwind config, and shadcn/ui.

**Package:** `packages/ui`
**Entity Type:** Infrastructure Module
**Status:** Active

## Overview

The UI package provides:
- Shared React components (buttons, forms, dialogs, etc.)
- Tailwind CSS v4 configuration
- shadcn/ui component library integration
- Design tokens and theming

## Key Principle

> UI components are pure and stateless. They receive props and emit events.
> Business logic belongs in the consuming modules, not in UI components.

## Component Architecture

```
packages/ui/
├── components/
│   ├── button.tsx       # Base components
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── lib/
│   └── utils.ts         # Class merging utilities
└── tailwind.config.ts   # Shared Tailwind config
```

## Dependencies

None - this is a foundational package.

## Consumed By

| Module | Usage |
|--------|-------|
| `platform/shell` | All UI rendering |
| Future micro-apps | Consistent styling |

## Development

```bash
# Start Storybook (if configured)
pnpm --filter @xentri/ui run storybook

# Run component tests
pnpm --filter @xentri/ui run test
```

## Theming

The UI package supports theming via CSS variables:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

## Documentation Structure

```
docs/platform/ui/
├── README.md              # This file
├── components.md          # Component catalog
├── theming.md             # Theme customization guide
└── sprint-artifacts/
    └── sprint-status.yaml
```

---

## Related Documents

- [Components](./components.md) — Full component catalog with usage examples
- [Theming](./theming.md) — Theme architecture and customization
