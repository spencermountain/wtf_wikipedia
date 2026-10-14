import Collection from '../collection/Collection.js'
import toJSON from './toJson.ts'
import setDefaults from '../_lib/setDefaults.ts'
import parseTable from '../table/index.ts'
import parseParagraphs from '../03-paragraph/index.ts'
import parseTemplates from '../template/index.ts'
import parseReferences from '../reference/index.ts'
import parseStartEndTemplates from './start-to-end/index.ts'

const defaults = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true,
}

//return the first, or n-th element of an array
const getNth = function (arr, clue) {
  if (typeof clue === 'number') {
    return arr[clue] || null
  }
  return arr[0] || null
}

//the Section class represents the == title == sections of an article
class Section {
  declare _doc: any
  declare _title: string
  declare _depth: number
  declare _wiki: string
  declare _templates: any[]
  declare _tables: any[]
  declare _infoboxes: any[]
  declare _references: any[]
  declare _paragraphs: any[]

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

  sentences(selector?) {
    return Collection.from(this.paragraphs().flatMap(p => p.sentences())).select(selector)
  }

  paragraphs(selector?) {
    return Collection.from(this._paragraphs || []).select(selector)
  }

  links(clue?) {
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

    arr = arr.flat().filter((val) => val !== undefined) //filter out all the undefined from the flattened empty arrays

    return Collection.from(arr).select(clue)
  }

  // TODO: Table collections have nested JSON; keep plain arrays for now.
  tables(_clue?) {
    return this._tables || []
  }

  templates(selector?) {
    return Collection.from(this._templates || []).select(selector)
  }

  infoboxes(selector?) {
    return Collection.from(this._infoboxes || []).select(selector)
  }

  // TODO: Coordinates are plain data, not model collections.
  coordinates(_clue?) {
    let arr = [...this.templates('coord'), ...this.templates('coor')]
    let list = arr.map((tmpl) => tmpl.json())
    //try to get coord from infoboxes
    let inf = this.infoboxes()[0]
    const coordinates = inf?.coordinates()
    if (coordinates) {
      list.push(coordinates)
    }
    return list
  }

  // TODO: List collections have nested JSON; keep plain arrays for now.
  lists(_clue?) {
    let arr = this.paragraphs().flatMap((p) => p.lists())
    return arr
  }

  interwiki(selector?) {
    return Collection.from(this.paragraphs().flatMap(p => p.interwiki())).select(selector)
  }

  images(selector?) {
    return Collection.from(this.paragraphs().flatMap(p => p.images())).select(selector)
  }

  references(selector?) {
    return Collection.from(this._references || []).select(selector)
  }

  //transformations
  remove() {
    if (!this._doc) {
      return null
    }

    let bads = new Set([this.title()])

    //remove children too
    this.children().forEach((sec) => bads.add(sec.title()))
    let sections = this._doc.sections()
    sections = sections.filter((sec) => !bads.has(sec.title()))

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
    //look backward for the previous section at the same depth,
    //stopping if we walk up-and-out of our parent (mirrors nextSibling)
    for (let i = index - 1; i >= 0; i--) {
      if (sections[i].depth() < this.depth()) {
        return null
      }
      if (sections[i].depth() === this.depth()) {
        return sections[i]
      }
    }
    return null
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

  child(selector?) {
    return this.children(selector)[0] ?? null
  }

  children(clue?) {
    if (!this._doc) {
      return new Collection()
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
    return Collection.from(children).select(clue)
  }

  sections(clue?) {
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

  text(options?) {
    options = setDefaults(options, defaults)
    return this.paragraphs()
      .map((p) => p.text(options))
      .join('\n\n')
  }
  wikitext() {
    return this._wiki
  }

  json(options?) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  citations(clue?) {
    return this.references(clue)
  }

  // singular aliases
  sentence(selector?) {
    return this.sentences(selector)[0] ?? null
  }
  paragraph(selector?) {
    return this.paragraphs(selector)[0] ?? null
  }
  link(selector?) {
    return this.links(selector)[0] ?? null
  }
  table(clue?) {
    return getNth(this.tables(clue), clue)
  }
  template(selector?) {
    return this.templates(selector)[0] ?? null
  }
  infobox(selector?) {
    return this.infoboxes(selector)[0] ?? null
  }
  coordinate(clue?) {
    return getNth(this.coordinates(clue), clue)
  }
  list(clue?) {
    return getNth(this.lists(clue), clue)
  }
  image(selector?) {
    return this.images(selector)[0] ?? null
  }
  reference(selector?) {
    return this.references(selector)[0] ?? null
  }
  citation(selector?) {
    return this.citations(selector)[0] ?? null
  }
}
export default Section
