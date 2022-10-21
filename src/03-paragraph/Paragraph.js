import toJSON from './toJson.js'
import setDefaults from '../_lib/setDefaults.js'
import Sentence from '../04-sentence/Sentence.js'
import Reference from '../reference/Reference.js'
import Link from '../link/Link.js'
import List from '../list/List.js'
import Image from '../image/Image.js'

const toTextDefaults = {
  sentences: true,
  lists: true,
  images: true,
}

class Paragraph {
  /**
   * 
   * @param {object} data 
   * @param {string} data.wiki
   * @param {Sentence[]} data.sentences
   * @param {List[]} data.lists
   * @param {Image[]} data.images
   */
  constructor (data) {
    this.data = data
  }

  /**
   * returns the sentences in this paragraph
   * @returns {Sentence[]} an array of Sentence objects
   */
  sentences () {
    return this.data.sentences || []
  }


  // TODO: should this work? 
  // Wrongly passing
  /**
   * returns the references in this paragraph
   * @returns {Reference[]} an array of Reference objects
   */
  references () {
    return this.data.references
  }

  /**
   * returns the lists in this paragraph
   * @returns {List[]} an array of List objects
   */
  lists () {
    return this.data.lists
  }

  /**
   * returns the images in this paragraph
   * @returns {Image[]} an array of Image objects
   */
  images () {
    return this.data.images || []
  }

  /**
   * returns the links in this paragraph
   *
   * @param {string} [clue] a string to filter the links by
   * @returns {Link[]} an array of Link objects
   */
  links (clue) {
    let arr = this.sentences().map((s) => s.links(clue)).flat()
    
    if (typeof clue === 'string') {
      //grab a specific link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === clue)
      return link === undefined ? [] : [link]
    }

    return arr || []
  }

  /**
   * returns all the interwiki links in this paragraph
   * @returns {Link[]} an array of Link objects
   */
  interwiki () {
    let arr = this.sentences().map((s) => s.interwiki()).flat()
       
    return arr || []
  }

  /**
   * returns the paragraphs as text
   *
   * @returns {String}
   */
  text () {
    let str = this.sentences()
      .map((s) => s.text())
      .join(' ')

    this.lists().forEach((list) => {
      str += '\n' + list.text()
    })

    return str
  }

  /**
   * returns the paragraphs as JSON
   * @param {*} options
   * @returns {Object}
   */
  json (options) {
    options = setDefaults(options, toTextDefaults)
    return toJSON(this, options)
  }

  /**
   * returns the wikitext of this paragraph
   * @returns {String}
   */
  wikitext () {
    return this.data.wiki
  }
}

Paragraph.prototype.citations = Paragraph.prototype.references

// aliases

/**
 * this function crates a function that calls the plural version of the method
 *
 * @param {string} plural the plural of the word
 * @returns {function} a Function that calls the plural version of the method
 */
function singularFactory (plural) {
  return function (clue) {
    let arr = this[plural](clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }
}

Paragraph.prototype.sentence = singularFactory('sentences')
Paragraph.prototype.reference = singularFactory('references')
Paragraph.prototype.citation = singularFactory('citations')
Paragraph.prototype.list = singularFactory('lists')
Paragraph.prototype.image = singularFactory('images')
Paragraph.prototype.link = singularFactory('links')

export default Paragraph
