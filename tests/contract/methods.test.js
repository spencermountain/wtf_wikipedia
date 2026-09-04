import test from 'tape'
import fs from 'fs'
import path from 'path'
import wtf from '../lib/index.js'
import { fileURLToPath } from 'url'

// the api contract: every public method, run against every cached page,
// checked against the return-shape promised in types/index.d.ts.
// a parser change that makes a method throw, or return the wrong shape,
// fails here with the page name - no matter which page triggers it.

const dir = path.dirname(fileURLToPath(import.meta.url))
const cacheDir = path.join(dir, '../cache')
const pages = fs
  .readdirSync(cacheDir)
  .filter((f) => f.endsWith('.txt'))
  .map((f) => f.replace(/\.txt$/, ''))

const parsed = pages.map((page) => {
  const str = fs.readFileSync(path.join(cacheDir, page + '.txt'), 'utf-8')
  return { page, doc: wtf(str) }
})

const is = {
  array: (v) => Array.isArray(v),
  string: (v) => typeof v === 'string',
  boolean: (v) => typeof v === 'boolean',
  object: (v) => v !== null && typeof v === 'object',
  'string|null': (v) => v === null || typeof v === 'string',
  'string|undefined': (v) => v === undefined || typeof v === 'string',
  'number|null': (v) => v === null || typeof v === 'number',
  number: (v) => typeof v === 'number',
  'item|null': (v) => v === null || (typeof v === 'object' && v !== undefined),
  json: (v) => {
    JSON.stringify(v) // must not throw (no cycles)
    return v !== null && v !== undefined
  },
  any: () => true,
}

// { methodName: expected-shape } - [name, arg] to call with an argument
const contracts = {
  Document: {
    title: 'string|null',
    pageID: 'number|null',
    wikidata: 'string|null',
    domain: 'string|null',
    language: 'string|null',
    lang: 'string|null',
    namespace: 'string|null',
    ns: 'string|null',
    url: 'string|null',
    description: 'string|null',
    timestamp: 'string|null',
    revisionID: 'number|null',
    pageImage: 'object',
    options: 'object',
    isRedirect: 'boolean',
    redirectTo: 'item|null',
    isDisambiguation: 'boolean',
    isDisambig: 'boolean',
    isStub: 'boolean',
    categories: 'array',
    sections: 'array',
    paragraphs: 'array',
    sentences: 'array',
    images: 'array',
    links: 'array',
    interwiki: 'array',
    lists: 'array',
    tables: 'array',
    templates: 'array',
    infoboxes: 'array',
    references: 'array',
    citations: 'array',
    coordinates: 'array',
    category: 'string|null',
    section: 'item|null',
    paragraph: 'item|null',
    sentence: 'item|null',
    image: 'item|null',
    link: 'item|null',
    list: 'item|null',
    table: 'item|null',
    template: 'item|null',
    reference: 'item|null',
    citation: 'item|null',
    coordinate: 'item|null',
    infobox: 'item|null',
    text: 'string',
    plaintext: 'string',
    json: 'json',
    wikitext: 'string',
    // .debug() prints to console, .category(clue) returns a string - special-cased below
  },
  Section: {
    title: 'string',
    index: 'number|null',
    depth: 'number',
    indentation: 'number',
    sentences: 'array',
    paragraphs: 'array',
    links: 'array',
    tables: 'array',
    templates: 'array',
    infoboxes: 'array',
    coordinates: 'array',
    lists: 'array',
    interwiki: 'array',
    images: 'array',
    references: 'array',
    citations: 'array',
    sentence: 'item|null',
    paragraph: 'item|null',
    link: 'item|null',
    table: 'item|null',
    template: 'item|null',
    infobox: 'item|null',
    coordinate: 'item|null',
    list: 'item|null',
    image: 'item|null',
    reference: 'item|null',
    citation: 'item|null',
    parent: 'item|null',
    children: 'any', // Section[] | null
    nextSibling: 'item|null',
    next: 'item|null',
    previousSibling: 'item|null',
    previous: 'item|null',
    lastSibling: 'item|null',
    last: 'item|null',
    text: 'string',
    json: 'json',
    wikitext: 'string',
    // .remove() mutates the document - not called here
  },
  Paragraph: {
    sentences: 'array',
    references: 'array',
    citations: 'array',
    lists: 'array',
    images: 'array',
    links: 'array',
    interwiki: 'array',
    sentence: 'item|null',
    reference: 'item|null',
    citation: 'item|null',
    list: 'item|null',
    image: 'item|null',
    link: 'item|null',
    text: 'string',
    json: 'json',
    wikitext: 'string',
  },
  Sentence: {
    links: 'array',
    interwiki: 'array',
    bolds: 'array',
    italics: 'array',
    link: 'item|null',
    bold: 'string|null',
    italic: 'string|null',
    isEmpty: 'boolean',
    text: 'string',
    plaintext: 'string',
    json: 'json',
    wikitext: 'string',
  },
  Link: {
    page: 'string|undefined', // external links have no page
    text: 'string',
    type: 'string',
    anchor: 'string|undefined',
    site: 'string|undefined',
    wiki: 'string|undefined',
    href: 'string|undefined',
    json: 'json',
    wikitext: 'string',
  },
  Image: {
    file: 'string',
    url: 'string',
    src: 'string',
    thumbnail: 'string',
    thumb: 'string',
    alt: 'string',
    caption: 'string',
    format: 'string|null',
    links: 'array',
    text: 'string',
    json: 'json',
    wikitext: 'string',
  },
  Infobox: {
    type: 'string',
    template: 'string',
    keyValue: 'object',
    image: 'item|null',
    images: 'item|null',
    links: 'array',
    coordinates: 'item|null',
    text: 'string',
    json: 'json',
    wikitext: 'string',
  },
  Template: {
    json: 'json',
    text: 'string',
    wikitext: 'string',
  },
  Table: {
    keyValue: 'array',
    keyvalue: 'array',
    keyval: 'array',
    links: 'array',
    json: 'array',
    text: 'string',
    wikitext: 'string',
  },
  List: {
    lines: 'array',
    links: 'array',
    json: 'array',
    text: 'string',
    wikitext: 'string',
  },
  Reference: {
    title: 'string',
    links: 'array',
    json: 'json',
    text: 'string',
    wikitext: 'string',
  },
}

