import Link from '../link/Link.js'
import encodeObj from '../_lib/encode.js'

//also called 'citations'
class Reference {
  /**
   * 
   * @param {object} data 
   * @param {string} data.type
   * @param {string} data.template
   * @param {object} data.data
   * @param {string} data.inline
   * 
   * @param {string} wiki 
   */
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
   * @param {number | string} [clue]
   * @returns {Link | Link[]}
   */
  links (clue) {
    let arr = []
    if (typeof clue === 'number') {
      return arr[clue]
    }

    //grab a specific link..
    if (typeof clue === 'number') {
      return arr[clue]
    } else if (typeof clue === 'string') {
      //grab a link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === clue)
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
