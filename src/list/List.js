import Sentence from '../04-sentence/Sentence.js'
import Link from '../link/Link.js'
import setDefaults from '../_lib/setDefaults.js'
const defaults = {}

/**
 * 
 * @param {List} list 
 * @param {*} [options] 
 * @returns 
 */
const toText = (list, options) => {
  return list.data
    .map((s) => {
      let str = s.text(options)
      return ' * ' + str
    })
    .join('\n')
}

class List {
  /**
   * @param {Sentence[]} data
   * @param {string} wiki
   * 
   */
  constructor (data, wiki = '') {
    this.data = data
    this.wiki = wiki
  }

  lines () {
    return this.data
  }

  /**
   * 
   * @param {string} clue 
   * @returns {Link[]}
   */
  links (clue) {
    let links = this
      .lines()
      .map((s) => s.links())
      .reduce((a, b) => a.concat(b), [])

    if (typeof clue === 'string') {
      //grab a link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = links.find((o) => o.page() === clue)
      return link === undefined ? [] : [link]
    }

    return links
  }

  /**
   * 
   * @param {object} options 
   * @returns {object}
   */
  json (options) {
    options = setDefaults(options, defaults)
    return this.lines().map((s) => s.json(options))
  }

  /**
   * 
   * @returns {string}
   */
  text () {
    return toText(this)
  }

  /**
   * 
   * @returns {string}
   */
  wikitext () {
    return this.wiki || ''
  }
}

export default List
