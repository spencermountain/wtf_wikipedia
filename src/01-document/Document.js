const sectionMap = require('./_sectionMap')
const toJSON = require('./toJson')
const disambig = require('./disambig')
const setDefaults = require('../_lib/setDefaults')
const Image = require('../image/Image')

const defaults = {
  tables: true,
  lists: true,
  paragraphs: true,
}

//
const Document = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  title: function (str) {
    //use like a setter
    if (str !== undefined) {
      this.data.title = str
      return str
    }
    //if we have it already
    if (this.data.title) {
      return this.data.title
    }
    //guess the title of this page from first sentence bolding
    let guess = null
    let sen = this.sentences(0)
    if (sen) {
      guess = sen.bolds(0)
    }
    return guess
  },
  pageID: function (id) {
    if (id !== undefined) {
      this.data.pageID = id
    }
    return this.data.pageID
  },
  wikidata: function (id) {
    if (id !== undefined) {
      this.data.wikidata = id
    }
    return this.data.wikidata
  },
  domain: function (str) {
    if (str !== undefined) {
      this.data.domain = str
    } else {
      // console.log(this.data)
    }
    return this.data.domain
  },
  language: function (lang) {
    if (lang !== undefined) {
      this.data.lang = lang
    }
    return this.data.lang
  },
  url: function () {
    let title = this.title()
    if (!title) {
      return null
    }
    let lang = this.language() || 'en'
    let domain = this.domain() || 'wikipedia.org'
    // replace blank to underscore
    title = title.replace(/ /g, '_')
    title = encodeURIComponent(title)
    return `https://${lang}.${domain}/wiki/${title}`
  },
  namespace: function (ns) {
    if (ns !== undefined) {
      this.data.namespace = ns
    }
    return this.data.namespace
  },
  isRedirect: function () {
    return this.data.type === 'redirect'
  },
  redirectTo: function () {
    return this.data.redirectTo
  },
  isDisambiguation: function () {
    return disambig(this)
  },
  categories: function (clue) {
    if (typeof clue === 'number') {
      return this.data.categories[clue]
    }
    return this.data.categories || []
  },
  sections: function (clue) {
    let arr = this.data.sections || []
    arr.forEach((sec) => (sec.doc = this))
    //grab a specific section, by its title
    if (typeof clue === 'string') {
      let str = clue.toLowerCase().trim()
      return arr.find((s) => {
        return s.title().toLowerCase() === str
      })
    }
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  paragraphs: function (n) {
    let arr = []
    this.data.sections.forEach((s) => {
      arr = arr.concat(s.paragraphs())
    })
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  paragraph: function (n) {
    let arr = this.paragraphs() || []
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr[0]
  },
  sentences: function (n) {
    let arr = []
    this.sections().forEach((sec) => {
      arr = arr.concat(sec.sentences())
    })
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  sentence: function () {
    return this.sentences(0)
  },
  images: function (clue) {
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
      if (obj.template === 'gallery') {
        obj.images = obj.images || []
        obj.images.forEach((img) => {
          if (img instanceof Image === false) {
            img.language = this.language()
            img.domain = this.domain()
            img = new Image(img)
          }
          arr.push(img)
        })
      }
    })
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  image: function () {
    return this.images(0)
  },
  links: function (clue) {
    return sectionMap(this, 'links', clue)
  },
  interwiki: function (clue) {
    return sectionMap(this, 'interwiki', clue)
  },
  lists: function (clue) {
    return sectionMap(this, 'lists', clue)
  },
  tables: function (clue) {
    return sectionMap(this, 'tables', clue)
  },
  templates: function (clue) {
    return sectionMap(this, 'templates', clue)
  },
  references: function (clue) {
    return sectionMap(this, 'references', clue)
  },
  coordinates: function (clue) {
    return sectionMap(this, 'coordinates', clue)
  },
  infoboxes: function (clue) {
    let arr = sectionMap(this, 'infoboxes')
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return -1
      }
      return 1
    })
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  text: function (options) {
    options = setDefaults(options, defaults)
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text(options))
    return arr.join('\n\n')
  },
  json: function (options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  },
  debug: function () {
    console.log('\n')
    this.sections().forEach((sec) => {
      let indent = ' - '
      for (let i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent
      }
      console.log(indent + (sec.title() || '(Intro)'))
    })
    return this
  },
}

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
//add singular-methods, too
let plurals = [
  'sections',
  'infoboxes',
  'sentences',
  'citations',
  'references',
  'coordinates',
  'tables',
  'lists',
  'links',
  'images',
  'templates',
  'categories',
]
plurals.forEach((fn) => {
  let sing = fn.replace(/ies$/, 'y')
  sing = sing.replace(/oxes$/, 'ox')
  sing = sing.replace(/s$/, '')
  methods[sing] = function (n) {
    n = n || 0
    let res = this[fn](n)
    if (isArray(res)) {
      return res[0]
    }
    return res
  }
})

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k]
})

//alias these ones
Document.prototype.lang = Document.prototype.language
Document.prototype.ns = Document.prototype.namespace
Document.prototype.plaintext = Document.prototype.text
Document.prototype.isDisambig = Document.prototype.isDisambiguation
Document.prototype.citations = Document.prototype.references
Document.prototype.redirectsTo = Document.prototype.redirectTo
Document.prototype.redirect = Document.prototype.redirectTo
Document.prototype.redirects = Document.prototype.redirectTo

module.exports = Document
