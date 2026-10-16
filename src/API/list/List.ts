import type { ListData } from '../../types/index.ts'

const toText = (list, options?) => {
  return list
    .map((s) => {
      let str = s.text(options)
      return ' * ' + str
    })
    .join('\n')
}

class List {
  #data: ListData
  #wiki: string

  constructor(data: ListData, wiki: string) {
    this.#data = data
    this.#wiki = wiki
  }

  lines() {
    return this.#data.items
  }

  links() {
    return this.lines().flatMap((s) => s.links())
  }

  json() {
    return this.#data.items
  }

  text() {
    return toText(this.#data.items)
  }

  wikitext() {
    return this.#wiki || ''
  }
}

export default List
