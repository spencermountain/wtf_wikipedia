/* eslint-disable no-console,no-duplicate-imports */

// type-only test - compiled by `npm run test:types`, never executed
import wtf from 'wtf_wikipedia'
import type {
  Document,
  Section,
  Infobox,
  Template,
  Table,
  Reference,
  Paragraph,
  Image,
  Link,
  List,
  Sentence,
  Block,
  Collection,
  SectionCollection,
  DocumentOptions,
  TemplateJson,
  InfoboxJson,
  LinkJson,
  ImageJson,
  FormattingJson,
  Coordinate,
  Models,
  Plugin,
} from 'wtf_wikipedia'

// ---- the factory ----
const opts: DocumentOptions = { title: 'Toronto', lang: 'en', pageID: 64646, domain: 'wikipedia.org' }
const doc: Document = wtf('some [[wiki]] text', opts)
const bare: Document = wtf('hello')

// ---- document accessors ----
const cats: string[] = doc.categories()
const secs: SectionCollection = doc.sections()
const sec: Section = doc.section('History')
const sens: Collection<Sentence> = doc.sentences()
const imgs: Collection<Image> = doc.images()
const infos: Infobox[] = doc.infoboxes()
const info1: Infobox | null = doc.infobox()
const tmpls: Template[] = doc.templates('coord')
const tmpl1: Template | null = doc.template('coord')
const lnk1: Link | null = doc.link('Toronto')
const coords: Coordinate[] = doc.coordinates()
const opts2: DocumentOptions = doc.options()
const viaNs: wtf.Document = doc // namespace-style type access
console.log(viaNs)
const title: string | null = doc.title
const ns: string | number | null = doc.namespace
const url: string | null = doc.url()
const plain: string = doc.text()
const j = doc.json('sm')
const t: unknown = j.title // json() allows property access
console.log(cats, secs, sec, sens, imgs, infos, info1, tmpls, tmpl1, lnk1, coords, opts2, title, ns, url, plain, t, bare)

// ---- section accessors ----
const secTitle: string = sec.title()
const secDepth: number = sec.depth()
const secIndex: number | null = sec.index()
const paras: Paragraph[] = sec.paragraphs()
const secRefs: Collection<Reference> = sec.references()
console.log(secTitle, secDepth, secIndex, paras, secRefs)

// ---- infobox ----
const info = infos[0]
if (info) {
  const name: string | undefined = info.get('name')?.text() // get returns one Block
  const firstOf: Block | undefined = info.getFirst(['name', 'birth_place'])
  const allOf: Collection<Block> = info.getAll(['name', 'birth_place'])
  const preferred: Image | undefined = info.image()
  const ibj: InfoboxJson = info.json()
  const geo: Coordinate | null = info.coordinates()
  console.log(name, firstOf, allOf, preferred, ibj, geo)
}

// ---- table / list / link / sentence / image / reference / template ----
declare const table: Table
const cols: string[] = table.cols()
const rows: Record<string, string>[] = table.rows()
const cells: Collection<Block> = table.cells()
declare const list: List
const lines: Collection<Block> = list.lines()
const lineText: string | undefined = lines[0]?.text()
declare const link: Link
const lj: LinkJson = link.json()
const page: string | undefined = lj.page
declare const s2: Sentence
const b: FormattingJson[] = s2.bolds()
declare const img2: Image
const ij: ImageJson = img2.json()
const file: string = ij.file
declare const ref: Reference
const refTitle: string = ref.title()
declare const tmpl2: Template
const tj: TemplateJson = tmpl2.json()
const tName: string = tj.template
console.log(cols, rows, cells, lineText, page, b, file, refTitle, tName)

// ---- fetch overloads ----
wtf.fetch('Toronto').then((d) => {
  if (d && !Array.isArray(d)) console.log(d.title)
})
wtf.fetch('Toronto', 'fr').then((d) => d && console.log(d))
wtf
  .fetch(['Toronto', 'Vancouver'], { follow_redirects: false, origin: '*' })
  .then((ds: Document[]) => console.log(ds.length))
wtf.fetch(64646, { lang: 'en' }).then((d) => d && console.log(d))
// @ts-expect-error - the callback form was removed
wtf.fetch(64646, { lang: 'en' }, (err: Error, d: Document) => console.log(err, d))

// ---- plugin authoring ----
declare module 'wtf_wikipedia' {
  interface Document {
    shout(): string
  }
  interface Sentence {
    shout(): string
  }
}
const shout: Plugin = (models: Models, templates, infoboxes) => {
  models.Doc.prototype.shout = function () {
    return this.text().toUpperCase()
  }
  models.Sentence.prototype.shout = function () {
    return this.text().toUpperCase()
  }
  templates['my-tmpl'] = () => ''
  infoboxes['my-box'] = true
  // @ts-expect-error - models.http was removed; plugins use their own fetch
  models.http('https://example.com')
}
const lib = wtf.extend(shout)
const loud: string = lib('hello').shout()
const v: string = wtf.version
console.log(loud, v)

// Namespace IDs from MediaWiki are numeric, including main namespace 0.
const numericNamespace: string | number | null = wtf('', { namespace: 0 }).namespace
const aliasNamespace: string | number | null = wtf('', { ns: 0 }).namespace
console.log(numericNamespace, aliasNamespace)
