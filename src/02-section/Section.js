import toJSON from './toJson.js'
import setDefaults from '../_lib/setDefaults.js'
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

//the Section class represents the == title == sections of an article
class Section {
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

  sentences() {
    return this.paragraphs().reduce((list, p) => {
      return list.concat(p.sentences())
    }, [])
  }

  paragraphs() {
    return this._paragraphs || []
  }

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

  tables() {
    return this._tables || []
  }

  templates(clue) {
    let arr = this._templates || []
    // arr = arr.map((t) => t.json())
    if (typeof clue === 'string') {
      clue = clue.toLowerCase()
      return arr.filter((o) => o.data.template === clue || o.data.name === clue)
    }

    return arr
  }

  infoboxes(clue) {
    let arr = this._infoboxes || []
    if (typeof clue === 'string') {
      clue = clue.replace(/^infobox /i, '')
      clue = clue.trim().toLowerCase()
      return arr.filter((info) => info._type === clue)
    }
    return arr
  }

  coordinates() {
    let arr = [...this.templates('coord'), ...this.templates('coor')]
    let list = arr.map((tmpl) => tmpl.json())
    //try to get coord from infoboxes
    let inf = this.infoboxes()[0]
    if (inf && inf.coordinates()) {
      list.push(inf.coordinates())
    }
    return list
  }

  lists() {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.lists())
    })
    return arr
  }

  interwiki() {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.interwiki())
    })
    return arr
  }

  images() {
    let arr = []
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.images())
    })
    return arr
  }

  references() {
    return this._references || []
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

  next() {
    return this.nextSibling()
  }

  lastSibling() {
    if (!this._doc) {
      return null
    }
    let sections = this._doc.sections()
    let index = this.index() || 0
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

  sections(clue) {
    return this.children(clue)
  }

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

  text(options) {
    options = setDefaults(options, defaults)
    return this.paragraphs()
      .map((p) => p.text(options))
      .join('\n\n')
  }
  wikitext() {
    return this._wiki
  }

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
