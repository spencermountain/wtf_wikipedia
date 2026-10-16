import toJSON from './toJson.ts'
import Sentence from '../04-sentence/Sentence.ts'
import List from '../list/List.ts'
import setDefaults from '../_lib/setDefaults.ts'
import type { ParagraphData } from '../../types/index.ts'

const defaults = {
  sentences: true,
  lists: true,
  images: true,
}

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
    return this.#data.images || []
  }

  links() {
    const items = this.sentences().flatMap((s) => s.links())
    return items[0] ?? null
  }

  interwiki() {
    const items = this.sentences().flatMap((s) => s.interwiki())
    return items[0] ?? null
  }

  text(options?) {
    options = setDefaults(options, defaults)
    let str = this.sentences()
      .map((s) => s.text(options))
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
