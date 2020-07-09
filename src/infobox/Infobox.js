const toJson = require('./toJson')
const Image = require('../image/Image')

const normalize = (str) => {
  str = str.toLowerCase()
  str = str.replace(/[-_]/g, ' ')
  return str.trim()
}

//a formal key-value data table about a topic
const Infobox = function (obj) {
  this._type = obj.type
  this.domain = obj.domain
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data,
  })
}

const methods = {
  type: function () {
    return this._type
  },
  links: function (n) {
    let arr = []
    Object.keys(this.data).forEach((k) => {
      this.data[k].links().forEach((l) => arr.push(l))
    })
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === n)
      return link === undefined ? [] : [link]
    }
    return arr
  },
  image: function () {
    let s = this.get('image') || this.get('image2') || this.get('logo')
    if (!s) {
      return null
    }
    let obj = s.json()
    obj.file = obj.text
    obj.text = ''
    obj.domain = this.domain // add domain information for image
    return new Image(obj)
  },
  get: function (key = '') {
    key = normalize(key)
    let keys = Object.keys(this.data)
    for (let i = 0; i < keys.length; i += 1) {
      let tmp = normalize(keys[i])
      if (key === tmp) {
        return this.data[keys[i]]
      }
    }
    return null
  },
  text: function () {
    return ''
  },
  json: function (options) {
    options = options || {}
    return toJson(this, options)
  },
  keyValue: function () {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].text()
      }
      return h
    }, {})
  },
}
//aliases

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k]
})
Infobox.prototype.data = Infobox.prototype.keyValue
Infobox.prototype.template = Infobox.prototype.type
Infobox.prototype.images = Infobox.prototype.image
module.exports = Infobox
