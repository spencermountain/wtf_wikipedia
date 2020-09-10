const encode = require('../_lib/encode')

//also called 'citations'
const Reference = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  title: function () {
    let data = this.data
    return data.title || data.encyclopedia || data.author || ''
  },
  links: function (n) {
    let arr = []
    if (typeof n === 'number') {
      return arr[n]
    }
    //grab a specific link..
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === n)
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  text: function () {
    return '' //nah, skip these.
  },

  json: function (options = {}) {
    let json = this.data || {}
    //encode them, for mongodb
    if (options.encode === true) {
      json = Object.assign({}, json)
      json = encode.encodeObj(json)
    }
    return json
  },
}
Object.keys(methods).forEach((k) => {
  Reference.prototype[k] = methods[k]
})
module.exports = Reference
