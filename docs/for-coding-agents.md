# Working on this repo (for coding agents)

Instructions for making changes to wtf_wikipedia itself. For *using* the
library, see the other docs in this folder.

## Layout

```
src/                   the parser, in TypeScript (erasable-syntax only — node runs it directly)
  01-document/         Document class, json output
  02-section/ 03-paragraph/ 04-sentence/
  image/ infobox/ link/ list/ reference/ table/ template/
  template/custom/     per-template parsers (text-only/, data-only/, text-and-data/)
  template/custom/aliases.ts        template-name aliases
  infobox/_infoboxes.ts             which templates count as infoboxes
  _fetch/              wtf.fetch implementation
  index.ts             entry: builds `wtf`, wires extend()
types/                 HAND-WRITTEN declarations: index.d.ts (ESM) + index.d.cts (CJS)
tests/                 tape tests (unit/, integration/, fetch/) + tests/types/ (tsc)
plugins/               13 plugin packages + plugins/wikis/* — each self-contained
                       (own package.json, src/, tests/, types/, node_modules)
builds/                rollup output — generated, never edit
scratch.js             playground file
```

## Commands

| command | what it does | needs network? |
| --- | --- | --- |
| `npm test` | tape suite against `src/` (~4k assertions, fast) | no |
| `npm run testb` | same suite against the production build (build first) | no |
| `npm run build` | rollup → `builds/` | no |
| `npm run lint` | eslint over src, plugins, tests | no |
| `npm run check` | loose `tsc --noEmit` over src + plugins | no |
| `npm run test:types` | strict tsc over the type declarations (3 configs) | no |
| `npm run test:fetch` | live-API tests | **yes** |

Per-plugin tests run inside the plugin dir: `cd plugins/classify && npm test`.

## Verifying a change quickly

Node (≥ 23) runs the TypeScript source directly — no build step needed:

```bash
node --input-type=module -e "
import wtf from './src/index.ts'
console.log(wtf('[[hello]] world').links()[0].json())
"
```

Tests import `../../src/index.ts` the same way. Use cached fixtures
(`tests/lib/_cachedPage.js`, pages in `tests/cache/`) rather than live fetches.

## Rules that keep the repo healthy

1. **Types are hand-written.** `tsc` never generates them. If you change any
   public method, update `types/index.d.ts` AND `types/index.d.cts`, and add a
   usage line to `tests/types/*.mts|cts`. Then run `npm run test:types`.
2. **Never edit `builds/`** — regenerate with `npm run build`.
3. **Code style is prettier-enforced**: no semicolons, single quotes
   (config in package.json). Tests use `tape`.
4. Runtime code must stay **erasable-syntax TypeScript** (no enums,
   no parameter properties) so node can strip types — tsconfig enforces it.
5. Each plugin is its own npm package with its own version. A breaking change
   in a plugin bumps that plugin's major, not the root's.
6. Note user-visible changes in `changelog.md` (draft block at the top).
7. Plugin type declarations import `Plugin`/`Models` from wtf_wikipedia and
   augment `interface Document` / `interface Wtf`. Do not try to augment
   `namespace wtf` — it silently fails to merge.

## Adding a template parser (most common contribution)

1. Find the right file under `src/template/custom/` — `text-only/` (renders
   text), `data-only/` (parsed data, no text), `text-and-data/` (both).
2. Add the parser keyed by the lower-cased template name. Aliases go in
   `template/custom/aliases.ts`.
3. Add a test in `tests/unit/template/` with a wikitext snippet.
4. `npm test` and `npm run lint`.

Non-english template aliases belong in `plugins/i18n`, not core.

## Adding a public method

1. Implement in the class file (e.g. `src/01-document/Document.ts`).
2. Types: both files in `types/`, plus a line in `tests/types/esm.mts`.
3. Test in `tests/unit/` or `tests/integration/`.
4. Document it in `docs/api.md` and the README's Full API list.
5. Run: `npm test && npm run lint && npm run check && npm run test:types`.
