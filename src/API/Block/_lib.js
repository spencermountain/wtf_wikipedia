import parseLinks from '../link/index.ts'
import parseFormatting from '../04-sentence/formatting.ts'
import postprocess from '../../_lib/postprocess.ts'

// Match the existing inline pipeline, without sentence splitting.
const parse = (wiki) => {
  const data = { wiki, text: wiki }
  // Preserve the existing order: link labels, text cleanup, then formatting.
  parseLinks(data)
  data.text = postprocess(data.text)
  const parsed = parseFormatting(data)

  // Shared parsers expose text, not ranges; do not infer offsets from labels.
  const formatting = Object.entries(parsed.fmt || {}).flatMap(([type, values]) => {
    return values.map((text) => ({ type, text }))
  })
  return {
    text: parsed.text,
    links: parsed.links.map((link) => link.json()),
    formatting,
  }
}

export default parse
