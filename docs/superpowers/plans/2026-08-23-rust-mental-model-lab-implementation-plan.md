# Rust Mental Model Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production milestone of Rust Mental Model Lab as a static React/TypeScript/MDX learning laboratory for Worlds 0–3, with a reusable simulation engine and an extensible registry for Worlds 4–17.

**Architecture:** Use a Vite React single-page application with hash-based navigation for GitHub Pages. MDX files are the lesson source of truth; a typed content loader validates frontmatter and maps each lesson to reusable educational components and deterministic simulation models. LocalStorage stores progress, while the simulation engine remains pure and testable outside React.

**Tech Stack:** React, TypeScript, Vite, MDX via `@mdx-js/rollup`, Tailwind CSS, Vitest, Testing Library, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-23-rust-mental-model-lab-design.md`

## Global Constraints

- Project root: `/Users/sudi/Documents/sudi/projects/rust-mental-model-lab`.
- GitHub owner: `sudidav`.
- Repository name and Pages base path: `rust-mental-model-lab` and `/rust-mental-model-lab/`.
- Content is authored in MDX; large simulation implementations stay in TypeScript/React.
- Worlds 0–3 are published in this milestone; Worlds 4–17 are planned/locked.
- No backend, secrets, account system, remote analytics, or browser Rust compiler.
- Use hash routing so direct lesson links work on GitHub Pages without server rewrites.
- Use tests first for behavior-bearing code, then run targeted tests before broader verification.
- Do not add AI/tool attribution to commits, branches, documentation, or release metadata.

---

### Task 1: Scaffold repository and build tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Create: `vite.config.ts`, `index.html`, `src/vite-env.d.ts`
- Create: `.gitignore`, `postcss.config.js`, `tailwind.config.js`, `src/index.css`
- Create: `scripts/validate-project.mjs`

**Interfaces:**
- npm scripts: `dev`, `build`, `preview`, `test`, `test:run`, `validate:content`, `check`.
- Vite base: `/rust-mental-model-lab/`.
- MDX exports frontmatter and uses `@mdx-js/react`.

- [ ] Write `scripts/validate-project.mjs` to assert the required scripts and Pages base path.
- [ ] Run `node scripts/validate-project.mjs`; confirm it fails because the project files are absent.
- [ ] Add the package manifest, Vite/React/MDX configuration, Tailwind configuration, TypeScript settings, and minimal entry point.
- [ ] Run `npm install && node scripts/validate-project.mjs`; confirm it passes.
- [ ] Run `npm run test:run && npm run build`; confirm both exit 0.
- [ ] Commit with `chore: scaffold learning lab`.

### Task 2: Build curriculum registry and MDX validation

**Files:**
- Create: `src/content/types.ts`, `src/content/worlds.ts`, `src/content/lessons.ts`, `src/content/loader.ts`
- Create: `scripts/validate-content.mjs` and `src/content/loader.test.ts`
- Create MDX lessons in `content/foundations` for bits, CPU/memory, program memory, and stack/heap.
- Create planned MDX records for ownership, borrowing, lifetimes, smart pointers, concurrency, async, and unsafe Rust.

**Interfaces:**
- `WorldRecord`: id, title, description, order, status.
- `LessonRecord`: id, slug, title, world, order, difficulty, estimatedMinutes, prerequisites, objectives, concepts, simulation, status.
- `loadLessons()` returns published and planned lessons with MDX components for published records.
- `validateContent(rootDir)` reports duplicate IDs, malformed frontmatter, missing prerequisites, missing published files, and unregistered simulations.

- [ ] Write tests for world ordering, lesson ordering, unknown prerequisites, duplicate IDs, and planned-lock metadata.
- [ ] Run `npm run test:run -- src/content/loader.test.ts`; confirm it fails for missing modules.
- [ ] Implement typed frontmatter parsing and the browser MDX glob loader.
- [ ] Add four complete published MDX lessons and planned records for Worlds 4–17.
- [ ] Run `npm run test:run -- src/content/loader.test.ts && npm run validate:content`; confirm it passes.
- [ ] Commit with `feat: add curriculum registry and MDX lessons`.

### Task 3: Implement deterministic simulation engine

**Files:**
- Create: `src/engine/types.ts`, `src/engine/simulation.ts`, `src/engine/simulation.test.ts`
- Create: `src/simulations/registry.ts`, `src/simulations/binary.ts`, `src/simulations/memory-hierarchy.ts`
- Create: `src/simulations/process-memory.ts`, `src/simulations/stack-heap.ts`, `src/simulations/simulations.test.ts`

**Interfaces:**
- `SimulationModel<State, Event>` exposes `initialState`, `events`, `reduce`, `describe`, and `inspect`.
- `SimulationController<State, Event>` exposes `state`, `stepForward()`, `stepBackward()`, `reset()`, and `select(entityId)`.
- `getSimulation(type, scenario)` returns a registered model or an actionable error.

- [ ] Write failing pure tests for bit toggling, hierarchy selection, process segment inspection, stack/heap event order, stepping, and reset.
- [ ] Run `npm run test:run -- src/engine/simulation.test.ts src/simulations/simulations.test.ts`; confirm failure is caused by missing behavior.
- [ ] Implement pure deterministic models with conceptual addresses and explicit simplification text.
- [ ] Run the same targeted tests; confirm they pass.
- [ ] Extract shared stepping and selection behavior into the engine without changing public interfaces.
- [ ] Commit with `feat: add deterministic memory simulations`.

### Task 4: Add progress persistence and prerequisite rules

**Files:**
- Create: `src/learning/progress.ts`, `src/learning/progress.test.ts`
- Create: `src/learning/prerequisites.ts`, `src/learning/prerequisites.test.ts`
- Create: `src/learning/LearningProvider.tsx`

**Interfaces:**
- `ProgressState` contains schemaVersion, lessons, and lastUpdated.
- `loadProgress(storage)`, `saveProgress(storage, state)`, and `migrateProgress(input)` are defensive and versioned.
- `isLessonUnlocked(lesson, progress, lessons)` returns unlock state and explanation.
- Provider actions: mark learning, complete lesson, record quiz score, toggle review concept, reset progress.

- [ ] Write tests for empty storage, malformed JSON, migration, completion persistence, prerequisite locking, and review toggling.
- [ ] Run `npm run test:run -- src/learning/progress.test.ts src/learning/prerequisites.test.ts`; confirm failure.
- [ ] Implement storage key `rust-lab-progress`, schema version 1, migrations, and provider actions.
- [ ] Run targeted tests; confirm pass.
- [ ] Commit with `feat: persist learning progress locally`.

### Task 5: Build application shell and MDX lesson workspace

**Files:**
- Create: `src/main.tsx`, `src/App.tsx`, `src/app/routes.ts`
- Create: `src/components/AppShell.tsx`, `TopBar.tsx`, `WorldMap.tsx`, `WorldCard.tsx`
- Create: `LessonWorkspace.tsx`, `ProgressSummary.tsx`, `LockedLesson.tsx`
- Create: `src/components/mdx/EducationalComponents.tsx` and `MDXProvider.tsx`
- Create: `CodeBlock.tsx`, `PredictionCard.tsx`, `SimulationPanel.tsx`, `src/App.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- `WorldMap` receives worlds, lessons, progress, and `onOpenLesson(id)`.
- `LessonWorkspace` receives a lesson record, MDX component, progress actions, and simulation registry.
- MDX components receive serializable lesson props and workspace callbacks.

