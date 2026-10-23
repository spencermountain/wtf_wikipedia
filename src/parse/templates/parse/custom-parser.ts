import parseBlocks from './toJSON/index.ts'
import simplifyArguments from './toJSON/simplify.ts'
import parseShortcut from '../../../templates/_shortcuts.ts'

// Preserve format aliases and the callback signature for existing plugins.
const parseArguments = (opts, text, order = [], format?: string) => {
  const args = parseBlocks(text, order, opts)
  if (format === 'block' || format === 'raw' || format === 'json') {
    return args
  }
  return simplifyArguments(args)
}

const runCustomParser = (handler, wiki, opts) => {
  const parse = parseArguments.bind(null, opts)
  if (typeof handler !== 'function') {
    return parseShortcut(handler, wiki, parse)
  }
  const results = []
  const replacement = handler(wiki, results, parse, null, opts)
  return { data: results[0] || null, replacement: replacement ?? '' }
}

export default runCustomParser
