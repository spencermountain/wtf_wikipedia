const setDefaults = require('../_lib/setDefaults')
const defaults = {}

const toText = (list, options) => {
  return list
    .map((s) => {
      let str = s.text(options)
      return ' * ' + str
    })
    .join('\n')
}

const List = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  lines() {
    return this.data
  },
  links(clue) {
    let links = []
    this.lines().forEach((s) => {
      links = links.concat(s.links())
    })
    if (typeof clue === 'string') {
      //grab a link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = links.find((o) => o.page() === clue)
      return link === undefined ? [] : [link]
    }
    return links
  },
  json(options) {
    options = setDefaults(options, defaults)
    return this.lines().map((s) => s.json(options))
  },
  text() {
    return toText(this.data)
  },
}

Object.keys(methods).forEach((k) => {
  List.prototype[k] = methods[k]
})
module.exports = List
