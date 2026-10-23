/* eslint-disable no-console */
import aliases from './aliases.ts'
import parseShortcut from './_shortcuts.ts'
import textTmpl from './text-only/index.ts'
import dataTmpl from './data-only/index.ts'
import bothTmpl from './text-and-data/index.ts'

let templates = { ...textTmpl, ...dataTmpl, ...bothTmpl }

// Normalize built-in shortcuts before exposing the registry to plugins.
Object.keys(templates).forEach((key) => {
  if (typeof templates[key] !== 'function') {
    templates[key] = parseShortcut.bind(null, templates[key])
  }
})
const builtins = new Set(Object.values(templates))

Object.keys(aliases).forEach((k) => {
  if (templates[aliases[k]] === undefined) {
    console.error(`Missing template: '${aliases[k]}'`)
  }
  templates[k] = templates[aliases[k]]
})
export { builtins }
export default templates
