# site-theme

Shared look-and-feel for [cochaviz.github.io](https://github.com/cochaviz/cochaviz.github.io)
and [cantpwn](https://github.com/cochaviz/cantpwn). Each site mounts this repo as a git
submodule at `./theme`.

## Contents

- `tailwind.preset.ts` – Tailwind preset (container, fonts, color map, radius, animations)
- `styles/index.css` – fonts, design tokens (`tokens.css`), base styles (`base.css`) and
  shared component classes (`components.css`, e.g. `.section-heading`, `.btn-outline-primary`)
- `components/`
  - `PageColumn` – page shell with the centered content column (the column width lives here)
  - `TopBar` – fixed top-right button bar that hides on scroll on mobile
  - `TypedTitle` – hero heading that retypes between two strings
  - `ThemeToggle` (requires a `next-themes` `ThemeProvider`) and `NavLink`
- `lib/utils.ts` – `cn()`

No `package.json`: imports (`react`, `next-themes`, `clsx`, `tailwind-merge`,
`tailwindcss-animate`, …) resolve from the consuming site's `node_modules`.

## Consuming

```ts
// tailwind.config.ts
import preset from "./theme/tailwind.preset";
export default { presets: [preset], darkMode: ["class"], content: ["./src/**/*.{ts,tsx}", "./theme/components/**/*.tsx"] };
```

```css
/* src/index.css – must be the first line */
@import "../theme/styles/index.css";
```

Add the `@theme/*` → `./theme/*` alias to `tsconfig.app.json` (`paths`, and `"theme"` in
`include`) and to `vite.config.ts` (`resolve.alias`).

## Updating

1. Edit files under `theme/` in either site, then commit and push from inside `theme/`.
2. Commit the new submodule pointer in that site.
3. In the other site: `git submodule update --remote theme` and commit the pointer.

Fresh clones need `git clone --recurse-submodules` (or `git submodule update --init`).
