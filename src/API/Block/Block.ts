import type { BlockData } from '../../types/index.ts'

class Block {
  #data: BlockData
  constructor(data: BlockData) {
    this.#data = data
  }
  links() {
    return this.#data.links || []
  }
  fmt() {
    return this.#data.fmt || {}
  }
  bolds() {
    return this.#data.fmt.bold || []
  }
  italics() {
    return this.#data.fmt.italic || []
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
