import { builtins } from '../../../templates/index.ts'
import parseTextArguments from './toJSON/text.ts'
import runCustomParser from './custom-parser.ts'

const parseArguments = (opts, wiki, order = []) => parseTextArguments(wiki, order, opts)

const runParser = (handler, wiki: string, opts) => {
  let result
  if (builtins.has(handler)) {
    result = handler(wiki, parseArguments.bind(null, opts), opts)
  } else {
    result = runCustomParser(handler, wiki, opts)
  }
  // Missing output is empty; numeric replacements still render as text.
  return { data: result.data ?? null, replacement: String(result.replacement ?? '') }
}

export default runParser
