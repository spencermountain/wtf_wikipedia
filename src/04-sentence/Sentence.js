import toJSON from './toJson.js'
import Link from '../link/Link.js'
import {singularFactory} from '../_lib/singularFactory.js'

//where we store the formatting, link, date information

class Sentence {
  constructor (data) {
    this.data = data
  }

  /**
   *
   * @param {string} [clue] string to filter on
   * @returns {Link[]} the links
   */
  links (clue) {
    let arr = this.data.links || []
    if (typeof clue === 'string') {
      //grab a link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === clue)
      return link === undefined ? [] : [link]
    }
    return arr
  }

  /**
   *
   * @returns {Link[]} the all the interwiki links in the sentence
   */
  interwiki () {
    return this.links().filter((l) => l.wiki !== undefined)
  }

  /**
   *
   * @returns {string[]}
   */
  bolds () {
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      return this.data.fmt.bold || []
    }
    return []
  }

  /**
   *
   * @returns {string[]}
   */
  italics () {
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      return this.data.fmt.italic || []
    }
    return []
  }

  /**
   * getter and setter for the wiki text
   *
   * @param {string} [str] the wiki text to be set
   * @returns {string} the wiki text
   */
  text (str) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.data.text = str
    }
    return this.data.text || ''
  }

  /**
   *
   * @param {object} [options] options to pass to toJSON
   * @returns {object} the json object
   */
  json (options) {
    return toJSON(this, options)
  }

  /**
   *
   * @returns {string} the wiki text of the sentence
   */
  wikitext () {
    return this.data.wiki || ''
  }

  /**
   *
   * @returns {boolean} true if the sentence is a empty string
   */
  isEmpty () {
    return this.data.text === ''
  }
}

// aliases
Sentence.prototype.link = singularFactory('links')
Sentence.prototype.bold = singularFactory('bolds')
Sentence.prototype.italic = singularFactory('italics')

Sentence.prototype.plaintext = Sentence.prototype.text

export default Sentence
