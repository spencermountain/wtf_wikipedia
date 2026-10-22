import type { BlockData } from '../../types/index.ts'
import Link from '../03-paragraph/link/Link.ts'

class Block {
  #data: BlockData
  constructor(data: BlockData) {
    this.#data = data
  }
  links() {
    const items = this.#data.links || []
    return items.map((item) => new Link(item))
  }
  bolds() {
    return this.#data.bolds || []
  }
  italics() {
    return this.#data.italics || []
  }
  text() {
    return this.#data.text || ''
  }
  json() {
    return this.#data
  }
  wikitext() {
    return this.#data.wiki || ''
  }
  isEmpty() {
    return this.#data.text === ''
  }
}

export default Block
