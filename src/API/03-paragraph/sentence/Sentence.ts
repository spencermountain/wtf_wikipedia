import Block from '../../Block/Block.ts'
import type { BlockData } from '../../../types/index.ts'
import Link from '../link/Link.ts'

class Sentence extends Block {
  #data: BlockData

  constructor(data: BlockData) {
    super(data)
    this.#data = data
  }

  links() {
    const items = this.#data.links || []
    return items.map((item) => new Link(item))
  }

  interwiki() {
    const links = this.#data.links || []
    return links.filter((link) => link.type === 'interwiki')
  }
}

export default Sentence
