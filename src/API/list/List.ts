import Collection from '../collection/Collection.js'
import setDefaults from '../_lib/setDefaults.ts'
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
  declare data: any
  declare wiki: string

  constructor(data, wiki = '') {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data,
    })
    Object.defineProperty(this, 'wiki', {
      enumerable: false,
      value: wiki,
    })
  }

  lines(selector?) {
    return Collection.from(this.data).select(selector)
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
    return toText(this.data)
  }

  wikitext() {
    return this.wiki || ''
  }
}

export default List
