import toJSON from './toJson.js'

//where we store the formatting, link, date information
const Sentence = function (data = {}) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  links: function (n) {
    let arr = this.data.links || []
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page === n)
      return link === undefined ? [] : [link]
    }
    return arr
  },
  interwiki: function () {
    return this.links().filter((l) => l.wiki !== undefined)
  },
  bolds: function () {
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      return this.data.fmt.bold || []
    }
    return []
  },
  italics: function () {
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      return this.data.fmt.italic || []
    }
    return []
  },
  text: function (str) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.data.text = str
    }
    return this.data.text || ''
  },
  json: function (options) {
    return toJSON(this, options)
  },
  wikitext: function () {
    return this.data.wiki || ''
  },
  isEmpty: function () {
    return this.data.text === ''
  },
}

Object.keys(methods).forEach((k) => {
  Sentence.prototype[k] = methods[k]
})

// aliases
const singular = {
  links: 'link',
  bolds: 'bold',
  italics: 'italic',
}
Object.keys(singular).forEach((k) => {
  let sing = singular[k]
  Sentence.prototype[sing] = function (clue) {
    let arr = this[k](clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }
})

Sentence.prototype.plaintext = Sentence.prototype.text

export default Sentence
