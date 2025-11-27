# Sales

> Sales & Pipeline - CRM, quotes, and deal management.

The Sales category contains modules for managing customer relationships, sales pipelines, and quote generation. Integrated with the Event Backbone for cross-module visibility.

## Modules

| Module | Purpose | Status |
|--------|---------|--------|
| crm | Contact and company management | Planned |
| quotes | Quote generation and tracking | Planned |
| pipeline | Deal stages and forecasting | Planned |

## Key Concepts

### Lead-to-Client Flow
```
Lead (Brand) → Contact (CRM) → Deal (Pipeline) → Quote → Client
```

### Event Integration
All sales activities emit events:
- `deal.created`, `deal.stage_changed`, `deal.won`, `deal.lost`
- `quote.sent`, `quote.accepted`, `quote.rejected`

These events trigger automations and update the "Calm Prompt" daily view.

## Dependencies

| Depends On | Relationship |
|------------|--------------|
| `platform/core-api` | Authentication, event storage |
| `brand/lead-capture` | Lead source (optional) |
| `strategy/universal-brief` | Quote templates, pricing |

## Roadmap

This category is planned for post-MVP development.

---

*Modules in this category are planned. Documentation will be added as development begins.*
