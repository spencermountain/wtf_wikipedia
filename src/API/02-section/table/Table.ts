import type { TableData } from '../../../types/index.ts'
import Link from '../../03-paragraph/link/Link.ts'

const normalize = function (key = '') {
  key = key.toLowerCase()
  key = key.replace(/[_-]/g, ' ')
  key = key.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1')
  key = key.trim()
  return key
}

class Table {
  #data: TableData
  #wiki: string

  constructor(data: TableData) {
    this.#data = data
  }

  get data() {
    return this.#data
  }

  get _wiki() {
    return this.#wiki
  }

  links() {
    const links = []
    this.#data.forEach((row) =>
      Object.keys(row).forEach((key) =>
        row[key].links.forEach((link) => {
          links.push(new Link(link))
        })
      )
    )
    return links
  }

  // TODO: Row/column projections remain plain arrays.
  get(keys?) {
    // normalize mappings
    let have = this.#data[0] || {}
    let mapping = Object.fromEntries(Object.keys(have).map((k) => [normalize(k), k]))
    // string gets a flat-list
    if (typeof keys === 'string') {
      let key = normalize(keys)
      key = mapping[key] || key
      return this.#data.map((row) => {
        return row[key] ? row[key].text() : null
      })
    }
    // array gets obj-list
    keys = keys.map(normalize).map((k) => mapping[k] || k)
    return this.#data.map((row) => {
      return Object.fromEntries(keys.map((k) => [k, row[k] || '']))
    })
  }

  keyValue() {
    let rows = this.json()
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text
      })
    })
    return rows
  }

  json() {
    return this.#data
  }

  text() {
    return ''
  }

  wikitext() {
    return this._wiki || ''
  }
}

export default Table
