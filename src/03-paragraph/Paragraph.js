const toJSON = require('./toJson')
const setDefaults = require('../_lib/setDefaults')
const defaults = {
  sentences: true,
  lists: true,
  images: true,
}

const Paragraph = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  sentences: function (num) {
    return this.data.sentences || []
  },
  references: function (num) {
    return this.data.references
  },
  lists: function (num) {
    return this.data.lists
  },
  images(num) {
    return this.data.images || []
  },
  links: function (n) {
    let arr = []
    this.sentences().forEach((s) => {
      arr = arr.concat(s.links(n))
    })
    if (typeof n === 'string') {
      //grab a specific link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === n)
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  interwiki(num) {
    let arr = []
    this.sentences().forEach((s) => {
      arr = arr.concat(s.interwiki())
    })
    return arr || []
  },
  text: function (options) {
    options = setDefaults(options, defaults)
    let str = this.sentences()
      .map((s) => s.text(options))
      .join(' ')
    this.lists().forEach((list) => {
      str += '\n' + list.text()
    })
    return str
  },
  json: function (options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  },
}
methods.citations = methods.references
Object.keys(methods).forEach((k) => {
  Paragraph.prototype[k] = methods[k]
})

// aliases
const singular = {
  sentences: 'sentence',
  references: 'reference',
  citation: 'citations',
  lists: 'list',
  images: 'image',
  links: 'link',
}
Object.keys(singular).forEach((k) => {
  let sing = singular[k]
  Paragraph.prototype[sing] = function (clue) {
    let arr = this[k](clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }
})

module.exports = Paragraph
