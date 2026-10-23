# v11 API updates

This records the obsolete methods removed from the TypeScript declarations after
the API refactor. The declaration cleanup did not remove runtime implementations;
these methods were already absent.

## Removed methods

The latest audit removed 48 signatures representing 47 distinct methods.
`Table.get()` previously had two overloads.

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

## Collection declaration cleanup

- Removed the obsolete generic collection `select()` and `isEmpty()` methods.
  A wrapper can still expose an item method of the same name; for example,
  `sentences().isEmpty()` returns one boolean per sentence.
- `map()`, `filter()`, and `slice()` return ordinary arrays.
- Sections, templates, infoboxes, references, and paragraphs return ordinary
  arrays, without collection-level `json()`, `text()`, or `wikitext()` methods.
- Wrapped item methods return one result per item, including `text()` and
  `wikitext()`. Empty collections return `[]`.

## Outstanding refactor issue

`Section.sentence()` still calls the removed `Paragraph.sentence()` method.
The declaration cleanup left this runtime issue unchanged.
