# AGENTS.md

This repo is a small React + TypeScript + Vite app (ESM) with ESLint (flat config).

## Ground Rules For Agents

- Match existing patterns in `src/`; prefer small, reviewable diffs.
- Avoid drive-by refactors (rename/move only when it directly helps the task).
- Do not add new dependencies unless the task clearly needs them.

## Project Layout

- `src/main.tsx`: React root (`StrictMode`) + global CSS import.
- `src/App.tsx`: App shell + simple state-based routing.
- `src/components/*`: Reusable UI components (icons, navigation, top bar).
- `src/pages/*`: Page-level components.
- `src/data/mock.ts`: Mock data for UI.
- `src/types.ts`: Shared types.
- `src/index.css`: Global styles, CSS variables, layout, component classes.

## Setup

- Install: `npm ci`
- Package manager: npm (lockfile: `package-lock.json`).

## Build / Lint / Typecheck

- Dev server (HMR): `npm run dev`
- Production build (typecheck + bundle): `npm run build` (runs `tsc -b` then `vite build`)
- Preview production build: `npm run preview`
- Lint (whole repo): `npm run lint`
- Lint with fixes: `npm run lint -- --fix`

### Targeted Linting

- Lint one file: `npx eslint src/App.tsx`
- Lint one file with fixes: `npx eslint src/App.tsx --fix`
- Lint only TS/TSX: `npx eslint "src/**/*.{ts,tsx}"`

### Targeted Typechecking

- Typecheck all projects: `npx tsc -b`
- Typecheck app only: `npx tsc -p tsconfig.app.json --noEmit`
- Typecheck Vite config only: `npx tsc -p tsconfig.node.json --noEmit`

## Tests

No test runner is configured yet (no `test` script; no `*.test.*` / `*.spec.*` files).

If you add tests, prefer Vitest (Vite-native):

- Run all tests (watch): `npx vitest`
- Run all tests (CI): `npx vitest run`
- Run a single test file: `npx vitest src/pages/DashboardPage.test.tsx`
- Run a single test by name: `npx vitest -t "renders KPIs"`
- Run a single test file + name: `npx vitest src/pages/DashboardPage.test.tsx -t "renders KPIs"`

When adding tests, also add `test` / `test:run` scripts to `package.json` and document them here.

## Tooling Notes

- ESLint: `eslint.config.js` with `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`.
- TypeScript: strict, `noEmit`, bundler resolution; `noUnusedLocals` / `noUnusedParameters`.
- TypeScript also enables `noUncheckedSideEffectImports`: keep side-effect imports rare and intentional.
- ESM: repo uses `"type": "module"` (keep configs/exports ESM-friendly).
- Vite base path: `vite.config.ts` uses `BASE_PATH` (via `process.env.BASE_PATH ?? '/'`).

## Code Style (TypeScript / React)

### Imports

- Group imports: 1) React/3rd-party 2) internal modules 3) side-effect imports (CSS).
- Use `import type` for type-only imports.
- Prefer relative imports inside `src/` (no path aliases configured).
- Keep side-effect imports (like `./index.css`) in entrypoints unless there is a strong reason.
- Keep imports lean; unused imports fail due to TS settings.

### Formatting

- No Prettier; keep formatting consistent with existing files.
- Conventions: 2-space indentation, single quotes, generally no semicolons.
- Use trailing commas where the surrounding code does.

### Components & React

- Prefer function components; avoid `React.FC`.
- Use named exports for shared components; default exports are fine for top-level pages/app.
- Props: define `type Props = { ... }` near the top; keep props serializable when possible.
- Hooks: follow Rules of Hooks; use `useMemo`/`useCallback` only when it improves clarity or avoids real churn.
- JSX: prefer simple expressions and early returns over nested ternaries; keep inline styles minimal.
- Accessibility: icon-only buttons need `aria-label`; decorative icons use `aria-hidden` (see `src/components/Icon.tsx`).

### TypeScript

- Do not use `any`; keep types explicit at boundaries.
- Prefer `type` aliases (consistent with existing code) and discriminated unions for finite states.
- Prefer `Record<K, V>` lookup tables (see `src/components/Sidebar.tsx`, `src/components/TopBar.tsx`).
- Use `as const` for literal data to preserve narrow types (see `src/data/mock.ts`).
- Avoid non-null assertions (`!`) except at known boundaries (e.g. `document.getElementById('root')!`).

### Naming

- Files/components: `PascalCase` (e.g. `TopBar.tsx`).
- Variables/functions/hooks: `camelCase`.
- Types: `PascalCase`; unions: readable literal strings (`NavItemId`).
- Constants: `const` for values; reserve ALL_CAPS for cross-file, truly constant values.

### Error Handling

- Prefer soft-failure UI: validate inputs at component boundaries; use early returns for impossible states.
- For async work (if introduced): surface errors (empty state/message), avoid silent catches, include context in thrown errors.

## App / UI Conventions

- Routing: `src/App.tsx` uses simple state-based routing; keep it lightweight unless a real router is required.
- Data: keep mock/demo data in `src/data/mock.ts` and type it via `src/types.ts`.
- Lookups: prefer maps (`Record<...>`) for labels/icons over `if` chains.
- UI consistency: reuse existing classes (`card`, `muted`, `h2`, etc.) before inventing new ones.
- Accessibility baseline: buttons must be focusable, have a `type`, and icon-only controls need an accessible name.
- Charts/tooltips: support hover + keyboard focus; tooltips should use `pointerEvents: 'none'` and avoid blocking interaction.

## Adding A New Page

- Add a new `NavItemId` literal in `src/types.ts`.
- Add the nav item + render branch in `src/App.tsx`.
- Add an icon mapping in `src/components/Sidebar.tsx` (`iconById`).
- Add a title mapping in `src/components/TopBar.tsx` (`titleById`).

## Styling (CSS)

- Global CSS is in `src/index.css` with CSS variables (`--bg0`, `--text0`, ...).
- Class naming is simple BEM-ish modifiers (`navItem--active`, `delta--pos`).
- Prefer existing tokens/gradients; avoid introducing a framework.
- Inline styles are acceptable for small dynamic values (keep them minimal and obvious).
- Responsive: use the existing `@media (max-width: 980px)` breakpoint; status colors use `--good`/`--bad`/`--warn`.

## Cursor / Copilot Rules

- No Cursor rules found (no `.cursorrules` or `.cursor/rules/`).
- No Copilot instructions found (no `.github/copilot-instructions.md`).

## Suggested Agent Workflow

- Make a small, focused change.
- Run `npm run lint` (or targeted `npx eslint <file> --fix`).
- Run `npm run build` (includes typecheck via `tsc -b`).
- If tests exist later: run the smallest relevant `vitest` command first.
