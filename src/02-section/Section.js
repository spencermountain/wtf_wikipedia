import toJSON from './toJson.js'
import setDefaults from '../_lib/setDefaults.js'
// import parseHeading from './heading.js'
import parseTable from '../table/index.js'
import parseParagraphs from '../03-paragraph/index.js'
import parseTemplates from '../template/index.js'
import parseReferences from '../reference/index.js'
import parseStartEndTemplates from './start-to-end/index.js'

const defaults = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true,
}

/**
 * the Section class represents the different sections of the article.
 * we look for the == title == syntax and split and parse the sections from there
 *
 * @class
 */
class Section {
  /**
   * the stuff between headings - 'History' section for example
   *
   * @param {object} data the data already gathered about the section
   * @param {object} doc the document that this section belongs to
   */
  constructor(data, doc) {
    let props = {
      doc: doc,
      title: data.title || '',
      depth: data.depth,
      wiki: data.wiki || '',
      templates: [],
      tables: [],
      infoboxes: [],
      references: [],
      paragraphs: [],
    }
    Object.keys(props).forEach((k) => {
      Object.defineProperty(this, '_' + k, {
        enumerable: false,
        writable: true,
        value: props[k],
      })
    })

    //parse-out <template></template>' and {{start}}...{{end}} templates
    const startEndTemplates = parseStartEndTemplates(this, doc)
    this._wiki = startEndTemplates.text
    this._templates = this._templates.concat(startEndTemplates.templates)

    //parse-out the <ref></ref> tags
    parseReferences(this)
    //parse-out all {{templates}}
    parseTemplates(this, doc)

    //parse the tables
    parseTable(this)

    //now parse all double-newlines
    parseParagraphs(this, doc)
  }

  /**
   * returns the title of a section. if no title is available then it returns empty string
   *
   * @returns {string} the title of the section
   */
  title() {
    return this._title || ''
  }

  /**
   * returns the index of the current section in the document
   *
   * @returns {number | null} the index of the current section in the document
   */
  index() {
    if (!this._doc) {
      return null
    }
    let index = this._doc.sections().indexOf(this)
    if (index === -1) {
      return null
    }
    return index
  }

  /**
   * returns the depth (or indentation) of the section
   * aka how many levels deep is this section located
   *
   * @returns {number} the depth of the section
   */
  depth() {
    return this._depth
  }

  /**
   * returns the depth (or indentation) of the section
   * aka how many levels deep is this section located
   *
   * @returns {number} the depth of the section
   */
  indentation() {
    return this.depth()
  }

  /**
   * returns all sentences in the section
   * if an clue is provided then it returns the sentence at clue-th index
   *
   * @returns {object | object[]} all sentences in an array or the clue-th sentence
   */
  sentences() {
    return this.paragraphs().reduce((list, p) => {
      return list.concat(p.sentences())
    }, [])
  }

  /**
   * returns all paragraphs in the section
   * if an clue is provided then it returns the paragraph at clue-th index
   *
   * @returns {object | object[]} all paragraphs in an array or the clue-th paragraph
   */
  paragraphs() {
    return this._paragraphs || []
  }

  /**
   * returns all links in the section
   * if an clue is provided and it is a number then it returns the link at clue-th index
   * if an clue is provided and it is a string then it returns the link at the that content
   *
   * @param {number| string} [clue] the clue for selecting the link
   * @returns {object | object[]} all links in an array or the clue-th link or the link with the content of clue
   */
  links(clue) {
    let arr = []

    this.infoboxes().forEach((templ) => {
      arr.push(templ.links())
    })

    this.sentences().forEach((s) => {
      arr.push(s.links())
    })

    this.tables().forEach((t) => {
      arr.push(t.links())
    })

    this.lists().forEach((list) => {
      arr.push(list.links())
    })

    arr = arr
      .reduce((acc, val) => acc.concat(val), []) //flatten the array
      .filter((val) => val !== undefined) //filter out all the undefined from the flattened empty arrays

    if (typeof clue === 'string') {
      let link = arr.find((o) => o.page().toLowerCase() === clue.toLowerCase())
      return link === undefined ? [] : [link]
    }

    return arr
  }