- [ ] Write tests for the home title, locked planned worlds, and a lesson route containing MDX plus a simulation panel.
- [ ] Run `npm run test:run -- src/App.test.tsx`; confirm failure.
- [ ] Implement hash routes `#/`, `#/world/:id`, and `#/lesson/:id`.
- [ ] Implement Concept, MentalModel, Simulation, Predict, Reveal, UnderTheHood, Challenge, and MasteryCheck.
- [ ] Add responsive dark workstation styling, focus states, and explanatory locked states.
- [ ] Run targeted shell tests; confirm pass.
- [ ] Commit with `feat: add learning workspace and curriculum map`.

### Task 6: Add World 0–3 interactive panels

**Files:**
- Create: `src/components/simulations/BinaryPlayground.tsx`
- Create: `MemoryHierarchy.tsx`, `ProcessMemory.tsx`, `StackHeapExplorer.tsx`
- Create: `src/components/simulations/simulation-components.test.tsx`
- Modify: `src/components/SimulationPanel.tsx`

**Interfaces:**
- Each panel accepts `scenario`, `onComplete`, and `onInspect`.
- Panels expose accessible reset, previous, next, and inspect controls.
- `SimulationPanel` maps registered simulation types/scenarios to components and reports unknown scenarios visibly.

- [ ] Write tests for keyboard-accessible bit toggles, hierarchy selection, process segment selection, stack/heap stepping, and reset.
- [ ] Run targeted component tests; confirm failure.
- [ ] Implement the four panels from the pure models, tying animation to state transitions.
- [ ] Include “what this represents” and “what this simplifies” copy in each panel.
- [ ] Run `npm run test:run -- src/components/simulations/simulation-components.test.tsx`; confirm pass.
- [ ] Commit with `feat: add Worlds 0 through 3 simulations`.

### Task 7: Add Pages deployment, documentation, and accessibility

**Files:**
- Create: `README.md`, `.github/workflows/deploy-pages.yml`, `public/404.html`
- Create: `src/components/SkipLink.tsx`, `StatusBadge.tsx`, `src/a11y/accessibility.test.tsx`
- Modify: `index.html`, `src/index.css`

**Interfaces:**
- Workflow runs validation, tests, build, artifact upload, and Pages deployment on pushes to `main`.
- README documents local commands and `sudidav/rust-mental-model-lab` Pages setup.
- Skip link and focus styles support keyboard navigation.

- [ ] Write tests for workflow permissions, artifact upload, validation/build commands, and repository URL documentation.
- [ ] Run those tests; confirm failure before files exist.
- [ ] Add official Pages actions, npm caching, `npm ci`, `npm run check`, artifact upload, and deployment.
- [ ] Add README with `npm install`, `npm run dev`, `npm run check`, and `npm run build`.
- [ ] Run deployment/configuration and accessibility tests; confirm pass.
- [ ] Commit with `chore: add Pages deployment and accessibility polish`.

### Task 8: Complete verification and handoff

**Files:**
- Modify: `README.md` only for verified command or URL mismatches.
- Modify: design spec only if implementation materially differs from the approved design.

- [ ] Run `npm run validate:content` and confirm all published MDX and planned records validate.
- [ ] Run `npm run test:run` and confirm zero failed tests.
- [ ] Run `npm run build` and confirm `dist/` is produced with the correct base path.
- [ ] Run `git status --short --branch && git log --oneline -8` and inspect intentional changes and neutral commit messages.
- [ ] Make a final documentation commit only if verification finds a documented mismatch.
- [ ] Report the verified local commands and Pages target `https://sudidav.github.io/rust-mental-model-lab/`.

