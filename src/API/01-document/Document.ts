/* eslint-disable no-console */
import Image from '../03-paragraph/image/Image.ts'
import Images from '../03-paragraph/image/Images.ts'
import Infoboxes from '../02-section/infobox/Infoboxes.ts'
import Links from '../03-paragraph/link/Links.ts'
import Lists from '../03-paragraph/list/Lists.ts'
import References from '../02-section/reference/References.ts'
import Section from '../02-section/Section.ts'
import Blocks from '../Block/Blocks.ts'
import Tables from '../02-section/table/Tables.ts'
import Templates from '../02-section/template/Templates.ts'
import { withDefaults } from '../../_lib/defaults.ts'
import isDisambig from './isDisambig.ts'
import isStub from './isStub.ts'
import sectionMap from './_sectionMap.ts'
import parseImage from '../../parse/03-paragraph/02-images/parse.ts'
import type { PageData, DocInfo } from '../../types/index.ts'

class Document {
  #data: PageData
  #info: DocInfo
  constructor(data: PageData, info?: DocInfo) {
    this.#data = data
    this.#info = withDefaults(info)
  }

  get title() {
    // if we have it already
    if (this.#info.title) {
      return this.#info.title
    }
    //guess the title of this page from first sentence bolding
    let guess = null
    let sen = this.sentences()[0]
    if (sen) {
      guess = sen.bolds()[0]?.text || null
    }
    return guess
  }
  set title(str) {
    this.#info.title = str
  }

  get pageID() {
    return this.#info.pageId || null
  }
  set pageID(str) {
    this.#info.pageId = str
  }
  get wikidata() {
    return this.#info.wikidata || null
  }
  set wikidata(str) {
    this.#info.wikidata = str
  }
  get domain() {
    return this.#info.domain || null
  }
  set domain(str) {
    this.#info.domain = str
  }
  get language() {
    return this.#info.lang || null
  }
  set language(str) {
    this.#info.lang = str
  }
  get namespace() {
    return this.#info.namespace ?? null
  }
  set namespace(str) {
    this.#info.namespace = str
  }
  get revisionID() {
    return this.#info.revisionId || null
  }
  set revisionID(str) {
    this.#info.revisionId = str
  }
  get timestamp() {
    return this.#info.timestamp || null
  }
  set timestamp(str) {
    this.#info.timestamp = str
  }
  get description() {
    return this.#info.description || null
  }
  set description(str) {
    this.#info.description = str
  }
  get pageImage() {
    return this.#info.pageImage || null
  }
  set pageImage(str) {
    this.#info.pageImage = str
  }

  // don'y allow setting thesese
  wikitext() {
    return this.#data.wiki || ''
  }
  options() {
    return { ...this.#info }
  }

  // falls back to 'en' and 'wikipedia.org' when language or domain are missing
  url() {
    let title = this.#info.title
    if (!title) {
      return null
    }
    let lang = this.#info.lang
    let domain = this.#info.domain
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
    const link = this.#data.redirectTo
    return link ?? null
  }
  isDisambiguation() {
    return isDisambig(this)
  }

  categories() {
    return this.#data.categories || []
  }

  comments() {
    return this.#data.comments || []
  }

  sections() {
    let arr = this.#data.sections || []
    return arr.map((section) => new Section(section, this.#info))
  }

  section(clue: string | number = 0): Section {
    const sections = this.sections()
    if (typeof clue === 'number') {
      return sections[clue] ?? Section.empty()
    }
    const title = clue.trim().toLowerCase()
    const found = sections.find((section) => section.title().trim().toLowerCase() === title)
    return found ?? Section.empty()
  }

  paragraphs() {
    return this.sections().flatMap((section) => section.paragraphs())
  }
  sentences() {
    return Blocks.from(this.sections().flatMap((section) => section.sentences()))
  }

  // searches the whole page, including infobox and gallery templates, for images
  images() {
    let arr = []
    // grab image from fetch/dumpster metadata
    if (this.#info.pageImage) {
      const data = parseImage(this.#info.pageImage, this.#info)
      if (data) {
        arr.push(new Image({ ...data, wiki: '' }))
      }
    }
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      let img = info.image()
      if (img) {
        arr.push(img)
      }
    })
    arr = arr.concat(sectionMap(this, 'images', null))
    // Both gallery forms share the same payload.
    this.templates('gallery').forEach((template) => {
      const data = template.json().data
      const images = data.images || []
      images.forEach((image) => {
        if (image) {
          arr.push(new Image(image, this.#info))
        }
      })
    })
    return Images.from(arr)
  }

  links() {
    return Links.from(this.sections().flatMap((sec) => sec.links()))
  }

  lists() {
    return Lists.from(sectionMap(this, 'lists', null))
  }

  tables() {
    return Tables.from(sectionMap(this, 'tables', null))
  }
  templates(clue?: string) {
    const items = this.sections().flatMap((sec) => sec.templates())
    if (clue) {
      return Templates.from(items.filter((t) => t.type === clue || t.json().template === clue))
    }
    return Templates.from(items)
  }
  template(clue?: string) {
    return this.templates(clue)[0]
  }

  references() {
    const items = this.sections().flatMap((sec) => sec.references())
    return References.from(items)
  }

  citations() {
    return this.references()
  }

  // TODO: Coordinates contain plain data, not models. Keep the existing array API for now.
  coordinates() {
    return sectionMap(this, 'coordinates', null)
  }

  infoboxes() {
    let arr = this.sections().flatMap((sec) => sec.infoboxes())
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.json().data).length > Object.keys(b.json().data).length) {
        return -1
      }
      return 1
    })

    return Infoboxes.from(arr)
  }

  text() {
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text())
    return arr.join('\n\n')
  }

  json(format = 'lg') {
    let data: any = {}
    data.title = this.title
    data.pageID = this.pageID
    data.categories = this.categories()
    data.wikidata = this.wikidata
    data.description = this.description
    data.isStub = this.isStub()
    data.isDisambiguation = this.isDisambiguation()
    data.isRedirect = this.isRedirect()

    // present only if true
    if (data.isRedirect === true) {
      data.redirectTo = this.redirectTo()
    }
    // page sections
    data.sections = this.sections().map((i) => i.json(format))
    const json = structuredClone(data)
    if (format === 'xl') {
      json.wiki = this.wikitext()
    }
    return json
  }

  debug() {
    console.log('\n') // eslint-disable-line no-console
    this.sections().forEach((sec) => {
      let indent = ' - '
      for (let i = 0; i < sec.depth(); i += 1) {
        indent = ' -' + indent
      }
      console.log(indent + (sec.title() || '(Intro)')) // eslint-disable-line no-console
    })
    return this
  }

  infobox() {
    return this.infoboxes()[0] ?? null
  }

  // aliases
  isDisambig() {
    return this.isDisambiguation()
  }
  redirectsTo() {
    return this.redirectTo()
  }
  redirect() {
    return this.redirectTo()
  }
}

export default Document
