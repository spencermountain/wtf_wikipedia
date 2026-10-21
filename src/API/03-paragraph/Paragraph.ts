import toJSON from './toJson.ts'
import Sentence from './sentence/Sentence.ts'
import Image from './image/Image.ts'
import Infobox from '../02-section/infobox/Infobox.ts'
import List from './list/List.ts'
import type { ParagraphData } from '../../types/index.ts'

class Paragraph {
  #data: ParagraphData

  constructor(data: ParagraphData) {
    this.#data = data
  }

  sentences() {
    const arr = this.#data.sentences || []
    return arr.map((s) => new Sentence(s))
  }

  // TODO: List collections have nested JSON; keep plain arrays for now.
  lists() {
    const arr = this.#data.lists || []
    return arr.map((l) => new List(l))
  }

  images() {
    const arr = this.#data.images || []
    return arr.map((i) => new Image(i))
  }

  links() {
    const items = this.sentences().flatMap((s) => s.links())
    return items[0] ?? null
  }

  interwiki() {
    const items = this.sentences().flatMap((s) => s.interwiki())
    return items[0] ?? null
  }

  text() {
    let str = this.sentences()
      .map((s) => s.text())
      .join(' ')
    this.lists().forEach((list) => {
      str += '\n' + list.text()
    })
    return str
  }

  json() {
    return toJSON(this, {})
  }

  wikitext() {
    return this.#data.wiki
  }
}

export default Paragraph
