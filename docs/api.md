# API reference

Exact signatures, matching `types/index.d.ts` (the authoritative, hand-written
type declarations). All examples verified against the current source.

Conventions used below:
- `clue?: number` — index into the plural result. On **Document**, plural
  methods with a number return a **one-element array** (`doc.links(1)` →
  `[secondLink]`, or `[]` when out of range). They never return a bare item.
- Singular forms (`.link()`, `.section()`, …) return the first (or clue-th)
  item — `null` on Document, **`undefined` on Section/Paragraph/Sentence**.
- `.json()` returns plain serializable data. `.text()` returns plaintext.
  `.wikitext()` returns the original markup. Every class has all three.

## wtf (the default export)

```ts
wtf(wikitext: string, options?: DocumentOptions): Document
wtf.fetch(title, options?, callback?): Promise<Document | Document[] | null>  // see fetch.md
wtf.extend(plugin): typeof wtf   // install a plugin
wtf.plugin(plugin): typeof wtf   // alias of extend
wtf.version: string
```

`DocumentOptions` (all optional): `title`, `pageID`, `namespace`/`ns`,
`lang`/`language`, `domain`, `wikidata`, `description`, `timestamp`,
`revisionID`, `pageImage`, `userAgent`, `templateFallbackFn`.
Pass `title` when parsing raw wikitext if you want `.title()` / `.url()` to work:

```js
let doc = wtf(str, { title: 'Glastonbury', lang: 'en' })
```

## Document

Metadata get/setters (call with an argument to set):

| method | returns | notes |
| --- | --- | --- |
| `.title(str?)` | `string \| null` | from options, or guessed from the first bolded text |
| `.pageID(id?)` | `number \| null` | |
| `.wikidata(id?)` | `string \| null` | |
| `.domain(str?)` | `string \| null` | |
| `.language(lang?)` / `.lang()` | `string \| null` | |
| `.namespace(ns?)` / `.ns()` | `string \| null` | |
| `.url()` | `string \| null` | built from title + lang + domain |
| `.description(str?)` | `string \| null` | the 'short description' |
| `.timestamp(iso?)` | `string \| null` | last-edit time, when fetched |
| `.revisionID(id?)` | `number \| null` | |
| `.pageImage(img?)` | `Image` | |
| `.options()` | `DocumentOptions` | the options the doc was created with |

Booleans and redirects:

| method | returns |
| --- | --- |
| `.isRedirect()` | `boolean` |
| `.redirectTo()` (aliases `.redirect()`, `.redirects()`, `.redirectsTo()`) | `{ page, raw, anchor? } \| null` |
| `.isDisambiguation()` / `.isDisambig()` | `boolean` |
| `.isStub()` | `boolean` |

```js
wtf('#REDIRECT [[Toronto Raptors]]').redirectTo()
// { page: 'Toronto Raptors', raw: '[[Toronto Raptors]]' }
```

Content accessors (plural → array, singular → item-or-null):

| plural | singular | item type |
| --- | --- | --- |
| `.categories(clue?)` | `.category(clue?)` | `string` |
| `.sections(clue?)` | `.section(clue?)` | `Section` — clue may be a **title string** (case-insensitive) or index |
| `.paragraphs(clue?)` | `.paragraph(clue?)` | `Paragraph` |
| `.sentences(clue?)` | `.sentence(clue?)` | `Sentence` |
| `.images(clue?)` | `.image(clue?)` | `Image` |
| `.links(clue?)` | `.link(clue?)` | `Link` — string clue matches the link's page name |
| `.lists(clue?)` | `.list(clue?)` | `List` |
| `.tables(clue?)` | `.table(clue?)` | `Table` |
| `.templates(clue?)` | `.template(clue?)` | `Template` — string clue matches template name |
| `.infoboxes(clue?)` | `.infobox(clue?)` | `Infobox` — string clue matches infobox type |
| `.references(clue?)` / `.citations()` | `.reference(clue?)` / `.citation()` | `Reference` |
| `.coordinates(clue?)` | `.coordinate(clue?)` | `Coordinate` (plain object) |
| `.interwiki(clue?)` | — | `Link` (links to other-language wikis) |

Output:

| method | returns | notes |
| --- | --- | --- |
| `.text(options?)` / `.plaintext()` | `string` | readable prose. infoboxes, templates, references are omitted |
| `.json(options?)` | `object` | default keys: `title`, `categories`, `sections` |
| `.json('sm')` | `object` | `title, description, infoboxes, categories` |
| `.json('md')` | `object` | sm + `coordinates, images, links, templates, text, references` |
| `.json('lg')` | `object` | md + full `sections` data |
| `.wikitext()` | `string` | the original markup |

## Section

`doc.section('History')` or `doc.sections()[0]`.

- `.title()` → `string` (empty for the lead section), `.index()` → `number | null`,
  `.depth()` / `.indentation()` → `number` (0 = top level).
- Same plural accessors as Document (`sentences, paragraphs, links, tables,
  templates, infoboxes, coordinates, lists, images, references, interwiki`),
  **but a number clue is ignored on Section plurals** — use the singular form
  for indexing: `sec.sentence(2)`. String clues still filter
  (`sec.templates('coord')`, `sec.infoboxes('person')`, `sec.links('Fortnight')`).
- Singulars (`.sentence()`, `.link()`, `.template()`, …) return `undefined`
  when missing (not `null`).
