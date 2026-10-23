import Links from '../link/Links.ts'
import type { ListData } from '../../../types/index.ts'
import Block from '../../Block/Block.ts'
import Blocks from '../../Block/Blocks.ts'

class List {
  #data: ListData

  constructor(data: ListData) {
    this.#data = data
  }

  lines() {
    return this.items()
  }
  items() {
    return Blocks.from(this.#data.items.map((item) => new Block(item)))
  }

  links() {
    return Links.from(this.items().flatMap((block) => block.links()))
  }

  json(format = 'lg') {
    const json = structuredClone(this.#data)
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    return json
  }

  text() {
    const items = this.#data.items
    return items
      .map((s) => {
        let str = s.text
        return ' * ' + str
      })
      .join('\n')
  }

  wikitext() {
    return this.#data.wiki || ''
  }
}

export default List
