import Images from '../03-paragraph/image/Images.ts'
import Infobox from './infobox/Infobox.ts'
import Infoboxes from './infobox/Infoboxes.ts'
import Link from '../03-paragraph/link/Link.ts'
import Links from '../03-paragraph/link/Links.ts'
import Lists from '../03-paragraph/list/Lists.ts'
import Paragraph from '../03-paragraph/Paragraph.ts'
import Reference from './reference/Reference.ts'
import References from './reference/References.ts'
import Blocks from '../Block/Blocks.ts'
import Table from './table/Table.ts'
import Tables from './table/Tables.ts'
import Template from './template/Template.ts'
import Templates from './template/Templates.ts'
import type { SectionData, BlockData, DocInfo } from '../../types/index.ts'

//the Section class represents the == title == sections of an article
class Section {
  #data: SectionData
  #info: DocInfo

  constructor(data: SectionData, info: DocInfo = {}) {
    this.#data = data
    this.#info = info
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

  sentences() {
    return Blocks.from(this.paragraphs().flatMap((p) => p.sentences()))
  }

  paragraphs() {
    const arr = this.#data.paragraphs || []
    return arr.map((p) => new Paragraph(p, this.#info))
  }

  wikitext() {
    return this.#data.wiki || ''
  }

  links() {
    // Stable group order; source-position ordering would require parser offsets.
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
    this.templates().forEach((template) => {
      arr.push(...template.links())
    })
    this.tables().forEach((t) => {
      arr.push(...t.links())
    })
    this.paragraphs().forEach((s) => {
      arr.push(...s.links())
    })

    arr = arr.flat().filter((val) => val !== undefined) //filter out all the undefined from the flattened empty arrays
    return Links.from(arr)
  }

  tables() {
    const arr = this.#data.tables || []
    return Tables.from(arr.map((t) => new Table(t)))
  }
  templates(clue?: string) {
    let arr = this.#data.templates.map((t) => new Template(t))
    if (clue) {
      return Templates.from(arr.filter((t) => t.type === clue || t.json().template === clue))
    }
    return Templates.from(arr)
  }

  infoboxes() {
    const arr = this.#data.infoboxes || []
    return Infoboxes.from(arr.map((t) => new Infobox(t, this.#info)))
  }

  coordinates() {
    let arr = this.templates('coord')
    let list = arr.map((tmpl) => ({ ...tmpl.json().data, wiki: tmpl.wikitext() }))
    //try to get coord from infoboxes
    let inf = this.infoboxes()[0]
    const coordinates = inf?.coordinates()
    if (coordinates) {
      list.push(coordinates)
    }
    return list
  }

  lists() {
    let arr = this.paragraphs().flatMap((p) => p.lists())
    return Lists.from(arr)
  }

  images() {
    return Images.from(this.paragraphs().flatMap((p) => p.images()))
  }

  references() {
    const arr = this.#data.references || []
    return References.from(arr.map((r) => new Reference(r)))
  }

  //outputs
  text() {
    return this.paragraphs()
      .map((p) => p.text())
      .join('\n\n')
  }

  json(format = 'lg') {
    if (format === 'xl') {
      return structuredClone(this.#data)
    }
    // leave the section's wikitext out of the copy, rather than cloning and then deleting it
    const { wiki: _wiki, ...data } = this.#data
    return structuredClone(data)
  }

  // aliases
  citations() {
    return this.references()
  }

  static empty() {
    return new Section({
      title: {} as BlockData,
      depth: 0,
      wiki: '',
      index: 0,
      templates: [],
      infoboxes: [],
      references: [],
      tables: [],
      paragraphs: [],
    })
  }
}
export default Section
