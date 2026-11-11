# Architecture & engineering notes

## Scope

FieldOps demonstrates an end-to-end service-business workflow within a static web application. It is deliberately limited to a **single local demo workspace**. It is not a real multi-user CRM, and the sample identity "Alex Rivera" is fictional.

## Modules

| Module | Responsibility |
| --- | --- |
| `src/domain.js` | Pure functions: escaped output, input validation, money calculations, domain factories, stage allowlists and analytics. |
| `src/data.js` | Coherent fictional customers, deals, estimates and jobs. Dates are generated relative to the current date. |
| `src/store.js` | State subscription, safe localStorage fallback, transactional updates and reset/export. |
| `src/app.js` | HTML templates, event delegation, cross-entity navigation, modals, drawers, filtering and keyboard controls. |
| `src/icons.js` | Dependency-free SVG path collection with consistent stroke semantics. |
| `styles/main.css` | Design tokens, responsive layout, print-specific quote formatting and reduced-motion support. |

## Business model

```text
Customer (1) ----> (many) Opportunities
Customer (1) ----> (many) Estimates
Customer (1) ----> (many) Jobs
Estimate (1) ----> (many) Line items
Job (1) ----> (many) Checklist items
```

Deals: `new → qualified → proposal → won`. Quotes: `draft → sent → accepted/declined`. Jobs: `scheduled → in progress → completed`.

The stages are currently editable independently. In a production system, consistency rules and audit events would also synchronize relevant transitions, e.g. an accepted quote could trigger a job creation suggestion but should not automatically schedule work without availability checks.

## Data storage

`localStorage` key: `fieldops.demo.v1`. `store.js` validates the expected top-level version and collection shapes before use, then loads fixture data when storage is empty or unavailable. The export action downloads a JSON backup but **does not implement arbitrary JSON import**, avoiding unvalidated uploads in the demo.

No real personal data should be entered. The fixtures use `example.com` email addresses and reserved/example telephone formats.

## Security

- HTML escaping for text inserted into templates using `escapeHTML()`.
- Exact allowlists for stage transitions.
- Restricted local static server path resolution and content-type mapping.
- Secure static response headers configured for Netlify.
- No third-party analytics, fonts, payment SDKs or external network requests.
- No secrets, `.env` files or tokens required.

**Limitation:** localStorage is not a security boundary; all records are browser-visible. No login, access control, encryption, RLS or server audit trail exists. A real SaaS would need those before processing live customer information.

## Testing

- Unit tests for quote math, validation, HTML escaping, stage allowlists, seed integrity, job creation.
- Render smoke tests for the dashboard, all navigation destinations and modal creation with a lightweight fake DOM.
- CI on PR and main runs `npm ci` followed by `npm run check`.

Future work: browser E2E tests, keyboard focus traps for drawers and modals, full accessibility audit, storage failure testing and drag/drop touch alternatives beyond the current detail-drawer select.
