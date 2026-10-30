# API reference

Exact signatures, matching `types/index.d.ts` (the authoritative, hand-written
type declarations). Every example below was run against the current source.

Conventions:

- Plural accessors (`.links()`, `.sections()`, …) return a **collection**: a real
  `Array`, so `.map`, `.filter`, `[0]` and `.length` all work, plus the item's
  own methods mapped across it — `doc.links().page()` is
  `doc.links().map((l) => l.page())`. `.filter()`/`.map()`/`.slice()` return a
  plain array. `.sections()` and `.paragraphs()` are plain arrays.
- Singular accessors exist only where a "first" is useful: `doc.section(clue)`,
  `doc.infobox()`, `doc.link(clue?)` and `doc.template(clue?)`. For everything
  else, index the collection: `doc.links()[2]`.
- `.json(format?)` returns plain serializable data. The default (`'lg'`) leaves
  out the raw wikitext; `'xl'` includes it as `wiki` keys. `.text()` returns
  plaintext and `.wikitext()` the original markup. Every class has all three.
- Metadata on a Document (`title`, `pageID`, …) are **properties**, not methods.

## wtf (the default export)

```ts
wtf(wikitext: string, options?: DocumentOptions): Document
wtf.fetch(title, options?, callback?): Promise<Document | Document[] | null>  // see fetch.md
wtf.extend(plugin): typeof wtf   // install a plugin — see plugins.md
wtf.plugin(plugin): typeof wtf   // alias of extend
wtf.version: string
```

`DocumentOptions` (all optional): `title`, `pageID` (or `id`), `namespace` (or
`ns`), `lang` (or `language`), `domain`, `project`, `wikidata`, `description`,
`timestamp`, `revisionID`, `pageImage`, `userAgent`. Pass `title` when parsing
raw wikitext if you want `doc.title` / `doc.url()` to work:

```js
let doc = wtf(str, { title: 'Glastonbury', lang: 'en' })
doc.url() // 'https://en.wikipedia.org/wiki/Glastonbury'
```

## Document

Metadata — plain get/set properties:

| property       | type                       | notes                                                 |
| -------------- | -------------------------- | ----------------------------------------------------- |
| `.title`       | `string \| null`           | from options, else guessed from the first bolded text |
| `.pageID`      | `number \| null`           |                                                       |
| `.wikidata`    | `string \| null`           |                                                       |
| `.domain`      | `string \| null`           | default `'wikipedia.org'`                             |
| `.language`    | `string \| null`           | default `'en'`                                        |
| `.namespace`   | `string \| number \| null` | numeric IDs preserved, including `0`                  |
| `.description` | `string \| null`           | the 'short description'                               |
| `.timestamp`   | `string \| null`           | last-edit time, when fetched                          |
| `.revisionID`  | `number \| null`           |                                                       |
| `.pageImage`   | `string \| null`           | file name, when fetched                               |

```js
doc.title = 'Glastonbury' // set
doc.title // 'Glastonbury'
```

Methods:

| method                                                    | returns            | notes                                     |
| --------------------------------------------------------- | ------------------ | ----------------------------------------- |
| `.url()`                                                  | `string \| null`   | built from title + language + domain      |
| `.options()`                                              | `DocumentOptions`  | the options the doc was created with      |
| `.isRedirect()`                                           | `boolean`          |                                           |
| `.redirectTo()` (aliases `.redirect()`, `.redirectsTo()`) | `LinkJson \| null` | `{ type, page, text, wiki, anchor? }`     |
| `.isDisambiguation()` / `.isDisambig()`                   | `boolean`          |                                           |
| `.isStub()`                                               | `boolean`          |                                           |
| `.debug()`                                                | `Document`         | prints the section outline to the console |

```js
wtf('#REDIRECT [[Toronto Raptors]]').redirectTo()
// { type: 'internal', page: 'Toronto Raptors', text: 'Toronto Raptors', wiki: '[[Toronto Raptors]]' }
```

Content accessors — all search the whole document:

