import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import parseTextArguments from '../../templates/parse/toJSON/text.ts'
import parseBlock from '../../block/index.ts'
import parseLinks from '../../block/links/parse.ts'
import makeResult from '../../templates/result.ts'
import getTemplates from '../../templates/find/flat.ts'
import templates from '../../../templates/index.ts'
import runParser from '../../templates/parse/run-parser.ts'

// Keep the existing limits for plain, self-closing, and attributed references.
const referencePattern =
  / ?<ref>(.{0,4000}?)<\/ref> ?| ?<ref\b[^>]{0,200}?\/> ?| ?<ref [^>]{0,200}>(.{0,1800}?)<\/ref> ?/gis
const namePattern = /\bname\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s/>]+))/i
const groupPattern = /\bgroup\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s/>]+))/i

const attribute = (tag, pattern) => {
  const match = tag.match(pattern)
  // Attribute values may use double quotes, single quotes, or no quotes.
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? ''
}

const nameReg = /^ *\{\{ *([^|}\n]+)/
// Plugins may register localized citation templates, which carry a 'citation' kind.
const isCitationName = (str) => {
  const name = str.match(nameReg)?.[1].trim().toLowerCase() || ''
  return /^(cite|citation)/.test(name) || templates[name]?.kind === 'citation'
}

const hasCitation = (str) => {
  return isCitationName(str) && /\}\} *$/.test(str) && /citation needed/i.test(str) === false
}

const parseBody = (text, wiki, opts: DocInfo = defaults) => {
  let prose = text
  // A single ref tag may contain several structured citation templates.
  const references = getTemplates(text)
    .filter(hasCitation)
    .map((template) => {
      prose = prose.replace(template, '')
      const name = template.match(nameReg)?.[1].trim().toLowerCase() || ''
      // a dedicated handler (eg. 'cite gnis') knows its own fields
      const payload = Object.hasOwn(templates, name)
        ? runParser(templates[name], template, opts).data
        : parseTextArguments(template, [], opts)
      const { template: _template, ...data } = payload || {}
      const result = makeResult(template, 'citation', data, '', opts)
      result.wiki = wiki
      return result
    })
  if (references.length === 0) {
    // Without a citation template, retain the body as formatted inline text.
    references.push(makeResult(wiki, 'reference', { inline: parseBlock(text, opts) }, '', opts))
  } else {
    // Attach surrounding prose once, even when a ref contains several citations.
    const links = parseLinks(prose, opts) || []
    if (links.length) {
      references[0].links = [...(references[0].links || []), ...links]
    }
  }
  return references
}

// Shared extraction keeps reference occurrences separate from visible content.
const extractReferences = (source, opts: DocInfo = defaults) => {
  const citations = []
  const named = new Map()
  const wiki = source.replace(referencePattern, (tag, plain, attributed) => {
    const opening = tag.slice(0, tag.indexOf('>') + 1)
    const name = attribute(opening, namePattern)
    // Reference names are scoped by group; serialize the pair without collisions.
    const key = JSON.stringify([attribute(opening, groupPattern), name])
    const body = plain ?? attributed
    // An empty paired tag is a definition; a self-closing tag is a reuse.
    const reuse = body === undefined
    const references = reuse ? [] : parseBody(body, tag, opts)
    if (name && !reuse) {
      named.set(key, references)
    }
    // A space prevents words on either side of the reference from joining.
    citations.push({ references, key, name, reuse, plain: plain !== undefined })
    return ' '
  })
  // Resolve after extraction so a reuse can precede its definition in this fragment.
  citations.forEach((citation) => {
    if (citation.name && citation.reuse) {
      citation.references = named.get(citation.key) || []
    }
  })
  return { wiki, citations }
}

export default extractReferences
