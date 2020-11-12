// Type definitions for wtf_wikipedia 7.3.0
// Project: https://github.com/spencermountain/wtf_wikipedia#readme
// Definitions by: Rob Rose <https://github.com/RobRoseKnows>
//                 Mr. Xyfir <https://github.com/MrXyfir>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// export = wtf
export as namespace wtf

declare function wtf(wiki: string, options?: any): wtf.Document

declare module wtf {
  /** current version of the library */
  export const version: string

  /** fetch articles belonging to this wikipedia category */
  export function category(cat: string, lang?: string, options?: object, cb?: any): Promise<object>

  /** extend built-in functionality */
  export function extend(fn: any): any

  /** grab wikipedia content from an API */
  export function fetch(titleOrId: string | number, lang?: string, options?: any, cb?: any): Promise<null | Document>

  /** grab wikipedia content from an API */
  export function fetch(titlesOrIds: string[] | number[], lang?: string, options?: any, cb?: any): Promise<Document[]>

  /** grab a random article from a wikimedia API */
  export function random(lang?: string, options?: object, cb?: any): Promise<Document>

  class Document {
    private data: object

    private options: object

    /**get, set, or guess the title of the page */
    title(str?: string): string
    /**get/set the wikimedia id for the page */
    pageID(str?: string | number): string
    /**get/set the wikidata id for the page */
    wikidata(str?: string | number): string
    /**get/set the domain of the wiki */
    domain(str?: string | number): string
    /**get/set the wikimedia namespace for the page */
    namespace(str?: string | number): string
    /**get/set the language for the page */
    language(str?: string): string
    /** try to create the url of the page */
    url(): string | null

    /**if the page is just a redirect to another page */
    isRedirect(): boolean

    /**the page this redirects to */
    redirectTo(): Document
    /** Alias of redirectTo */
    redirectsTo(): Document
    /** Alias of redirectTo */
    redirect(): Document
    /** Alias of redirectTo */
    redirects(): Document

    /**is this a placeholder page to direct you to one-of-many possible pages */
    isDisambiguation(): boolean

    /** Alias of isDisambiguation */
    isDisambig(): boolean

    /** fetch a list of this page's categories */
    categories(): string[]
    /** fetch the first or nth category */
    category(clue?: number): string

    /**return a list, or given-index of the Document's sections */
    sections(): Section[]
    /** fetch the nth section */
    sections(clue?: string): Section[]
    /** fetch the first Section */
    section(clue?: number | string): Section

    /**return a list, or given-index of Paragraphs, in all sections */
    paragraphs(): Paragraph[]
    /**grab the first paragraph */
    paragraph(n?: number): Paragraph

    /** list of all sentences in the document*/
    sentences(): Sentence[]
    /** return the first sentence in the document*/
    sentence(n?: number): Sentence

    /** return all images in the document */
    images(): Image[]
    /** return the first image in the document */
    image(n?: number): Image

    /**list of all links in the document */
    links(clue?: string): Link[]
    link(clue?: number | string): Link

    /**any links to other language wikis */
    interwiki(clue?: string): object[]
    interwiki(clue?: number): object

    /**sections in a page where each line begins with a bullet point */
    lists(): List[]
    lists(n?: number): List

    /**list of all structured tables in the document */
    tables(): Table[]
    table(n?: number): Table

    /**list any type of structured-data elements, typically wrapped in like {{this}} */
    templates(clue?: string): object[]
    template(clue?: number): object

    /**list of 'citations' in the document */
    references(clue?: string): Reference[]
    reference(clue?: number): Reference

    /** Alias of references */
    citations(clue?: string): Reference[]
    /** Alias of reference */
    citation(clue?: number): Reference

    /**geo-locations that appear on the page */
    coordinates(clue?: string): object[]
    coordinate(clue?: string|number): object

    /**specific type of template, that appear on the top-right of the page */
    infoboxes(): Infobox[]
    infobox(clue?: number): Infobox

    /**plaintext, human-readable output for the page */
    text(options?: object): string
    /**a 'stringifyable' output of the page's main data */
    json(options?: object): object

    /** helper information for the document */
    debug(): Document
  }

  class Section {
    private doc: Document
    private _title: string
    private data: object
    private depth: number

