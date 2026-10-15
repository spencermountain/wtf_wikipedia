import Collection from '../collection/Collection.js'
import setDefaults from '../_lib/setDefaults.ts'
import type { ListData } from '../../types/index.ts'
const defaults = {}

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

  lines(selector?) {
    return Collection.from(this.#data.items).select(selector)
  }

  links(selector?) {
    const items = this.lines().flatMap((s) => s.links())
    return Collection.from(items).select(selector)
  }

  json(options?) {
    options = setDefaults(options, defaults)
    return this.lines().map((s) => s.json(options))
  }

  text() {
    return toText(this.#data.items)
  }

  wikitext() {
    return this.#wiki || ''
  }
}

export default List
