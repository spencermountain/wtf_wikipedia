//@ts-expect-error because this is some kind of type definition for jsdoc that's why typescript does not recognize it
const Document = require('../01-document/Document')
const toJSON = require('./toJson')
const setDefaults = require('../_lib/setDefaults')

const parse = {
  heading: require('./heading'),
  table: require('../table'),
  paragraphs: require('../03-paragraph'),
  templates: require('../template'),
  references: require('../reference'),
  startEndTemplates: require('./start-to-end'),
}

const defaults = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true,
}

/**
 * @class
 */
class Section {
  /**
   * the stuff between headings - 'History' section for example
   *
   * @param {Object} data the data already gathered about the section
   * @param {Document} doc the document that this section belongs to
   */
  constructor(data, doc) {
    this._doc = doc || null

    this._title = data.title || ''
    this._depth = data.depth
    this._wiki = data.wiki || ''
    this._templates = []
    this._tables = []
    this._infoboxes = []
    this._references = []
    this._paragraphs = []

    //parse-out <template></template>' and {{start}}...{{end}} templates
    const startEndTemplates = parse.startEndTemplates(this, doc)
    this._wiki = startEndTemplates.text
    this._templates = [...this._templates, ...startEndTemplates.templates]

    //parse-out the <ref></ref> tags
    parse.references(this)
    //parse-out all {{templates}}
    parse.templates(this, doc)

    //parse the tables
    parse.table(this)

    //now parse all double-newlines
    parse.paragraphs(this, doc)
  }

  title() {
    return this._title || ''
  }

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

  depth() {
    return this._depth
  }

  indentation() {
    return this.depth()
  }

  sentences(n) {
    let arr = this.paragraphs().reduce((list, p) => {
      return list.concat(p.sentences())
    }, [])
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr || []
  }

  paragraphs(n) {
    let arr = this._paragraphs || []
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr || []
  }

  paragraph(n) {
    let arr = this._paragraphs || []
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr[0]
  }

  links(n) {
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

    if (typeof n === 'number') {
      return arr[n]
    }

    if (typeof n === 'string') {
      n = n.toLowerCase()

      let link = arr.find((o) => o.page().toLowerCase() === n)

      return link === undefined ? [] : [link]
    }

    return arr
  }

  tables(clue) {
    let arr = this._tables || []
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  }

  templates(clue) {
    let arr = this._templates || []
    arr = arr.map((t) => t.json())
    if (typeof clue === 'number') {
      return arr[clue]
    }
    if (typeof clue === 'string') {
      clue = clue.toLowerCase()
      return arr.filter((o) => o.template === clue || o.name === clue)
    }
    return arr
  }

  infoboxes(clue) {
    let arr = this._infoboxes || []
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  }

  coordinates(clue) {
    let arr = [...this.templates('coord'), ...this.templates('coor')]
    if (typeof clue === 'number') {
      if (!arr[clue]) {
        return []
      }
      return arr[clue]
    }
    return arr
  }

  lists(clue) {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.lists())
    })
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  }

  interwiki(num) {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.interwiki())
    })
    if (typeof num === 'number') {
      return arr[num]
    }
    return arr || []
  }

  images(clue) {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.images())
    })
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr || []
  }

  references(clue) {
    let arr = this._references || []
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  }

  citations(clue) {
    return this.references(clue)
  }

  //transformations
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
    this._doc._sections = sections
    return this._doc
  }

  //move-around sections like in jquery
  nextSibling() {
    //if this section is not part of a document then we can go to the next part of the document
    if (!this._doc) {
      return null
    }

    //first we get the a list of sections and our own position in this list
    let sections = this._doc.sections()
    let index = this.index()

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

  next() {
    return this.nextSibling()
  }

  lastSibling() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections()
    let index = this.index()
    return sections[index - 1] || null
  }

  last() {
    return this.lastSibling()
  }

  previousSibling() {
    return this.lastSibling()
  }

  previous() {
    return this.lastSibling()
  }

  children(n) {
    if (!this._doc) {
      return null
    }

    let sections = this._doc.sections()
    let index = this.index()
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
    if (typeof n === 'string') {
      n = n.toLowerCase()
      return children.find((s) => s.title().toLowerCase() === n)
    }
    if (typeof n === 'number') {
      return children[n]
    }
    return children
  }

  sections(n) {
    return this.children(n)
  }

  parent() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections()
    let index = this.index()
    for (let i = index; i >= 0; i -= 1) {
      if (sections[i] && sections[i].depth() < this.depth()) {
        return sections[i]
      }
    }
    return null
  }

  text(options) {
    options = setDefaults(options, defaults)
    let pList = this.paragraphs()
    pList = pList.map((p) => p.text(options))
    return pList.join('\n\n')
  }

  json(options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  toJSON() {
    return Object.entries(this)
      .filter((entry) => entry[0] !== '_doc')
      .reduce((accum, [k, v]) => {
        accum[k] = v
        return accum
      }, {})
  }
}

module.exports = Section
