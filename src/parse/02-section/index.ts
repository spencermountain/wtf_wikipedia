import xmlTemplates from './01-xml-templates/index.ts'
import parseReferences from './02-references/index.ts'
import parseTemplates from './03-templates/index.ts'
import parseTable from './04-tables/index.ts'
import parseParagraphs from '../03-paragraph/index.ts'

import type { SectionData } from '../../types/index.ts'

const parseSection = (section: SectionData) => {
  //parse-out <template></template>' and {{start}}...{{end}} templates
  section = xmlTemplates(section)

  //parse-out the <ref></ref> tags
  section = parseReferences(section)
  //parse-out all {{templates}}
  section = parseTemplates(section)

  //parse the tables
  section = parseTable(section)

  //now parse all double-newlines
  section = parseParagraphs(section)

  return section
}

export default parseSection
