# Rust Mental Model Lab Design Specification

**Date:** 2026-08-23  
**Project path:** `/Users/sudi/Documents/sudi/projects/rust-mental-model-lab`  
**GitHub owner:** `sudidav`  
**Planned repository:** `rust-mental-model-lab`

## Goal

Build a static, GitHub Pages-compatible interactive learning laboratory that teaches Rust by helping learners mentally simulate computer memory, program execution, ownership, borrowing, lifetimes, and concurrency.

The first implementation milestone is a production-quality foundation: a learning map, MDX-driven lesson content, a reusable simulation engine, local progress persistence, and polished interactive lessons for Worlds 0–3. The architecture must make Worlds 4–17 additive rather than requiring a rewrite.

## Product principles

- Teach the problem before the Rust rule.
- Let learners see, predict, manipulate, and experiment before asking them to memorize.
- Keep the mental model, Rust language model, and machine model visibly distinct.
- Treat simulations as educational models with explicit simplifications.
- Keep learning content in MDX and behavior in reusable TypeScript components.
- Prefer a small number of accurate, polished interactions over decorative animation.
- Make the first screen useful without a backend or account.
- Preserve the curriculum dependency graph in a form that can drive locking and progression.

## Approved initial scope

### In scope

- React, TypeScript, Vite, Tailwind CSS, and MDX.
- Static build suitable for GitHub Pages.
- Repository metadata and deployment configuration for `sudidav`.
- Learning map covering Worlds 0–17.
- Published starter lessons for Worlds 0–3:
  - binary representation
  - CPU and memory hierarchy
  - conceptual process memory
  - stack and heap
- Reusable simulation state model with step, reset, inspect, and selection behavior.
- Local progress storage for lesson status and quiz results.
- Responsive dark developer-workstation visual language.
- Automated validation for lesson metadata, IDs, prerequisites, and content loading.
- Targeted unit/component tests and a production build check.

### Deferred but architecturally supported

- Ownership, borrowing, mutable borrowing, lifetimes, smart pointers, concurrency, async Rust, and unsafe Rust simulations.
- Compiler execution integration.
- User accounts, a backend, cloud synchronization, and multiplayer.
- Full Rust compilation in the browser.
- Advanced canvas/WebGL visualizations.

### Out of scope for the first milestone

- Pretending all seventeen worlds are fully implemented.
- A complete Rust reference manual.
- A server-rendered application.
- Remote progress storage.
- External analytics or tracking.

## Information architecture

The application has four primary areas:

1. **Home / learning map** — explains the mental-simulator approach and shows world dependencies.
2. **World overview** — lists lessons, prerequisite state, completion state, and estimated time.
3. **Lesson workspace** — presents MDX content, a simulation panel, code/mental-model views, prediction prompts, and mastery actions.
4. **Progress summary** — shows completed lessons, quiz performance, and concepts marked for review.

The shell should work on desktop as a debugger-like workstation and remain usable on narrow screens by stacking panels vertically.

## Curriculum registry

The registry is the typed source for world order and lesson navigation. It must support:

- world ID, title, description, order, and status;
- lesson ID, title, slug, world ID, order, difficulty, estimated minutes;
- prerequisite lesson IDs;
- published versus planned status;
- simulation type and scenario ID;
- objective and concept labels.

Worlds 0–3 receive published lesson records. Worlds 4–17 receive planned records with explanatory locked states so the learning map communicates the intended path without claiming unfinished content is complete.

## MDX content architecture

The content source of truth is `content/`. Lessons use frontmatter matching the registry and render through a controlled MDX component map.

Required component boundaries:

- `Concept` — concise definition.
- `MentalModel` — simplified visual explanation.
- `Simulation` — selects a registered simulation type/scenario.
- `Predict` — prediction question and answer feedback.
- `Reveal` — progressive disclosure.
- `UnderTheHood` — deeper technical explanation.
- `Challenge` — an exercise identified by stable ID.
- `MasteryCheck` — completion action and reflection.

