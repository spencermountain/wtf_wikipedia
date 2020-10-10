const sectionMap = require('./_sectionMap')
const toJSON = require('./toJson')
const disambig = require('./disambig')
const setDefaults = require('../_lib/setDefaults')
const Image = require('../image/Image')
const redirects = require('./redirects')
const preProcess = require('./preProcess')
const parse = {
  section: require('../02-section'),
  categories: require('./categories')
}

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

function aliasWrapper(aliasedFunction, clue) {
  const res = aliasedFunction(clue || 0)
  if (isArray(res)) {
    return res[0]
  }
  return res
}

const defaults = {
  tables: true,
  lists: true,
  paragraphs: true,
}

class Document {
  constructor(wiki, options) {
    options = options || {}
    this._title = options.title || null;
    this._pageID = options.pageID || options.id || null;
    this._namespace = options.namespace || options.ns || null;
    this._lang = options.lang || options.language || null;
    this._domain = options.domain || null;
    this._type = 'page'
    this._redirectTo = null;
    this._wikidata = options.wikidata || null;
    this._wiki = wiki || '';
    this._categories = [];
    this._sections = [];
    this._coordinates = [];

    //detect if page is just redirect, and return it
    if (redirects.isRedirect(this._wiki) === true) {
      this._type = 'redirect'
      this._redirectTo = redirects.parse(this._wiki)

      const [categories, newWiki] = parse.categories(this._wiki);
      this._categories = categories;
      this._wiki = newWiki;
      return;
    }

    //give ourselves a little head-start
    this._wiki = preProcess(this._wiki)

    //pull-out [[category:whatevers]]
    const [categories, newWiki] = parse.categories(this._wiki);
    this._categories = categories;
    this._wiki = newWiki;

    //parse all the headings, and their texts/sentences
    this._sections = parse.section(this)
  }

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
    let sen = this.sentences(0)
    if (sen) {
      guess = sen.bolds(0)
    }
    return guess
  }

  pageID(id) {
    if (id !== undefined) {
      this._pageID = id
    }
    return this._pageID
  }

  wikidata(id) {
    if (id !== undefined) {
      this._wikidata = id
    }
    return this._wikidata
  }

  domain(str) {
    if (str !== undefined) {
      this._domain = str
    }
    return this._domain
  }

  language(lang) {
    if (lang !== undefined) {
      this._lang = lang
    }
    return this._lang
  }

  lang(lang) {
    return this.language(lang)
  }

  url() {
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
  }

  namespace(ns) {
    if (ns !== undefined) {
      this._namespace = ns
    }
    return this._namespace
  }

  ns(ns) {
    return this.namespace(ns);
  }

  isRedirect() {
    return this._type === 'redirect'
  }

  redirectTo() {
    return this._redirectTo
  }

  redirectsTo() {
    return this.redirectTo();
  }

  redirect() {
    return this.redirectTo();
  }

  redirects() {
    return this.redirectTo();
  }

  isDisambiguation() {
    return disambig(this)
  }

  isDisambig() {
    return this.isDisambiguation();
  }

  categories(clue) {
    if (typeof clue === 'number') {
      return this._categories[clue]
    }
    return this._categories || []
  }

  category(clue) {
    return aliasWrapper(this.categories.bind(this), clue);
  }

  sections(clue) {
    let arr = this._sections || []
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
  }

  section(clue) {
    return aliasWrapper(this.sections.bind(this), clue);
  }

  paragraphs(n) {
    let arr = []
    this.sections().forEach((s) => {
      arr = arr.concat(s.paragraphs())
    })
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  }

  paragraph(n) {
    let arr = this.paragraphs() || []
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr[0]
  }

  sentences(n) {
    let arr = []
    this.sections().forEach((sec) => {
      arr = arr.concat(sec.sentences())
    })
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  }

  sentence(clue) {
    return aliasWrapper(this.sentences.bind(this), clue);
  }

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
      if (obj.template === 'gallery') {
        obj.images = obj.images || []
        obj.images.forEach((img) => {
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
      return arr[clue]
    }
    return arr
  }

  image(clue) {
    return aliasWrapper(this.images.bind(this), clue);
  }

  links(clue) {
    return sectionMap(this, 'links', clue)
  }

  link(clue) {
    return aliasWrapper(this.links.bind(this), clue);
  }

  interwiki(clue) {
    return sectionMap(this, 'interwiki', clue)
  }

  lists(clue) {
    return sectionMap(this, 'lists', clue)
  }

  list(clue) {
    return aliasWrapper(this.lists.bind(this), clue);
  }

  tables(clue) {
    return sectionMap(this, 'tables', clue)
  }

  table(clue) {
    return aliasWrapper(this.tables.bind(this), clue);
  }

  templates(clue) {
    return sectionMap(this, 'templates', clue)
  }

  template(clue) {
    return aliasWrapper(this.templates.bind(this), clue);
  }

  references(clue) {
    return sectionMap(this, 'references', clue)
  }

  reference(clue) {
    return aliasWrapper(this.references.bind(this), clue);
  }

  citations(clue) {
    return this.references(clue);
  }

  citation(clue) {
    return aliasWrapper(this.references.bind(this), clue);
  }

  coordinates(clue) {
    return sectionMap(this, 'coordinates', clue)
  }

  coordinate(clue) {
    return aliasWrapper(this.coordinates.bind(this), clue);
  }

  infoboxes(clue) {
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
  }

  infobox(clue) {
    return aliasWrapper(this.infoboxes.bind(this), clue);
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

  plaintext(options) {
    return this.text(options);
  }

  json(options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  debug() {
    console.log('\n')
    this.sections().forEach((sec) => {
      let indent = ' - '
      for (let i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent
      }
      console.log(indent + (sec.title() || '(Intro)'))
    })
    return this
  }
}

module.exports = Document
