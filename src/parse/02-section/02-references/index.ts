import extractReferences from './extract.ts'
import type { SectionData } from '../../../types/index.ts'

// Section parsing keeps its existing definition-only reference collection.
const parseRefs = (section: SectionData) => {
  const { wiki, citations } = extractReferences(section.remaining)
  const definitions = citations.filter((citation) => !citation.reuse)
  // Historically plain references precede attributed references.
  definitions.sort((a, b) => Number(b.plain) - Number(a.plain))
  section.references = definitions.flatMap((citation) => citation.references)
  // Retain legacy section-level HTML cleanup; it is not part of ref extraction.
  section.remaining = wiki.replace(/ ?<[ /]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ /]?> ?/g, ' ')
  return section
}

export default parseRefs
