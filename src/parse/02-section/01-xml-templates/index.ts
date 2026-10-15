import parseElection from './election.ts'
import parseGallery from './gallery.ts'
import parseMath from './math.ts'
import parseNBA from './nba.ts'
import parseMMA from './mma.ts'
import parseMlb from './mlb.ts'
import type { SectionData } from '../../../types/index.ts'

//parses out non-standard templates - the '<template></template>' and {{start}}...{{end}} forms,
//rather than the usual '{{template}}'
const xmlTemplates = function (section: SectionData) {
  section = parseElection(section)
  section = parseGallery(section)
  section = parseMath(section)
  section = parseMlb(section)
  section = parseMMA(section)
  section = parseNBA(section)
  return section
}

export default xmlTemplates
