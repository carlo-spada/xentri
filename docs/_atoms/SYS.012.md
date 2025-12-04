---
id: SYS.012
type: interface
title: 'Module Registration Manifest'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [modules, registration, shell, manifest]
legacy_id: IC-003
---

# Module Registration Manifest

> **Atom ID:** `SYS.012`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-003

---

## Summary

Defines the manifest format for registering modules with the Xentri Shell, enabling dynamic loading and navigation.

---

## Content

### Contract

All modules MUST provide a registration manifest conforming to this schema:

```typescript
interface ModuleManifest {
  id: string; // Unique module identifier
  name: string; // Human-readable name
  version: string; // Module version (semver)
  category: string; // Parent category

  // Navigation
  routes: {
    path: string; // URL path segment
    component: string; // Entry component path
    icon?: string; // Navigation icon
    label: string; // Navigation label
  }[];

  // Permissions
  permissions: {
    required: string[]; // Minimum permissions to access
    optional?: string[]; // Enhanced feature permissions
  };

  // Integration
  events: {
    subscribes: string[]; // Event types this module listens to
    publishes: string[]; // Event types this module emits
  };

  // Metadata
  description?: string;
  author?: string;
  documentation?: string; // Link to module docs
}
```

### Consumers

- Shell (for routing and navigation)
- Permission system (for access control)
- Event infrastructure (for subscription setup)

### Providers

- All installable modules

### Registration Process

1. Module places manifest at `module-manifest.json` in package root
2. Shell reads manifest at build time (static) or runtime (dynamic)
3. Routes are registered with router
4. Events subscriptions are configured

### Version

**v1.0** — Initial manifest schema

### Defined In

**shell** — `apps/shell/src/types/module-manifest.ts`

---

## Dependencies

| Atom ID | Relationship | Description                              |
| ------- | ------------ | ---------------------------------------- |
| —       | root         | Constitution-level interface (no parent) |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-003 |
