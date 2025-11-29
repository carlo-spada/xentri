# Product Brief: Xentri

**Date:** 2025-11-28 (revised)
**Author:** Carlo
**Context:** Enterprise Greenfield

---

## Executive Summary

Xentri is a modular Business OS that starts with conversation, not configuration. Seven free AI co-pilots help you articulate what your business actually is and what it needs right now for sustainable growth and stability. After you've talked with them, they point you in the right direction — nudging you to acquire the specific modules your business needs without overwhelming you with excessive information at any given time.

Start free. Add modules as you need them. We offer a 5-tier personalized system based on what your co-pilots have learned about you, not a one-size-fits-all feature list, but you can also add any individual module as you go. Scale your business as you see fit.

**For:** Service businesses, founders, agencies, creators, and any SMB owner who's outgrown spreadsheets and WhatsApp and is ready to automate their business.

---

## The Problem

Small businesses don't suffer from missing features — they suffer from tools that don't talk to each other, software that overwhelms instead of simplifies, and bills that don't fit their business model. *Client info lives in WhatsApp, quotes in Excel, invoices in QuickBooks, and critical context in the owner's head; websites that don't automatically sync with their CMS, CRM, and ERPs; or enterprise software that needs dedicated teams to run with a one-size-fits-all approach.*

The owners and founders often become the human router: copy-pasting, chasing threads, reconciling numbers. Even when automations already exist, they're often either opaque and convoluted or just not built for their specific business model. The result is chronic, low-grade anxiety that "something is dropping" without a specific solution at hand.

Xentri is that solution.

---

## The Solution

Xentri organizes everything a business needs into seven categories: **Strategy, Brand, Sales, Finance, Operations, Team, and Legal.** Each category has its own AI co-pilot that understands your context.

You start with a free conversation. The Strategy co-pilot learns your business, generates your Brief (the living DNA of your company), and recommends exactly which categories you should tackle next — never a catalog of 100 features, but only the few tools that will solve your pain right now.

Every automated action is logged and explainable. One daily view surfaces what needs your attention today. No notification flood, no 40-tab cockpit.

---

## Pricing

| Tier | Price | Modules | Focus |
|------|-------|---------|-------|
| **Free** | $0 | 1 | Strategy co-pilot + Brief |
| **Presencia** | $10/mo | ~3 | Get visible (website, leads) |
| **Light Ops** | $30/mo | ~8 | Run daily ops (CRM, quotes) |
| **Business in Motion** | $90/mo | ~24 | Full flow (invoicing, payments) |
| **Professional** | $270/mo | ~72 | Scale team (roles, permissions) |

Plus $5/module à la carte.

---

## Key Differentiators

- **Free co-pilot from day zero** — Clarity before tools, no credit card required
- **Clarity-first, not tool-first** — Brief informs everything else (and is informed by everything else: single source of truth)
- **Calm, not noisy** — 7 categories, clean hierarchy, never more than you need on screen
- **Visible, not magical** — Every automation logged and explainable
- **Modular growth** — Add what you need, skip what you don't
- **Personalized recommendations** — Your tier looks different from everyone else's

---

## Target Users

| Persona | Who | Core Need |
|---------|-----|-----------|
| **Founder** | Idea-stage, scattered plans | Articulate the business, bridge vision → action |
| **Owner** | Expert at craft, not at systems | One calm view of what matters today |
| **Admin** | The "good with computers" person | Tools they can manage, clear audit trail |
| **Staff** | The eventual category owner | Tools they can manage, clear audit trail |

**Beachheads:** Service trades, small clinics, founders, workshops, restaurants, cafes, hotels, and more.

---

## North Star

**Weekly Active Revenue Events per Organization** — quotes sent + invoices issued + payments recorded.

If money is flowing through Xentri, users are getting real value.

---

## Key Risks

| Risk | Mitigation |
|------|------------|
| Co-pilot quality / hallucination | Outstanding context engineering. Graceful fallback to guided forms. Fine-tuning? |
| Low free → paid conversion | Brief completion triggers personalized upgrade prompts |
| Multi-tenant data leaks | RLS enforced, every query includes `org_id`, paranoid testing |

> **Note:** For co-pilot quality we MUST learn from how the BMAD method handles things, make it our own and improve upon it.

---

_This Product Brief captures the vision for Xentri. For detailed requirements, see [PRD](./prd.md). For technical architecture, see [Architecture](./architecture.md). For market + research, see [research/](./research/)._
