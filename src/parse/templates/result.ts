import parseBlock from '../block/index.ts'
import type { DocInfo, TemplateData } from '../../types/index.ts'

// Keep invocation spelling separate from the parser's normalized interpretation.
const rawName = (wiki: string) => {
  wiki = wiki.trim()
  const tag = wiki.match(/^<([a-z]+)/i)
  if (tag) {
    return tag[1]
  }
  return wiki.replace(/^\{\{/, '').split(/[|}\n]/, 1)[0].trim()
}

const makeResult = (wiki: string, kind: string | null, data: object, replacement = '', opts?: DocInfo): TemplateData => {
  return {
    template: rawName(wiki),
    kind,
    wiki,
    text: parseBlock(String(replacement), opts).text,
    data,
  }
}

export default makeResult
