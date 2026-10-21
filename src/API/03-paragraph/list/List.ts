import type { ListData } from '../../../types/index.ts'

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
    return this.lines().flatMap((s) => s.links)
  }

  json() {
    return this.#data.items
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
