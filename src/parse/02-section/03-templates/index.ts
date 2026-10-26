import defaults from '../../../_lib/defaults.ts'
import parse from '../../templates/index.ts'
import parseLiterals from './literals.ts'
import parseHtml from './html-syntax.ts'

import type { DocInfo, SectionData } from '../../../types/index.ts'

// simple wrapper around the template parser
const sectionTemplates = (section: SectionData, opts: DocInfo = defaults) => {
  // find named syntax like __TOC__
  section = parseLiterals(section)
  // parse HTML in wikiscript
  section = parseHtml(section)
  // full template parser
  const { infoboxes, references, templates, remaining } = parse(section.remaining, opts)
  section.infoboxes = infoboxes
  // Keep references and special templates extracted by earlier stages.
  section.references.push(...references)
  section.templates.push(...templates)
  section.remaining = remaining
  return section
}

export default sectionTemplates
