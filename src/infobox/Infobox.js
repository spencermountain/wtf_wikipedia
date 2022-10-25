import toJson from './toJson.js'
import Image from '../image/Image.js'
import { isArray } from '../_lib/helpers.js'
import Sentence from '../04-sentence/Sentence.js'
import Link from '../link/Link.js'

function normalize (str = '') {
  str = str.toLowerCase()
  str = str.replace(/[-_]/g, ' ')
  return str.trim()
}

//a formal key-value data table about a topic
class Infobox {
  /**
   * 
   * @param {object} obj 
   * @param {string} [obj.wiki] - the wikitext of the infobox
   * @param {string} [obj.type] - the type of infobox
   * @param {string} [obj.domain] - the domain of the infobox
   * @param {object} [obj.data] - the data of the infobox
   * @param {string} [wiki] 
   */
  constructor (obj, wiki) {
    this._type = obj.type
    this.domain = obj.domain
    this._data = obj.data
    this.wiki = wiki
  }

  /**
   * 
   * @returns {string | undefined} - the type of infobox
   */
  type () {
    return this._type
  }

  /**
   * get the links from the infobox
   * 
   * @param {string} [n] - the index of the link
   * @returns {Link[]} - the links in the infobox
   */
  links (n) {
    let arr = []
    Object.keys(this._data).forEach((k) => {
      this._data[k].links().forEach((l) => arr.push(l))
    })

    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === n)
      return link === undefined ? [] : [link]
    }

    return arr
  }

  /**
   * 
   * @returns {Image | null} - the image in the infobox
   */
  image () {
    let s = this._data.image
      || this._data.image2
      || this._data.logo
      || this._data.image_skyline
      || this._data.image_flag

    if (!s) {
      return null
    }

    let obj = s.json()
    let file = obj.text
    obj.file = file
    obj.text = ''
    obj.caption = this._data.caption
    obj.domain = this.domain // add domain information for image

    return new Image(obj)
  }

  /**
   * get the value of from the infobox
   * 
   * @param {string | string[]} keys - the key or keys of the infobox 
   * @returns {Sentence | Sentence[]} - the value or values of the infobox
   */
  get (keys) {
    let allKeys = Object.keys(this._data)
    if (typeof keys === 'string') {
      let key = normalize(keys)
      for (let i = 0; i < allKeys.length; i += 1) {
        let tmp = normalize(allKeys[i])
        if (key === tmp) {
          return this._data[allKeys[i]]
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
            return this._data[allKeys[i]]
          }
        }
        return new Sentence()
      })
    }
    return new Sentence()
  }

  /**
   * 
   * @returns {string} - the text from the infobox
   */
  text () {
    return ''
  }

  /**
   * 
   * @param {object} options 
   * @returns {object}
   */
  json (options) {
    options = options || {}
    return toJson(this, options)
  }

  /**
   * 
   * @returns {string} - the wikitext of the infobox
   */
  wikitext () {
    return this.wiki || ''
  }

  /**
   * 
   * @returns {object} - the key-value data of the infobox
   */
  keyValue () {
    return Object.keys(this._data).reduce((h, k) => {
      if (this._data[k]) {
        h[k] = this._data[k].text()
      }
      return h
    }, {})
  }

  // aliases
  data () {
    return this.keyValue()
  }

  template () {
    return this.type()
  }

  images () {
    return this.image()
  }

}

export default Infobox