- Navigation: `.parent()`, `.children(titleStr?)` (alias `.sections()`),
  `.nextSibling()` / `.next()`, `.previousSibling()` / `.previous()`,
  `.lastSibling()` / `.last()` — all return `Section | null`
  (`children()` returns `Section[] | null`; with a title string, one `Section | undefined`).
- `.remove()` → removes this section (and its children) from the document,
  returns the `Document`.

```js
let doc = wtf('==A==\nhi\n===B===\nyo')
doc.section('A').children().map((s) => s.title()) // ['B']
```

## Paragraph

`.sentences()`, `.references()`/`.citations()`, `.lists()`, `.images()`,
`.links()`, `.interwiki()`, plus singulars (`.sentence()`, `.image()`, …
→ `undefined` when missing), and `.text()` / `.json()` / `.wikitext()`.

## Sentence

- `.text(str?)` → `string` (passing a string overwrites it)
- `.plaintext()` alias
- `.links(clue?)` → `Link[]`, `.link(clue?)` → `Link | undefined`
- `.bolds()` → `string[]`, `.bold(n?)` → `string | undefined`
- `.italics()` → `string[]`, `.italic(n?)` → `string | undefined`
- `.interwiki()` → `Link[]`, `.isEmpty()` → `boolean`
- `.json()` → `{ text, links?, formatting? }`:

```js
wtf("Hello '''there''' [[world]].").sentences()[0].json()
// { text: 'Hello there world.',
//   links: [{ text: 'world', type: 'internal', page: 'world' }],
//   formatting: { bold: ['there'] } }
```

## Link

- `.page(str?)` → `string` — the target page (for internal/interwiki links)
- `.text(str?)` → `string` — display text (falls back to page name)
- `.type()` → `'internal' | 'interwiki' | 'external'`
- `.site()` → `string` — url, for external links
- `.wiki()` → `string | undefined` — which wiki, for interwiki links
- `.anchor()` → `string` — the `#section` part, if any
- `.href()` → `string`
- `.json()` → `{ text?, type, page? | site? | wiki?, anchor? }`

## Image

```js
let img = wtf('[[File:Duveneck Whistling Boy.jpg|thumb|a caption]]').images()[0]
img.file()      // 'File:Duveneck_Whistling_Boy.jpg'  (prefix added, spaces → underscores)
img.url()       // 'https://wikipedia.org/wiki/Special:Redirect/file/Duveneck_Whistling_Boy.jpg'
img.thumbnail() // same + '?width=300'  — .thumbnail(500) to size
img.caption()   // 'a caption'
img.format()    // 'jpg'
```

Also `.alt()`, `.links()` (links inside the caption), `.json()`
(`{ file, thumb, url, caption?, alt?, links? }`). `.text()` returns `''`.

## Template

Templates are `{{name|...}}` structures. `.json()` is the way in:

```js
wtf('{{coord|43.6|-79.4}}').templates()[0].json()
// { template: 'coord', lat: 43.6, lon: -79.4 }
```

- `.json()` → `{ template: string, ... }` — `template` is the lower-cased name
- `.text()` → the text this template renders inline (usually `''`)
- `.wikitext()` → the raw `{{...}}`

Which templates appear in `.templates()`:
- **known data templates** (coord, cite, …) — parsed into rich json
- **unknown templates** — kept, with `{ template: name }` and their params
- **known text-only templates** (convert, nowrap, …) — consumed into `.text()`
  output and **not** listed
- **infoboxes** — not listed here; they appear in `.infoboxes()`

## Infobox

```js
let inf = wtf('{{Infobox person|name=Jane|birth_place=Toronto}}').infobox()
inf.type()               // 'person'  (alias .template())
inf.get('Birth  Place')  // a Sentence — keys are case/space/underscore-insensitive
inf.get('nope').text()   // ''  — misses return an empty Sentence, never null
inf.get(['name', 'birth_place'])  // Sentence[]
inf.keyValue()           // { name: 'Jane', birth_place: 'Toronto' }  (plain strings)
inf.image()              // Image | null   (alias .images())
inf.coordinates()        // { template: 'infobox/lat-long', lat, lon } | null
inf.data                 // raw { key: Sentence } map
```

## Table

```js
let t = wtf('{| class=wikitable\n! name !! age\n|-\n| jane || 40\n|}').tables()[0]
t.keyValue()        // [{ name: 'jane', age: '40' }]   (aliases .keyvalue(), .keyval())
t.get('name')       // ['jane']            — one column, by (normalized) header
t.get(['name','age']) // [{ name: 'jane', age: '40' }]
t.json()            // rows with { text } cell objects
t.links()           // Link[]
```

`.text()` returns `''` — use `.keyValue()` for table data.

## List

- `.lines()` → `Sentence[]` — one per bullet
- `.links(clue?)` → `Link[]`
- `.json()` → array of sentence-json
- `.text()` → plaintext with bullets

## Reference

- `.title()` → `string` — best-effort human title of the citation
- `.links()` → `Link[]`, `.json()` → citation data, `.text()` → `''`

## Coordinate (plain object, not a class)

From `{{coord}}` templates and infobox lat/long fields, merged into one list:

```js
wtf('{{coord|43.6|-79.4|display=title}}').coordinates()
// [{ template: 'coord', lat: 43.6, lon: -79.4, display: 'title' }]
```

Always `lat` / `lon` (in ≤ v10 the infobox entries used `lng` — see gotchas).
