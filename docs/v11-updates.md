# v11 API updates

This records the collection API changes and obsolete methods removed from the
TypeScript declarations after the API refactor. The declaration cleanup removed
signatures for methods that were already absent from the runtime.

## Removed methods

The list includes both former overloads of `Table.get()`.

### Document

- `citation()`
- `coordinate()`
- `image()`
- `lang()`
- `link()`
- `list()`
- `ns()`
- `paragraph()`
- `redirects()`
- `reference()`
- `table()`

### Section

- `child()`
- `children()`
- `citation()`
- `coordinate()`
- `image()`
- `infobox()`
- `indentation()` — use `depth()`.
- `isEmpty()`
- `last()`
- `lastSibling()`
- `link()`
- `list()`
- `next()`
- `nextSibling()`
- `paragraph()`
- `parent()`
- `previous()`
- `previousSibling()`
- `reference()`
- `remove()`
- `sections()`
- `sentence()` — use `sentences()[0]`, which can be `undefined`.
- `table()`

### Paragraph

- `citations()`
- `citation()`
- `image()`
- `link()`
- `list()`
- `references()`
- `reference()`
- `sentence()`

### Image

- `thumb()` — use `thumbnail(size)`.

### Table

- `get(key: string)`
- `get(keys: string[])`
- `keyval()`
- `keyValue()`
- `keyvalue()`

### Sentence

- `bold()`
- `italic()`
- `link()`

## Document methods changed to properties

Read these values directly and use assignment to update them. For example,
`doc.title()` becomes `doc.title`, and `doc.title('New title')` becomes
`doc.title = 'New title'`.

| Previous method | Current property |
| --------------- | ---------------- |
| `domain()`      | `domain`         |
| `language()`    | `language`       |
| `namespace()`   | `namespace`      |
| `pageID()`      | `pageID`         |
| `title()`       | `title`          |
| `wikidata()`    | `wikidata`       |
| `revisionID()`  | `revisionID`     |
| `description()` | `description`    |
| `timestamp()`   | `timestamp`      |
| `pageImage()`   | `pageImage`      |

`pageImage` is a filename string or `null`, rather than an `Image` instance.
The removed `lang()` and `ns()` aliases are replaced by the `language` and
`namespace` properties.

## Earlier Link declaration cleanup

- Removed `Link.interwiki()` and `Link.site()`.
- Removed setter arguments from `Link.text()`, `Link.page()`, `Link.anchor()`,
  and `Link.type()`. These remain getter methods.
- Removed the obsolete `LinkCollection.pages()` declaration; use `.page()`.

## Plural collections

Links, images, lists, sentences, infoboxes, references, tables, and templates now
use Array subclasses that forward item methods:

```js
doc.links().page()               // array of page names
doc.images().thumbnail(150)      // array of thumbnail URLs
doc.sentences().text()           // array of sentence strings
doc.infoboxes().json()           // array of infobox JSON objects
doc.references().title()         // array of reference titles
doc.tables().json()              // array of table JSON objects
doc.templates('example').json()  // filtered template collection
```

Every `.links()` accessor returns a Links collection, including links from
images, lists, tables, infoboxes, templates, references, sentences, and blocks.
`.citations()` returns the same collection type as `.references()`.

The collections retain indexing, iteration, `length`, and native Array methods.
`Array.isArray(collection)` returns `true`.

- Removed the obsolete generic collection `select()` and `isEmpty()` methods.
  A wrapper can still expose an item method of the same name; for example,
  `sentences().isEmpty()` returns one boolean per sentence.
- `map()`, `filter()`, and `slice()` return ordinary arrays.
- Sections and paragraphs still return ordinary
  arrays, without collection-level `json()`, `text()`, or `wikitext()` methods.
- Wrapped item methods return one result per item, including `text()` and
  `wikitext()`. Empty collections return `[]` from forwarded methods.
- Arguments are forwarded to every item. For example, `.json('xl')` passes
  `'xl'` to each item's `.json()` method.
- Results are not flattened: `.lists().items()` returns one Blocks collection
  per list.
- Explicit collection methods and native Array methods take precedence over
  generated methods. Property getters, such as `Template.type` and `.kind`,
  are not forwarded; use `.map()` to read them.

After filtering, use `.map()` to serialize individual items:

```js
doc.links().filter(link => link.type() === 'internal').map(link => link.json())
```

## Block access

`List.items()`, `List.lines()`, `Table.cells()`, and `Table.headers()` return
Blocks collections containing Block instances. Replace raw property access
with methods:

```js
list.items()[0].text()  // previously .text
list.items().text()     // array of item strings
table.headers().text()  // array of header strings
table.cells().json()    // array of cell JSON objects
```

Use `.wikitext()` for a block's original markup and `.links()` for its Links
collection. `.json()` returns plain data; `.json('xl')` retains source markup.

## Infobox field access

- `get(key)` returns the first Block for that field, or `undefined` if missing.
- `getFirst(keys)` returns the first available Block in requested-key order,
  or `undefined` when no field matches.
- `getAll(keys)` returns a flat Blocks collection, preserving all values in
  requested-key order and skipping missing fields. No matches produce an empty
  collection.

```js
box.get('name')?.text()                    // previously .text
box.getFirst(['name', 'title'])?.text()    // string or undefined
box.getAll(['name', 'title']).text()       // array of strings
box.getAll(['missing']).json()            // []
```

For a multi-value field, `get()` selects its first value; use `getAll([key])`
to retain every value. Infobox `.json()` continues to expose plain field data.

## Plugin methods

Wrappers refresh after each synchronous `wtf.extend()` or `wtf.plugin()` callback.
New item methods become available on both existing and newly created collections,
including empty collections. Explicit collection methods and native Array methods
still take precedence.

Forwarders look up the item method on every call, so replacing an item method also
updates collection behavior. Deleting item methods does not remove their collection
forwarders. Prototype changes made outside plugin callbacks do not trigger a refresh.
