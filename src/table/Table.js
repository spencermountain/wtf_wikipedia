import Link from '../link/Link.js'
import setDefaults from '../_lib/setDefaults.js'
import toJson from './toJson.js'

/**
 * 
 * @param {string} key 
 * @returns {string}
 */
function normalize (key = '') {
  key = key.toLowerCase()
  key = key.replace(/[_-]/g, ' ')
  key = key.replace(/\(.*?\)/, '')
  key = key.trim()
  return key
}

class Table {
  /**
   * will be Record<string, Sentence>[]
   * @param {object[]} data 
   * @param {string} wiki 
   */
  constructor (data, wiki = '') {
    this.data = data
    this._wiki = wiki
  }

  /**
   * 
   * @param {string} [clue] 
   * @returns {Link[]}
   */
  links (clue) {
    let links = this.data.map((row) => {
      return Object.values(row).map((cell) => {
        return cell.links(clue)
      })
    }).flat(2)


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
   * @param {string[]} keys 
   * @returns 
   */
  get (keys) {
    // normalize mappings
    let have = this.data[0] || {}
    let mapping = Object.keys(have).reduce((h, k) => {
      h[normalize(k)] = k
      return h
    }, {})

    // string gets a flat-list
    if (typeof keys === 'string') {
      let key = normalize(keys)
      key = mapping[key] || key
      return this.data.map((row) => {
        return row[key] ? row[key].text() : null
      })
    }

    // array gets obj-list
    keys = keys.map(normalize).map((k) => mapping[k] || k)
    return this.data.map((row) => {
      return keys.reduce((h, k) => {
        if (row[k]) {
          h[k] = row[k].text()
        } else {
          h[k] = ''
        }
        return h
      }, {})
    })
  }

  /**
   * 
   * @param {object} options 
   * @returns {object}
   */
  keyValue (options) {
    let rows = this.json(options)
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text
      })
    })
    return rows
  }

  /**
   * 
   * @param {object} options 
   * @returns {object}
   */
  json (options) {
    const defaults = {}
    options = setDefaults(options, defaults)
    return toJson(this.data, options)
  }

  /**
   * 
   * @returns {string}
   */
  text () {
    return ''
  }

  /**
   * 
   * @returns {string}
   */
  wikitext () {
    return this._wiki || ''
  }
}

Table.prototype.keyvalue = Table.prototype.keyValue
Table.prototype.keyval = Table.prototype.keyValue

export default Table
