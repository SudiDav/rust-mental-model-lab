# String lifecycle diagram verification

Scope: integration of “The life of a String” with the Stack and Heap lesson and the isolated memory-lab preview. These checks were performed locally before publication.

## Artifact identity

- Source: `content/diagrams/life-of-a-string.lifecycle.json`
- Source SHA-256: `1085bae0e06d3775a46d712e8445d3e5cac79a215a92ca0721772497d8ac57f6`
- Delivered HTML: `public/diagrams/life-of-a-string.html` (707,647 bytes)
- HTML SHA-256: `d6fdba09fb818791591ce61038b0c216de19497830ecd66358cb293b251e3113`
- Archify revision: `d8e4daf2610d512821365f41b139d874b29efe81` (`2.17.0-dev.1`)
- Portable delivery evidence: `public/diagrams/life-of-a-string.receipt.json`

## Results

- Structural validation: 9/9 showcase checks; zero errors or warnings.
- Automated viewer containment/readability/chrome checks: passed at 1440×900, 1600×1000, 1920×1080, and 2048×1320. Light/dark endpoint captures passed.
- Visual inspection: reviewed final light/dark desktop captures and the embedded dark viewer. The ownership chapter focuses on Create, Move, and the unavailable caller binding. Other nodes deliberately dim during a focused chapter.
- Browser interactions: three chapter routes, story playback, lesson theme propagation, and closing/unloading the sandboxed iframe checked. Six explicit graph edges connect the seven states. SVG export from the full viewer downloaded successfully.
- Mobile wrapper: 390px viewport and document width both 390px; readable stacked summary and wrapping chapter buttons. The interactive canvas uses zoom/pan and internal scrolling; it is not a vertically reflowed diagram. A full-view link remains available.
- Progress isolation: unit tests check that opening, switching, and closing the viewer preserve saved lesson progress; the iframe lacks same-origin permission.
- Tests: 24 targeted Vitest tests and 6 generator-check tests passed.
- Content validation: all 10 published MDX lessons passed.
- Production build and `git diff --check`: passed. Existing warning: the lazy Three.js scene bundle exceeds Vite’s 500kB advisory threshold.

## Corrections and limits

The authoring pass removed redundant cards, clarified the caller/return lanes, added explicit primary transitions (the renderer’s visual rail is not a semantic edge), and changed one diagnosed route to avoid a tiny connector segment. Validation and delivery were rerun on the final source. Generated HTML was not hand-edited.

A focused code review identified repeated chapter selections not resetting an independently navigated iframe. A failing regression test reproduced the missing restart. Each outer chapter action now remounts the viewer, and these jump actions no longer display a potentially stale pressed state.

An early embedded screenshot caught a transient viewport repaint during resizing; a settled viewport capture and measured frame bounds confirmed the correct layout. Browser controls must be tested after the generated viewer initializes, not merely after its static toolbar appears.

This is a reviewed teaching diagram for the lab’s fixed Rust example, not a compiler or automatic proof of arbitrary Rust code. Hash checks detect changed files, not semantic correctness. Browser evidence is from Chromium; a complete cross-browser/accessibility audit is outside this pass. Generated diagnostic screenshots are retained locally outside public assets, not shipped with the site.
