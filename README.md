# Rust Mental Model Lab

Rust Mental Model Lab is an interactive learning laboratory for building a working mental simulator of computer memory, program execution, ownership, borrowing, lifetimes, and concurrency.

The first milestone includes:

- an MDX-driven lesson workspace;
- a curriculum map for Worlds 0–17;
- a human orientation lesson followed by interactive lessons for Worlds 0–3;
- deterministic simulations for bits, memory hierarchy, process memory, and stack/heap;
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
