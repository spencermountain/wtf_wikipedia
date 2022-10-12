import { fromText } from '../04-sentence/index.js'

class Template {
  constructor (data, text = '', wiki = '') {
    this.data = data
    this._text = text
    this.wiki = wiki
  }

  /**
   *
   * @returns {string} the text of the template
   */
  text () {
    let str = this._text || ''
    return fromText(str).text()
  }
  /**
   *
   * @returns {string} the data of the template in json format
   */
  json () {
    return this.data || {}
  }

  /**
   *
   * @returns {string} the wiki text of the template
   */
  wikitext () {
    return this.wiki || ''
  }
}

export default Template
