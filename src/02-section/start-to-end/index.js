const Section = require('../Section')

const parseGallery = require('./gallery')
const parseElection = require('./election')
const parseNBA = require('./nba')
const parseMlb = require('./mlb')
const parseMMA = require('./mma')
const parseMath = require('./math')

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
 * @returns {string} wikitext
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
