import defaults from '../../../_lib/defaults.ts'
import extractReferences from './extract.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'

// Section parsing keeps its existing definition-only reference collection.
const parseRefs = (section: SectionData, opts: DocInfo = defaults) => {
  let { wiki, citations } = extractReferences(section.remaining, opts)
  const definitions = citations.filter((citation) => !citation.reuse)
  // Historically plain references precede attributed references.
  definitions.sort((a, b) => Number(b.plain) - Number(a.plain))
  section.references = definitions.flatMap((citation) => citation.references)

  // Reference-list wrappers contain definitions, which have now been extracted.
  wiki = wiki.replace(/<\/?references\b[^>]*>/gi, '')

  // we're done with xml now - remove remaining wrappers
  wiki = wiki.replace(/ ?<[ /]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ /]?> ?/g, (found: string) => {
    section.templates.push({ template: 'html', kind: 'html', text: ' ', data: null, wiki: found })
    return ' '
  })

  section.remaining = wiki
  return section
}

export default parseRefs
