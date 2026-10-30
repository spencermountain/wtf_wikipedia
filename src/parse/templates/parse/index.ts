import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import { normalizeKey } from '../../../_lib/helpers.ts'
import { resolve } from '../../../templates/index.ts'
import ignore from './_ignore.ts'
import { isInfobox } from './infobox.ts'
import runParser from './run-parser.ts'
import parseArguments from './toJSON/index.ts'
import parseTextArguments from './toJSON/text.ts'
import fmtName from './toJSON/_fmtName.ts'
import makeResult from '../result.ts'

// Handlers supply payload and replacement; only this boundary builds public results.
const finish = (wiki, kind, payload, opts, replacement = '') => {
  if (!payload) {
    return { replacement, result: null }
  }
  const { template: _template, ...data } = payload
  return { replacement, result: makeResult(wiki, kind, data, replacement, opts) }
}

const parseTemplate = (wiki: string, name: string, opts: DocInfo = defaults) => {
  // Specialized forms take precedence over registry entries.
  if (isInfobox(name)) {
    const payload = parseArguments(wiki, [], opts)
    const normalized = Object.fromEntries(Object.entries(payload).map(([key, value]) => [normalizeKey(key), value]))
    return finish(wiki, 'infobox', normalized, opts)
  }
  if (ignore.has(name)) {
    return { replacement: '', result: null }
  }
  if (/^cite [a-z]/.test(name)) {
    // a dedicated handler (eg. 'cite gnis') knows its own fields; otherwise parse generically
    const cite = resolve(name, opts)
    const payload = cite?.handler != null ? runParser(cite.handler, wiki, opts).data : parseTextArguments(wiki, [], opts)
    return finish(wiki, 'citation', payload, opts)
  }
  const found = resolve(name, opts)
  if (!found || found.handler === null || found.handler === undefined) {
    const payload = parseTextArguments(wiki, [], opts)
    return finish(wiki, null, Object.keys(payload).length > 0 ? payload : null, opts)
  }

  const handler = found.handler
  const { replacement, data: payload } = runParser(handler, wiki, opts)
  let kind = handler.kind || found.name
  // Some handlers interpret the invocation as another recognized form.
  if (payload?.template && payload.template !== name) {
    kind = fmtName(payload.template)
  }
  return finish(wiki, kind, payload, opts, replacement)
}

export default parseTemplate
