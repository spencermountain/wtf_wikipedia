import defaults from '../../_lib/defaults.ts'
import xmlTemplates from './01-xml-templates/index.ts'
import parseReferences from './02-references/index.ts'
import parseTemplates from './03-templates/index.ts'
import parseTable from './04-tables/index.ts'
import parseParagraphs from '../03-paragraph/index.ts'

import type { DocInfo, SectionData } from '../../types/index.ts'

const parseSection = (section: SectionData, opts: DocInfo = defaults) => {
  //parse-out <template></template>' and {{start}}...{{end}} templates
  section = xmlTemplates(section, opts)
  //parse-out the <ref></ref> tags
  section = parseReferences(section, opts)
  //parse-out all {{templates}}
  section = parseTemplates(section, opts)
  //parse the tables
  section = parseTable(section, opts)

  //now parse all double-newlines
  section = parseParagraphs(section, opts)

  return section
}

export default parseSection
