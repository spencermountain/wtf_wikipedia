declare class Document {
  constructor(wiki?: string, options?: object)
  _pageID: any
  _namespace: any
  _lang: any
  _domain: any
  _title: any
  _type: string
  _redirectTo: any
  _wikidata: any
  _wiki: string
  _categories: string[]
  _sections: any[]
  _coordinates: any[]

  categories(clue?: number): string[]
  category(clue?: number): string | null
  citations(clue?: number): Reference[]
  coordinate(clue?: number): object | null
  coordinates(clue?: number): object[]
  debug(): Document
  domain(str?: string): string | null
  images(clue?: string | number): Image[]
  infoboxes(clue?: number): Infobox[]
  interwiki(clue?: number): string[]
  isDisambig: () => boolean
  isDisambiguation(): boolean
  isRedirect(): boolean
  json(options?: object): object
  lang: (lang?: string) => string | null
  language(lang?: string): string | null
  links(clue?: number): string[]
  lists(clue?: number): List[]
  namespace(ns?: string): string | null
  ns: (ns?: string) => string | null
  pageID(id?: number): number | null
  paragraph(clue?: string | number): Paragraph | null
  paragraphs(clue?: string | number): Paragraph[]
  plaintext: (options?: object) => string
  redirect: () => null | object
  redirects: () => null | object
  redirectsTo: () => null | object
  redirectTo(): null | object
  references(clue?: number): Reference[]
  section(clue?: string | number): Section | null
  sections(clue?: string | number): Section[]
  sentence(clue?: number): Sentence | null
  sentences(clue?: string | number): Sentence[]
  tables(clue?: number): List[]
  templates(clue?: number): List[]
  text(options?: object): string
  title(str?: string): null | string
  url(): string | null
  wikidata(id?: string): string | null
  wikitext(): string
}

declare class Section {
  private doc: Document
  private _title: string
  private data: object
  private depth: number

  children(clue?: string | number): Section | Section[] | null
  citations: () => object | object[]
  coordinates(): object | object[]
  depth(): number
  images(): Image | Image[]
  indentation(): number
  index(): number | null
  infoboxes(clue?: string | number): object | object[]
  interwiki(): object | object[]
  json(options: object): object
  last(): Section | null
  lastSibling(): Section | null
  links(clue?: string | number): object | object[]
  lists(): object | object[]
  next(): Section | null
  nextSibling(): Section | null
  paragraphs(): object | object[]
  parent(): Section | null
  previous(): Section | null
  previousSibling(): Section | null
  references(): object | object[]
  remove(): null | Document
  sections(clue?: string | number): Section | Section[] | null
  sentences(): object | object[]
  tables(): object | object[]
  templates(clue?: string | number): object | object[]
  text(options: object): string
  title(): string
  wikitext(): string
}

declare class Infobox {
  constructor(obj: object, wiki: string)
  _type: any
  _domain: any
  _wiki: string
  _data: any

  data: () => object
  get(keys: string | string[]): Sentence | undefined | unknown
  image(): Image | null
  images: () => Image | null
  json(options: object): object
  keyValue(): object
  links(clue?: string): Link[]
  template: () => string
  text(): string
  type(): string
  wikitext(): string
}

declare class Template {
  constructor(data: object, text?: string, wiki?: string)
  _data: any
  _text: string
  _wiki: string

  json(): object
  text(): string
  wikitext(): string
}

declare class Table {
  constructor(data: any[], wiki?: string)
  _data: any[]
  _wiki: string

  get(keys?: string | string[]): object
  json(options: object): object
  keyval(options: object): object
  keyValue(options: object): object
  keyvalue(options: object): object
  links(n?: string): Link[]
  text(): string
  wikitext(): string
}

declare class Reference {
  constructor(data: object, wiki: string)
  _data: any
  _wiki: string

  json(options?: object): object
  links(n?: string | number): Link[]
  text(): string
  title(): string
  wikitext(): string
}

declare class Paragraph {
  constructor(data: {
    wiki?: string | undefined
    lists?: List[] | undefined
    sentences?: Sentence[] | undefined
    images?: Image[] | undefined
    references?: Reference[] | undefined
  })
  _sentences: Sentence[]
  _references: Reference[]
  _lists: List[]
  _images: Image[]
  _wiki: string

  images(): Image[]
  interwiki(): Link[]
  json(options: object): object
  links(clue: string): Link[]
  lists(): List[]
  references(): Reference[]
  sentences(): Sentence[]
  text(options?: object): string
  wikitext(): string
}

declare class Image {
  constructor(data: {
    language?: string | undefined
    lang?: string | null | undefined
    domain?: string | undefined
    file?: string | undefined
    alt?: string | undefined
    caption?: Sentence | undefined
    wiki?: string | undefined
  })
  _language: string | null | undefined
  _domain: string | undefined
  _file: string
  _alt: string | undefined
  _caption: Sentence | undefined
  _wiki: string | undefined

  alt(): string
  caption(): string
  file(): string
  format(): string | null
  json(options?: object): object
  links(): Link[]
  src(): string
  text(): string
  thumb(size?: number): string
  thumbnail(size?: number): string
  url(): string
  wikitext(): string
}

declare class Link {
  constructor(data: object);
  _text: any;
  _type: any;
  _raw: any;
  _page: any;
  
  text(): string;
  json(): object;
  wikitext(): string;
  page(str?: string): string;
  anchor(str?: string): string;
  _anchor: string | undefined;
  wiki(str?: string): string | undefined;
  _wiki: string | undefined;
  type(str?: string): string;
  site(str?: string): string;
  _site: string | undefined;
  href(): string;
}

declare class List {
  constructor(data: Sentence[], wiki?: string)
  _data: Sentence[]
  _wiki: string

  json(options?: object): object
  lines(): object[]
  links(clue: string): Link[]
  text(): string
  wikitext(): string
}

declare class Sentence {
  constructor(data?: {
    links?: Link[] | undefined
    fmt?: object
    wiki?: object
    text?: object
  })
  _links: Link[]
  _fmt: any
  _wiki: any
  _text: any

  bold(clue?: number): string
  bolds(): string[]
  interwiki(): Link[]
  isEmpty(): boolean
  italic(clue?: number): string
  italics(): string[]
  json(options?: object): object
  link(clue?: string): Link | undefined
  links(clue?: string): Link[]
  plaintext: (str?: string) => string
  text(str?: string): string
  wikitext(): string
}

export = wtf

type version = string

type fetchDefaults = {
  path?: string | undefined;
  wiki?: string | undefined;
  domain?: string | undefined;
  follow_redirects?: boolean | undefined;
  lang?: string | undefined;
  title?: string | number | Array<string> | Array<number> | undefined;
  "Api-User-Agent"?: string | undefined;
};

type fetchCallback = (error: any, response: (null | Document | Document[])) => any;

declare function fetch(title: string | number | Array<number> | Array<string>, options?: fetchDefaults | undefined, callback?: fetchCallback): Promise<null | Document | Document[]>;

declare function wtf(wiki: string, options: object): Document
declare namespace wtf {
    export { fetch }
    export { extend }
    export { extend as plugin }
    export { version }
}

declare function extend(fn: Function): {
    (wiki: string, options: object): Document
    fetch: (title: string | number | string[] | number[], options?: fetch.fetchDefaults | undefined, callback?: fetch.fetchCallback | undefined) => Promise<Document | Document[] | null>
    extend: typeof extend
    plugin: typeof extend
    version: string
}
