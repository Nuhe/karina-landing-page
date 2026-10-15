# Blue advisor demo

## Objective
Present Karina as a demonstration health-plan advisor and make the consultation journey clear, accessible and conversion-oriented.

## Problem and scope
The existing blue palette is visually understated; credentials, prices, endorsements and contact destinations contain placeholders. Use the established #1E5A9C as the dominant visual color, remove credential references, explain comparison criteria, and provide an honest local-only demonstration of consultation capture. Preserve Spanish UI and the static HTML architecture.

## Constraints
- Only principal ui-ux-pro-max guidance at commit 56ea9cf174ed86786187daa9de0e6247cb0747e4; no installer, companion skills, MuAPI or credentials. Use its general priority defaults, not claimed database matches.
- No invented affiliation, credentials, testimonials, pricing or contact details. SanCor Salud is a reference, not a represented partnership.
- Public official sources: https://sancorsalud.com.ar/planes and https://sancorsalud.com.ar/cotiza-tu-plan/ . Benefits and availability require plan-specific confirmation.
- No remote publishing. Preserve pre-existing untracked .atl/.
- Allowed source surfaces: index.html, tests/landing.spec.cjs. Tracking: this document.

## Work unit
- [ ] T1: Implement blue-led advisor presentation and honest demo consultation with regression checks.
  - Route: delegated direct; unfamiliar HTML reading prepares edits, browser execution and new logic require bounded workers.
  - Acceptance: no matrícula variants or unresolved placeholders; dominant existing blue; useful overview, comparison guidance, FAQ and clear CTA; no personal data transmitted/stored; no fake submission confirmation.
  - Checks: node tests/landing.spec.cjs; git diff --check; independent browser verification at mobile/tablet/desktop, keyboard navigation, reduced motion and JavaScript-disabled content.
  - Test-first: deterministic regression assertions must fail on the original HTML, then pass after implementation. No existing test runner; use available Playwright and Chromium without installing dependencies.
  - Rollback boundary: index.html and tests/landing.spec.cjs.
  - Verification: observed RED on original HTML then GREEN. Independent browser verification identified 320px contact-grid overflow; regression observed RED then GREEN after zero-minimum tracks and shrinkable controls. node tests/landing.spec.cjs and git diff --check pass, including 320/375/768/1440px, navigation, FAQ, demo privacy, reduced motion and JS-disabled content.
  - Commit: pending delivery-strategy decision and native review.

## Delivery and review
Strategy: ask-on-risk; user selected feature-branch-chain (option 2). Local tracker feat/blue-advisor-demo targets master; children target their immediate parent. No remote PR creation, push or publication authorized.
One cohesive slicing pass: presentation (blue hero, navigation, responsive foundations, scoped tests; estimated 366 lines), guidance (comparison, advisor process, FAQ, footer and scoped tests; estimated 312 lines), consultation (local privacy-safe form, official destinations and final tests; estimated 250 lines). Tracking updates also count. Preserve exact final source/test bytes. If a cohesive slice exceeds 400, report it and recommend size:exception rather than repacking.
Order: feat/blue-advisor-demo -> feat/blue-advisor-demo-presentation -> feat/blue-advisor-demo-guidance -> feat/blue-advisor-demo-consultation. Future tracker PR must remain draft/no-merge; no PRs exist yet. Each slice runs node tests/landing.spec.cjs and git diff --check. Intermediate slices are integration work, not publishable demonstrations.
RDD: on (global). Base boundary: 9a4dd4d. Native risk assessment and candidate consent apply; no fabricated approval.

## Progress
Implementation complete locally. Principal skill general defaults applied without scripts or installation. Writer and independent browser verification performed; 320px defect corrected with RED/GREEN regression. Actual authored source+test changes: 930 additions+deletions (index.html +212/-607, tests +111), not compressed to fit budget. Screenshots: /tmp/karina-blue-320.png, /tmp/karina-blue-375.png, /tmp/karina-blue-1440.png. No publication or commit. Existing .atl/ preserved. Initial native risk assessment is high/unassessable because untracked files require explicit inventory selection; no review transaction started.

## Next step
Prepare the three local slices with tests alongside behavior, measure actual boundaries and record commits. Resolve native inventory, candidate consent and review using exact provider transitions. T1 remains unchecked until all slice commits and applicable review outcomes are recorded.