| method                           | returns                 | notes                                                                                                                |
| -------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `.categories()`                  | `string[]`              |                                                                                                                      |
| `.comments()`                    | `string[]`              | raw `<!-- html comments -->`                                                                                         |
| `.sections()`                    | `Section[]`             | flat list, in page order, including the lead section                                                                 |
| `.section(clue?)`                | `Section`               | by **index** or **title** (trimmed, case-insensitive); defaults to `0`. Misses return an empty Section, never `null` |
| `.paragraphs()`                  | `Paragraph[]`           |                                                                                                                      |
| `.sentences()`                   | `Collection<Sentence>`  |                                                                                                                      |
| `.images()`                      | `Collection<Image>`     | infobox and gallery images first, then inline ones                                                                   |
| `.links()`                       | `LinkCollection`        | in document order                                                                                                    |
| `.link(clue?)`                   | `Link \| null`          | the first link, or the first to the given page name                                                                  |
| `.lists()`                       | `Collection<List>`      |                                                                                                                      |
| `.tables()`                      | `Collection<Table>`     |                                                                                                                      |
| `.templates(clue?)`              | `TemplateCollection`    | string clue filters by template name                                                                                 |
| `.template(clue?)`               | `Template \| null`      | the first template, or the first with that name                                                                      |
| `.infoboxes()`                   | `InfoboxCollection`     | sorted biggest-first                                                                                                 |
| `.infobox()`                     | `Infobox \| null`       | the biggest infobox                                                                                                  |
| `.references()` / `.citations()` | `Collection<Reference>` |                                                                                                                      |
| `.coordinates()`                 | `Coordinate[]`          | plain objects, see below                                                                                             |

Output:

| method           | returns  | notes                                                                                                                                                       |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.text()`        | `string` | readable prose. Infoboxes, templates, references and tables are omitted; lists are kept                                                                     |
| `.json(format?)` | `object` | `{ title, pageID, categories, wikidata, description, isStub, isDisambiguation, isRedirect, sections }` (+ `redirectTo` when redirect, + `wiki` with `'xl'`) |
| `.wikitext()`    | `string` | the original markup                                                                                                                                         |

## Section

`doc.section('History')` or `doc.sections()[1]`.

- `.title()` → `string` (empty for the lead section)
- `.index()` → `number | null` — position in `doc.sections()`
- `.depth()` → `number` — `0` for `==`, `1` for `===`, and so on
- `.sentences()`, `.paragraphs()`, `.links()`, `.tables()`, `.templates(clue?)`,
  `.infoboxes()`, `.coordinates()`, `.lists()`, `.images()`,
  `.references()`/`.citations()` — same as on Document, scoped to this section
  (not its subsections)
- `.text()`, `.json()`, `.wikitext()`

```js
let doc = wtf('==A==\nhi\n===B===\nyo')
doc.sections().map((s) => [s.title(), s.depth()]) // [['', 0], ['A', 0], ['B', 1]]
doc.section('b').text() // 'yo'
doc.section('nope').sentences().length // 0
```

Sections are a flat list; walk `depth()` and `index()` to find subsections:

```js
const kids = (doc, title) => {
  const parent = doc.section(title)
  const out = []
  for (const s of doc.sections().slice(parent.index() + 1)) {
    if (s.depth() <= parent.depth()) break
    out.push(s)
  }
  return out
}
```

## Paragraph

`.sentences()`, `.lists()`, `.images()`, `.links()`, plus `.text()` / `.json()` /
`.wikitext()`. A list ends its paragraph, so text after a list starts a new one.

`.json()` → `{ sentences, lists, images }`.

## Sentence

- `.text()` → `string`
- `.links()` → `LinkCollection`
- `.bolds()` / `.italics()` → `{ text, start, end }[]` — offsets into `.text()`
- `.json()` → `{ text, links?, bolds?, italics? }`

```js
wtf("Hello '''there''' [[world]].").sentences()[0].json()
// { text: 'Hello there world.',
//   links: [{ type: 'internal', page: 'World', text: 'world' }],
//   bolds: [{ text: 'there', start: 6, end: 11 }] }
```

Table cells and list items are the same shape (`Block` in the types): `.text()`,
`.links()`, `.bolds()`, `.italics()`, `.json()`, `.wikitext()`.

## Link

- `.type()` → `'internal' | 'external' | 'interwiki'`
- `.page()` → `string` — target page, first letter capitalised (`''` for external)
- `.text()` → `string` — display text (falls back to the page name)
- `.anchor()` → `string` — the `#section` part, if any
- `.wiki()` → `string` — the language/project prefix of an interwiki link (`'fr'`), else `''`
- `.href()` → `string` — a usable URL for any type
- `.json()` → `{ type, page?, text, anchor?, site?, lang?, inline? }`

Collections of links add `.internal()`, `.external()` and `.interwiki()` filters.

```js
wtf('[[Paris#Food|food]] [[:fr:Paris|Paris]] [http://x.com x]').links().json()
// [{ type: 'internal', page: 'Paris', text: 'food', anchor: 'Food' },
//  { type: 'interwiki', page: 'Paris', text: 'Paris', lang: 'fr', inline: true },
//  { type: 'external', site: 'http://x.com', text: 'x' }]
```