MDX must orchestrate content; it must not contain large simulation implementations.

Recommended content organization:

```text
content/
  foundations/
  memory/
  ownership/
  borrowing/
  lifetimes/
  smart-pointers/
  concurrency/
  async/
  unsafe/
```

The build must reject:

- duplicate lesson IDs;
- malformed frontmatter;
- prerequisite IDs that do not exist;
- simulation types/scenarios that are not registered;
- missing content files for published lessons.

## Simulation architecture

The simulation engine is a deterministic state machine independent of React rendering.

A simulation exposes:

- initial state;
- ordered execution events;
- current event index;
- next/previous/reset transitions;
- inspectable entities;
- selected entity ID;
- narrative explanation;
- explicit conceptual simplifications.

The first simulations are:

- `binary-playground`;
- `memory-hierarchy`;
- `process-memory`;
- `stack-heap`.

Each simulation must have a pure transition layer that can be unit-tested without a browser. React components render the state and dispatch commands.

## Progress model

Progress is local-only in the first milestone.

Stored data includes:

- schema version;
- lesson status: `not-started`, `learning`, or `completed`;
- quiz score;
- completed challenge IDs;
- concepts marked for review;
- last visited timestamp.

Storage must be resilient to malformed or outdated data by falling back to defaults and migrating known older versions.

## Visual design

Use a dark, high-contrast developer-workstation interface:

- near-black canvas;
- warm amber for active learning and execution;
- cyan/blue for memory structures and data paths;
- green for valid states;
- red for invalid or blocked states;
- restrained motion tied to state transitions;
- clear typography hierarchy and generous panel spacing.

The interface should favor visible relationships: arrows, frames, addresses, selected entities, and event timelines. Decorative motion must not compete with explanatory text or controls.

## GitHub Pages

Configure the Vite base path for the repository name:

```text
/rust-mental-model-lab/
```

The repository must include a GitHub Actions workflow that:

1. installs dependencies;
2. runs metadata/content validation;
3. runs targeted tests;
4. builds the static site;
5. deploys the build artifact to GitHub Pages.

The workflow must not require secrets for the static application. The README must document local development, production build, and Pages setup for the `sudidav` account.

## Testing strategy

Use test-first development for behavior-bearing code.

Required checks:

- pure simulation transitions;
- curriculum prerequisite and status logic;
- progress storage serialization and migration;
- MDX metadata validation;
- rendering of a lesson with its simulation component;
- production build.

Run the smallest relevant test command while implementing each unit, then run the complete project checks before handoff.

## Acceptance criteria for the first milestone

- The project runs locally with documented commands.
- The home screen explains the learning method and links to the learning map.
- The map shows Worlds 0–17, with Worlds 0–3 available and later worlds clearly marked planned/locked.
- At least one lesson in each of Worlds 0–3 loads from MDX.
- Each published lesson renders a working simulation with reset, step, and inspect interactions.
- A learner can answer a prediction question and see immediate feedback.
- Completion and review state persist across reloads in the same browser.
- Invalid lesson metadata fails validation with an actionable message.
- The production build succeeds with the correct GitHub Pages base path.
- No backend is required.

## Delivery sequence

1. Repository and tooling foundation.
2. Curriculum registry and MDX validation.
3. Application shell and learning map.
4. Progress store and lesson workspace.
5. Pure simulation engine and World 0–1 simulations.
6. World 2–3 simulations.
7. Responsive polish, accessibility pass, documentation, and deployment workflow.
8. Verification and handoff.

## Decisions

- New standalone project instead of modifying an unrelated project in `/Users/sudi/Documents/sudi/projects`.
- Repository and folder name: `rust-mental-model-lab`.
- GitHub owner: `sudidav`.
- Static-first architecture.
- MDX is the learning-content source of truth.
- Worlds 0–3 are the first implementation boundary; later worlds are represented in the registry and built incrementally.

