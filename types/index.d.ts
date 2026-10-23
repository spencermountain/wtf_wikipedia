import type {
  Collection,
  CollectionItem,
  LinkCollection,
  SectionCollection,
  TemplateCollection,
  InfoboxCollection,
} from './plural-wrapper.js'

type JsonFormat = 'sm' | 'md' | 'lg' | 'xl'

type FormattingJson = { text: string; wiki?: string; start: number; end: number }

declare class Image {
  alt(): string
  caption(): string
  file(): string
  format(): string | null
  json(format?: JsonFormat): ImageJson
  links(): LinkCollection
  src(): string
  text(): string
  thumbnail(size?: number): string
  url(): string
  wikitext(): string
}

declare class Document {
  categories(): string[]
  citations(): Collection<Reference>
  coordinates(): Coordinate[]
  debug(): Document
  domain: string | null
  images(): Collection<Image>
  infoboxes(): InfoboxCollection
  infobox(): Infobox | null
  interwiki(): Link[]
  isDisambig(): boolean
  isDisambiguation(): boolean
  isRedirect(): boolean
  isStub(): boolean
  json(format?: JsonFormat): Record<string, unknown>
  language: string | null
  links(): LinkCollection
  lists(): Collection<List>
  namespace: string | number | null
  options(): DocumentOptions
  pageID: number | null
  paragraphs(): Paragraph[]
  redirect(): LinkJson | null
  redirectsTo(): LinkJson | null
  redirectTo(): LinkJson | null
  references(): Collection<Reference>
  section(clue?: string | number): Section
  sections(): SectionCollection
  sentence(): Sentence | undefined
  sentences(): Collection<Sentence>
  tables(): Collection<Table>
  templates(clue?: string): TemplateCollection
  template(clue?: string): Template
  text(): string
  title: string | null
  url(): string | null
  wikidata: string | null
  wikitext(): string
  revisionID: number | null
  description: string | null
  timestamp: string | null
  pageImage: string | null
}

declare class Section {
  static empty(): Section
  citations(): Collection<Reference>
  coordinates(): Coordinate[]
  depth(): number
  images(): Collection<Image>
  index(): number | null
  infoboxes(): InfoboxCollection
  interwiki(): Link[]
  json(format?: JsonFormat): Record<string, unknown>
  links(): LinkCollection
  lists(): Collection<List>
  paragraphs(): Paragraph[]
  references(): Collection<Reference>
  sentences(): Collection<Sentence>
  tables(): Collection<Table>
  templates(clue?: string): TemplateCollection
  template(clue?: string): Template
  text(): string
  title(): string
  wikitext(): string
}

declare class Infobox {
  readonly kind: string | null
  get(key: string): Block | undefined
  getFirst(keys: string[]): Block | undefined
  getAll(keys: string[]): Collection<Block>
  image(): Image | undefined
  images(): Collection<Image>
  json(format?: JsonFormat): InfoboxJson
  links(): LinkCollection
  text(): string
  type(): string
  wikitext(): string
  coordinates(): Coordinate | null
}

declare class Template {
  static empty(): Template
  readonly kind: string | null
  readonly type: string
  isEmpty(): boolean
  json(format?: JsonFormat): TemplateJson
  links(): LinkCollection
  text(): string
  wikitext(): string
}

declare class Table {
  cols(): string[]
  rows(): Record<string, string>[]
  getRows(requested?: string | string[] | Record<string, unknown>):
    Record<string, string>[] | (string | undefined)[] | (string | undefined)[][]
  cells(): Collection<Block>
  headers(): Collection<Block>
  json(format?: JsonFormat): Record<string, unknown>
  links(): LinkCollection
  text(): string
  wikitext(): string
}

declare class Reference {
  readonly kind: string | null
  json(format?: JsonFormat): TemplateJson
  links(): LinkCollection
  text(): string
  title(): string
  wikitext(): string
}

declare class Paragraph {
  images(): Collection<Image>
  interwiki(): LinkJson[]
  json(format?: JsonFormat): Record<string, unknown>
  links(): LinkCollection
  lists(): Collection<List>
  sentences(): Collection<Sentence>
  text(): string
  wikitext(): string
}

