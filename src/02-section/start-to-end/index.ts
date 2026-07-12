import parseGallery from './gallery.ts'
import parseElection from './election.ts'
import parseNBA from './nba.ts'
import parseMlb from './mlb.ts'
import parseMMA from './mma.ts'
import parseMath from './math.ts'
import Template from '../../template/Template.ts'

//parses out non-standard templates - the '<template></template>' and {{start}}...{{end}} forms,
//rather than the usual '{{template}}'
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
