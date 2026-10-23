type CollectionItem = {
  json: (...args: any[]) => any
  text: (...args: any[]) => string
  wikitext: () => string
}

interface Collection<T extends CollectionItem> extends Array<T> {
  isEmpty(): boolean
  select(selector?: number): this
  filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): Collection<S>
  filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): this
  slice(start?: number, end?: number): this
  json(...args: Parameters<T['json']>): ReturnType<T['json']>[]
  text(options?: object): string
  wikitext(): string
}

interface LinkCollection extends Collection<Link> {
  select(selector?: string | number): this
  pages(): string[]
}

interface SectionCollection extends Collection<Section> {
  select(selector?: string | number): this
}

interface TemplateCollection extends Collection<Template> {
  select(selector?: string | number): this
}

interface InfoboxCollection extends Collection<Infobox> {
  select(selector?: string | number): this
}

declare class Image {
  alt(): string
  caption(): string
  file(): string
  format(): string | null
  json(options?: object): ImageJson
  links(selector?: string | number): LinkCollection
  src(): string
  text(): string
  thumb(size?: number): string
  thumbnail(size?: number): string
  url(): string
  wikitext(): string
}

declare class Document {
  categories(clue?: number): string[]
  category(clue?: number): string | null
  citations(clue?: number): Collection<Reference>
  citation(clue?: number): Reference | null
  coordinate(clue?: number): Coordinate | null
  coordinates(clue?: number): Coordinate[]
  debug(): Document
  domain(str?: string): string | null
  images(selector?: number): Collection<Image>
  image(selector?: number): Image | null
  infoboxes(clue?: string | number): InfoboxCollection
  infobox(clue?: string | number): Infobox | null
  interwiki(selector?: string | number): LinkCollection
  isDisambig(): boolean
  isDisambiguation(): boolean
  isRedirect(): boolean
  isStub(): boolean
  json(options?: object | 'sm' | 'md' | 'lg'): Record<string, unknown>
  lang(lang?: string): string | null
  language(lang?: string): string | null
  links(selector?: string | number): LinkCollection
  link(clue?: string | number): Link | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
  namespace(ns?: string | number): string | number | null
  ns(ns?: string | number): string | number | null
  options(): DocumentOptions
  pageID(id?: number): number | null
  paragraph(selector?: number): Paragraph | null
  paragraphs(selector?: number): Collection<Paragraph>
  redirect(): Record<string, unknown> | null
  redirects(): Record<string, unknown> | null
  redirectsTo(): Record<string, unknown> | null
  redirectTo(): Record<string, unknown> | null
  references(clue?: number): Collection<Reference>
  reference(clue?: number): Reference | null
  section(clue?: string | number): Section
  sections(clue?: string | number): SectionCollection
  sentence(clue?: number): Sentence | null
  sentences(selector?: number): Collection<Sentence>
  tables(clue?: number): Table[]
  table(clue?: number): Table | null
  templates(clue?: string | number): TemplateCollection
  template(clue?: string | number): Template | null
  text(options?: object): string
  title(str?: string): null | string
  url(): string | null
  wikidata(id?: string): string | null
  wikitext(): string
  revisionID(id?: number): number | null
  description(desc?: string): string | null
  timestamp(iso?: string): string | null
  pageImage(img?: string): Image
}

declare class Section {
  static empty(): Section
  isEmpty(): boolean
  child(selector?: string | number): Section | null
  children(selector?: string | number): SectionCollection
  citations(clue?: number): Collection<Reference>
  citation(clue?: number): Reference | null
  coordinates(clue?: number): Coordinate[]
  coordinate(clue?: number): Coordinate | null
  depth(): number
  images(clue?: number): Collection<Image>
  image(clue?: number): Image | null
  indentation(): number
  index(): number | null
  infoboxes(clue?: string | number): InfoboxCollection
  infobox(clue?: string | number): Infobox | null
  interwiki(selector?: string | number): LinkCollection
  json(options?: object): Record<string, unknown>
  last(): Section | null
  lastSibling(): Section | null
  links(selector?: string | number): LinkCollection
  link(clue?: string | number): Link | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
  next(): Section | null
  nextSibling(): Section | null
  paragraphs(clue?: number): Collection<Paragraph>
  paragraph(selector?: number): Paragraph | null
  parent(): Section | null
  previous(): Section | null
  previousSibling(): Section | null
  references(clue?: number): Collection<Reference>
  reference(clue?: number): Reference | null
  remove(): null | Document
  sections(selector?: string | number): SectionCollection
  sentences(clue?: number): Collection<Sentence>
  sentence(clue?: number): Sentence | null
  tables(clue?: number): Table[]
  table(clue?: number): Table | null
  templates(clue?: string | number): TemplateCollection
  template(clue?: string | number): Template | null
  text(options?: object): string
  title(): string
  wikitext(): string
}

