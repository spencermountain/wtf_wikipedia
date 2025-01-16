declare class Document {
  categories(clue?: number): string[]
  category(clue?: number): string | null
  citations(clue?: number): Reference[]
  citation(clue?: number): Reference | null
  coordinate(clue?: number): object | null
  coordinates(clue?: number): object[]
  debug(): Document
  domain(str?: string): string | null
  images(clue?: string | number): Image[]
  image(clue?: string | number): Image | null
  infoboxes(clue?: number): Infobox[]
  infobox(clue?: number): Infobox | null
  interwiki(clue?: number): string[]
  isDisambig: () => boolean
  isDisambiguation(): boolean
  isRedirect(): boolean
  isStub(): boolean
  json(options?: object): object
  lang: (lang?: string) => string | null
  language(lang?: string): string | null
  links(clue?: number): string[]
  link(clue?: number): string | null
  lists(clue?: number): List[]
  list(clue?: number): List | null
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
  reference(clue?: number): Reference | null
  section(clue?: string | number): Section | null
  sections(clue?: string | number): Section[]
  sentence(clue?: number): Sentence | null
  sentences(clue?: string | number): Sentence[]
  tables(clue?: number): List[]
  table(clue?: number): List | null
  templates(clue?: number): List[]
  template(clue?: number): List | null
  text(options?: object): string
  title(str?: string): null | string
  url(): string | null
  wikidata(id?: string): string | null
  wikitext(): string
  revisionID(id?: number): number | null
  description(desc?: string): string | null
  timestamp(iso?: string): string | null
  pageImage(img?: string): Image
  domain(domain?: string): string | null
}

declare class Section {
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
  data: () => object
  get(keys: string | string[]): Sentence | undefined | unknown
  image(): Image | null
  images: () => Image | null
  json(options?: object): object
  keyValue(): object
  links(clue?: string): Link[]
  template: () => string
  text(): string
  type(): string
  wikitext(): string
}

declare class Template {
  json(): object
  text(): string
  wikitext(): string
}

declare class Table {
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
  json(options?: object): object
  links(n?: string | number): Link[]
  text(): string
  title(): string
  wikitext(): string
}

declare class Paragraph {
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
  text(): string;
  json(): object;
  wikitext(): string;
  page(str?: string): string;
  anchor(str?: string): string;
  wiki(str?: string): string | undefined;
  type(str?: string): string;
  site(str?: string): string;
  href(): string;
}

declare class List {
  json(options?: object): object
  lines(): object[]
  links(clue: string): Link[]
  text(): string
  wikitext(): string
}

declare class Sentence {
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

export default wtf

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

declare function fetch(
  title: string | number | Array<number> | Array<string>,
  options?: fetchDefaults | undefined, callback?: fetchCallback
): Promise<null | Document | Document[]>;

declare function wtf(wiki: string, options?: object): Document
declare namespace wtf {
  var version : string
  export { fetch }
  export { extend }
  export { extend as plugin }
  export { version }
  export { Document }
  export { Section }
  export { Infobox }
  export { Template }
  export { Table }
  export { Reference }
  export { Paragraph }
  export { Image }
  export { Link }
  export { List }
  export { Sentence }
}

declare function extend(fn: Function): {
  (wiki: string, options: object): Document
  fetch: typeof fetch
  extend: typeof extend
  plugin: typeof extend
  version: string
}
