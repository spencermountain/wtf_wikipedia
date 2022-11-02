import parseGallery from './gallery.js'
import parseElection from './election.js'
import parseNBA from './nba.js'
import parseMlb from './mlb.js'
import parseMMA from './mma.js'
import parseMath from './math.js'
import Template from '../../template/Template.js'
import Section from '../Section.js'

/**
 * @typedef {Object} parseStartEndTemplatesReturn
 * @property {Template[]} templates An array of Template objects found in the wiki text
 * @property {string} text The wiki text without the templates
 */

/**
 * parses out non standard templates
 *
 * Most templates are '{{template}}',
 * but then, some are '<template></template>'
 * others are {{start}}...{{end}}
 * -> the templates here are of the second type.
 *
 * @private
 * @param {Section} section
 * @param {Document} doc
 * @returns {parseStartEndTemplatesReturn} an object with the wiki text without templates and an array of templates
 *
 */
function parseStartEndTemplates (section, doc) {
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

export default parseStartEndTemplates
