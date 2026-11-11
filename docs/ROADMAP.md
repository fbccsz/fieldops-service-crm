# Roadmap — FieldOps

This project is a portfolio case study. Roadmap entries are **proposals**, not functionality available now.

## Phase 1 — Demonstration (implemented)

- [x] Responsive operations dashboard
- [x] Sales pipeline with drag-and-drop and stage controls
- [x] Linked customer directory, global search and detail drawers
- [x] Itemized estimate builder with tax calculation
- [x] Print / Save as PDF via browser print
- [x] Jobs, scheduling, status and checklists
- [x] Local state, JSON export and demo reset
- [x] Business-rule tests, render tests, CI and static build

## Phase 2 — Secure multi-user MVP

- [ ] Tenant-aware PostgreSQL schema with migrations and indexes
- [ ] Auth (passkeys/OAuth or password plus MFA), roles, session management
- [ ] Object and row-level authorization with negative security tests
- [ ] Activity/audit log and server-side idempotency keys
- [ ] Search, pagination and transactional updates via API
- [ ] Real job calendar and assignment workflows

## Phase 3 — Operational integrations

- [ ] Versioned estimates and legally reviewed approval signatures
- [ ] Encrypted file uploads, signed URLs, retention controls
- [ ] Email/calendar notifications with user consent and opt-out
- [ ] Accounting/billing integrations and reconciliation
- [ ] Multi-tenant observability, backups, restore drills
- [ ] Full WCAG 2.2 AA evaluation and cross-browser regression suite

## Market validation

A small-business operator could test: number of overlooked follow-ups, time to create an estimate, days from proposal to approval and job completion lead time. The demo **does not** claim measured improvements or real customer adoption.
