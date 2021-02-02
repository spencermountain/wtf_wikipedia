const parseGallery = require('./gallery')
const parseElection = require('./election')
const parseNBA = require('./nba')
const parseMlb = require('./mlb')
const parseMMA = require('./mma')
const parseMath = require('./math')
const Template = require('../../template/Template')

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
  const res = {
    templates: [],
    text: section._wiki,
  }

  parseElection(res)
  parseGallery(res, doc, section)
  parseMath(res)
  parseMlb(res)
  parseMMA(res)
  parseNBA(res)

  // turn them into Template objects
  res.templates = res.templates.map((obj) => new Template(obj))
  return res
}

module.exports = xmlTemplates
