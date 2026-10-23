import Table from './table/Table.ts'
import Reference from './reference/Reference.ts'
import Infobox from './infobox/Infobox.ts'
import Template from './template/Template.ts'
import Link from '../03-paragraph/link/Link.ts'
import Paragraph from '../03-paragraph/Paragraph.ts'
import type { SectionData, BlockData } from '../../types/index.ts'

//the Section class represents the == title == sections of an article
class Section {
  #data: SectionData

  constructor(data: SectionData) {
    this.#data = data
  }
  title() {
    return this.#data.title?.text || ''
  }

  index() {
    return this.#data.index ?? null
  }
  depth() {
    return this.#data.depth || 0
  }

  sentence() {
    return this.paragraphs()[0]?.sentence()
  }
  sentences() {
    return this.paragraphs().flatMap((p) => p.sentences())
  }

  paragraphs() {
    const arr = this.#data.paragraphs || []
    return arr.map((p) => new Paragraph(p))
  }

  links() {
    let arr = []
    // section headers can have links
    if (this.#data.title?.links) {
      this.#data.title.links.forEach((l) => {
        arr.push(new Link(l))
      })
    }
    this.infoboxes().forEach((templ) => {
      arr.push(...templ.links())
    })
    this.references().forEach((s) => {
      arr.push(...s.links())
    })
    this.tables().forEach((t) => {
      arr.push(...t.links())
    })
    this.paragraphs().forEach((s) => {
      arr.push(...s.links())
    })

    arr = arr.flat().filter((val) => val !== undefined) //filter out all the undefined from the flattened empty arrays
    return arr
  }

  // TODO: Table collections have nested JSON; keep plain arrays for now.
  tables() {
    const arr = this.#data.tables || []
    return arr.map((t) => new Table(t))
  }

  template(clue?: string) {
    return this.templates(clue)[0] ?? Template.empty()
  }
  templates(clue?: string) {
    let arr = this.#data.templates.map((t) => new Template(t))
    if (clue) {
      return arr.filter((t) => t.type === clue || t.json().template === clue)
    }
    return arr
  }

  infoboxes() {
    const arr = this.#data.infoboxes || []
    return arr.map((t) => new Infobox(t))
  }

  // TODO: Coordinates are plain data, not model collections.
  coordinates() {
    let arr = this.templates('coord')
    let list = arr.map((tmpl) => tmpl.json().data)
    //try to get coord from infoboxes
    let inf = this.infoboxes()[0]
    const coordinates = inf?.coordinates()
    if (coordinates) {
      list.push(coordinates)
    }
    return list
  }

  // TODO: List collections have nested JSON; keep plain arrays for now.
  lists() {
    let arr = this.paragraphs().flatMap((p) => p.lists())
    return arr
  }

  interwiki() {
    return this.links().filter((l) => l.type() === 'interwiki')
  }

  images() {
    return this.paragraphs().flatMap((p) => p.images())
  }

  references() {
    const arr = this.#data.references || []
    return arr.map((r) => new Reference(r))
  }

  //outputs
  text() {
    return this.paragraphs()
      .map((p) => p.text())
      .join('\n\n')
  }

  json() {
    return this.#data
  }

  isEmpty() {
    return Object.keys(this.#data).length === 0
  }

  // aliases
  wikitext() {
    return this.#data.wiki || ''
  }
  indentation() {
    return this.depth()
  }
  citations() {
    return this.references()
  }

  static empty() {
    return new Section({
      title: {} as BlockData,
      depth: 0,
      wiki: '',
      index: 0,
      remaining: '',
      templates: [],
      infoboxes: [],
      references: [],
      tables: [],
      paragraphs: [],
    })
  }
}
export default Section
