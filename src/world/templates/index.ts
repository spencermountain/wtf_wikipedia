/* eslint-disable no-console */
import aliases from './aliases.ts'
import parseShortcut from './_shortcuts.ts'
import textTmpl from './text-only/index.ts'
import dataTmpl from './data-only/index.ts'
import bothTmpl from './text-and-data/index.ts'
import i18n, { byLang, byProject } from './i18n/index.ts'

let templates = { ...textTmpl, ...dataTmpl, ...bothTmpl }

// Normalize built-in shortcuts before exposing the registry to plugins.
Object.keys(templates).forEach((key) => {
  if (typeof templates[key] !== 'function') {
    templates[key] = parseShortcut.bind(null, templates[key])
  }
})
const builtins = new Set(Object.values(templates))
// overlay handlers shipped here use the built-in calling convention; ones added by plugins do not
;[...Object.values(byLang), ...Object.values(byProject)].forEach((overlay) => {
  Object.values(overlay).forEach((handler) => {
    if (typeof handler === 'function') {
      builtins.add(handler)
    }
  })
})

// Aliases are resolved at lookup time (see parse/templates/parse/index.ts), so a plugin that
// overrides a template also changes every alias of it. Only sanity-check the targets here.
Object.keys(aliases).forEach((k) => {
  if (templates[aliases[k]] === undefined) {
    console.error(`Missing template: '${aliases[k]}'`)
  }
})

// Find the handler for a template name: an explicit handler wins over an alias,
// and a plugin can disable a built-in with `templates.foo = null`.
const resolve = (name: string, opts: any = {}) => {
  // other-language and other-project names, like {{monnaie}} on fr.wikipedia
  const overlays = [byProject[opts.project], byLang[opts.lang]]
  for (const overlay of overlays) {
    if (overlay && Object.hasOwn(overlay, name)) {
      return { handler: overlay[name], name }
    }
  }
  if (Object.hasOwn(templates, name)) {
    return { handler: templates[name], name }
  }
  const target = aliases[name]
  if (target !== undefined && Object.hasOwn(templates, target)) {
    return { handler: templates[target], name: target }
  }
  return null
}
export { builtins, resolve, i18n }
export default templates
