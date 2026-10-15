import Collection from '../collection/Collection.js'
import setDefaults from '../_lib/setDefaults.ts'
import toJson from './toJson.ts'
import type { TableData } from '../../types/index.ts'
const defaults = {}

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

  constructor(data: TableData, wiki: string = '') {
    this.#data = data
    this.#wiki = wiki
  }

  get data() {
    return this.#data
  }

  get _wiki() {
    return this.#wiki
  }

  links(selector?) {
    const items = this.#data.flatMap((row) => Object.keys(row).flatMap((key) => row[key].links()))
    return Collection.from(items).select(selector)
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
      return Object.fromEntries(keys.map((k) => [k, row[k] ? row[k].text() : '']))
    })
  }

  keyValue(options?) {
    let rows = this.json(options)
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text
      })
    })
    return rows
  }

  keyvalue(options?) {
    return this.keyValue(options)
  }

  keyval(options?) {
    return this.keyValue(options)
  }

  json(options?) {
    options = setDefaults(options, defaults)
    return toJson(this.#data, options)
  }

  text() {
    return ''
  }

  wikitext() {
    return this._wiki || ''
  }
}

export default Table
