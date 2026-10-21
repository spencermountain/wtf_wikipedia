import Table from './table/Table.ts'
import Reference from './reference/Reference.ts'
import Infobox from './infobox/Infobox.ts'
import Template from './template/Template.ts'
import Paragraph from '../03-paragraph/Paragraph.ts'
import type { SectionData } from '../../types/index.ts'

//the Section class represents the == title == sections of an article
class Section {
  #data: SectionData

  constructor(data: SectionData) {
    this.#data = data
  }

  title() {
    return this.#data.title || ''
  }

  index() {
    return this.#data.index || ''
  }
  depth() {
    return this.#data.depth || 0
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

    return arr
  }

  // TODO: Table collections have nested JSON; keep plain arrays for now.
  tables() {
    const arr = this.#data.tables || []
    return arr.map((t) => new Table(t))
  }

  templates() {
    const arr = this.#data.templates || []
    return arr.map((t) => new Template(t))
  }

  infoboxes() {
    const arr = this.#data.infoboxes || []
    return arr.map((t) => new Infobox(t))
  }

  // TODO: Coordinates are plain data, not model collections.
  coordinates() {
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
  lists() {
    let arr = this.paragraphs().flatMap((p) => p.lists())
    return arr
  }

  interwiki() {
    return this.paragraphs().flatMap((p) => p.interwiki())
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

  // aliases
  wikitext() {
    return this.#data.wiki
  }
  indentation() {
    return this.depth()
  }
  citations() {
    return this.references()
  }
}
export default Section
