/* eslint-disable max-nested-callbacks */
import test from 'tape'
import wtf from '../../lib/index.js'
import { allPages, readPage } from '../../_examples/index.js'

// Smoke-check no-argument return shapes on sampled instances from every cached page.
// Focused tests cover arguments, mutations, and exact parsed values.

const parsed = allPages.map((page) => {
  const str = readPage(page)
  return { page, doc: wtf(str) }
})

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isModel = (v) => isObject(v) && typeof v.json === 'function' && typeof v.text === 'function'

const is = {
  array: (v) => Array.isArray(v),
  string: (v) => typeof v === 'string',
  boolean: (v) => typeof v === 'boolean',
  object: isObject,
  'list-json': (v) => isObject(v) && Array.isArray(v.items),
  'string|null': (v) => v === null || typeof v === 'string',
  'string|undefined': (v) => v === undefined || typeof v === 'string',
  'string|number|null': (v) => v === null || typeof v === 'string' || typeof v === 'number',
  'number|null': (v) => v === null || Number.isFinite(v),
  number: Number.isFinite,
  'item|null': (v) => v === null || isObject(v),
  'model|null': (v) => v === null || isModel(v),
  'model|undefined': (v) => v === undefined || isModel(v),
  'models|null': (v) => v === null || (Array.isArray(v) && v.every(isModel)),
  json: (v) => {
    JSON.stringify(v) // must not throw (no cycles)
    return isObject(v) || Array.isArray(v)
  },
}

// { methodName: expected-shape } for no-argument calls
const contracts = {
  Document: {
    // pageID: 'number|null',
    // wikidata: 'string|null',
    // domain: 'string|null',
    // language: 'string|null',
    // lang: 'string|null',
    // namespace: 'string|number|null',
    // ns: 'string|null',
    url: 'string|null',
    // description: 'string|null',
    // timestamp: 'string|null',
    // revisionID: 'number|null',
    // pageImage: 'object',
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
    // interwiki: 'array',
    lists: 'array',
    tables: 'array',
    templates: 'array',
    infoboxes: 'array',
    references: 'array',
    citations: 'array',
    coordinates: 'array',
    // category: 'string|null',
    // section: 'model|null',
    // paragraph: 'model|null',
    // sentence: 'model|null',
    // image: 'model|null',
    // link: 'model|null',
    // list: 'model|null',
    // table: 'model|null',
    // template: 'model|null',
    // reference: 'model|null',
    // citation: 'model|null',
    // coordinate: 'item|null',
    infobox: 'model|null',
    text: 'string',
    // plaintext: 'string',
    json: 'json',
    wikitext: 'string',
    // .debug() prints to console and is omitted.
  },
  Section: {
    title: 'string',
    index: 'number|null',
    depth: 'number',
    sentences: 'array',
    paragraphs: 'array',
    links: 'array',
    tables: 'array',
    templates: 'array',
    infoboxes: 'array',
    coordinates: 'array',
    lists: 'array',
    // interwiki: 'array',
    images: 'array',
    // references: 'array',
    // citations: 'array',
    // sentence: 'model|null',
    // paragraph: 'model|null',
    // link: 'model|null',
    // table: 'model|null',
    // template: 'model|null',
    // infobox: 'model|null',
    // coordinate: 'item|null',
    // list: 'model|null',
    // image: 'model|null',
    // reference: 'model|null',
    // citation: 'model|null',
    // parent: 'model|null',
    // children: 'models|null',
    // nextSibling: 'model|null',
    // next: 'model|null',
    // previousSibling: 'model|null',
    // previous: 'model|null',
    // lastSibling: 'model|null',
    // last: 'model|null',
    text: 'string',
    json: 'json',
    wikitext: 'string',
    // .remove() mutates the document - not called here
  },
  Paragraph: {
    sentences: 'array',
    lists: 'array',
    images: 'array',
    // links: 'array',
    // interwiki: 'array',
    // sentence: 'model|null',
    // reference: 'model|null',
    // citation: 'model|null',
    // list: 'model|null',
    // image: 'model|null',
    // link: 'model|null',
    text: 'string',
    json: 'json',
    wikitext: 'string',
  },
  Sentence: {
    links: 'array',
    // interwiki: 'array',
    bolds: 'array',
    italics: 'array',
    // link: 'model|null',
    // bold: 'string|null',
    // italic: 'string|null',
    // isEmpty: 'boolean',
    text: 'string',
    // plaintext: 'string',
    json: 'json',
    wikitext: 'string',
  },
  Link: {
    page: 'string|undefined', // external links have no page
    text: 'string',
    type: 'string',
    anchor: 'string|undefined',
    // site: 'string|undefined',
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
    image: 'model|undefined',
    images: 'array',
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
    links: 'array',
    rows: 'array',
    getRows: 'array',
    json: 'json',
    text: 'string',
    wikitext: 'string',
  },
  List: {
    lines: 'array',
    links: 'array',
    json: 'list-json',
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
            if (check(got) !== true) {
              failures.push(`${entry.page}: got ${typeof got} ${JSON.stringify(got)?.slice(0, 60)}`)
            }
          } catch (e) {
            failures.push(name, `${entry.page}: threw "${e.message}"`)
            return
          }
        })
      })
      const msg = `${cls}.${name}() → ${kind}  (${count} calls)`
      t.ok(count > 0, `${cls}.${name}() has sampled instances`)
      t.ok(failures.length === 0, failures.length === 0 ? msg : `${msg} — ${failures.slice(0, 3).join(' | ')}`)
    })
    t.end()
  })
})

test('contract: Document.title property', (t) => {
  parsed.forEach(({ page, doc }) => {
    t.ok(is['string|null'](doc.title), `${page}: title → string|null`)
  })
  t.end()
})

// every page: parses, and its full json survives a stringify round-trip
test('contract: every cached page', (t) => {
  parsed.forEach(({ page, doc }) => {
    const json = doc.json()
    const roundTrip = JSON.parse(JSON.stringify(json))
    t.ok(roundTrip && typeof doc.text() === 'string', page)
    doc.infoboxes().forEach((box) => {
      t.equal(typeof box.json().template, 'string', `${page}: infobox template`)
      t.ok(isObject(box.json().data), `${page}: infobox fields`)
    })
  })
  t.end()
})
