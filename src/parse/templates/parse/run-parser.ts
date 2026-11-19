import { builtins } from '../../../world/templates/index.ts'
import parseTextArguments from './toJSON/text.ts'
import runCustomParser from './custom-parser.ts'

const parseArguments = (opts, wiki, order = []) => parseTextArguments(wiki, order, opts)

const runParser = (handler, wiki: string, opts) => {
  let result
  if (builtins.has(handler)) {
    // a page's own parameters can make these throw, like {{nbsp|-1}} or {{percent|1|3|decimals=101}}
    try {
      result = handler(wiki, parseArguments.bind(null, opts), opts)
    } catch {
      return { data: null, replacement: '' }
    }
  } else {
    result = runCustomParser(handler, wiki, opts)
  }
  // Missing output is empty; numeric replacements still render as text.
  const replacement = String(result.replacement ?? '')
  // a short template can't be asked for a huge string
  const tooBig = replacement.length > wiki.length * 2 + 100000
  return { data: result.data ?? null, replacement: tooBig ? '' : replacement }
}

export default runParser
