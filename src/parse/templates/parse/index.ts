import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import templates from '../../../templates/index.ts'
import aliases from '../../../templates/aliases.ts'
import ignore from './_ignore.ts'
import { isInfobox } from './infobox.ts'
import runParser from './run-parser.ts'
import toJSON from './toJSON/index.ts'
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
    return finish(wiki, 'infobox', toJSON(wiki, [], 'raw', opts), opts)
  }
  if (ignore.has(name)) {
    return { replacement: '', result: null }
  }
  if (/^cite [a-z]/.test(name)) {
    return finish(wiki, 'citation', toJSON(wiki, [], undefined, opts), opts)
  }
  if (!Object.hasOwn(templates, name)) {
    const payload = toJSON(wiki, [], undefined, opts)
    return finish(wiki, null, Object.keys(payload).length > 0 ? payload : null, opts)
  }

  const handler = templates[name]
  const { replacement, payload } = runParser(handler, wiki, opts)
  let kind = handler.kind || aliases[name] || name
  // Some handlers interpret the invocation as another recognized form.
  if (payload?.template && payload.template !== name) {
    kind = fmtName(payload.template)
  }
  return finish(wiki, kind, payload, opts, replacement)
}

export default parseTemplate
