# Rust Mental Model Lab

Rust Mental Model Lab is an interactive learning laboratory for building a working mental simulator of computer memory, program execution, ownership, borrowing, lifetimes, and concurrency.

The first milestone includes:

- an MDX-driven lesson workspace;
- a curriculum map for Worlds 0–17;
- a human orientation lesson followed by first-principles lessons through World 8;
- interactive models for Worlds 0–3, with text-first MDX lessons carrying the path forward while later visualizers are built;
- deterministic simulations for bits, memory hierarchy, process memory, and stack/heap;
- a Three.js stack-and-heap lab with an execution timeline, inspectable memory boxes, and two prediction checkpoints;
- local browser progress through `localStorage`;
- a static GitHub Pages deployment workflow.

## Local development

```bash
npm install
npm run dev
```

Run the project checks before sharing a change:

```bash
npm run check
```

Create a production build locally:

```bash
npm run build
npm run preview
```

## GitHub Pages

The intended repository is [sudidav/rust-mental-model-lab](https://github.com/sudidav/rust-mental-model-lab). The Vite base path is configured for the repository name, and the workflow deploys on pushes to `main`.

After creating the repository, enable GitHub Pages with **GitHub Actions** as the source. The published site target is:

https://sudidav.github.io/rust-mental-model-lab/

## Content architecture

Lesson content lives in `content/**/*.mdx`. Frontmatter is validated during `npm run validate:content`. React components provide the educational DSL (`Concept`, `MentalModel`, `Simulation`, `Predict`, `Challenge`, and `MasteryCheck`) while the simulation engine owns deterministic state transitions.

Future worlds are represented as planned curriculum nodes so the dependency graph is visible without presenting unfinished lessons as complete.

## Interactive memory lab

The Stack and Heap lesson embeds `<MemoryLab />` through the MDX provider. Its deterministic walkthrough lives in `src/simulations/memory-lab.ts`; the 2D and 3D views render the same snapshots. It teaches allocation, a function-call move, printing, and drop using the displayed Rust program. It is not a general Rust interpreter.

Three.js loads only when the 3D view opens. The renderer draws on camera input and for short state transitions, disposes resources on unmount, and respects reduced-motion preferences. Small screens and reduced-motion users start in 2D. WebGL or chunk-loading failures fall back to 2D with the same interactions. Camera controls support dragging, scrolling, arrow keys, plus/minus, and Home; the Inspect buttons expose the same objects without requiring canvas interaction.

Both predictions and reaching the final execution step register with the lesson’s existing exercise gate. Rewinding or switching views does not reset passed predictions. Restart rewinds the visualization; it does not erase saved learning progress. Existing completed lessons remain completed.

For a standalone local demo, start Vite and open `/rust-mental-model-lab/memory-lab-preview.html`. This development-only entry uses in-memory challenge results and does not touch course progress. The normal production build still has a single entry (`index.html`); the preview does not bypass lesson prerequisites on GitHub Pages.

Implementation references: [Three.js fundamentals](https://threejs.org/manual/en/fundamentals.html), [resource cleanup](https://threejs.org/manual/en/cleanup.html), and [Rust ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html).
