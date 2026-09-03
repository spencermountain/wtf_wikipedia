// type-only test - compiled by `npm run test:types`, never executed
import wtf from 'wtf_wikipedia'
import type {
  Document, Section, Infobox, Template, Table, Reference, Paragraph,
  Image, Link, List, Sentence, DocumentOptions, TemplateJson, LinkJson,
  ImageJson, Coordinate, Models, Plugin,
} from 'wtf_wikipedia'

// ---- the factory ----
const opts: DocumentOptions = { title: 'Toronto', lang: 'en', pageID: 64646, domain: 'wikipedia.org' }
const doc: Document = wtf('some [[wiki]] text', opts)
const bare: Document = wtf('hello')

// ---- document accessors ----
const cats: string[] = doc.categories()
const secs: Section[] = doc.sections()
const sec: Section | null = doc.section('History')
const sens: Sentence[] = doc.sentences()
const sen: Sentence | null = doc.sentence(0)
const imgs: Image[] = doc.images()
const infos: Infobox[] = doc.infoboxes('person')
const tmpls: Template[] = doc.templates('coord')
const coords: Coordinate[] = doc.coordinates()
const opts2: DocumentOptions = doc.options()
const viaNs: wtf.Document = doc // namespace-style type access
console.log(viaNs)
const title: string | null = doc.title()
const url: string | null = doc.url()
const plain: string = doc.plaintext()
const j = doc.json('sm')
const t: unknown = j.title // json() allows property access
console.log(cats, secs, sec, sens, sen, imgs, infos, tmpls, coords, opts2, title, url, plain, t, bare)

// ---- section navigation + singulars ----
if (sec) {
  const kids: Section[] | null = sec.children()
  const kid: Section | null | undefined = sec.children('Early life')
  const p: Paragraph | undefined = sec.paragraph(0)
  const tm: Template | undefined = sec.template('coord')
  const rf: Reference | undefined = sec.reference(0)
  console.log(kids, kid, p, tm, rf)
}

// ---- infobox ----
const info = infos[0]
if (info) {
  const name: string = info.get('name').text() // string key -> one Sentence
  const both: Sentence[] = info.get(['name', 'birth_place']) // array key -> Sentence[]
  const kv: Record<string, string> = info.keyValue()
  const raw: Record<string, Sentence> = info.data
  const geo: { template: string; lat: number; lon: number } | null = info.coordinates()
  console.log(name, both, kv, raw, geo)
}

// ---- table / list / link / sentence / image / reference / template ----
declare const table: Table
const col: (string | null)[] = table.get('Position')
const rows: Record<string, string>[] = table.get(['Position', 'Player'])
const kvRows: Record<string, string>[] = table.keyValue()
declare const list: List
const lines: Sentence[] = list.lines()
const lineText: string = lines[0]!.text()
declare const link: Link
const lj: LinkJson = link.json()
const page: string | undefined = lj.page
declare const s2: Sentence
const b: string | undefined = s2.bold(0)
declare const img2: Image
const ij: ImageJson = img2.json()
const file: string = ij.file
declare const ref: Reference
const refTitle: string = ref.title()
declare const tmpl2: Template
const tj: TemplateJson = tmpl2.json()
const tName: string | undefined = tj.template
console.log(col, rows, kvRows, lineText, page, b, file, refTitle, tName)

// ---- fetch overloads ----
wtf.fetch('Toronto').then((d) => { if (d && !Array.isArray(d)) console.log(d.title()) })
wtf.fetch('Toronto', 'fr').then((d) => d && console.log(d))
wtf.fetch(['Toronto', 'Vancouver'], { follow_redirects: false, origin: '*' }).then((ds: Document[]) => console.log(ds.length))
wtf.fetch(64646, { lang: 'en' }, (err, d) => { console.log(err, d) })

// ---- plugin authoring ----
declare module 'wtf_wikipedia' {
  interface Document { shout(): string }
  interface Sentence { shout(): string }
}
const shout: Plugin = (models: Models, templates, infoboxes) => {
  models.Doc.prototype.shout = function () { return this.text().toUpperCase() }
  models.Sentence.prototype.shout = function () { return this.text().toUpperCase() }
  templates['my-tmpl'] = () => ''
  infoboxes['my-box'] = true
  models.http('https://example.com').then((res: unknown) => console.log(res))
}
const lib = wtf.extend(shout)
const loud: string = lib('hello').shout()
const v: string = wtf.version
console.log(loud, v)
