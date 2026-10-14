# Writing a plugin

A plugin is a function. `wtf.extend(fn)` calls it once with three arguments:

```js
const myPlugin = (models, templates, infoboxes) => { ... }
wtf.extend(myPlugin)
```

| argument | what it is |
| --- | --- |
| `models` | the classes: `{ Doc, Section, Paragraph, Sentence, Image, Infobox, Link, List, Reference, Table, Template, http, wtf }` — note the Document class is named **`Doc`** here |
| `templates` | the template-parser registry — assign to add custom `{{...}}` parsers |
| `infoboxes` | registry of which template names count as infoboxes |

## Adding methods

```js
wtf.extend((models) => {
  models.Doc.prototype.isPerson = function () {
    return Boolean(this.categories().find((cat) => /people/i.test(cat)))
  }
})
let doc = await wtf.fetch('Stephen Harper')
doc.isPerson()
```

Any class works the same way: `models.Sentence.prototype.shout = ...`.
`models.http(url, opts?)` is the library's fetch helper (promise of parsed json).
`models.wtf` is the library itself, for adding statics: `models.wtf.myHelper = ...`.

## Custom template parsers

Four registration styles, from most to least control:

```js
wtf.extend((models, templates) => {
  // 1. a function: receive raw tmpl text, push parsed data, return display text
  templates.foo = (tmpl, list, parse) => {
    let obj = parse(tmpl)   // generic {{a|b|c}} → json parser
    list.push(obj)          // keep it (shows up in .templates())
    return 'shown text'     // rendered into .text() ('' to hide)
  }
  // 2. array: name the positional params '{{bar|x|y}}' → {a:'x', b:'y'}
  templates.bar = ['a', 'b', 'c']
  // 3. number: render the nth param as text '{{baz|zero|one}}' → 'zero'
  templates.baz = 0
  // 4. string: constant replacement '{{asterisk}}' → '*'
  templates.asterisk = '*'
})
```

Unknown templates are kept in `.templates()` as data but render as `''` in
`.text()`. To handle them globally, pass `templateFallbackFn` as a document
option (see api.md).

Registering infoboxes:

```js
wtf.extend((models, templates, infoboxes) => {
  Object.assign(infoboxes, { person: true, place: true, thing: true })
})
```

## TypeScript

Augment the interface you extend, then implement. Methods merge into every
`Document` (or `Sentence`, etc) the compiler sees:

```ts
import type { Plugin, Models } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document {
    isPerson(): boolean
  }
  // statics on wtf itself merge through the Wtf interface:
  interface Wtf {
    myHelper(title: string): Promise<string | null>
  }
}

const myPlugin: Plugin = (models: Models) => {
  models.Doc.prototype.isPerson = function () { ... }
  models.wtf.myHelper = async (title) => { ... }
}
export default myPlugin
```

Things that do **not** work (verified — save yourself the attempt):
- augmenting `namespace wtf { ... }` from a plugin — statics only merge via
  `interface Wtf`
- value-importing the classes (`import { Document }`) — they are type-only
  exports; get real classes from the `models` argument at runtime

## Publishing a plugin package

Copy the pattern from `plugins/html/` in this repo:

- `types/index.d.ts` — ESM declarations: the augmentation + `export default plugin`
- `types/index.d.cts` — CommonJS mirror:

  ```ts
  type Esm = typeof import('./index.js', { with: { 'resolution-mode': 'import' } })
  declare const plugin: Esm['default']
  export = plugin
  ```

- `package.json` exports map with per-condition types:

  ```json
  "exports": {
    ".": {
      "import":  { "types": "./types/index.d.ts",  "default": "./src/index.js" },
      "require": { "types": "./types/index.d.cts", "default": "./builds/<name>.cjs" }
    }
  }
  ```

- peerDependency `"wtf_wikipedia": ">=11.0.0"` — the `Plugin`/`Wtf` types the
  declarations import first shipped in v11.
