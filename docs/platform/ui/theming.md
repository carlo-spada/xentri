# UI Theming

> **Module:** ui
> **System:** CSS custom properties + Tailwind

---

## Theme Architecture

Xentri supports three themes, each with light and dark modes:

| Theme | Personality | Use Case |
|-------|-------------|----------|
| **Modern** | Conversational, immersive | Default for most users |
| **Power** | Dense, high-contrast | Power users, data-heavy |
| **Traditional** | Professional, balanced | Conservative industries |

---

## CSS Custom Properties

Themes are implemented via CSS custom properties:

```css
/* Base tokens (theme-agnostic) */
:root {
  --radius: 0.5rem;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* Modern Dark (default) */
[data-theme="modern"][data-mode="dark"] {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --primary: 210 100% 60%;
  --primary-foreground: 0 0% 100%;
  --muted: 223 47% 11%;
  --muted-foreground: 215 20% 65%;
  --accent: 262 83% 58%;
  /* ... */
}

/* Modern Light */
[data-theme="modern"][data-mode="light"] {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --primary: 210 100% 50%;
  /* ... */
}
```

---

## Color Palette

### Semantic Colors

| Token | Purpose |
|-------|---------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--primary` | Primary actions, links |
| `--secondary` | Secondary actions |
| `--muted` | Subtle backgrounds |
| `--accent` | Highlights, focus |
| `--destructive` | Error states, delete |

### Status Colors

| Token | Meaning |
|-------|---------|
| `--success` | Positive outcomes |
| `--warning` | Attention needed |
| `--error` | Problems, failures |
| `--info` | Informational |

---

## Applying Themes

### Via Data Attributes

```html
<html data-theme="modern" data-mode="dark">
```

### Via React Context

```tsx
import { ThemeProvider, useTheme } from '@xentri/ui/theme';

// In app root
<ThemeProvider defaultTheme="modern" defaultMode="dark">
  <App />
</ThemeProvider>

// In components
function ThemeToggle() {
  const { theme, mode, setTheme, setMode } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="modern">Modern</option>
      <option value="power">Power</option>
      <option value="traditional">Traditional</option>
    </select>
  );
}
```

---

## Using Theme Tokens

### In CSS/Tailwind

```tsx
// Using Tailwind classes with CSS variables
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

### In JavaScript

```tsx
// Reading computed values
const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue('--primary');
```

---

## Typography Scale

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

---

## Spacing Scale

Based on 4px grid:

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

---

## Soul-Aware Theming

The Soul can suggest a theme based on business type:

```typescript
const themeRecommendations = {
  'healthcare': 'traditional',
  'tech_startup': 'modern',
  'finance': 'power',
  'creative_agency': 'modern',
  'legal': 'traditional',
};

// In copilot recommendation
if (soul.business_type && themeRecommendations[soul.business_type]) {
  suggestTheme(themeRecommendations[soul.business_type]);
}
```

---

## Dark Mode Detection

Respects system preference by default:

```typescript
// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (userPreference === 'system') {
      setMode(e.matches ? 'dark' : 'light');
    }
  });
```

---

## Customization

Organizations can customize within theme constraints:

```typescript
// Allowed customizations (stored in Soul)
interface ThemeCustomization {
  primaryColor?: string;  // Must meet contrast requirements
  logoUrl?: string;
  customTerms?: Record<string, string>;
}

// Validation
function validateCustomColor(color: string): boolean {
  const contrast = getContrastRatio(color, backgroundColor);
  return contrast >= 4.5; // WCAG AA
}
```

---

## Related Documents

- [Components](./components.md) — Component catalog
- [UX Design Spec](../ux-design.md) — Design system foundations
