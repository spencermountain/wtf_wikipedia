# Gotchas — read this first if you are an LLM

Training data is full of old wtf_wikipedia examples. The API changed at v9 and
v11. This page lists what models most often get wrong, then the honest limits
of the library.

## Version differences (the big one)

| you may have learned | current (v11) reality | changed in |
| --- | --- | --- |
| `doc.templates()[0].template` | templates are `Template` objects → `doc.templates()[0].json().template` | v9 |
| `doc.links()` returns strings | returns `Link` objects → `.page()` / `.text()` / `.json()` | v9 |
| `doc.links(3)` returns one link | plural + number returns a **one-element array** | v9 |
| `wtf.random()`, `wtf.category()` on core | moved to `wtf-plugin-api` (`getRandomPage`, `getCategoryPages`) | v9 |
| `doc.dates()` | removed | v9 |
| coordinates: infobox entries have `lng` | every coordinate is `{ lat, lon }` | v11 |
| classify empty result `{ detail, type, score }` | always `{ root, type, score, details }` | classify v3 |
| runs on Node 12/14/16, uses cross-fetch | native fetch, Node ≥ 18 | v11 |
| no `.json()` presets | `doc.json('sm' \| 'md' \| 'lg')` | v11 |

## Methods that do not exist (commonly hallucinated)

- `doc.html()`, `doc.markdown()`, `doc.latex()` — **plugins**, not core
- `doc.summary()`, `doc.classify()`, `doc.birthDate()` — plugins
- `doc.infobox('birth_place')` — the clue selects *which infobox*, not a field.
  Field access is `doc.infobox().get('birth_place')`
- `doc.category()` does not fetch a category listing — it returns this page's
  first category string. Category listings are `wtf.getCategoryPages()` (api plugin)
- `wtf.parse()` — the parser is calling `wtf(text)` itself
- `section.html`, `image.src` as properties — everything is a **method call**

## Return-type traps

- `wtf.fetch()` of a missing page resolves **`null`**, it does not throw.
- Singular getters return `null` on Document but `undefined` on
  Section/Paragraph/Sentence. Check truthiness, not `=== null`.
- `infobox.get('missing key')` returns an **empty Sentence**, never
  null/undefined — `.text()` on it gives `''`. Check `.text().length`.
- `table.text()` and `reference.text()` intentionally return `''` —
  use `.keyValue()` / `.json()` / `.title()`.
- `image.text()` returns `''` — captions are `.caption()`.
- Section plurals ignore a number clue (`sec.sentences(2)` returns **all**);
  index with the singular: `sec.sentence(2)`.
- `doc.title()` is `null` for parsed strings unless you passed
  `{ title }` as an option or the text has a bolded first-sentence subject.
- person plugin dates: `month` is **0-based** (January = 0).

## Parsing model surprises

- `.templates()` content: known **data** templates are parsed rich, unknown
  templates are kept as `{ template: '<name>' }` + raw params, but known
  **text-only** templates (like `{{convert}}`) are folded into `.text()` and
  do not appear in the list. Infoboxes appear only in `.infoboxes()`.
- `.text()` deliberately omits infobox, template, table and reference content.
  A page that is mostly tables can have nearly empty text.
- Nested/edge-case wikitext is lossy. This is by design; wikitext is not a
  context-free grammar and full fidelity is impossible.
- Only the wikitext of the page itself is parsed — **transcluded** content
  (except the templates the library knows) is not expanded.
- `.images()` sees `[[File:...]]` links, gallery entries and infobox images;
  images inserted by obscure templates may be missed.
- Redirect pages parse to a nearly-empty doc — check `.isRedirect()` before
  assuming content. Same for `.isDisambiguation()`.

## Environment traps

- ESM and CommonJS both work (`import wtf from` / `const wtf = require(...)`)
  — but the browser build is a separate file (`wtf_wikipedia-client.min.js`,
  the `unpkg` field) exposing a global `wtf`.
- The classes (`Document`, `Section`, …) are **type-only exports**. At runtime
  the default export carries just `fetch`, `extend`, `plugin`, `version`.
  Get classes via a plugin's `models` argument.
- Fetch calls a live API: respect etiquette (see fetch.md), don't hammer it
  in tests. Missing network → rejected promises.