// pull instances of each class out of the parsed pages (capped, for speed)
const instancesOf = {
  Document: ({ doc }) => [doc],
  Section: ({ doc }) => doc.sections().slice(0, 8),
  Paragraph: ({ doc }) => doc.paragraphs().slice(0, 8),
  Sentence: ({ doc }) => doc.sentences().slice(0, 10),
  Link: ({ doc }) => doc.links().slice(0, 10),
  Image: ({ doc }) => doc.images().slice(0, 5),
  Infobox: ({ doc }) => doc.infoboxes(),
  Template: ({ doc }) => doc.templates().slice(0, 10),
  Table: ({ doc }) => doc.tables().slice(0, 4),
  List: ({ doc }) => doc.lists().slice(0, 4),
  Reference: ({ doc }) => doc.references().slice(0, 6),
}

Object.keys(contracts).forEach((cls) => {
  test(`contract: ${cls}`, (t) => {
    const methods = contracts[cls]
    Object.keys(methods).forEach((name) => {
      const kind = methods[name]
      const check = is[kind]
      let count = 0
      const failures = []
      parsed.forEach((entry) => {
        instancesOf[cls](entry).forEach((obj) => {
          count += 1
          let got
          try {
            got = obj[name]()
          } catch (e) {
            failures.push(`${entry.page}: threw "${e.message}"`)
            return
          }
          if (check(got) !== true) {
            failures.push(`${entry.page}: got ${typeof got} ${JSON.stringify(got)?.slice(0, 60)}`)
          }
        })
      })
      const msg = `${cls}.${name}() → ${kind}  (${count} calls)`
      t.ok(failures.length === 0, failures.length === 0 ? msg : `${msg} — ${failures.slice(0, 3).join(' | ')}`)
    })
    t.end()
  })
})

// every page: parses, and its full json survives a stringify round-trip
test('contract: every cached page', (t) => {
  parsed.forEach(({ page, doc }) => {
    const json = doc.json()
    const roundTrip = JSON.parse(JSON.stringify(json))
    t.ok(roundTrip && typeof doc.text() === 'string', page)
  })
  t.end()
})
