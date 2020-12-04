const setDefaults = require('../_lib/setDefaults')
const toJson = require('./toJson')
const defaults = {}

const normalize = function (key = '') {
  key = key.toLowerCase()
  key = key.replace(/[_-]/g, ' ')
  key = key.replace(/\(.*?\)/, '')
  key = key.trim()
  return key
}

const Table = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  links(n) {
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
  },
  get(keys) {
    // string gets a flat-list
    if (typeof keys === 'string') {
      let key = normalize(keys)
      return this.data.map((row) => {
        return row[key] ? row[key].text() : null
      })
    }
    // array gets obj-list
    keys = keys.map(normalize)
    return this.data.map((row) => {
      return keys.reduce((h, k) => {
        if (row[k]) {
          h[k] = row[k].text()
        }
        return h
      }, {})
    })
  },
  keyValue(options) {
    let rows = this.json(options)
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text
      })
    })
    return rows
  },
  json(options) {
    options = setDefaults(options, defaults)
    return toJson(this.data, options)
  },

  text() {
    return ''
  },
}
methods.keyvalue = methods.keyValue
methods.keyval = methods.keyValue

Object.keys(methods).forEach((k) => {
  Table.prototype[k] = methods[k]
})
module.exports = Table
