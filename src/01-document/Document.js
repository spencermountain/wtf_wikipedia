/* eslint-disable no-console */
import sectionMap from './_sectionMap.js'
import toJSON from './toJson.js'
import isDisambig from './isDisambig.js'
import isStub from './isStub.js'
import setDefaults from '../_lib/setDefaults.js'
import Image from '../image/Image.js'
import { isRedirect, parse } from './redirects.js'
import preProcess from './preProcess/index.js'
import parseSection from '../02-section/index.js'
import parseCategories from './categories.js'

const defaults = {
  tables: true,
  lists: true,
  paragraphs: true,
}

class Document {
  constructor(wiki, options) {
    options = options || {}
    this._options = options
    let userAgent = options.userAgent || options['User-Agent'] || options['Api-User-Agent']
    userAgent = userAgent || 'User of the wtf_wikipedia library'
    let props = {
      title: options.title || null,
      type: 'page',
      userAgent,
      redirectTo: null,
      wiki: wiki || '',
      categories: [],
      sections: [],
      coordinates: [],
      templateFallbackFn: options.templateFallbackFn || null,
      revisionID: options.revisionID || null,
      timestamp: options.timestamp || null,
      description: options.description || null,
      wikidata: options.wikidata || null,
      pageImage: options.pageImage || null,
      pageID: options.pageID || options.id || null,
      namespace: options.namespace || options.ns || null,
      lang: options.lang || options.language || null,
      domain: options.domain || null,
    }

    Object.keys(props).forEach((k) => {
      Object.defineProperty(this, '_' + k, {
        enumerable: false,
        writable: true,
        value: props[k],
      })
    })

    //detect if page is just redirect, and return it
    if (isRedirect(this._wiki) === true) {
      this._type = 'redirect'
      this._redirectTo = parse(this._wiki)
      const [categories, newWiki] = parseCategories(this._wiki)
      this._categories = categories
      this._wiki = newWiki
      return
    }

    //give ourselves a little head-start
    this._wiki = preProcess(this._wiki)

    //pull-out [[category:whatevers]]
    const [categories, newWiki] = parseCategories(this._wiki)
    this._categories = categories
    this._wiki = newWiki

    //parse all the headings, and their texts/sentences
    this._sections = parseSection(this)
  }

  // if no title is set, guess it from a bolded phrase in the first sentence
  title(str) {
    //use like a setter
    if (str !== undefined) {
      this._title = str
      return str
    }
    //if we have it already
    if (this._title) {
      return this._title
    }
    //guess the title of this page from first sentence bolding
    let guess = null
    let sen = this.sentences()[0]
    if (sen) {
      guess = sen.bold()
    }
    return guess
  }

  pageID(id) {
    if (id !== undefined) {
      this._pageID = id
    }
    return this._pageID || null
  }

  wikidata(id) {
    if (id !== undefined) {
      this._wikidata = id
    }
    return this._wikidata || null
  }

  domain(str) {
    if (str !== undefined) {
      this._domain = str
    }
    return this._domain || null
  }

  language(lang) {
    if (lang !== undefined) {
      this._lang = lang
    }
    return this._lang || null
  }

  // falls back to 'en' and 'wikipedia.org' when language or domain are missing
  url() {
    let title = this.title()
    if (!title) {
      return null
    }
    let lang = this.language() || 'en'
    let domain = this.domain() || 'wikipedia.org'
    //replace blank to underscore
    title = title.replace(/ /g, '_')
    title = encodeURIComponent(title)
    return `https://${lang}.${domain}/wiki/${title}`
  }

  namespace(ns) {
    if (ns !== undefined) {
      this._namespace = ns
    }
    return this._namespace || null
  }

  isRedirect() {
    return this._type === 'redirect'
  }
  isStub() {
    return isStub(this)
  }

  redirectTo() {
    return this._redirectTo
  }

  isDisambiguation() {
    return isDisambig(this)
  }

  categories(clue) {
    let arr = this._categories || []
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  sections(clue) {
    let arr = this._sections || []
    arr.forEach((sec) => {
      // link-up parent and child
      sec._doc = this
    })

    //grab a specific section, by its title
    if (typeof clue === 'string') {
      let str = clue.toLowerCase().trim()
      return arr.filter((s) => {
        return s.title().toLowerCase() === str
      })
    } else if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  paragraphs(clue) {
    let arr = []
    this.sections().forEach((s) => {
      arr = arr.concat(s.paragraphs())
    })
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  sentences(clue) {
    let arr = []
    this.sections().forEach((sec) => {
      arr = arr.concat(sec.sentences())
    })
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  // searches the whole page, including infobox and gallery templates, for images
  images(clue) {
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
        obj.data.images = obj.data.images || []
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
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  links(clue) {
    return sectionMap(this, 'links', clue)
  }

  interwiki(clue) {
    return sectionMap(this, 'interwiki', clue)
  }

  lists(clue) {
    return sectionMap(this, 'lists', clue)
  }

  tables(clue) {
    return sectionMap(this, 'tables', clue)
  }

  templates(clue) {
    return sectionMap(this, 'templates', clue)
  }

  references(clue) {
    return sectionMap(this, 'references', clue)
  }

  citations(clue) {
    return this.references(clue)
  }

  coordinates(clue) {
    return sectionMap(this, 'coordinates', clue)
  }

  infoboxes(clue) {
    let arr = sectionMap(this, 'infoboxes', clue)
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return -1
      }
      return 1
    })

    return arr
  }

  text(options) {
    options = setDefaults(options, defaults)
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text(options))
    return arr.join('\n\n')
  }

  json(options) {
    return toJSON(this, options)
  }

  wikitext() {
    return this._wiki || ''
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

  revisionID(id) {
    if (id !== undefined) {
      this._revisionID = id
    }
    return this._revisionID || null
  }
  timestamp(str) {
    if (str !== undefined) {
      this._timestamp = str
    }
    return this._timestamp || null
  }
  description(str) {
    if (str !== undefined) {
      this._description = str
    }
    return this._description || null
  }
  pageImage(str) {
    if (str !== undefined) {
      this._pageImage = str
    }
    let file = this._pageImage || null
    return new Image({ file })
  }

  options() {
    return this._options
  }
}

// aliases
const singular = {
  categories: 'category',
  sections: 'section',
  paragraphs: 'paragraph',
  sentences: 'sentence',
  images: 'image',
  links: 'link',
  // interwiki
  lists: 'list',
  tables: 'table',
  templates: 'template',
  references: 'reference',
  citations: 'citation',
  coordinates: 'coordinate',
  infoboxes: 'infobox',
}
Object.keys(singular).forEach((k) => {
  let sing = singular[k]
  Document.prototype[sing] = function (clue) {
    let arr = this[k](clue)
    return arr[0] || null
  }
})
Document.prototype.lang = Document.prototype.language
Document.prototype.ns = Document.prototype.namespace
Document.prototype.plaintext = Document.prototype.text
Document.prototype.isDisambig = Document.prototype.isDisambiguation
Document.prototype.citations = Document.prototype.references
Document.prototype.redirectsTo = Document.prototype.redirectTo
Document.prototype.redirect = Document.prototype.redirectTo
Document.prototype.redirects = Document.prototype.redirectTo

export default Document