    /**the name of the section, between ==these tags== */
    title(): string
    /**which number section is this, in the whole document. */
    index(): null | number
    /**how many steps deep into the table of contents it is */
    indentation(): number

    sentences(): Sentence[]
    sentence(n: number): Sentence

    paragraphs(): Paragraph[]
    paragraph(n?: number): Paragraph

    links(n?: string): object[]
    link(n?: number): object

    tables(): Table[]
    table(n?: number): Table

    templates(clue?: string): object[]
    template(clue?: number): object

    infoboxes(): Infobox[]
    infoboxe(clue?: number): Infobox

    coordinates(): object[]
    coordinate(clue?: number): object

    lists(): List[]
    list(clue?: number): List

    /**any links to other language wikis */
    interwiki(): object[]
    interwikis(num: number): object

    /**return a list of any images in this section */
    images(): Image[]
    image(clue?: number): Image

    references(clue?: string): Reference[]
    reference(clue?: number|string): Reference
    /** Alias of references() */
    citations(clue?: string): Reference
    /** Alias of reference() */
    citation(clue?: number|string): Reference[]

    /**remove the current section from the document */
    remove(): Document

    nextSibling(): Section | null

    /** Alias of nextSibling() */
    next(): Section | null

    /**a section following this one, under the current parent: eg. 1920s → 1930s  */
    lastSibling(): Section | null
    /** Alias of lastSibling() */
    last(): Section | null
    /** Alias of lastSibling() */
    previousSibling(): Section | null
    /** Alias of lastSibling() */
    previous(): Section | null
    /**any sections more specific than this one: eg. History → [PreHistory, 1920s, 1930s] */
    children(n?: string): Section[]
    child(n: number): Section
    /** Alias of children */
    sections(n?: string): Section[]
    /** Alias of children */
    section(n?: number): Section
    /**the section, broader than this one: eg. 1920s → History */
    parent(): null | Section

    text(options?: object): string

    json(options?: object): object
  }

  class Infobox {
    private _type: string

    type(): string
    /** Alias of type() */
    template(): string

    links(n?: string): object[]

    image(): Image | null

    /** Alias of image() */
    images(): Image | null//FIXME

    get(key: string): object | null

    keyValue(): object

    /** Alias of keyValue() */
    data(): object

    text(): string

    json(options?: object): object
  }

  class Table {
    private data: object

    links(n?: string): object[]

    keyValue(options?: object): object

    /** Alias of keyValue */
    keyvalue(options?: object): object

    // Alais of keyValue
    keyval(options?: object): object

    text(): string

    json(options?: object): object
  }

  class Reference {
    private data: object

    title(): string

    links(n: number): object

    links(n?: string): object[]

    text(): string

    json(options?: object): object
  }

  class Paragraph {
    private data: object

    sentences(): Sentence[]

    references(clue?: string|number): Reference[]
    reference(): Reference

    /** Alias of references */
    citations(clue?: string): Reference []
    /** Alias of references */
    citation(clue?: string|number): Reference[]

    lists(): List[]
    lists(): List

    images(): Image[]
    images(clue?: number | string): Image


    links(clue?: string|number): object
    link(clue?: string|number): object

    interwiki(clue?: number): object
    interwiki(): object[]

    text(options?: object): string

    json(options?: object): object
  }

  class Image {
    private data: object

    file(): string

    alt(): string

    caption(): string

    links(): object[]

    url(): string

    /** Alias of url() */
    src(): string

    thumbnail(size?: number): string

    /** Alias of thumbnail() */
    thumb(size?: number): string

    format(): string

    text(): string

    json(options?: object): object
  }

  class List {
    private data: object

    lines(): object[]

    links(clue?: number): object[]
    // link(n?: string): object

    interwiki(clue?: number): object[]

    interwiki(): object[]

    text(options?: object): string

    json(options?: object): object
  }

  class Sentence {
    private data: object

    links(clue?: string|number): object
    link(clue?: string|number): object

    interwiki(clue?: number|string): object
    interwiki(): object[]

    bolds(clue?: number|string): string[]
    bold(clue?:number|string): string


    italics(clue?: number|string): string[]
    italic(clue?: number|string): string

    text(str?: string): string

    /** Alias of text */
    plaintext(str?: string): string

    json(options?: object): object
  }
}

export default wtf
