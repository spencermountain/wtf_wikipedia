# wtf_wikipedia

> JavaScript library that parses wikipedia markup (wikitext) into structured,
> queryable data — Document/Section/Sentence objects with .text(), .json(),
> links, infoboxes, templates, tables and coordinates. Fetches from any
> mediawiki API. Not an HTML scraper and it does not render pages.

Parsing wikitext is [notoriously hard](https://en.wikipedia.org/wiki/Help:Wikitext)
and inherently lossy. This library is opinionated about what it keeps.
See [gotchas.md](./gotchas.md) for what to expect.

Machine-readable docs live in ./docs — interactive, non-machine-readable documentation lives on [GitHub](https://github.com/observablehq/wtf_wikipedia)


## Mental Model
```js
import wtf from 'wtf_wikipedia'

// parse a string of wikitext
let doc = wtf(`[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.`)
doc.text() // "Boston's baseball field has a 37 ft wall."
doc.links().map((l) => l.page()) // ['Greater_Boston', 'Fenway_Park']
doc.json() // full parsed representation of the document

// or fetch + parse a live page
doc = await wtf.fetch('Toronto Raptors')
doc.infobox().get('coach').text() // 'Darko Rajaković'
```

The object tree is: `Document → Section → Paragraph → Sentence`, with
`Image`, `Infobox`, `Template`, `Table`, `List`, `Link`, `Reference` hanging
off the levels where they occur. Every class has `.text()`, `.json()` and
`.wikitext()`.

---
## Docs

- [Gotchas & version differences](docs/gotchas.md): what LLMs most often get wrong
- [API reference](docs/api.md): every class and method, exact signatures
- [Fetch](docs/fetch.md): downloading pages, options, etiquette
- [Plugins](docs/plugins.md): classify, summary, person, api, html, and the rest
- [Plugin authoring](docs/plugin-authoring.md): extend(), custom templates, TypeScript
- [Contributing](docs/for-coding-agents.md): repo layout, commands, conventions

## Optional

- [README](README.md): human-facing overview
- [changelog](changelog.md): version history
- [types/index.d.ts](types/index.d.ts): authoritative TypeScript declarations

---
## Commands

| command | what it does | needs network? |
| --- | --- | --- |
| `npm test` | tape suite against `src/` (~4k assertions, fast) | no |
| `npm run testb` | same suite against the production build (build first) | no |
| `npm run build` | rollup → `builds/` | no |
| `npm run lint` | eslint over src, plugins, tests | no |
| `npm run check` | loose `tsc --noEmit` over src + plugins | no |
| `npm run test:types` | strict tsc over the type declarations (3 configs) | no |
| `npm run test:fetch` | live-API tests (`tests/fetch/*.fetch.js`) | **yes** |
---

# Development

Unless given specific instruction:
- Do not edit README or add documentation
- do not install or change dependencies
- do not change existing tests
- do not make a commit or PR

Work on the current branch. The user may make simultaneous changes. Verify their work is not overwritten, or ask permission before destructive git changes.

### Code style
- Write maintainable javascript, using esmodules
- Write portable ES2022+ for browers or for Node>=18
- Typescript and jsdoc are not required
- Add terse comments for maintainability
- Prefer functions assigned with const, over declarations
- Do not use unbracketed if statements
- Do not use complex, multi-line, or nested ternary operators
- Defensive try/catch blocks are not required
- File-size is always important

### Project structure
- Prefer pnpm over npm
- eslint is always configured
- Prefer small maintainable files with one purpose
- Split out utility functions into a _lib.js file or ./_lib dir
- Prefer `export default` on files with one export
- Prefer clear exports at the bottom of files
- If workflow is sequential, prefix filenames with 01-, 02-, ...
- Prefer tape-formatted tests
- Use process.env for any secrets, tokens, or keys
