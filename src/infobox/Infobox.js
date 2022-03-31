import toJson from './toJson.js'
import Image from '../image/Image.js'
import { isArray } from '../_lib/helpers.js'
import Sentence from '../04-sentence/Sentence.js'

const normalize = (str = '') => {
  str = str.toLowerCase()
  str = str.replace(/[-_]/g, ' ')
  return str.trim()
}

//a formal key-value data table about a topic
const Infobox = function (obj, wiki) {
  this._type = obj.type
  this.domain = obj.domain
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data,
  })
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki,
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
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === n)
      return link === undefined ? [] : [link]
    }
    return arr
  },
  image: function () {
    let s = this.data.image || this.data.image2 || this.data.logo || this.data.image_skyline || this.data.image_flag
    if (!s) {
      return null
    }
    let obj = s.json()
    let file = obj.text
    obj.file = file
    obj.text = ''
    obj.caption = this.data.caption
    obj.domain = this.domain // add domain information for image
    return new Image(obj)
  },
  get: function (keys) {
    let allKeys = Object.keys(this.data)
    if (typeof keys === 'string') {
      let key = normalize(keys)
      for (let i = 0; i < allKeys.length; i += 1) {
        let tmp = normalize(allKeys[i])
        if (key === tmp) {
          return this.data[allKeys[i]]
        }
      }
      return new Sentence()
    }
    if (isArray(keys)) {
      // support array-input
      keys = keys.map(normalize)
      return keys.map((k) => {
        for (let i = 0; i < allKeys.length; i += 1) {
          let tmp = normalize(allKeys[i])
          if (k === tmp) {
            return this.data[allKeys[i]]
          }
        }
        return new Sentence()
      })
    }
    return new Sentence()
  },
  text: function () {
    return ''
  },
  json: function (options) {
    options = options || {}
    return toJson(this, options)
  },
  wikitext: function () {
    return this.wiki || ''
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
export default Infobox
