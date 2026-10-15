import Collection from '../collection/Collection.js'
import toJSON from './toJson.ts'
import type { SentenceData } from '../../types/index.ts'
//where we store the formatting, link, date information
class Sentence {
  #data: SentenceData

  constructor(data: SentenceData) {
    this.#data = data
  }

  links(selector?) {
    const items = this.#data.links || []
    return Collection.from(items).select(selector)
  }

  link(selector?) {
    return this.links(selector)[0] ?? null
  }

  interwiki(selector?) {
    return this.links()
      .filter((link) => link.type() === 'interwiki')
      .select(selector)
  }

  // TODO: Formatting values are strings, not model collections.
  bolds() {
    if (this.#data && this.#data.fmt && this.#data.fmt.bold) {
      return this.#data.fmt.bold || []
    }
    return []
  }

  bold(clue) {
    let arr = this.bolds()
    if (typeof clue === 'number') {
      return arr[clue] || null
    }
    return arr[0] || null
  }

  // TODO: Formatting values are strings, not model collections.
  italics() {
    if (this.#data && this.#data.fmt && this.#data.fmt.italic) {
      return this.#data.fmt.italic || []
    }
    return []
  }

  italic(clue) {
    let arr = this.italics()
    if (typeof clue === 'number') {
      return arr[clue] || null
    }
    return arr[0] || null
  }

  text(str?) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.#data.text = str
    }
    return this.#data.text || ''
  }

  plaintext(str?) {
    return this.text(str)
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
