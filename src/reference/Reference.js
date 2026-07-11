import encodeObj from '../_lib/encode.js'

//also called 'citations'
const Reference = function (data, wiki) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
  })
}

const methods = {
  title: function () {
    let data = this.data
    return data.title || data.encyclopedia || data.author || ''
  },
  links: function () {
    return [] //nah, skip these.
  },
  text: function () {
    return '' //nah, skip these.
  },
  wikitext: function () {
    return this.wiki || ''
  },
  json: function (options = {}) {
    let json = this.data || {}
    //encode them, for mongodb
    if (options.encode === true) {
      json = Object.assign({}, json)
      json = encodeObj(json)
    }
    return json
  },
}
Object.keys(methods).forEach((k) => {
  Reference.prototype[k] = methods[k]
})
export default Reference
