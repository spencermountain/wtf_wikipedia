const toJSON = require('./toJson')

//where we store the formatting, link, date information
const Sentence = function (data) {
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
  interwiki: function (n) {
    let arr = this.links().filter((l) => l.wiki !== undefined)
    return arr
  },
  bolds: function (n) {
    let arr = []
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      arr = this.data.fmt.bold || []
    }
    return arr
  },
  italics: function (n) {
    let arr = []
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      arr = this.data.fmt.italic || []
    }
    return arr
  },
  dates: function (n) {
    let arr = []
    return arr
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
}

Object.keys(methods).forEach((k) => {
  Sentence.prototype[k] = methods[k]
})

// aliases
const singular = {
  links: 'link',
  bolds: 'bold',
  italics: 'italic',
  dates: 'date',
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

module.exports = Sentence
