const sectionMap = require('./_sectionMap')
const toJSON = require('./toJson')
const disambig = require('./disambig')
const setDefaults = require('../_lib/setDefaults')
const {isArray} = require('../_lib/helpers')

const Image = require('../image/Image')
const redirects = require('./redirects')
const preProcess = require('./preProcess')
const parse = {
  section: require('../02-section'),
  categories: require('./categories'),
}

/**
 * Call the aliased function with the provided clue. if the clue is unavailable then we use 0 as the clue
 * If the return value from the aliased function is an array then we return the 0th element of the array
 *
 * Do not forget to bind this to have it available in the function
 *
 * @private
 * @param {Function} aliasedFunction The function to be wrapped
 * @param {number | string} [clue] The clue for the wrapped function
 * @returns {object|string|number} The return value of the wrapped function
 */
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

/***
 * @class
 * @borrows Document#namespace as Document#ns
 * @borrows Document#text as Document#plaintext
 * @borrows Document#language as Document#lang
 *
 * @borrows Document#redirectTo as Document#redirectsTo
 * @borrows Document#redirectTo as Document#redirect
 * @borrows Document#redirectTo as Document#redirects
 *
 * @borrows Document#reference as Document#citations
 */
class Document {
  /**
   * The constructor for the document class
   * This function starts parsing the wiki text and sets the options in the class
   *
   * @param {string} [wiki] The wiki text
   * @param {object} [options] The options for the parser
   */
  constructor(wiki, options) {
    options = options || {}
    this._title = options.title || null
    this._pageID = options.pageID || options.id || null
    this._namespace = options.namespace || options.ns || null
    this._lang = options.lang || options.language || null
    this._domain = options.domain || null
    this._type = 'page'
    this._redirectTo = null
    this._wikidata = options.wikidata || null
    this._wiki = wiki || ''
    this._categories = []
    this._sections = []
    this._coordinates = []

    //detect if page is just redirect, and return it
    if (redirects.isRedirect(this._wiki) === true) {
      this._type = 'redirect'
      this._redirectTo = redirects.parse(this._wiki)

      const [categories, newWiki] = parse.categories(this._wiki)
      this._categories = categories
      this._wiki = newWiki
      return
    }

    //give ourselves a little head-start
    this._wiki = preProcess(this._wiki)

    //pull-out [[category:whatevers]]
    const [categories, newWiki] = parse.categories(this._wiki)
    this._categories = categories
    this._wiki = newWiki

    //parse all the headings, and their texts/sentences
    this._sections = parse.section(this)
  }

  /**
   * Getter and setter for the tile.
   * If string is given then this function is a setter and sets the variable and returns the set value
   * If the string is not given then it will check if the title is available
   * If it is available it returns the title.
   * Else it will look if the first sentence contains a bolded phrase and assumes that's the title and returns it
   *
   * @param {string} [str] The title that will be set
   * @returns {null|string} The title found or given
   */
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

  /**
   * If an pageID is given then it sets the pageID and returns the given pageID
   * Else if the pageID is already set it returns the pageID
   *
   * @param {number} [id] The pageID that will be set
   * @returns {number|null} The given or found pageID
   */
  pageID(id) {
    if (id !== undefined) {
      this._pageID = id
    }
    return this._pageID
  }

  /**
   * If an WikidataID is given then it sets the WikidataID and returns the given WikidataID
   * Else if the WikidataID is already set it returns the WikidataID
   *
   * @param {string} [id] The WikidataID that will be set
   * @returns {string|null} The given or found WikidataID
   */
  wikidata(id) {
    if (id !== undefined) {
      this._wikidata = id
    }
    return this._wikidata
  }

  /**
   * If an domain is given then it sets the domain and returns the given domain
   * Else if the domain is already set it returns the domain
   *
   * @param {string} [str] The domain that will be set
   * @returns {string|null} The given or found domain
   */
  domain(str) {
    if (str !== undefined) {
      this._domain = str
    }
    return this._domain
  }

  /**
   * If an language is given then it sets the language and returns the given language
   * Else if the language is already set it returns the language
   *
   * @param {string} [lang] The language that will be set
   * @returns {string|null} The given or found language
   */
  language(lang) {
    if (lang !== undefined) {
      this._lang = lang
    }
    return this._lang
  }

  //eslint-disable-next-line require-jsdoc -- inherits from language
  lang(lang) {
    return this.language(lang)
  }

  /**
   * Gets the url of the page
   * If the language or domain is not available we substitute 'en' and 'wikipedia.org'
   * Then we use the template of `https://${lang}.${domain}/wiki/${title}` to make the url
   *
   * @returns {string|null} The url of the page
   */
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

  /**
   * If an namespace is given then it sets the namespace and returns the given namespace
   * Else if the namespace is already set it returns the namespace
   *
   * @param {string} [ns] The namespace that will be set
   * @returns {string|null} The given or found namespace
   */
  namespace(ns) {
    if (ns !== undefined) {
      this._namespace = ns
    }
    return this._namespace
  }

