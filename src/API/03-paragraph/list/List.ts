import type { ListData } from '../../../types/index.ts'
import Link from '../link/Link.ts'

class List {
  #data: ListData
  #wiki: string

  constructor(data: ListData) {
    this.#data = data
  }

  lines() {
    return this.#data.items
  }

  links() {
    const out = []
    this.lines().forEach((s) => (s.links || []).forEach((obj) => out.push(new Link(obj))))
    return out
  }

  json() {
    return this.#data
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
    return this.#wiki || ''
  }
}

export default List
