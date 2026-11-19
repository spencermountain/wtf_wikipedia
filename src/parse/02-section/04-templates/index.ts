import defaults from '../../../_lib/defaults.ts'
import parse from '../../templates/index.ts'
import parseLiterals from './literals.ts'

import type { DocInfo, SectionData } from '../../../types/index.ts'

// simple wrapper around the template parser
const sectionTemplates = (section: SectionData, opts: DocInfo = defaults) => {
  // find named syntax like __TOC__
  section = parseLiterals(section)
  // full template parser
  const { infoboxes, references, templates, remaining } = parse(section.remaining, opts)
  section.infoboxes = infoboxes
  // Keep references and special templates extracted by earlier stages.
  // one at a time, since push(...list) overflows on a very long list
  references.forEach((ref) => section.references.push(ref))
  templates.forEach((tmpl) => section.templates.push(tmpl))
  section.remaining = remaining
  return section
}

export default sectionTemplates