  //eslint-disable-next-line require-jsdoc -- inherits from namespace
  ns(ns) {
    return this.namespace(ns)
  }

  /**
   * Returns if the page is a redirect
   *
   * @returns {boolean} Is the page a redirect
   */
  isRedirect() {
    return this._type === 'redirect'
  }

  /**
   * Returns information about the page this page redirects to
   *
   * @returns {null|{}} The redirected page
   */
  redirectTo() {
    return this._redirectTo
  }

  //eslint-disable-next-line require-jsdoc -- inherits from redirectTo
  redirectsTo() {
    return this.redirectTo()
  }

  //eslint-disable-next-line require-jsdoc -- inherits from redirectTo
  redirect() {
    return this.redirectTo()
  }

  //eslint-disable-next-line require-jsdoc -- inherits from redirectTo
  redirects() {
    return this.redirectTo()
  }

  /**
   * This function finds out if a page is a disambiguation page
   *
   * @returns {boolean} Whether the page is a disambiguation page
   */
  isDisambiguation() {
    return disambig(this)
  }

  //eslint-disable-next-line require-jsdoc -- inherits from isDisambiguation
  isDisambig() {
    return this.isDisambiguation()
  }

  /**
   * If a clue is available return the category at that index
   * Else return all categories
   *
   * @param {number} [clue] The index of the wanted category
   * @returns {string | string[]} The category at the provided index or all categories
   */
  categories(clue) {
    if (typeof clue === 'number') {
      return this._categories[clue]
    }
    return this._categories || []
  }

  /**
   * Returns the 0th or clue-th category
   *
   * @param {number} [clue] The index of the wanted category
   * @returns {object|string|number} The category at the provided index
   */
  category(clue) {
    return aliasWrapper(this.categories.bind(this), clue)
  }

