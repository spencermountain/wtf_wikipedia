import parseBlock from '../block/index.ts'
import parseLinks from '../block/links/parse.ts'
import type { DocInfo, TemplateData } from '../../types/index.ts'

// Keep invocation spelling separate from the parser's normalized interpretation.
const rawName = (wiki: string) => {
  wiki = wiki.trim()
  const tag = wiki.match(/^<([a-z]+)/i)
  if (tag) {
    return tag[1].toLowerCase()
  }
  return wiki
    .replace(/^\{\{/, '')
    .split(/[|}\n]/, 1)[0]
    .trim()
}

const makeResult = (
  wiki: string,
  kind: string | null,
  data: object,
  replacement = '',
  opts?: DocInfo
): TemplateData => {
  const result: TemplateData = {
    template: rawName(wiki),
    kind,
    wiki,
    text: parseBlock(String(replacement), opts).text,
    data,
  }
  // Links retained in replacement markup will be collected by its eventual parent.
  let remaining = wiki
  const renderedLinks = parseLinks(String(replacement), opts) || []
  renderedLinks.forEach((link) => {
    remaining = remaining.replace(link.wiki, '')
  })
  const links = parseLinks(remaining, opts)
  if (links?.length) {
    result.links = links
  }
  return result
}

export default makeResult
