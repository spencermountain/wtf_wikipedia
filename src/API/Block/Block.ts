import type { BlockData } from '../../types/index.ts'
import Link from '../03-paragraph/link/Link.ts'
import Links from '../03-paragraph/link/Links.ts'

class Block {
  #data: BlockData
  constructor(data: BlockData) {
    this.#data = data
  }
  links() {
    const items = this.#data.links || []
    return Links.from(items.map((item) => new Link(item)))
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
  json(format = 'lg') {
    const json = structuredClone(this.#data)
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    json.links?.forEach((link) => {
      delete link.wiki
    })
    json.bolds?.forEach((span) => {
      delete span.wiki
    })
    json.italics?.forEach((span) => {
      delete span.wiki
    })
    return json
  }
  wikitext() {
    return this.#data.wiki || ''
  }
  isEmpty() {
    return this.#data.text === ''
  }
}

export default Block