  /**
   * returns all tables in the section
   * if an clue is provided then it returns the table at clue-th index
   *
   * @returns {object | object[]} all tables in an array or the clue-th infobox
   */
  tables() {
    return this._tables || []
  }

  /**
   * returns all templates in the section
   * if an clue is provided and clue is a number then it returns the template at clue-th index
   * if an clue is provided and clue is a string then it returns all template with that name
   *
   * @param {number|string} [clue] the clue for selecting the template
   * @returns {object | object[]} all templates in an array or the clue-th template or all template name `clue`
   */
  templates(clue) {
    let arr = this._templates || []
    // arr = arr.map((t) => t.json())
    if (typeof clue === 'string') {
      clue = clue.toLowerCase()
      return arr.filter((o) => o.data.template === clue || o.data.name === clue)
    }

    return arr
  }

  /**
   * returns all infoboxes in the section
   * if an clue is provided then it returns the infobox at clue-th index
   *
   * @param {number|string} [clue] the clue for selecting the infobox
   * @returns {object | object[]} all infoboxes in an array or the clue-th infobox
   */
  infoboxes(clue) {
    let arr = this._infoboxes || []
    if (typeof clue === 'string') {
      clue = clue.replace(/^infobox /i, '')
      clue = clue.trim().toLowerCase()
      return arr.filter((info) => info._type === clue)
    }
    return arr
  }

  /**
   * returns all lists in the section
   * if an clue is provided then it returns the list at clue-th index
   *
   * @returns {object | object[]} all lists in an array or the clue-th list
   */
  coordinates() {
    let arr = [...this.templates('coord'), ...this.templates('coor')]
    return arr.map((tmpl) => tmpl.json())
  }

