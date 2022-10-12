import encodeObj from '../_lib/encode.js'

//also called 'citations'
class Reference {
  constructor (data, wiki) {
    this.data = data
    this.wiki = wiki
  }

  /**
   *
   * @returns {string} tile of the reference
   */
  title () {
    return this.data.title || this.data.encyclopedia || this.data.author || ''
  }

  /**
   *
   * @param {number | string} [n]
   * @returns {}
   */
  links (n) {
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
  }

  /**
   * NOT IMPLEMENTED
   *
   * @returns {string} the text of the reference
   */
  text () {
    return '' //nah, skip these.
  }

  /**
   *
   * @returns {string} the wiki text of the reference
   */
  wikitext () {
    return this.wiki || ''
  }

  /**
   *
   * @param {object} options the options for the serialization
   * @returns {object} the serialized reference
   */
  json (options = {}) {
    let json = this.data || {}
    //encode them, for mongodb
    if (options.encode === true) {
      json = Object.assign({}, json)
      json = encodeObj(json)
    }
    return json
  }
}

export default Reference
