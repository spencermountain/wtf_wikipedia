import parse from '../../template/index.ts'
import type { SectionData } from '../../../types/index.ts'

// simple wrapper around the template parser
const sectionTemplates = (section: SectionData) => {
  const { infoboxes, references, templates, remaining } = parse(section.remaining)
  section.infoboxes = infoboxes
  section.references = references
  section.templates = templates
  section.remaining = remaining
  return section
}

export default sectionTemplates
