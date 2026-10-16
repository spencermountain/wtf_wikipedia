import toJSON from './toJson.ts'
import type { SentenceData } from '../../../types/index.ts'
//where we store the formatting, link, date information
class Sentence {
  #data: SentenceData

  constructor(data: SentenceData) {
    this.#data = data
  }

  links() {
    const items = this.#data.links || []
    return items
  }

  interwiki() {
    return this.links().filter((link) => link.type === 'interwiki')
  }

  fmt() {
    return this.#data.fmt || {}
  }
  // TODO: Formatting values are strings, not model collections.
  bolds() {
    if (this.#data && this.#data.fmt && this.#data.fmt.bold) {
      return this.#data.fmt.bold || []
    }
    return []
  }

  // TODO: Formatting values are strings, not model collections.
  italics() {
    if (this.#data && this.#data.fmt && this.#data.fmt.italic) {
      return this.#data.fmt.italic || []
    }
    return []
  }

  text() {
    return this.#data.text || ''
  }

  json(options?) {
    return toJSON(this, options)
  }

  wikitext() {
    return this.#data.wiki || ''
  }

  isEmpty() {
    return this.#data.text === ''
  }
}

export default Sentence
