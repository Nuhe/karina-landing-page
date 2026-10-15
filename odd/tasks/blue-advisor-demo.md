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
- [x] T1: Implement blue-led advisor presentation and honest demo consultation with regression checks.
  - Route: delegated direct; unfamiliar HTML reading prepares edits, browser execution and new logic require bounded workers.
  - Acceptance: no matrícula variants or unresolved placeholders; dominant existing blue; useful overview, comparison guidance, FAQ and clear CTA; no personal data transmitted/stored; no fake submission confirmation.
  - Checks: node tests/landing.spec.cjs; git diff --check; independent browser verification at mobile/tablet/desktop, keyboard navigation, reduced motion and JavaScript-disabled content.
  - Test-first: deterministic regression assertions must fail on the original HTML, then pass after implementation. No existing test runner; use available Playwright and Chromium without installing dependencies.
  - Rollback boundary: index.html and tests/landing.spec.cjs.
  - Verification: observed RED on original HTML then GREEN. Independent browser verification identified 320px contact-grid overflow; regression observed RED then GREEN after zero-minimum tracks and shrinkable controls. node tests/landing.spec.cjs and git diff --check pass, including 320/375/768/1440px, navigation, FAQ, demo privacy, reduced motion and JS-disabled content.
  - Closure: implementation and checks complete after scoped FAQ test timing correction; A `93f01da`, B `0b1cb2a`; parent C commit/assessment pending.

## Delivery and review
Strategy: ask-on-risk; user selected feature-branch-chain (option 2). Local tracker feat/blue-advisor-demo targets master; children target their immediate parent. No remote PR creation, push or publication authorized.
One cohesive slicing pass: presentation (blue hero, navigation, responsive foundations, scoped tests; estimated 366 lines), guidance (comparison, advisor process, FAQ, footer and scoped tests; estimated 312 lines), consultation (local privacy-safe form, official destinations and final tests; estimated 250 lines). Tracking updates also count. Preserve exact final source/test bytes. If a cohesive slice exceeds 400, report it and recommend size:exception rather than repacking.
Order: feat/blue-advisor-demo -> feat/blue-advisor-demo-presentation -> feat/blue-advisor-demo-guidance -> feat/blue-advisor-demo-consultation. Future tracker PR must remain draft/no-merge; no PRs exist yet. Each slice runs node tests/landing.spec.cjs and git diff --check. Intermediate slices are integration work, not publishable demonstrations.
RDD: on (global). Reviewed boundary: B `0b1cb2a`. A medium/372 lines was `under_budget`; A+B medium/693 lines approved in `review-c35876cb2bd3acba`, exact acknowledgement succeeded and authority burned. Do not reopen this transaction; assess C against B.

## Progress
Final HTML restored byte-for-byte; final tests include the authorized asynchronous FAQ assertion correction. Principal skill general defaults applied without scripts or installation. Writer and independent browser verification performed; 320px contact-grid regression corrected with observed RED/GREEN. Final authored source+test net change remains 930 lines (HTML +212/-607, tests +111); chain slices include additional scoped test/tracking changes. Existing .atl/ preserved; no publication. Tracker `6a8e4e5`, A `93f01da` (372 lines), B `0b1cb2a` (321 lines); C prepared locally and uncommitted. Initial C run passed, repeat exposed FAQ assertion race, and one post-correction full run passed; no retry-until-green or skipped checks.

## Next step
Parent spot-checks/commits C and assesses only C against reviewed B; do not reopen burned A+B authority. Full delivery closure remains pending that C commit/assessment. Nonblocking R3-001 follow-up: tests depend on machine-specific Playwright fallback and Chromium path; make browser dependencies portable in a separately authorized change, without further expanding this scoped timing correction.

## Slice A preparation
Preserved original source blob: `778c21f5288975660d0cedd32b28ae7eb9288714`; exact final source blob: `7a58afabae1aeda42eaad03233506f4032f0b44e`; exact final tests blob: `6c0e7fbd777e948a53433b70d61d7aef55e98ac2`. Restore final bytes with `git cat-file blob <hash>` only when preparing the final slice.
Slice A: `feat/blue-advisor-demo-presentation` from tracker `6a8e4e5`; source +104/-196, scoped tests +67, tracking +5/-0: 372 authored lines. RED: `node tests/landing.spec.cjs` on original source failed hero palette (transparent vs blue); GREEN: same command passes 320/375/768/1440px hero/nav bounds, palette, anchors, keyboard/reduced-motion and console. `git diff --check` passes. Final source/tests remain recoverable from blobs above.
Scope limitation: inherited original plan cards still overflow at 320px (document 804px, hero 320px); global/form/FAQ/privacy assertions deferred to responsible B/C slices. A is integration-only, not publishable; full T1 remains unchecked. Scoped screenshots use `/tmp/karina-blue-presentation-*.png`; first run overwrote earlier `/tmp/karina-blue-*.png` with intermediate A. No commit, staging or review performed.

## Slice B preparation
Slice A committed as `93f01da`; native assessment medium, 372 lines, `under_budget`. Reviewed base stays tracker `6a8e4e5`, with A pending in the medium slice. Slice B branch: `feat/blue-advisor-demo-guidance` from A. Source +47/-237, tests +30/-3, tracking +4/-0: 321 authored changed lines.
B RED: `node tests/landing.spec.cjs` on A failed missing comparison heading. GREEN: same command passes comparison/FAQ content, absent invented testimonials, scoped section bounds, navigation and FAQ at 320/375/768/1440px, normal-motion keyboard and JS-disabled information. `git diff --check` passes. Original contact remains unconverted/integration-only; full form/privacy/global assertions wait for C. Preserved final blobs unchanged; T1 pending; no B staging, commit or native review.

## Slice C preparation
Branch `feat/blue-advisor-demo-consultation` from B. Restored exact HTML `7a58afabae1aeda42eaad03233506f4032f0b44e` and original final tests `6c0e7fbd777e948a53433b70d61d7aef55e98ac2` (preserved). Authorized test timing correction supersedes test-byte identity: new stored blob `87e11c643f3a41d4e72bab9fd8fb1418567d0a01`; HTML hash unchanged. C source +58/-171, tests +28/-7, tracking +9/-5: 278 authored changed lines.
C RED: final `node tests/landing.spec.cjs` against B failed unresolved placeholder/contact assertions. Initial GREEN after exact HTML restoration: same command passed 320/375/768/1440px global/form bounds, blue palette, anchors, navigation, FAQ, invalid/valid demo form, no network/storage/cookies/personal fields, reduced motion, normal-motion keyboard and JS-disabled content/safe form. `git diff --check` passes. Final repeat failed at 375px FAQ (line 63, 2 open vs 1); read-only three-attempt diagnostic observed immediate 2 then settled 1 each time. Inference: assertion races the toggle handler. Parent authorized only a bounded `waitForFunction` before the unchanged count assertion: second item must be open and exactly one item open (1s timeout), matching the `toggle` handler at HTML lines 797–803. Existing failure supplies RED; one post-correction `node tests/landing.spec.cjs` run passed all checks, followed by passing `git diff --check`. No product code change, arbitrary sleep or retry. Final screenshots: `/tmp/karina-blue-{320,375,1440}.png`. No staging, commit, native review, installation or remote operation performed by C worker.
