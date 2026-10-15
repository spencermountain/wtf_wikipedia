/* eslint-disable no-console */
import Collection from '../collection/Collection.js'
import sectionMap from './_sectionMap.ts'
import toJSON from './toJson.ts'
import isDisambig from './isDisambig.ts'
import Section from '../02-section/Section.ts'
import isStub from './isStub.ts'
import setDefaults from '../_lib/setDefaults.ts'
import Image from '../image/Image.ts'
import type { PageData } from '../../types/index.ts'

const defaults = {
  tables: true,
  lists: true,
  paragraphs: true,
}

class Document {
  #data: any
  #options: any

  constructor(data: PageData, options) {
    options ||= {}
    this.#options = options
    this.#data = data
  }

  get title() {
    // if we have it already
    if (this.#data.title) {
      return this.#data.title
    }
    //guess the title of this page from first sentence bolding
    let guess = null
    let sen = this.sentences()[0]
    if (sen) {
      guess = sen.bold() || null
    }
    return guess
  }
  set title(str) {
    this.#data.title = str
  }

  get pageID() {
    return this.#data.pageId || null
  }
  set pageID(str) {
    this.#data.pageId = str
  }
  get wikidata() {
    return this.#data.wikidata || null
  }
  set wikidata(str) {
    this.#data.wikidata = str
  }
  get domain() {
    return this.#data.domain || null
  }
  set domain(str) {
    this.#data.domain = str
  }
  get language() {
    return this.#data.lang || null
  }
  set language(str) {
    this.#data.lang = str
  }
  get namespace() {
    return this.#data.namespace || null
  }
  set namespace(str) {
    this.#data.namespace = str
  }
  get revisionID() {
    return this.#data.revisionID || null
  }
  set revisionID(str) {
    this.#data.revisionID = str
  }
  get timestamp() {
    return this.#data.timestamp || null
  }
  set timestamp(str) {
    this.#data.timestamp = str
  }
  get description() {
    return this.#data.description || null
  }
  set description(str) {
    this.#data.description = str
  }
  get _pageImage() {
    return this.#data._pageImage || null
  }
  set _pageImage(str) {
    this.#data._pageImage = str
  }

  // don'y allow setting thesese
  wikitext() {
    return this.#data.wiki || ''
  }
  options() {
    return this._options
  }

  // falls back to 'en' and 'wikipedia.org' when language or domain are missing
  url() {
    let title = this.#data.title
    if (!title) {
      return null
    }
    let lang = this.#data.lang || 'en' //sorry
    let domain = this.#data.domain || 'wikipedia.org'
    //replace blank to underscore
    title = title.replace(/ /g, '_')
    title = encodeURIComponent(title)
    return `https://${lang}.${domain}/wiki/${title}`
  }

  isRedirect() {
    return Boolean(this.#data.isRedirect)
  }
  isStub() {
    return isStub(this)
  }
  redirectTo() {
    return this.#data.redirectTo
  }
  isDisambiguation() {
    return isDisambig(this)
  }

  categories() {
    return this.#data.categories || []
  }

  sections(clue?) {
    let arr = this.#data.sections || []
    const res = arr.map((section) => new Section(section))
    return Collection.from(res).select(clue)
  }

  paragraphs(selector?) {
    const items = this.sections().flatMap((section) => section.paragraphs())
    return Collection.from(items).select(selector)
  }

  sentences(selector?) {
    const items = this.sections().flatMap((section) => section.sentences())
    return Collection.from(items).select(selector)
  }

  // searches the whole page, including infobox and gallery templates, for images
  images(clue?) {
    let arr = sectionMap(this, 'images', null)
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      let img = info.image()
      if (img) {
        arr.unshift(img) //put it at the top
      }
    })
    //look for 'gallery' templates, too
    this.templates().forEach((obj) => {
      if (obj.data.template === 'gallery') {
        obj.data.images ||= []
        obj.data.images.forEach((img) => {
          if (!(img instanceof Image)) {
            img.language = this.language()
            img.domain = this.domain()
            img = new Image(img)
          }
          arr.push(img)
        })
      }
    })
    // TODO: Image filename string selectors are not implemented.
    return Collection.from(arr).select(clue)
  }

  links(selector?) {
    const items = this.sections().flatMap((section) => section.links())
    return Collection.from(items).select(selector)
  }

  interwiki(selector?) {
    const items = this.sections().flatMap((section) => section.interwiki())
    return Collection.from(items).select(selector)
  }

  // TODO: List collections have nested JSON. Keep the existing array API for now.
  lists(clue?) {
    return sectionMap(this, 'lists', clue)
  }

  // TODO: Table collections have nested JSON. Keep the existing array API for now.
  tables(clue?) {
    return sectionMap(this, 'tables', clue)
  }

  templates(selector?) {
    const items = this.sections().flatMap((section) => section.templates())
    return Collection.from(items).select(selector)
  }

  references(selector?) {
    const items = this.sections().flatMap((section) => section.references())
    return Collection.from(items).select(selector)
  }

  citations(clue?) {
    return this.references(clue)
  }

  // TODO: Coordinates contain plain data, not models. Keep the existing array API for now.
  coordinates(clue?) {
    return sectionMap(this, 'coordinates', clue)
  }

  infoboxes(clue?) {
    let arr = this.sections().flatMap((section) => section.infoboxes())
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return -1
      }
      return 1
    })

    return Collection.from(arr).select(clue)
  }

  text(options?) {
    options = setDefaults(options, defaults)
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text(options))
    return arr.join('\n\n')
  }

  json(options?) {
    return toJSON(this, options)
  }

  debug() {
    console.log('\n')
    this.sections().forEach((sec) => {
      let indent = ' - '
      for (let i = 0; i < sec.depth(); i += 1) {
        indent = ' -' + indent
      }
      console.log(indent + (sec.title() || '(Intro)'))
    })
    return this
  }

  // singular aliases
  category() {
    return this.categories()[0] || null
  }
  section(clue?) {
    return this.sections(clue)[0] ?? null
  }
  paragraph(clue?) {
    return this.paragraphs(clue)[0] ?? null
  }
  sentence(clue?) {
    return this.sentences(clue)[0] ?? null
  }
  image(clue?) {
    return this.images(clue)[0] ?? null
  }
  link(clue?) {
    return this.links(clue)[0] ?? null
  }
  list(clue?) {
    return this.lists(clue)[0] || null
  }
  table(clue?) {
    return this.tables(clue)[0] || null
  }
  template(clue?) {
    return this.templates(clue)[0] ?? null
  }
  reference(clue?) {
    return this.references(clue)[0] ?? null
  }
  citation(clue?) {
    return this.citations(clue)[0] ?? null
  }
  coordinate(clue?) {
    return this.coordinates(clue)[0] || null
  }
  infobox(clue?) {
    return this.infoboxes(clue)[0] ?? null
  }

  // aliases
  lang(str?) {
    return this.language(str)
  }
  ns(str?) {
    return this.namespace(str)
  }
  plaintext(options?) {
    return this.text(options)
  }
  isDisambig() {
    return this.isDisambiguation()
  }
  redirectsTo() {
    return this.redirectTo()
  }
  redirect() {
    return this.redirectTo()
  }
  redirects() {
    return this.redirectTo()
  }
}

export default Document