declare class Infobox {
  readonly kind: string | null
  /** the raw key-value data of the infobox, as Sentence objects */
  data: Record<string, Sentence>
  get(key: string): Sentence
  get(keys: string[]): Sentence[]
  get(): Sentence
  image(): Image | null
  images(): Image[]
  json(options?: object): TemplateJson
  keyValue(): Record<string, string>
  links(selector?: string | number): LinkCollection
  template(): string
  text(): string
  type(): string
  wikitext(): string
  coordinates(): { template: string; lat: number; lon: number } | null
}

declare class Template {
  readonly kind: string | null
  readonly type: string
  isEmpty(): boolean
  json(): TemplateJson
  text(): string
  wikitext(): string
}

declare class Table {
  // a string key gets a flat column; an array of keys gets a row-list
  get(key: string): (string | null)[]
  get(keys: string[]): Record<string, string>[]
  json(options?: object): Record<string, unknown>[]
  keyval(options?: object): Record<string, string>[]
  keyValue(options?: object): Record<string, string>[]
  keyvalue(options?: object): Record<string, string>[]
  links(selector?: string | number): LinkCollection
  text(): string
  wikitext(): string
}

declare class Reference {
  readonly kind: string | null
  json(options?: object): TemplateJson
  links(selector?: string | number): LinkCollection
  text(): string
  title(): string
  wikitext(): string
}

declare class Paragraph {
  citations(clue?: number): Collection<Reference>
  citation(clue?: number): Reference | null
  images(clue?: number): Collection<Image>
  image(clue?: number): Image | null
  interwiki(selector?: string | number): LinkCollection
  json(options?: object): Record<string, unknown>
  links(selector?: string | number): LinkCollection
  link(clue?: string | number): Link | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
  references(clue?: number): Collection<Reference>
  reference(clue?: number): Reference | null
  sentences(clue?: number): Collection<Sentence>
  sentence(clue?: number): Sentence | null
  text(options?: object): string
  wikitext(): string
}

declare class Link {
  text(str?: string): string
  json(): LinkJson
  wikitext(): string
  page(str?: string): string
  anchor(str?: string): string
  wiki(): string
  interwiki(): string | { wiki: string; lang: string } | undefined
  type(str?: string): string
  site(str?: string): string
  href(): string
}

declare class List {
  json(options?: object): Record<string, unknown>[]
  lines(selector?: number): Collection<Sentence>
  links(selector?: string | number): LinkCollection
  text(): string
  wikitext(): string
}

declare class Sentence {
  static empty(): Sentence
  bold(clue?: number): string | null
  bolds(clue?: number): { text: string; start: number; end: number }[]
  interwiki(selector?: string | number): LinkCollection
  isEmpty(): boolean
  italic(clue?: number): string | null
  italics(clue?: number): { text: string; start: number; end: number }[]
  json(options?: object): Record<string, unknown>
  link(clue?: string | number): Link | null
  links(selector?: string | number): LinkCollection
  text(str?: string): string
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
  /** called for templates wtf doesn't recognise. return replacement text, or null to leave it */
  templateFallbackFn?: (body: string, list: object[], toJSON: Function, unused: null, doc: Document) => string | null
  [key: string]: unknown
}

/** Template identity, recognized parser kind, and parsed payload. */
type TemplateJson = {
  template: string
  kind: string | null
  wiki: string
  text: string
  data: Record<string, any>
}

/** the json() shape of a Link */
type LinkJson = {
  text?: string
  type: 'internal' | 'interwiki' | 'external'
  page?: string
  interwiki?: string | { wiki: string; lang: string }
  site?: string
  anchor?: string
}

/** the json() shape of an Image */
type ImageJson = {
  file: string
  thumb?: string
  url?: string
  caption?: string
  alt?: string
  links?: Link[]
  [key: string]: unknown
}

/** a parsed coordinate, from a coord-template or an infobox */
type Coordinate = {
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
  TemplateJson,
  LinkJson,
  ImageJson,
  Coordinate,
  Models,
  Plugin,
}
