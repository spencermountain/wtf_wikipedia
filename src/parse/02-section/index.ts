import parseStartEndTemplates from './01-xml-templates/index.ts'
import type { SectionData } from '../../types/index.ts'

const parseSection = (section: SectionData) => {
  //parse-out <template></template>' and {{start}}...{{end}} templates
  const res = parseStartEndTemplates(section)
  section.wiki = res.text
  section.templates = res.templates

  //parse-out the <ref></ref> tags
  // parseReferences(this)
  //parse-out all {{templates}}
  // parseTemplates(this, doc)

  //parse the tables
  // parseTable(this)

  //now parse all double-newlines
  // parseParagraphs(this, doc)

  return section
}

export default parseSection
