import parseGallery from './gallery.js'
import parseElection from './election.js'
import parseNBA from './nba.js'
import parseMlb from './mlb.js'
import parseMMA from './mma.js'
import parseMath from './math.js'
import Template from '../../template/Template.js'

/**
 * parses out non standard templates
 *
 * Most templates are '{{template}}',
 * but then, some are '<template></template>' others are {{start}}...{{end}}
 * -> the templates here are of the second type.
 *
 * @private
 * @param {object} section
 * @param {object} doc
 * @returns {Object} wikitext
 */
const xmlTemplates = function (section, doc) {
  const res = {
    templates: [],
    text: section._wiki,
  }

  parseElection(res, doc)
  parseGallery(res, doc, section)
  parseMath(res)
  parseMlb(res)
  parseMMA(res)
  parseNBA(res)

  // turn them into Template objects
  res.templates = res.templates.map((obj) => new Template(obj))
  return res
}

export default xmlTemplates
