# Blue advisor visual polish

## Objective
Improve the existing health-plan advisor landing page with a distinctive blue-led visual presentation and clear responsive hierarchy.

## Problem and scope
The current page is complete but repeats similar card layouts and uses a generic monogram composition. Refine the hero and section rhythm without changing the privacy-safe demonstration journey.

## Constraints
- Preserve primary #1E5A9C, existing Spanish UI, anchors, form IDs and behavior.
- Use only principal ui-ux-pro-max guidance pinned to 56ea9cf174ed86786187daa9de0e6247cb0747e4. No installation, companion skills, scripts, MuAPI or credentials; general defaults only, not database matches.
- No fabricated portrait, affiliation, endorsement, credentials, pricing or contact details. Keep demonstration notices readable.
- No dependencies, backend, push, PR or publication. Preserve existing .atl changes and completed prior tracker.
- Allowed source surfaces: index.html and tests/landing.spec.cjs. Tracking: this document.

## Tasks
- [x] T1: Refine advisor hero composition, editorial section hierarchy, responsive spacing and local typography; retain all existing behavior and add focused layout regression checks.
  - Route: delegated direct; reading prepares source edits and browser execution requires a bounded worker.
  - Acceptance: clearly improved hero and section rhythm; original blue remains dominant; mobile content does not clip; keyboard focus and demo disclosures remain usable.
  - Test-first: add meaningful deterministic layout checks, observe RED, implement GREEN, then run full regression suite.
  - Verification: node tests/landing.spec.cjs; git diff --check; screenshot inspection at 375 and 1440px; existing 320/375/768/1440px, keyboard, reduced-motion, no-JS and privacy checks.
  - Rollback: this work unit's changes to index.html, tests/landing.spec.cjs and this document only.
  - Commit: pending.

## Delivery and review
Forecast: approximately 250–350 authored changed lines including tests and tracking. Strategy: ask-on-risk; preserve previously selected feature-branch-chain if slices become necessary. One coherent visual work unit on a local feature branch. RDD on (global); native reviewed boundary remains 0b1cb2a, with previous consultation slice pending under budget. Assess the combined pending range after the commit; do not claim approval without terminal native evidence. Candidate consent remains user-owned.

## Progress
T1 implementation and functional checks complete; parent repeated the full suite successfully and inspected mobile/desktop screenshots. Commit and native assessment remain pending.
- Replaced the rotated monogram/orbits with an upright, numbered decision guide: zone, family and priorities. Kept the explicit demonstration/quotation distinction.
- Added local serif accents to the hero and guide numbering; system fonts remain the body stack with no remote fonts or new requests.
- Broke the repeated card rhythm into white comparison cards, a split advisor narrative with divider-led principles, a pale-blue numbered process and a split FAQ layout. Mobile stacks retain logical reading order.
- Applied the pinned principal skill's general priority defaults (readability, responsive layout, semantic colors, visible disclosures, keyboard/reduced-motion preservation). No database match, additional references, scripts or installation used.
- Observed RED: `node tests/landing.spec.cjs` failed on the existing rotated guide transform (`matrix(...)` versus `none`) before source changes.
- Observed GREEN: `node tests/landing.spec.cjs` exited 0 after final source normalization; 320/375/768/1440px layout, anchors, navigation, FAQ, local demo form, privacy, browser console, reduced motion, normal-motion keyboard and no-JavaScript checks passed.
- New regressions check upright guide/no decorative monogram or orbit, all three guide criteria fitting the viewport, desktop side-by-side narrative/FAQ, and mobile heading-before-content order.
- `git diff --check`: passed. Screenshots `/tmp/karina-polish-375.png` and `/tmp/karina-polish-1440.png` inspected; no clipping or overlap observed. They show the tested open FAQ and completed local guide states.
- Authored source/test diff: 163 lines (129 additions, 34 deletions), plus this 42-line new tracker: 205 authored lines total; the smaller coherent implementation meets the full design scope. Existing `.atl` modifications remain untouched.
- No stage, commit, native review, push, PR or publication performed. Engram mirror is updated and read back by the parent before delivery.

## Next step
Commit the coherent work unit and assess the combined pending native-review range. Parent spot-check: node tests/landing.spec.cjs and git diff --check passed; 375/1440px screenshots inspected. Do not mark native review approved without terminal evidence.