  /**
   * returns all lists in the section
   * if an clue is provided then it returns the list at clue-th index
   *
   * @returns {object | object[]} all lists in an array or the clue-th list
   */
  lists() {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.lists())
    })
    return arr
  }

  /**
   * returns all interwiki links in the section
   * if an clue is provided then it returns the interwiki link at clue-th index
   *
   * @returns {object | object[]} all interwiki links in an array or the clue-th interwiki link
   */
  interwiki() {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.interwiki())
    })
    return arr
  }

  /**
   * returns all images in the section
   * if an clue is provided then it returns the image at clue-th index
   *
   * @returns {object | object[]} all images in an array or the clue-th image
   */
  images() {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.images())
    })
    return arr
  }

  /**
   * returns all references in the section
   * if an clue is provided then it returns the reference at clue-th index
   *
   * @returns {object | object[]} all references in an array or the clue-th reference
   */
  references() {
    return this._references || []
  }

  //transformations
  /**
   * Removes the section from the document
   *
   * @returns {null|object} the document without this section. or null if there is no document
   */
  remove() {
    if (!this._doc) {
      return null
    }

    let bads = {}
    bads[this.title()] = true

    //remove children too
    this.children().forEach((sec) => (bads[sec.title()] = true))
    let sections = this._doc.sections()
    sections = sections.filter((sec) => bads.hasOwnProperty(sec.title()) !== true)
    sections = sections.filter((sec) => bads.hasOwnProperty(sec.title()) !== true)

    this._doc._sections = sections
    return this._doc
  }

  //move-around sections like in jquery
  /**
   * returns the next sibling of this section
   * if it can find one then it returns null
   *
   * @returns {Section|null} the next sibling
   */
  nextSibling() {
    //if this section is not part of a document then we can go to the next part of the document
    if (!this._doc) {
      return null
    }

    //first we get the a list of sections and our own position in this list
    let sections = this._doc.sections()
    let index = this.index() || 0

    //then we look trough the list looking for the next sibling
    //aka we look the next item at the same depth as us
    //so we start the loop at the next section in the list and go till the length of the list
    for (let i = index + 1; i < sections.length; i++) {
      //if the depth is smaller then the current depth then there is no next sibling
      //aka the depth of the section at position i a level higher then this section then this section is the last section at this depth
      if (sections[i].depth() < this.depth()) {
        return null
      }
      //if the section has the same depth as the current section then it is the next sibling
      if (sections[i].depth() === this.depth()) {
        return sections[i]
      }
    }
    //if the loop has no results then there is no next sibling and we are at the end of the file
    return null
  }

  /**
   * returns the next sibling of this section
   * if it can find one then it returns null
   *
   * @returns {Section|null} the next sibling
   */
  next() {
    return this.nextSibling()
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  lastSibling() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections()
    let index = this.index() || 0
    return sections[index - 1] || null
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  last() {
    return this.lastSibling()
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  previousSibling() {
    return this.lastSibling()
  }

  /**
   * returns the previous section
   *
   * @returns {Section|null} the previous section
   */
  previous() {
    return this.lastSibling()
  }

  /**
   * returns all the children of a section
   *
   * If the clue is a string then it will return the child with that exact title
   * Else if the clue is a number then it returns the child at that index
   * Else it returns all the children
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {Section | Section[] | null} A section or a array of sections
   */
  children(clue) {
    if (!this._doc) {
      return null
    }

    let sections = this._doc.sections()
    let index = this.index() || 0
    let children = []

    //(immediately preceding sections with higher depth)
    if (sections[index + 1] && sections[index + 1].depth() > this.depth()) {
      for (let i = index + 1; i < sections.length; i += 1) {
        if (sections[i].depth() > this.depth()) {
          children.push(sections[i])
        } else {
          break
        }
      }
    }
    if (typeof clue === 'string') {
      return children.find((s) => s.title().toLowerCase() === clue.toLowerCase())
    }
    return children
  }

  /**
   * returns all the children of a section
   *
   * If the clue is a string then it will return the child with that exact title
   * Else if the clue is a number then it returns the child at that index
   * Else it returns all the children
   *
   * @param {number | string} [clue] A title of a section or a index of a wanted section
   * @returns {Section | Section[] | null} A section or a array of sections
   */
  sections(clue) {
    return this.children(clue)
  }

  /**
   * returns all the parent of a section
   *
   * @returns {Section | null} A section that is the parent of a section
   */
  parent() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections()
    let index = this.index() || 0

    for (let i = index; i >= 0; i -= 1) {
      if (sections[i] && sections[i].depth() < this.depth()) {
        return sections[i]
      }
    }

    return null
  }

  //outputs

  /**
   * returns a plaintext version of the section
   *
   * @param {object} options options for the text transformation
   * @returns {string} the section in text
   */
  text(options) {
    options = setDefaults(options, defaults)
    return this.paragraphs()
      .map((p) => p.text(options))
      .join('\n\n')
  }
  /**
   * returns original wiki markup
   *
   * @returns {string} the original markup
   */
  wikitext() {
    return this._wiki
  }

  /**
   * returns a json version of the section
   *
   * @param {object} options keys to include in the resulting json
   * @returns {object} the section in json
   */
  json(options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }
}
Section.prototype.citations = Section.prototype.references

// aliases
const singular = {
  sentences: 'sentence',
  paragraphs: 'paragraph',
  links: 'link',
  tables: 'table',
  templates: 'template',
  infoboxes: 'infobox',
  coordinates: 'coordinate',
  lists: 'list',
  images: 'image',
  references: 'reference',
  citations: 'citation',
}
Object.keys(singular).forEach((k) => {
  let sing = singular[k]
  Section.prototype[sing] = function (clue) {
    let arr = this[k](clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0] || null
  }
})
export default Section
