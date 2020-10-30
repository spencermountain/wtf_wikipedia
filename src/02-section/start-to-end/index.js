//@ts-expect-error because this is some kind of type definition for jsdoc that's why typescript does not recognize it
const Document = require('../../01-document/Document')
const Section = require('../Section')

const parseGallery = require('./gallery')
const parseElection = require('./election')
const parseNBA = require('./nba')
const parseMlb = require('./mlb')
const parseMMA = require('./mma')
const parseMath = require('./math')

/**
 * a catcher for the data used in these parsers
 *
 * @private
 * @typedef Catcher
 * @property {Template[]} templates the found templates
 * @property {string} text the wiki text
 */

/**
 * parses out non standard templates
 *
 * Most templates are '{{template}}',
 * but then, some are '<template></template>' others are {{start}}...{{end}}
 * -> the templates here are of the second type.
 *
 * @private
 * @param {Section} section
 * @param {Document} doc
 * @return {Catcher}
 */
const xmlTemplates = function (section, doc) {
  const catcher = {
    templates: [],
    text: section._wiki,
  }

  parseElection(catcher)
  parseGallery(catcher, doc, section)
  parseMath(catcher)
  parseMlb(catcher)
  parseMMA(catcher)
  parseNBA(catcher)

  return catcher
}

module.exports = xmlTemplates
