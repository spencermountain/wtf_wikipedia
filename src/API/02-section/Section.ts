import Collection from '../collection/Collection.js'
import toJSON from './toJson.ts'
import setDefaults from '../_lib/setDefaults.ts'
import Paragraph from '../03-paragraph/Paragraph.ts'
import type { SectionData } from '../../types/index.ts'

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

  sentences(selector?) {
    return Collection.from(this.paragraphs().flatMap((p) => p.sentences())).select(selector)
  }

  paragraphs(selector?) {
    const arr = this.#data.paragraphs || []
    return arr.map((p) => new Paragraph(p))
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
    return this.#data.tables || []
  }

  templates(selector?) {
    return Collection.from(this.#data.templates || []).select(selector)
  }

  infoboxes(selector?) {
    return Collection.from(this.#data.infoboxes || []).select(selector)
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
    return Collection.from(this.paragraphs().flatMap((p) => p.interwiki())).select(selector)
  }

  images(selector?) {
    return Collection.from(this.paragraphs().flatMap((p) => p.images())).select(selector)
  }

  references(selector?) {
    return Collection.from(this.#data.references || []).select(selector)
  }

  //outputs
  text(options?) {
    options = setDefaults(options, defaults)
    return this.paragraphs()
      .map((p) => p.text(options))
      .join('\n\n')
  }

  json(options?) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  // aliases
  wikitext() {
    return this._wiki
  }
  indentation() {
    return this.depth()
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
