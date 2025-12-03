# React Islands

> **Module:** shell
> **Pattern:** Astro Island Architecture

---

## Overview

React islands are interactive components that hydrate independently within the Astro shell. They enable rich interactivity while keeping the overall bundle size minimal.

---

## Island Catalog

| Island | Purpose | Hydration |
|--------|---------|-----------|
| `StrategySPA` | Strategy category SPA | `client:visible` |
| `SoulEditor` | Soul section editor | `client:load` |
| `NotificationBell` | Notification center | `client:idle` |
| `CopilotPanel` | AI copilot interface | `client:visible` |
| `CommandPalette` | Cmd+K search | `client:idle` |

---

## Creating an Island

### 1. Create the React Component

```tsx
// src/islands/MyIsland.tsx
import { useStore } from '@nanostores/react';
import { $user } from '../stores/user';

interface MyIslandProps {
  initialData?: string;
}

export function MyIsland({ initialData }: MyIslandProps) {
  const user = useStore($user);

  return (
    <div className="my-island">
      <h2>Hello, {user?.name}</h2>
      {initialData && <p>{initialData}</p>}
    </div>
  );
}
```

### 2. Use in Astro Page

```astro
---
// src/pages/example.astro
import { MyIsland } from '../islands/MyIsland';

const serverData = await fetchSomeData();
---

<MyIsland
  client:visible
  initialData={serverData}
/>
```

---

## Hydration Strategies

### `client:load`

Hydrates immediately when page loads. Use for above-the-fold interactive content.

```astro
<CriticalForm client:load />
```

### `client:visible`

Hydrates when scrolled into viewport. Use for below-the-fold content.

```astro
<DataTable client:visible />
```

### `client:idle`

Hydrates when browser is idle. Use for non-critical enhancements.

```astro
<Analytics client:idle />
```

### `client:only="react"`

Renders only on client, no SSR. Use when server rendering is impossible.

```astro
<BrowserOnlyChart client:only="react" />
```

---

## State Management

### Shared State with Nano Stores

```typescript
// stores/soul.ts
import { atom, computed } from 'nanostores';

export const $soul = atom<Soul | null>(null);
export const $soulSection = atom<string>('identity');

export const $currentSection = computed(
  [$soul, $soulSection],
  (soul, section) => soul?.sections[section]
);
```

### Using in Islands

```tsx
import { useStore } from '@nanostores/react';
import { $soul, $soulSection } from '../stores/soul';

export function SoulNav() {
  const section = useStore($soulSection);

  return (
    <nav>
      {['identity', 'offerings', 'goals'].map(s => (
        <button
          key={s}
          onClick={() => $soulSection.set(s)}
          data-active={section === s}
        >
          {s}
        </button>
      ))}
    </nav>
  );
}
```

---

## Data Fetching

### Server-Side (Recommended)

Fetch data in Astro, pass to island:

```astro
---
const soul = await fetch('/api/v1/soul', {
  headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json());
---

<SoulEditor initialSoul={soul} client:load />
```

### Client-Side

For dynamic data after hydration:

```tsx
export function SoulEditor({ initialSoul }) {
  const [soul, setSoul] = useState(initialSoul);

  const refresh = async () => {
    const response = await fetch('/api/v1/soul');
    setSoul(await response.json());
  };

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {/* ... */}
    </div>
  );
}
```

---

## Communication Between Islands

Islands communicate via Nano Stores:

```tsx
// Island A: Updates store
import { $selectedDeal } from '../stores/deals';

function DealList() {
  return (
    <ul>
      {deals.map(deal => (
        <li
          key={deal.id}
          onClick={() => $selectedDeal.set(deal)}
        >
          {deal.name}
        </li>
      ))}
    </ul>
  );
}

// Island B: Reacts to store
import { $selectedDeal } from '../stores/deals';

function DealDetail() {
  const deal = useStore($selectedDeal);

  if (!deal) return <p>Select a deal</p>;

  return <div>{deal.name}</div>;
}
```

---

## Performance Tips

1. **Prefer `client:visible`** over `client:load` when possible
2. **Keep islands small** — Split large components
3. **Avoid prop drilling** — Use stores for shared state
4. **Lazy load heavy deps** — Dynamic imports for charts, editors
5. **Measure hydration** — Use React DevTools Profiler
