# Module Interfaces

This folder documents the contracts and interfaces that this module **exposes** to other modules.

## Structure

Each interface document follows a standard format:

```
interfaces/
├── README.md           # This file
├── {consumer}-{feature}.md  # Interface consumed by another module
└── ...
```

## Interface Document Template

Interface documents are auto-generated from approved cross-module requests (GitHub Issues with `cross-module` label and `status:approved`).

## How to Add an Interface

1. Create a cross-module request using the GitHub Issue template
2. Once approved, the interface doc is generated here
3. Update this module's code to implement the interface
4. Consumer module references this doc for integration

## Current Interfaces

<!-- Auto-populated by interface-sync workflow -->

| Interface                      | Consumer | Status | Issue |
| ------------------------------ | -------- | ------ | ----- |
| _No interfaces documented yet_ | -        | -      | -     |
