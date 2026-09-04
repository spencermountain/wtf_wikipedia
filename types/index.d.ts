
declare class Image {
  alt(): string
  caption(): string
  file(): string
  format(): string | null
  json(options?: object): ImageJson
  links(): Link[]
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
  citations(clue?: number): Reference[]
  citation(clue?: number): Reference | null
  coordinate(clue?: number): Coordinate | null
  coordinates(clue?: number): Coordinate[]
  debug(): Document
  domain(str?: string): string | null
  images(clue?: string | number): Image[]
  image(clue?: string | number): Image | null
  infoboxes(clue?: string | number): Infobox[]
  infobox(clue?: string | number): Infobox | null
  interwiki(clue?: number): Link[]
  isDisambig(): boolean
  isDisambiguation(): boolean
  isRedirect(): boolean
  isStub(): boolean
  json(options?: object | 'sm' | 'md' | 'lg'): Record<string, unknown>
  lang(lang?: string): string | null
  language(lang?: string): string | null
  links(clue?: string | number): Link[]
  link(clue?: string | number): Link | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
  namespace(ns?: string): string | null
  ns(ns?: string): string | null
  options(): DocumentOptions
  pageID(id?: number): number | null
  paragraph(clue?: string | number): Paragraph | null
  paragraphs(clue?: string | number): Paragraph[]
  plaintext(options?: object): string
  redirect(): Record<string, unknown> | null
  redirects(): Record<string, unknown> | null
  redirectsTo(): Record<string, unknown> | null
  redirectTo(): Record<string, unknown> | null
  references(clue?: number): Reference[]
  reference(clue?: number): Reference | null
  section(clue?: string | number): Section | null
  sections(clue?: string | number): Section[]
  sentence(clue?: number): Sentence | null
  sentences(clue?: string | number): Sentence[]
  tables(clue?: number): Table[]
  table(clue?: number): Table | null
  templates(clue?: string | number): Template[]
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
  // a string clue looks a child section up by title; without one you get the array
  children(clue: string): Section | null | undefined
  children(clue?: number): Section[] | null
  citations(clue?: number): Reference[]
  citation(clue?: number): Reference | null
  coordinates(clue?: number): Coordinate[]
  coordinate(clue?: number): Coordinate | null
  depth(): number
  images(clue?: number): Image[]
  image(clue?: number): Image | null
  indentation(): number
  index(): number | null
  infoboxes(clue?: string | number): Infobox[]
  infobox(clue?: string | number): Infobox | null
  interwiki(): Link[]
  json(options?: object): Record<string, unknown>
  last(): Section | null
  lastSibling(): Section | null
  links(clue?: string | number): Link[]
  link(clue?: string | number): Link | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
  next(): Section | null
  nextSibling(): Section | null
  paragraphs(clue?: number): Paragraph[]
  paragraph(clue?: number): Paragraph | null
  parent(): Section | null
  previous(): Section | null
  previousSibling(): Section | null
  references(clue?: number): Reference[]
  reference(clue?: number): Reference | null
  remove(): null | Document
  sections(clue: string): Section | null | undefined
  sections(clue?: number): Section[] | null
  sentences(clue?: number): Sentence[]
  sentence(clue?: number): Sentence | null
  tables(clue?: number): Table[]
  table(clue?: number): Table | null
  templates(clue?: string | number): Template[]
  template(clue?: string | number): Template | null
  text(options?: object): string
  title(): string
  wikitext(): string
}

declare class Infobox {
  /** the raw key-value data of the infobox, as Sentence objects */
  data: Record<string, Sentence>
  get(key: string): Sentence
  get(keys: string[]): Sentence[]
  get(): Sentence
  image(): Image | null
  images(): Image | null
  json(options?: object): Record<string, unknown>
  keyValue(): Record<string, string>
  links(clue?: string): Link[]
  template(): string
  text(): string
  type(): string
  wikitext(): string
  coordinates(): { template: string; lat: number; lon: number } | null
}

declare class Template {
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
  links(n?: string): Link[]
  text(): string
  wikitext(): string
}

declare class Reference {
  json(options?: object): Record<string, unknown>
  links(): Link[]
  text(): string
  title(): string
  wikitext(): string
}

declare class Paragraph {
  citations(clue?: number): Reference[]
  citation(clue?: number): Reference | null
  images(clue?: number): Image[]
  image(clue?: number): Image | null
  interwiki(): Link[]
  json(options?: object): Record<string, unknown>
  links(clue?: string | number): Link[]
  link(clue?: string | number): Link | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
  references(clue?: number): Reference[]
  reference(clue?: number): Reference | null
  sentences(clue?: number): Sentence[]
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
  wiki(str?: string): string | undefined
  type(str?: string): string
  site(str?: string): string
  href(): string
}

declare class List {
  json(options?: object): Record<string, unknown>[]
  lines(): Sentence[]
  links(clue?: string): Link[]
  text(): string
  wikitext(): string
}

declare class Sentence {
  bold(clue?: number): string | null
  bolds(clue?: number): string[]
  interwiki(): Link[]
  isEmpty(): boolean
  italic(clue?: number): string | null
  italics(clue?: number): string[]
  json(options?: object): Record<string, unknown>
  link(clue?: string | number): Link | null
  links(clue?: string): Link[]
  plaintext(str?: string): string
  text(str?: string): string
  wikitext(): string
}

export default wtf

// The classes below are exposed for typing and plugin development only.
// At runtime the default export (`wtf`) is a function carrying just
// .fetch/.extend/.plugin/.version — the classes are NOT attached to it.
// Import them as types: `import type { Document } from 'wtf_wikipedia'`.
export type {
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

type FetchOptions = {
  path?: string | undefined;
  wiki?: string | undefined;
  domain?: string | undefined;
  follow_redirects?: boolean | undefined;
  lang?: string | undefined;
  origin?: string | undefined;
  noOrigin?: boolean | undefined;
  userAgent?: string | undefined;
  "User-Agent"?: string | undefined;
  "Api-User-Agent"?: string | undefined;
};

type FetchCallback<T> = (...args: [err: Error, result: null] | [err: null, result: FetchResult<T>]) => void;

declare function fetch<T extends string | number | string[] | number[] | URL>(
  title: T,
  options?: FetchOptions | string | undefined, // a string is a language-code, like 'en'
  callback?: FetchCallback<T>
): Promise<FetchResult<T>>;

type FetchResult<T> = T extends unknown[]
  ? Document[]
  : Document | null;

/** options for `wtf(text, options)` - metadata about the page, all optional */
type DocumentOptions = {
  title?: string
  pageID?: number
  id?: number
  namespace?: string
  ns?: string
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

/** the parsed data of a template. `template` is its lower-cased name */
type TemplateJson = {
  template?: string
  [key: string]: unknown
}

/** the json() shape of a Link */
type LinkJson = {
  text?: string
  type: 'internal' | 'interwiki' | 'external'
  page?: string
  wiki?: string
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
  fetch: typeof fetch
  extend: typeof extend
  plugin: typeof extend
  version: string
}

// private aliases, so the namespace below can re-expose each type under `wtf.*`
// (alias declarations keep the namespace type-only, which lets it merge with the const)
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
declare namespace wtf {
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

declare function extend(fn: Plugin): Wtf
