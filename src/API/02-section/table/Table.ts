import type { TableData } from '../../../types/index.ts'
import Link from '../../03-paragraph/link/Link.ts'
import { normalizeKey } from '../../../_lib/helpers.ts'

class Table {
  #data: TableData

  constructor(data: TableData) {
    this.#data = data
  }

  cells() {
    let arr = [...this.#data.headers]
    this.#data.rows.forEach((row) => {
      Object.values(row).forEach((cell) => {
        arr.push(cell)
      })
    })
    return arr
  }
  links() {
    const links = []
    this.cells().forEach((block) => {
      if (block.links) {
        block.links.forEach((obj) => {
          links.push(new Link(obj))
        })
      }
    })
    return links
  }

  cols() {
    const row = this.#data.rows[0]
    return Object.keys(row || {})
  }
  headers() {
    return this.#data.headers
  }
  rows() {
    // simplify data into one string per cell
    return this.#data.rows.map((row) => {
      const result = {}
      Object.keys(row).forEach((key) => {
        result[key] = row[key].text || ''
      })
      return result
    })
  }
  // return only the requested cols
  getRows(requested: string[] | string | object) {
    const rows = this.rows()
    if (!requested) {
      return rows
    }
    // ['foo', 'bar']
    if (Array.isArray(requested)) {
      requested = requested.map((col) => normalizeKey(col))
      return rows.map((row) => requested.map((col) => row[col]))
    }
    // 'foo'
    if (typeof requested === 'string') {
      return rows.map((row) => row[normalizeKey(requested)])
    }
    // { foo:true, bar: true}
    if (typeof requested === 'object') {
      return rows.map((row) => {
        let result = {}
        Object.entries(requested).forEach(([key, val]) => {
          if (val) {
            let clean = normalizeKey(key)
            result[clean] = row[clean]
          }
        })
        return result
      })
    }
    return []
  }

  json() {
    return this.#data
  }

  text() {
    return ''
  }
  wikitext() {
    return this.#data.wiki || ''
  }
}

export default Table
