import defaults from '../../../_lib/defaults.ts'
import parseElection from './election.ts'
import parseGallery from './gallery.ts'
import parseMath from './math.ts'
import parseNBA from './nba.ts'
import parseMMA from './mma.ts'
import parseMlb from './mlb.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'

//parses out non-standard templates - the '<template></template>' and {{start}}...{{end}} forms,
//rather than the usual '{{template}}'
const xmlTemplates = function (section: SectionData, opts: DocInfo = defaults) {
  section = parseElection(section, opts)
  section = parseGallery(section, opts)
  section = parseMath(section, opts)
  section = parseMlb(section, opts)
  section = parseMMA(section, opts)
  section = parseNBA(section, opts)
  return section
}

export default xmlTemplates
