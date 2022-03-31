import toJSON from './toJson.js'
import setDefaults from '../_lib/setDefaults.js'
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
  sentences: function () {
    return this.data.sentences || []
  },
  references: function () {
    return this.data.references
  },
  lists: function () {
    return this.data.lists
  },
  images() {
    return this.data.images || []
  },
  links: function (clue) {
    let arr = []
    this.sentences().forEach((s) => {
      arr = arr.concat(s.links(clue))
    })
    if (typeof clue === 'string') {
      //grab a specific link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === clue)
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  interwiki() {
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
  wikitext: function () {
    return this.data.wiki
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
  citations: 'citation',
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

export default Paragraph