declare class Link {
  text(): string
  json(format?: JsonFormat): LinkJson
  wikitext(): string
  page(): string
  anchor(): string
  wiki(): string
  type(): 'internal' | 'external' | 'interwiki'
  href(): string
}

declare class List {
  json(format?: JsonFormat): Record<string, unknown>
  lines(): Collection<Block>
  items(): Collection<Block>
  links(): LinkCollection
  text(): string
  wikitext(): string
}

declare class Block {
  links(): LinkCollection
  bolds(): FormattingJson[]
  italics(): FormattingJson[]
  text(): string
  json(format?: JsonFormat): BlockJson
  wikitext(): string
  isEmpty(): boolean
}

declare class Sentence {
  static empty(): Sentence
  bolds(): FormattingJson[]
  interwiki(): LinkJson[]
  isEmpty(): boolean
  italics(): FormattingJson[]
  json(format?: JsonFormat): Record<string, unknown>
  links(): LinkCollection
  text(): string
  wikitext(): string
}

type FetchOptions = {
  project?: string | undefined
  path?: string | undefined
  wiki?: string | undefined
  domain?: string | undefined
  follow_redirects?: boolean | undefined
  lang?: string | undefined
  origin?: string | undefined
  noOrigin?: boolean | undefined
  userAgent?: string | undefined
  'User-Agent'?: string | undefined
  'Api-User-Agent'?: string | undefined
}

type FetchCallback<T> = (...args: [err: Error, result: null] | [err: null, result: FetchResult<T>]) => void

type Fetch = <T extends string | number | string[] | number[] | URL>(
  title: T,
  options?: FetchOptions | string | undefined, // a string is a language-code, like 'en'
  callback?: FetchCallback<T>
) => Promise<FetchResult<T>>

type FetchResult<T> = T extends unknown[] ? Document[] : Document | null

/** options for `wtf(text, options)` - metadata about the page, all optional */
type DocumentOptions = {
  project?: string
  title?: string
  pageID?: number
  id?: number
  namespace?: string | number
  ns?: string | number
  lang?: string
  language?: string
  domain?: string
  wikidata?: string
  description?: string
  timestamp?: string
  revisionID?: number | string
  pageImage?: string
  userAgent?: string
  'User-Agent'?: string
  'Api-User-Agent'?: string
  [key: string]: unknown
}

/** Template identity, recognized parser kind, and parsed payload. */
type TemplateJson = {
  links?: LinkJson[]
  template: string
  kind: string | null
  wiki?: string
  text: string
  data: Record<string, any>
}

type BlockJson = {
  text: string
  wiki?: string
  links?: LinkJson[]
  bolds?: Array<FormattingJson>
  italics?: Array<FormattingJson>
}

type InfoboxJson = Omit<TemplateJson, 'data'> & {
  data: Record<string, BlockJson | BlockJson[]>
}

/** the json() shape of a Link */
type LinkJson = {
  wiki?: string
  text?: string
  type: 'internal' | 'interwiki' | 'external'
  page?: string
  interwiki?: string | { wiki?: string; lang: string }
  site?: string
  anchor?: string
}

/** the json() shape of an Image */
type ImageJson = {
  file: string
  wiki?: string
  domain?: string
  caption?: {
    text: string
    wiki?: string
    links?: LinkJson[]
    bolds?: FormattingJson[]
    italics?: FormattingJson[]
  }
  alt?: string
  [key: string]: unknown
}

/** a parsed coordinate, from a coord-template or an infobox */
type Coordinate = {
  wiki: string
  template?: string
  lat?: number
  lon?: number
  [key: string]: unknown
}

/** the classes handed to a plugin by `wtf.extend()`, so it can add methods to their prototypes */
type Models = {
  Doc: typeof Document
  Section: typeof Section
  Paragraph: typeof Paragraph
  Sentence: typeof Sentence
  Image: typeof Image
  Infobox: typeof Infobox
  Link: typeof Link
  List: typeof List
  Reference: typeof Reference
  Table: typeof Table
  Template: typeof Template
  /** the fetch helper wtf uses internally */
  http: (url: string, options?: object) => Promise<unknown>
  wtf: typeof wtf
}

