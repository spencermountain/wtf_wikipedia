import { isArray, isObject } from '../../../_lib/helpers.ts'
import toJSON from './toJSON/index.ts'

const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// Keep the plugin callback signature while binding each invocation's options.
const parseArguments = (opts, text, order = [], format?: string) => {
  return toJSON(text, order, format, opts)
}

// Registry entries are either rendering shortcuts or custom parser functions.
const runHandler = (handler, wiki: string, opts) => {
  if (typeof handler === 'number') {
    const payload = toJSON(wiki, positions, undefined, opts)
    return { replacement: payload[String(handler)] || '', payload: null }
  }
  if (typeof handler === 'string') {
    return { replacement: handler, payload: null }
  }
  if (isArray(handler)) {
    return { replacement: '', payload: toJSON(wiki, handler, undefined, opts) }
  }
  if (isObject(handler)) {
    const payload = toJSON(wiki, handler.props, undefined, opts)
    return { replacement: payload[handler.out], payload }
  }
  if (typeof handler === 'function') {
    // Existing plugin callbacks return wikitext and push their payload into a list.
    const results = []
    const replacement = handler(wiki, results, parseArguments.bind(null, opts), null, opts)
    return { replacement, payload: results[0] }
  }
  return { replacement: '', payload: toJSON(wiki, [], undefined, opts) }
}

export default runHandler
