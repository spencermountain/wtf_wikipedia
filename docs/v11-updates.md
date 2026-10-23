# v11 API updates

This records the collection API changes, removed runtime methods, and obsolete
TypeScript declarations cleaned up after the API refactor.

## Selecting individual items

Most singular collection accessors have been removed. Use plural methods followed by
an array index, such as `doc.sentences()[0]`, or `.find()` for a named selection.
Three singular selectors remain:

| Retained method | Selection | When missing |
| --------------- | --------- | ------------ |
| `Document.section(titleOrIndex)` | Index or trimmed, case-insensitive title; defaults to index 0 | Empty `Section` |
| `Document.infobox()` | Most important infobox | `null` |
| `Infobox.image()` | Preferred infobox image | `undefined` |

Their plural counterparts, `sections()`, `infoboxes()`, and `images()`, remain
available. The TypeScript declarations retain these three selectors and remove
the other singular accessors.

```js
doc.section('Keilwellen-Verbindungen').text()
doc.sentences()[0]?.text()
doc.templates('short description')[0]?.json()
doc.infobox()?.image()?.url()
```

## Removed methods

The list includes both former overloads of `Table.get()`. Indexed access can
return `undefined`; use optional chaining when an item may be missing. Use
`.find()` when selecting by a predicate rather than an index. Alternatives that
use the containing document or section cover that wider scope. Missing sections
and templates produce `undefined` through array selection. `doc.section()` retains
its empty `Section` fallback when the title or index is missing.

### Document

- `sentence()` — use `sentences()[0]`.
- `template(name)` — use `templates(name)[0]`; omit the name to select the first template.
- `citation()` — use `citations()[0]` (or another array index).
- `coordinate()` — use `coordinates()[0]` (or another array index).
- `image()` — use `images()[0]` (or another array index).
- `lang()` — use the `language` property.
- `link()` — use `links()[0]` (or another array index).
- `list()` — use `lists()[0]` (or another array index).
- `ns()` — use the `namespace` property.
- `paragraph()` — use `paragraphs()[0]` (or another array index).
- `redirects()` — use `redirectTo()` for the redirect target.
- `reference()` — use `references()[0]` (or another array index).
- `table()` — use `tables()[0]` (or another array index).

### Section

- `template(name)` — use `templates(name)[0]`.
- `child()`
- `children()`
- `citation()` — use `citations()[0]` (or another array index).
- `coordinate()` — use `coordinates()[0]` (or another array index).
- `image()` — use `images()[0]` (or another array index).
- `infobox()` — use `infoboxes()[0]` (or another array index).
- `indentation()` — use `depth()`.
- `isEmpty()` — use `text() === ''` when checking for no readable text.
- `last()`
- `lastSibling()`
- `link()` — use `links()[0]` (or another array index).
- `list()` — use `lists()[0]` (or another array index).
- `next()`
- `nextSibling()`
- `paragraph()` — use `paragraphs()[0]` (or another array index).
- `parent()`
- `previous()`
- `previousSibling()`
- `reference()` — use `references()[0]` (or another array index).
- `remove()`
- `sections()` — use `doc.sections()` and `depth()` to determine hierarchy.
- `sentence()` — use `sentences()[0]`, which can be `undefined`.
- `table()` — use `tables()[0]` (or another array index).

Section navigation methods (`child()`, `children()`, `parent()`, sibling methods,
`last()`, `next()`, and `previous()`) have no direct replacement. Use the containing
document’s ordered `sections()` array and section `depth()` values to implement
the traversal you need. `remove()` has no direct replacement.

### Paragraph

- `citations()` — use the containing document or section’s `citations()`.
- `citation()` — use the containing document or section’s `citations()[0]`.
- `image()` — use `images()[0]` (or another array index).
- `link()` — use `links()[0]` (or another array index).
- `list()` — use `lists()[0]` (or another array index).
- `references()` — use the containing document or section’s `references()`.
- `reference()` — use the containing document or section’s `references()[0]`.
- `sentence()` — use `sentences()[0]`.

### Image

- `thumb()` — use `thumbnail(size)`.

### Table

- `get(key: string)` — use `getRows(key)` for values from one column.
- `get(keys: string[])` — use `getRows(keys)` for arrays of selected values, or `getRows({ name: true, year: true })` for keyed rows.
- `keyval()` — use `rows()` and explicitly map the desired key/value columns.
- `keyValue()` — use `rows()` and explicitly map the desired key/value columns.
- `keyvalue()` — use `rows()` and explicitly map the desired key/value columns.

### Block

- `isEmpty()` — use `text() === ''` to check for empty text, or `wikitext() === ''` to check for empty source markup.

### Sentence

- `isEmpty()` — use `text() === ''` to check for empty text.
- `bold()` — use `bolds()[0]?.text` for the first bold span.
- `italic()` — use `italics()[0]?.text` for the first italic span.
- `link()` — use `links()[0]` (or another array index).

### Template

- `isEmpty()` — use `json().template === ''` to recognize the empty-template placeholder; use `text() === ''` only to check rendered text.

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

- `Link.interwiki()` — use `type() === 'interwiki'` to identify interwiki links and `href()` for their resolved URL.
- `Link.site()` — use `href()` for the URL, or `json().site` for the stored external-link URL.
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

- `select()` — use indexing for one item, `.find()` for a matching item, or `.filter()` for multiple matches.
- `isEmpty()` — use `collection.length === 0`; item classes no longer expose `isEmpty()` either.
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
