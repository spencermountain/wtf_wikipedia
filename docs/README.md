# wtf_wikipedia docs

Plain-markdown documentation for **wtf_wikipedia** — written to be readable by
LLMs and coding agents, as well as humans. The interactive (human-first) docs
live on [Observable](https://observablehq.com/@spencermountain/wtf), but those
pages render client-side and are hard for machines to read. Everything in this
folder is self-contained and current with the source in this repo.

| file | what it covers |
| --- | --- |
| [api.md](./api.md) | every class and method, with exact signatures and return types |
| [fetch.md](./fetch.md) | fetching pages from wikipedia (or any mediawiki) |
| [plugins.md](./plugins.md) | the bundled plugins and the methods they add |
| [plugin-authoring.md](./plugin-authoring.md) | writing your own plugin, custom templates, TypeScript augmentation |
| [gotchas.md](./gotchas.md) | version differences and traps — **read this first if you are an LLM** |
| [for-coding-agents.md](./for-coding-agents.md) | working on this repo: layout, commands, conventions, how to verify changes |

## 30-second orientation

wtf_wikipedia parses **wikitext** (wikipedia's markup) into a queryable
`Document` object. It is not an HTML scraper and it does not render pages.

```js
import wtf from 'wtf_wikipedia'

// parse a string of wikitext
let doc = wtf(`[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.`)
doc.text() // "Boston's baseball field has a 37 ft wall."
doc.links().map((l) => l.page()) // ['Greater_Boston', 'Fenway_Park']

// or fetch + parse a live page
doc = await wtf.fetch('Toronto Raptors')
doc.infobox().get('coach').text() // 'Darko Rajaković'
```

The object tree is: `Document → Section → Paragraph → Sentence`, with
`Image`, `Infobox`, `Template`, `Table`, `List`, `Link`, `Reference` hanging
off the levels where they occur. Every class has `.text()`, `.json()` and
`.wikitext()`.

Parsing wikitext is [notoriously hard](https://en.wikipedia.org/wiki/Help:Wikitext)
and inherently lossy. This library is opinionated about what it keeps.
See [gotchas.md](./gotchas.md) for what to expect.
