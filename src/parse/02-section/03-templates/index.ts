import defaults from '../../../_lib/defaults.ts'
import parse from '../../templates/index.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'

// simple wrapper around the template parser
const sectionTemplates = (section: SectionData, opts: DocInfo = defaults) => {
  const { infoboxes, references, templates, remaining } = parse(section.remaining, opts)
  section.infoboxes = infoboxes
  // Keep references and special templates extracted by earlier stages.
  section.references.push(...references)
  section.templates.push(...templates)
  section.remaining = remaining
  return section
}

export default sectionTemplates
