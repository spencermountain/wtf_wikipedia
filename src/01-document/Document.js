import sectionMap from './_sectionMap.js'
import toJSON from './toJson.js'
import isDisambig from './isDisambig.js'
import setDefaults from '../_lib/setDefaults.js'
import Image from '../image/Image.js'
import { isRedirect, parse as ParseRedirect } from './redirects.js'
import preProcess from './preProcess/index.js'
import parseSection from '../02-section/index.js'
import parseCategories from './categories.js'
import Sentence from '../04-sentence/Sentence.js'
import Reference from '../reference/Reference.js'
import Link from '../link/Link.js'
import List from '../list/List.js'
import Table from '../table/Table.js'
import Infobox from '../infobox/Infobox.js'
import Section from '../02-section/Section.js'
import Paragraph from '../03-paragraph/Paragraph.js'
import Template from '../template/Template.js'
import {singularFactory} from '../_lib/singularFactory.js'

const defaults = {
  tables: true,
  lists: true,
  paragraphs: true,
}

/**
 * The document class is the main entry point of wtf_wikipedia.
 * this class represents an article of wikipedia.
 * from here you can go to the infoboxes or paragraphs
 *
 * @class
 */
class Document {
  /**
   * The constructor for the document class
   * This function starts parsing the wiki text and sets the options in the class
   *
   * @param {string} [wiki] The wiki text
   * @param {object} [options] The options for the parser
   * @param {number} [options.pageID] The pageID of the page
   * @param {number} [options.id] The pageID of the page
   * @param {string} [options.namespace] The namespace of the page
   * @param {string} [options.ns] The namespace of the page
   * @param {string} [options.lang] The language of the page
   * @param {string} [options.language] The language of the page
   * @param {string} [options.domain] The domain of the page
   * @param {string} [options.title] The title of the page
   * @param {string} [options.wikidata] The WikidataID of the page
   * 
   * @param {string} [options.userAgent] the user-agent to use for http requests
   * @param {string} [options.User-Agent ] the user-agent to use for http requests
   * @param {string} [options.Api-User-Agent] the user-agent to use for http requests
   * 
   * 
   */
  constructor (wiki, options) {
    options = options || {}
    this._pageID = options.pageID || options.id || null
    this._namespace = options.namespace || options.ns || null
    this._lang = options.lang || options.language || null
    this._domain = options.domain || null
    this._title = options.title || null
    this._type = 'page'
    this._redirectTo = null
    this._wikidata = options.wikidata || null

    this._wiki = wiki || ''
    
    this._categories = []
    this._sections = []
    this._coordinates = []
    // userAgent is used for successive calls to the API
    this._userAgent = options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library'

    // this._missing_templates = {} //for stats+debugging purposes

    //detect if page is just redirect, and return it
    if (isRedirect(this._wiki)) {
      this._type = 'redirect'
      this._redirectTo = ParseRedirect(this._wiki)
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

  /**
   * Getter and setter for the tile.
   * If string is given then this function is a setter and sets the variable and returns the set value
   * If the string is not given then it will check if the title is available
   * If it is available it returns the title.
   * Else it will look if the first sentence contains a bolded phrase and assumes that's the title and returns it
   *
   * @param {string} [str] - sets the title and returns the set title
   * @returns {null|string|Sentence} The title found or given
   */
  title (str) {
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

  /**
   * If an pageID is given then it sets the pageID and returns the given pageID
   * Else if the pageID is already set it returns the pageID
   *
   * @param {number} [id] The pageID that will be set
   * @returns {number|null} The given or found pageID
   */
  pageID (id) {
    if (id !== undefined) {
      this._pageID = id
    }
    return this._pageID || null
  }

  /**
   * If an WikidataID is given then it sets the WikidataID and returns the given WikidataID
   * Else if the WikidataID is already set it returns the WikidataID
   *
   * @param {string} [id] The WikidataID that will be set
   * @returns {string|null} The given or found WikidataID
   */
  wikidata (id) {
    if (id !== undefined) {
      this._wikidata = id
    }
    return this._wikidata || null
  }

  /**
   * If an domain is given then it sets the domain and returns the given domain
   * Else if the domain is already set it returns the domain
   *
   * @param {string} [str] The domain that will be set
   * @returns {string|null} The given or found domain
   */
  domain (str) {
    if (str !== undefined) {
      this._domain = str
    }
    return this._domain || null
  }

  /**
   * If an language is given then it sets the language and returns the given language
   * Else if the language is already set it returns the language
   *
   * @param {string} [lang] The language that will be set
   * @returns {string|null} The given or found language
   */
  language (lang) {
    if (lang !== undefined) {
      this._lang = lang
    }
    return this._lang || null
  }

  /**
   * Gets the url of the page
   * If the language or domain is not available we substitute 'en' and 'wikipedia.org'
   * Then we use the template of `https://${lang}.${domain}/wiki/${title}` to make the url
   *
   * @returns {string|null} The url of the page
   */
  url () {
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
  namespace (ns) {
    if (ns !== undefined) {
      this._namespace = ns
    }
    return this._namespace || null
  }

  /**
   * Returns if the page is a redirect
   *
   * @returns {boolean} Is the page a redirect
   */
  isRedirect () {
    return this._type === 'redirect'
  }

  /**
   * Returns information about the page this page redirects to
   *
   * @returns {null|object} The redirected page
   */
  redirectTo () {
    return this._redirectTo
  }

  /**
   * This function finds out if a page is a disambiguation page
   *
   * @returns {boolean} Whether the page is a disambiguation page
   */
  isDisambiguation () {
    return isDisambig(this)
  }

  /**
   * If a clue is available return the category at that index
   * Else return all categories
   *
   * @param {number} [clue] The index of the category
   * @returns {string[]} The category at the provided index or all categories
   */
  categories (clue) {
    let arr = this._categories || []
    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    return arr
  }

  /**
   * returns the sections of the document
   *
   * If the clue is a string then it will return the section with that exact title
   * Else if the clue is a number then it returns the section at that index
   * Else it returns all the sections
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {Section[]} A section or a array of sections
   */
  sections (clue) {
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

  /**
   * Returns the paragraphs in the document
   *
   * If the clue is a number then it returns the paragraph at that index
   * Else it returns all paragraphs in an array
   * 
   * @param {number} [clue] The index of the wanted paragraph
   * @returns {Paragraph[]} the selected paragraph or an array of all paragraphs
   */
  paragraphs (clue) {
    let arr =     this.sections()
      .map((s) => s.paragraphs())
      .reduce((a, b) => a.concat(b), [])

    if (typeof clue === 'number') {
      return [arr[clue]]
    }
    
    return arr
  }

  /**
   * if no clue is provided, it compiles an array of sentences in the wiki text.
   * if the clue is provided it return the sentence at the provided index
   * @param {number} [clue] given index of a sentence
   * @returns {Sentence[]} an array of sentences or a single sentence
   */
  sentences (clue) {
    let arr = this.sections()
      .map((sec) => sec.sentences())
      .reduce((a, b) => a.concat(b), [])

    if (typeof clue === 'number') {
      return [arr[clue]]
    }

    return arr
  }

  /**
   * This function search the whole page, including the infobox and image gallery templates for images
   * and then returns them in an array if no clue is provided.
   * if an clue is provided then it returns the image at the clue-th index
   *
   * @param {number} [clue] given index of an image
   * @returns {Image[]} a single image or an array of images
   */
  images (clue) {
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

  /**
   * Return all links or if a clue is provided only the link at that index
   *
   * @param {number} [clue] the index of the wanted link
   * @returns {Link[]} all the links or the selected link
   */
  links (clue) {
    return sectionMap(this, 'links', clue)
  }

  /**
   * Return all inter wiki links or if a clue is provided only the inter wiki link at that index
   *
   * @param {number} [clue] the index of the wanted inter wiki link
   * @returns {Link[]} all the inter wiki links or the selected inter wiki link
   */
  interwiki (clue) {
    return sectionMap(this, 'interwiki', clue)
  }

  /**
   * If a clue is available return the list at that index
   * Else return all lists
   *
   * @param {number} [clue] The index of the wanted list
   * @returns {List[]} The list at the provided index or all lists
   */
  lists (clue) {
    return sectionMap(this, 'lists', clue)
  }

  /**
   * If a clue is available return the tables at that index
   * Else return all tables
   *
   * @param {number} [clue] The index of the wanted table
   * @returns {Table[]} The table at the provided index or all tables
   */
  tables (clue) {
    return sectionMap(this, 'tables', clue)
  }

  /**
   * If a clue is available return the template at that index
   * Else return all templates
   *
   * @param {number} [clue] The index of the wanted template
   * @returns {Template[]} The category at the provided index or all categories
   */
  templates (clue) {
    return sectionMap(this, 'templates', clue)
  }

  /**
   * If a clue is available return the references at that index
   * Else return all references
   *
   * @param {number} [clue] The index of the wanted references
   * @returns {Reference[]} The category at the provided index or all references
   */
  references (clue) {
    return sectionMap(this, 'references', clue)
  }

  /**
   * Returns the 0th or clue-th reference
   *
   * @param {number} [clue] The index of the wanted reference
   * @returns {Reference[]} The reference at the provided index
   */
  citations (clue) {
    return this.references(clue)
  }

  /**
   * finds and returns all coordinates
   * or if an clue is given, the coordinate at the index
   *
   * @param {number} [clue] the index of the coordinate returned
   * @returns {object[]|object|null} if a clue is given, the coordinate of null, else an array of coordinates
   */
  coordinates (clue) {
    return sectionMap(this, 'coordinates', clue)
  }

  /**
   * If clue is unidentified then it returns all infoboxes
   * If clue is a number then it returns the infobox at that index
   * It always sorts the infoboxes by size
   *
   * @param {number} [clue] the index of the infobox you want to select
   * @returns {Infobox[]} an array of infoboxes or a single infobox in an array
   */
  infoboxes (clue) {
    let arr = sectionMap(this, 'infoboxes', clue)
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return 1
      }
      return -1
    })

    return arr
  }

  /**
   * return a plain text version of the wiki article
   *
   * @param {object} [options] the options for the parser
   * @returns {string} the plain text version of the article
   */
  text (options) {
    options = setDefaults(options, defaults)
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map((sec) => sec.text(options))
    return arr.join('\n\n')
  }

  /**
   * return a json version of the Document class
   *
   * @param {object} [options] options for the rendering
   * @returns {object} this document as json
   */
  json (options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  /**
   * return original wiki markup
   *
   * @returns {string} markup text
   */
  wikitext () {
    return this._wiki || ''
  }

  /**
   * prints the title of every section
   *
   * @returns {Document} the document itself
   */
  debug () {
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
}

// aliases
Document.prototype.category = singularFactory('categories')
Document.prototype.section = singularFactory('sections')
Document.prototype.paragraph = singularFactory('paragraphs')
Document.prototype.sentence = singularFactory('sentences')
Document.prototype.image = singularFactory('images')
Document.prototype.link = singularFactory('links')
Document.prototype.list = singularFactory('lists')
Document.prototype.table = singularFactory('tables')
Document.prototype.template = singularFactory('templates')
Document.prototype.reference = singularFactory('references')
Document.prototype.citation = singularFactory('citations')
Document.prototype.coordinate = singularFactory('coordinates')
Document.prototype.infobox = singularFactory('infoboxes')

Document.prototype.lang = Document.prototype.language
Document.prototype.ns = Document.prototype.namespace
Document.prototype.plaintext = Document.prototype.text
Document.prototype.isDisambig = Document.prototype.isDisambiguation
Document.prototype.citations = Document.prototype.references
Document.prototype.redirectsTo = Document.prototype.redirectTo
Document.prototype.redirect = Document.prototype.redirectTo
Document.prototype.redirects = Document.prototype.redirectTo

export default Document