/**
 * a plugin, for `wtf.extend(fn)`.
 * augment the class first, then add to its prototype:
 *   declare module 'wtf_wikipedia' { interface Document { shout(): string } }
 *   const shout: Plugin = (models) => {
 *     models.Doc.prototype.shout = function () { return this.text().toUpperCase() }
 *   }
 */
type Plugin = (models: Models, templates: Record<string, unknown>, infoboxes: Record<string, boolean>) => void

/**
 * the shape of the default export - the parser function, carrying
 * .fetch/.extend/.plugin/.version.
 * an interface, so plugins that add methods onto wtf itself can merge them in:
 *   declare module 'wtf_wikipedia' { interface Wtf { myHelper(): void } }
 */
export interface Wtf {
  (wiki: string, options?: DocumentOptions): Document
  fetch: Fetch
  extend: Extend
  plugin: Extend
  version: string
}

// private aliases, so the namespace below can re-expose each type under `wtf.*`
// (alias declarations keep the namespace type-only, which lets it merge with the const)
type Collection_<T extends CollectionItem> = Collection<T>
type LinkCollection_ = LinkCollection
type SectionCollection_ = SectionCollection
type TemplateCollection_ = TemplateCollection
type InfoboxCollection_ = InfoboxCollection
type Document_ = Document
type Section_ = Section
type Infobox_ = Infobox
type Template_ = Template
type Table_ = Table
type Reference_ = Reference
type Paragraph_ = Paragraph
type Image_ = Image
type Link_ = Link
type List_ = List
type Sentence_ = Sentence
type DocumentOptions_ = DocumentOptions
type JsonFormat_ = JsonFormat
type Block_ = Block
type BlockJson_ = BlockJson
type InfoboxJson_ = InfoboxJson
type TemplateJson_ = TemplateJson
type LinkJson_ = LinkJson
type ImageJson_ = ImageJson
type Coordinate_ = Coordinate
type Models_ = Models
type Plugin_ = Plugin
type Wtf_ = Wtf

declare const wtf: Wtf
// type-only: these are accessible as `wtf.Document` for typing, but are
// not runtime properties of the default export.
/* eslint-disable @typescript-eslint/no-shadow -- Public namespace aliases intentionally reuse exported type names. */
declare namespace wtf {
  export type Collection<T extends CollectionItem> = Collection_<T>
  export type LinkCollection = LinkCollection_
  export type SectionCollection = SectionCollection_
  export type TemplateCollection = TemplateCollection_
  export type InfoboxCollection = InfoboxCollection_

  export type Document = Document_
  export type Section = Section_
  export type Infobox = Infobox_
  export type Template = Template_
  export type Table = Table_
  export type Reference = Reference_
  export type Paragraph = Paragraph_
  export type Image = Image_
  export type Link = Link_
  export type List = List_
  export type Sentence = Sentence_
  export type DocumentOptions = DocumentOptions_
  export type JsonFormat = JsonFormat_
  export type Block = Block_
  export type BlockJson = BlockJson_
  export type InfoboxJson = InfoboxJson_
  export type TemplateJson = TemplateJson_
  export type LinkJson = LinkJson_
  export type ImageJson = ImageJson_
  export type Coordinate = Coordinate_
  export type Models = Models_
  export type Plugin = Plugin_
  export type Wtf = Wtf_
}
/* eslint-enable @typescript-eslint/no-shadow */

type Extend = (fn: Plugin) => Wtf

export default wtf

// The classes below are exposed for typing and plugin development only.
// At runtime the default export (`wtf`) is a function carrying just
// .fetch/.extend/.plugin/.version — the classes are NOT attached to it.
// Import them as types: `import type { Document } from 'wtf_wikipedia'`.
export type {
  JsonFormat,
  FormattingJson,
  Collection,
  LinkCollection,
  SectionCollection,
  TemplateCollection,
  InfoboxCollection,
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
  DocumentOptions,
  Block,
  BlockJson,
  InfoboxJson,
  TemplateJson,
  LinkJson,
  ImageJson,
  Coordinate,
  Models,
  Plugin,
}