  /**
   * returns the sections of the document
   *
   * If the clue is a string then it will return the section with that exact title
   * Else if the clue is a number then it returns the section at that index
   * Else it returns all the sections
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {Section | Section[]} A section or a array of sections
   */
  sections(clue) {
    let arr = this._sections || []
    arr.forEach((sec) => (sec._doc = this))

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

  /**
   * Returns the 0th or clue-th category
   *
   * @param {number} [clue] The index of the wanted section
   * @returns {Section} The section at the provided index
   */
  section(clue) {
    return aliasWrapper(this.sections.bind(this), clue)
  }

  /**
   * Returns the paragraphs in the document
   *
   * If the clue is a number then it returns the paragraph at that index
   * Else it returns all paragraphs in an array
   *
   * @param {number} [clue] The index of the to be selected paragraph
   * @returns {Paragraph | Paragraph[]} the selected paragraph or an array of all paragraphs
   */
  paragraphs(clue) {
    let arr = []
    this.sections().forEach((s) => {
      arr = arr.concat(s.paragraphs())
    })
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  }

  /**
   * returns the first or the clue-th paragraph
   *
   * @param {number} [clue] the index of the paragraph
   * @returns {Paragraph} The selected paragraph
   */
  paragraph(clue) {
    let arr = this.paragraphs() || []
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }

  /**
   * if no clue is provided, it compiles an array of sentences in the wiki text.
   * if the clue is provided it return the sentence at the provided index
   *
   * @param {number} clue the index of the wanted sentence
   * @returns {Sentence[]|Sentence} an array of sentences or a single sentence
   */
  sentences(clue) {
    let arr = []
    this.sections().forEach((sec) => {
      arr = arr.concat(sec.sentences())
    })
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  }

  /**
   * Returns the 0th or clue-th sentence
   *
   * @param {number} [clue] The index of the wanted sentence
   * @returns {Sentence} The sentence at the provided index
   */
  sentence(clue) {
    return aliasWrapper(this.sentences.bind(this), clue)
  }

  /**
   * This function search the whole page, including the infobox and image gallery templates for images
   * and then returns them in an array if no clue is provided.
   * if an clue is profieded then it returns the image at the clue-th index
   *
   * @param {number} [clue] the index of the image to be selected
   * @returns {Image[]|Image} a single image or an array of images
   */
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

  /**
   * Returns the 0th or clue-th image
   *
   * @param {number} [clue] The index of the wanted image
   * @returns {Image} The image at the provided index
   */
  image(clue) {
    return aliasWrapper(this.images.bind(this), clue)
  }

  /**
   * Return all links or if a clue is provided only the link at that index
   *
   * @param {number} [clue] the index of the wanted link
   * @returns {string[]|string} all the links or the selected link
   */
  links(clue) {
    return sectionMap(this, 'links', clue)
  }

  /**
   * Returns the 0th or clue-th link
   *
   * @param {number} [clue] The index of the wanted link
   * @returns {object|string|number} The link at the provided index
   */
  link(clue) {
    return aliasWrapper(this.links.bind(this), clue)
  }

  /**
   * Return all inter wiki links or if a clue is provided only the inter wiki link at that index
   *
   * @param {number} [clue] the index of the wanted inter wiki link
   * @returns {string[]|string} all the inter wiki links or the selected inter wiki link
   */
  interwiki(clue) {
    return sectionMap(this, 'interwiki', clue)
  }

  /**
   * If a clue is available return the list at that index
   * Else return all lists
   *
   * @param {number} [clue] The index of the wanted list
   * @returns {List | List[]} The list at the provided index or all lists
   */
  lists(clue) {
    return sectionMap(this, 'lists', clue)
  }

  /**
   * Returns the 0th or clue-th list
   *
   * @param {number} [clue] The index of the wanted list
   * @returns {object|string|number} The list at the provided index
   */
  list(clue) {
    return aliasWrapper(this.lists.bind(this), clue)
  }

  /**
   * If a clue is available return the tables at that index
   * Else return all tables
   *
   * @param {number} [clue] The index of the wanted table
   * @returns {Table | Tables[]} The table at the provided index or all tables
   */
  tables(clue) {
    return sectionMap(this, 'tables', clue)
  }

  /**
   * Returns the 0th or clue-th table
   *
   * @param {number} [clue] The index of the wanted table
   * @returns {object|string|number} The table at the provided index
   */
  table(clue) {
    return aliasWrapper(this.tables.bind(this), clue)
  }

  /**
   * If a clue is available return the template at that index
   * Else return all templates
   *
   * @param {number} [clue] The index of the wanted template
   * @returns {Template | Template[]} The category at the provided index or all categories
   */
  templates(clue) {
    return sectionMap(this, 'templates', clue)
  }

  /**
   * Returns the 0th or clue-th template
   *
   * @param {number} [clue] The index of the wanted template
   * @returns {object|string|number} The template at the provided index
   */
  template(clue) {
    return aliasWrapper(this.templates.bind(this), clue)
  }

  /**
   * If a clue is available return the references at that index
   * Else return all references
   *
   * @param {number} [clue] The index of the wanted references
   * @returns {Reference | Reference[]} The category at the provided index or all references
   */
  references(clue) {
    return sectionMap(this, 'references', clue)
  }

  /**
   * Returns the 0th or clue-th reference
   *
   * @param {number} [clue] The index of the wanted reference
   * @returns {object|string|number} The reference at the provided index
   */
  reference(clue) {
    return aliasWrapper(this.references.bind(this), clue)
  }

  //eslint-disable-next-line require-jsdoc -- inherits from reference
  citations(clue) {
    return this.references(clue)
  }

  /**
   * Returns the 0th or clue-th citation
   *
   * @param {number} [clue] The index of the wanted citation
   * @returns {object|string|number} The citation at the provided index
   */
  citation(clue) {
    return aliasWrapper(this.references.bind(this), clue)
  }

  /**
   * finds and returns all coordinates
   * or if an clue is given, the coordinate at the index
   *
   * @param {number} [clue] the index of the coordinate returned
   * @returns {object[]|object|null} if a clue is given, the coordinate of null, else an array of coordinates
   */
  coordinates(clue) {
    return sectionMap(this, 'coordinates', clue)
  }

  /**
   * Returns the 0th or clue-th coordinate
   *
   * @param {number} [clue] The index of the wanted coordinate
   * @returns {object|string|number} The coordinate at the provided index
   */
  coordinate(clue) {
    return aliasWrapper(this.coordinates.bind(this), clue)
  }

  /**
   * If clue is unidentified then it returns all infoboxes
   * If clue is a number then it returns the infobox at that index
   * It always sorts the infoboxes by size
   *
   * @param {number} [clue] the index of the infobox you want to select
   * @returns {Infobox | Infobox[]} the selected infobox or an array of infoboxes
   */
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

  /**
   * Returns the 0th or clue-th infobox
   *
   * @param {number} [clue] The index of the wanted infobox
   * @returns {object|string|number} The infobox at the provided index
   */
  infobox(clue) {
    return aliasWrapper(this.infoboxes.bind(this), clue)
  }

  /**
   * return a plain text version of the wiki article
   *
   * @param {object} [options] the options for the parser
   * @returns {string} the plain text version of the article
   */
  text(options) {
    options = setDefaults(options, defaults)
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text(options))
    return arr.join('\n\n')
  }

  //eslint-disable-next-line require-jsdoc -- inherits from text
  plaintext(options) {
    return this.text(options)
  }

  /**
   * return a json version of the Document class
   *
   * @param {object} [options] options for the rendering
   * @returns {object} this document as json
   */
  json(options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  /**
   * prints the title of every section
   *
   * @returns {Document} the document itself
   */
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
