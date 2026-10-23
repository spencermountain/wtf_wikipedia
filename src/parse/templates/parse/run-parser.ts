import { isArray, isObject } from '../../../_lib/helpers.ts'
import parseBlocks from './toJSON/index.ts'
import parseTextArguments from './toJSON/text.ts'
import simplifyArguments from './toJSON/simplify.ts'

const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// Keep the plugin callback signature while binding each invocation's options.
const parseArguments = (opts, text, order = [], format?: string) => {
  const args = parseBlocks(text, order, opts)
  // Keep existing plugin format aliases at the callback boundary.
  if (format === 'block' || format === 'raw' || format === 'json') {
    return args
  }
  return simplifyArguments(args)
}

// Registry entries are either rendering shortcuts or custom parser functions.
const runHandler = (handler, wiki: string, opts) => {
  if (typeof handler === 'number') {
    const payload = parseTextArguments(wiki, positions, opts)
    return { replacement: payload[String(handler)] || '', payload: null }
  }
  if (typeof handler === 'string') {
    return { replacement: handler, payload: null }
  }
  if (isArray(handler)) {
    return { replacement: '', payload: parseTextArguments(wiki, handler, opts) }
  }
  if (isObject(handler)) {
    const payload = parseTextArguments(wiki, handler.props, opts)
    return { replacement: payload[handler.out], payload }
  }
  if (typeof handler === 'function') {
    // Existing plugin callbacks return wikitext and push their payload into a list.
    const results = []
    const replacement = handler(wiki, results, parseArguments.bind(null, opts), null, opts)
    return { replacement, payload: results[0] }
  }
  return { replacement: '', payload: parseTextArguments(wiki, [], opts) }
}

export default runHandler
