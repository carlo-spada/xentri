# Finance

> Finance & Accounting - invoicing, payments, and bookkeeping.

The Finance category contains modules for managing business finances, from invoicing clients to tracking payments and maintaining accounting records.

## Modules

| Module | Purpose | Status |
|--------|---------|--------|
| invoicing | Invoice generation and sending | Planned |
| payments | Payment tracking and reminders | Planned |
| accounting | Basic bookkeeping and reporting | Planned |

## Key Concepts

### Invoice Flow
```
Quote (Sales) → Invoice → Payment → Reconciliation
```

### Open Loops Integration
Unpaid invoices and overdue payments surface in the "Calm Prompt" as Open Loops requiring attention.

### Multi-Currency Support
Designed for international businesses with proper currency handling and exchange rate tracking.

## Dependencies

| Depends On | Relationship |
|------------|--------------|
| `platform/core-api` | Authentication, event storage |
| `sales/quotes` | Quote-to-invoice conversion (optional) |

## Roadmap

This category is planned for v0.4 (Business in Motion bundle).

---

*Modules in this category are planned. Documentation will be added as development begins.*
