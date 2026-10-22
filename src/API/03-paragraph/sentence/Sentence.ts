import Block from '../../Block/Block.ts'
import type { BlockData } from '../../../types/index.ts'
import Link from '../link/Link.ts'

class Sentence extends Block {
  #data: BlockData

  constructor(data: BlockData) {
    super(data)
    this.#data = data
  }

  static empty() {
    // Only this factory bypasses the required fields for a missing sentence.
    return new Sentence({} as BlockData)
  }

  isEmpty() {
    return Object.keys(this.#data).length === 0
  }

  interwiki() {
    const links = this.#data.links || []
    return links.filter((link) => link.type === 'interwiki')
  }
}

export default Sentence
