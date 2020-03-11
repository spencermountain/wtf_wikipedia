const setDefaults = require('../_lib/setDefaults')
const toJson = require('./toJson')
const defaults = {}

const Table = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  })
}

const methods = {
  links(n) {
    let links = []
    this.data.forEach(r => {
      Object.keys(r).forEach(k => {
        links = links.concat(r[k].links())
      })
    })
    //grab a specific link..
    if (typeof n === 'number') {
      return links[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = links.find(o => o.page() === n)
      return link === undefined ? [] : [link]
    }
    return links
  },
  keyValue(options) {
    let rows = this.json(options)
    rows.forEach(row => {
      Object.keys(row).forEach(k => {
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
  }
}
methods.keyvalue = methods.keyValue
methods.keyval = methods.keyValue

Object.keys(methods).forEach(k => {
  Table.prototype[k] = methods[k]
})
module.exports = Table
