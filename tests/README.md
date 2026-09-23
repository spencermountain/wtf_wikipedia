# tests

Run with `pnpm test`. All tests use `*.test.js`, including live Wikimedia API
tests, so the suite requires network access.

`pnpm run test:all` builds and verifies the whole workspace, including each
plugin's source and built tests. Use `pnpm --filter wtf-plugin-html test:all`
to verify one plugin after building the core.

## layout

`unit/` holds the everyday offline tests - one directory per subject,
mirroring `src/`:
`unit/document/ unit/section/ unit/paragraph/ unit/sentence/ unit/link/
unit/image/ unit/infobox/ unit/table/ unit/list/ unit/reference/
unit/templates/ unit/output/ unit/preprocess/ unit/i18n/ unit/fetch-offline/
unit/regressions/`

Everything else stays in the test root - helpers (`lib/`, `cache/`, `golden/`,
`types/`) and the special suites:
- `contract/` — the api contract: every public method runs against every page
  in `cache/`, checked for throw-safety and the return shape promised in
  `types/index.d.ts`. If you add or change a method, update the table in
  `contract/methods.test.js`.
- `golden/` — snapshot files for large json outputs. Never edit them by hand;
  regenerate with `pnpm run goldens:update` and review the diff.

## rules

1. **Test parsing behavior with small inline wikitext and exact expected
   strings.** A reader should understand the test without opening a fixture.
2. **Never assert on `.length` of text** — string-lengths break on any
   unrelated parser change and say nothing about what broke. Assert the
   actual string, or a real shape (`deepEqual` on json, titles, pages).
3. Whole pages in `cache/` are for the contract harness, stress tests and
   goldens — not for pinning behavior. Don't add a cached page to test one
   template; write the template inline.
4. Core live API tests live in `fetch/` and use the same `.test.js` suffix
   as the rest of the suite.
5. Singular accessors return `null` on a miss (every class). Plural accessors
   always return arrays.