A bare `[[fr:Paris]]` is an _interlanguage_ link: it is listed with
`inline: false` and does not appear in `.text()`, matching how MediaWiki
renders it. `[[:fr:Paris|Paris]]` (leading colon) is an inline link.

## Image

```js
let img = wtf('[[File:Duveneck Whistling Boy.jpg|thumb|a caption]]').images()[0]
img.file() // 'File:Duveneck_Whistling_Boy.jpg'  (prefix added, spaces → underscores)
img.url() // 'https://wikipedia.org/wiki/Special:Redirect/file/Duveneck_Whistling_Boy.jpg'
img.src() // same as .url()
img.thumbnail() // same + '?width=300'  — .thumbnail(500) to size
img.caption() // 'a caption'
img.alt() // '' unless |alt= was given
img.format() // 'jpg'
img.links() // links inside the caption
img.json() // { file, domain, caption?: { text, links? }, alt? }
```

`.text()` returns `''`.

## Template

Templates are `{{name|...}}` structures. `.json()` is the way in:

```js
wtf('{{coord|43.6|-79.4}}').templates()[0].json()
// { template: 'coord', kind: 'coord', text: '43.6°N 79.4°W', data: { lat: 43.6, lon: -79.4 } }
```

- `.json()` → `{ template, kind, text, data }` — `template` is the lower-cased
  name, `kind` is the parser family that handled it (`'coord'`, `'citation'`,
  `'infobox'`, … or `null` for unknown templates), `data` the parsed params
- `.type` → `string` — the template name (property)
- `.kind` → `string | null` (property)
- `.text()` → what the template renders inline (often `''`)
- `.links()`, `.wikitext()`

Which templates appear in `.templates()`:

- **known data templates** (coord, convert, …) — parsed into `data`
- **unknown templates** — kept, with `kind: null` and positional params under `data.list`
- **known text-only templates** (nowrap, lang, …) — consumed into `.text()`
  output and **not** listed
- **infoboxes** — not listed here; see `.infoboxes()`
- **citations** — not listed here; see `.references()`

## Infobox

```js
let inf = wtf('{{Infobox person|name=Jane|birth_place=Toronto}}').infobox()
inf.type() // 'person'
inf.get('Birth Place') // a Block — keys are case/space/underscore-insensitive
inf.get('nope') // undefined
inf.getFirst(['dob', 'birth_date']) // first key that exists, or undefined
inf.getAll(['name', 'birth_place']).text() // ['Jane', 'Toronto']
inf.image() // Image | undefined
inf.images() // every image field
inf.coordinates() // Coordinate | null
inf.links() // links in any field
inf.json() // { template: 'Infobox person', kind: 'infobox', text: '', data: { name: { text }, … } }
```

## Table

```js
let t = wtf('{| class=wikitable\n! name !! age\n|-\n| jane || 40\n|}').tables()[0]
t.rows() // [{ name: 'jane', age: '40' }]  — plain strings, keyed by normalised header
t.cols() // ['name', 'age']
t.getRows('name') // ['jane']
t.getRows(['name', 'age']) // [['jane', '40']]
t.headers().text() // ['name', 'age']
t.cells() // every cell as a Block
t.json() // { rows: [{ name: { text }, … }], headers: [{ text }] }
t.links()
```

Tables without headers get `col1`, `col2`, … keys. `.text()` returns `''`.

## List

- `.lines()` / `.items()` → `Collection<Block>` — one per bullet, nested items flattened
- `.links()`
- `.json()` → `{ items: [{ text, links? }] }`
- `.text()` → one ` * item` per line

## Reference

- `.title()` → `string` — best-effort human title of the citation
- `.kind` → `'citation'` for `{{cite …}}` templates, else `null`
- `.json()` → `{ template, kind, text, data, name?, group? }`
- `.links()`, `.wikitext()`; `.text()` returns `''`

## Coordinate (plain object, not a class)

From `{{coord}}` templates and infobox lat/long fields, merged into one list:

```js
wtf('{{coord|43.6|-79.4|display=title}}').coordinates()
// [{ lat: 43.6, lon: -79.4, display: 'title', wiki: '{{coord|43.6|-79.4|display=title}}' }]
```

Always `lat` / `lon`, signed decimals (in ≤ v10 the infobox entries used `lng` — see gotchas).

## Removed in v11

These appeared in older docs and no longer exist: Section navigation
(`.children()`, `.parent()`, `.nextSibling()`, `.previousSibling()`,
`.remove()`), the singular accessors other than `section`/`infobox`
(`.sentence()`, `.paragraph()`, `.category()`, …), `.plaintext()` and `.keyValue()`
aliases, `Link.site()` (use `.href()`), and metadata _methods_ like
`.title()` (now the `.title` property). See `changelog.md`.
