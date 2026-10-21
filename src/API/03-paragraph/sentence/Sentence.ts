import Block from '../../Block/Block.ts'
import type { BlockData } from '../../../types/index.ts'

class Sentence extends Block {
  #data: BlockData

  constructor(data: BlockData) {
    super(data)
    this.#data = data
  }

  links() {
    const items = this.#data.links || []
    return items
  }

  interwiki() {
    return this.links().filter((link) => link.type === 'interwiki')
  }
}

export default Sentence
