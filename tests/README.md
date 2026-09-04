# tests

Run with `npm test` (offline, fast). Live-network tests are separate:
`npm run test:fetch` runs `tests/fetch/*.fetch.js` — the `.fetch.js` suffix is
what keeps them out of the default `*.test.js` glob.

## layout

One directory per subject, mirroring `src/`:
`document/ section/ paragraph/ sentence/ link/ image/ infobox/ table/ list/
reference/ templates/ output/ preprocess/ i18n/ fetch-offline/ regressions/`

Two special ones:
- `contract/` — the api contract: every public method runs against every page
  in `cache/`, checked for throw-safety and the return shape promised in
  `types/index.d.ts`. If you add or change a method, update the table in
  `contract/methods.test.js`.
- `golden/` — snapshot files for large json outputs. Never edit them by hand;
  regenerate with `npm run goldens:update` and review the diff.

## rules

1. **Test parsing behavior with small inline wikitext and exact expected
   strings.** A reader should understand the test without opening a fixture.
2. **Never assert on `.length` of text** — string-lengths break on any
   unrelated parser change and say nothing about what broke. Assert the
   actual string, or a real shape (`deepEqual` on json, titles, pages).
3. Whole pages in `cache/` are for the contract harness, stress tests and
   goldens — not for pinning behavior. Don't add a cached page to test one
   template; write the template inline.
4. Live-network tests end in `.fetch.js` and live in `fetch/`. Everything else
   must pass offline.
5. Singular accessors return `null` on a miss (every class). Plural accessors
   always return arrays.
