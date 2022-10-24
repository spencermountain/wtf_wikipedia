import setDefaults from '../_lib/setDefaults.js'
import toJson from './toJson.js'

function normalize (key = '') {
  key = key.toLowerCase()
  key = key.replace(/[_-]/g, ' ')
  key = key.replace(/\(.*?\)/, '')
  key = key.trim()
  return key
}

class Table {
  constructor (data, wiki = '') {
    this.data = data
    this._wiki = wiki
  }

  links (n) {
    let links = []
    this.data.forEach((r) => {
      Object.keys(r).forEach((k) => {
        links = links.concat(r[k].links())
      })
    })
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = links.find((o) => o.page() === n)
      return link === undefined ? [] : [link]
    }
    return links
  }

  get (keys) {
    // normalize mappings
    let have = this.data[0] || {}
    let mapping = Object.keys(have).reduce((h, k) => {
      h[normalize(k)] = k
      return h
    }, {})
    // string gets a flat-list
    if (typeof keys === 'string') {
      let key = normalize(keys)
      key = mapping[key] || key
      return this.data.map((row) => {
        return row[key] ? row[key].text() : null
      })
    }
    // array gets obj-list
    keys = keys.map(normalize).map((k) => mapping[k] || k)
    return this.data.map((row) => {
      return keys.reduce((h, k) => {
        if (row[k]) {
          h[k] = row[k].text()
        } else {
          h[k] = ''
        }
        return h
      }, {})
    })
  }

  keyValue (options) {
    let rows = this.json(options)
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text
      })
    })
    return rows
  }

  json (options) {
    const defaults = {}
    options = setDefaults(options, defaults)
    return toJson(this.data, options)
  }

  text () {
    return ''
  }

  wikitext () {
    return this._wiki || ''
  }
}

Table.prototype.keyvalue = Table.prototype.keyValue
Table.prototype.keyval = Table.prototype.keyValue

export default Table
