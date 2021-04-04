const toText = require('../04-sentence').fromText

const methods = {
  text: function () {
    let str = this._text || ''
    return toText(str).text()
  },
  json: function () {
    return this.data || {}
  },
  wikitext: function () {
    return this.wiki || ''
  },
}

const Template = function (data, text = '', wiki = '') {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
  Object.defineProperty(this, '_text', {
    enumerable: false,
    value: text,
  })
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
  })
}

Object.keys(methods).forEach((k) => {
  Template.prototype[k] = methods[k]
})
module.exports = Template
