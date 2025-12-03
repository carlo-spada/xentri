# UI Component Catalog

> **Module:** ui
> **Design System:** shadcn/ui + Tailwind CSS

---

## Overview

The UI package provides a shared component library based on shadcn/ui, customized for Xentri's design system.

---

## Component Categories

### Layout

| Component | Description | Import |
|-----------|-------------|--------|
| `Card` | Content container with variants | `@xentri/ui/card` |
| `Panel` | Sidebar/overlay panels | `@xentri/ui/panel` |
| `Grid` | Responsive grid layouts | `@xentri/ui/grid` |
| `Stack` | Vertical/horizontal stacking | `@xentri/ui/stack` |

### Navigation

| Component | Description | Import |
|-----------|-------------|--------|
| `Sidebar` | Main navigation sidebar | `@xentri/ui/sidebar` |
| `Breadcrumb` | Path navigation | `@xentri/ui/breadcrumb` |
| `Tabs` | Tab navigation | `@xentri/ui/tabs` |
| `CommandPalette` | Cmd+K search | `@xentri/ui/command` |

### Forms

| Component | Description | Import |
|-----------|-------------|--------|
| `Input` | Text input with variants | `@xentri/ui/input` |
| `Select` | Dropdown selection | `@xentri/ui/select` |
| `Checkbox` | Boolean input | `@xentri/ui/checkbox` |
| `Switch` | Toggle switch | `@xentri/ui/switch` |
| `DatePicker` | Date selection | `@xentri/ui/date-picker` |

### Feedback

| Component | Description | Import |
|-----------|-------------|--------|
| `Toast` | Notification toasts | `@xentri/ui/toast` |
| `Alert` | Inline alerts | `@xentri/ui/alert` |
| `Badge` | Status badges | `@xentri/ui/badge` |
| `Progress` | Progress indicators | `@xentri/ui/progress` |

### Data Display

| Component | Description | Import |
|-----------|-------------|--------|
| `Table` | Data tables | `@xentri/ui/table` |
| `Avatar` | User avatars | `@xentri/ui/avatar` |
| `Tooltip` | Hover tooltips | `@xentri/ui/tooltip` |

---

## Usage Examples

### Button

```tsx
import { Button } from '@xentri/ui/button';

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With icon
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@xentri/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Invoice #247</CardTitle>
    <CardDescription>Due in 5 days</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Amount: $1,500.00</p>
  </CardContent>
  <CardFooter>
    <Button>Send Reminder</Button>
  </CardFooter>
</Card>
```

### Form

```tsx
import { Input } from '@xentri/ui/input';
import { Label } from '@xentri/ui/label';
import { Button } from '@xentri/ui/button';

<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
      />
    </div>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

### Toast

```tsx
import { useToast } from '@xentri/ui/toast';

function MyComponent() {
  const { toast } = useToast();

  const handleSave = async () => {
    await save();
    toast({
      title: 'Saved',
      description: 'Your changes have been saved.',
    });
  };
}
```

---

## Xentri-Specific Components

### ExceptionCard

Displays actionable items requiring attention:

```tsx
import { ExceptionCard } from '@xentri/ui/exception-card';

<ExceptionCard
  type="warning"
  title="Invoice Overdue"
  description="Invoice #247 is 30 days past due"
  action={{
    label: "Send Reminder",
    onClick: handleReminder
  }}
/>
```

### AutonomyBadge

Shows automation level:

```tsx
import { AutonomyBadge } from '@xentri/ui/autonomy-badge';

<AutonomyBadge level="assisted" />
// Levels: manual | assisted | supervised | autonomous
```

### PolicySlider

Configures automation policies:

```tsx
import { PolicySlider } from '@xentri/ui/policy-slider';

<PolicySlider
  label="Auto-send invoice reminders"
  value={policy.invoiceReminders}
  onChange={(value) => updatePolicy('invoiceReminders', value)}
/>
```

---

## Installation

Components are pre-installed in the monorepo. Import from `@xentri/ui`:

```tsx
import { Button, Card, Input } from '@xentri/ui';
```

For new shadcn/ui components, use the CLI:

```bash
pnpm --filter @xentri/ui dlx shadcn@latest add [component]
```

---

## Related Documents

- [Theming](./theming.md) — Theme customization
- [UX Design Spec](../ux-design.md) — Design system foundations
