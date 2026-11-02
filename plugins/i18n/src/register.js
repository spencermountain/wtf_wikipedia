// registers one language pack onto the core template registry. every section is optional:
//   aliases   — localized name → the core template key it resolves to
//   infoboxes — names recognised as infoboxes, not parsed
//   templates — localized name → a core-style shorthand def: ['lat', 'lon'], 1, 'text', {props, out}
//   parsers   — localized name → a core-style parser fn (see langs/_lib.js translate())
import { translate, fromShortcut } from './langs/_lib.js'

const register = (data, templates, infoboxes = {}) => {
  ;(data.infoboxes || []).forEach((name) => {
    infoboxes[name] = true
  })
  Object.keys(data.aliases || {}).forEach((name) => {
    const key = data.aliases[name]
    const parser = templates[key]
    // fail at extend-time, not parse-time, if a core registry key moves
    if (typeof parser !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${key}' is not a core template`)
    }
    // wikis share names — a plain alias never replaces an earlier i18n registration
    if (templates[name] && templates[name].i18n) {
      return
    }
    // Bridge the plugin callback to the built-in result contract.
    templates[name] = function (tmpl, list, parse, _unused, opts) {
      const { data: found, replacement } = parser(tmpl, parse, opts)
      if (found) {
        list.push(found)
      }
      return replacement
    }
    templates[name].kind = /^cite /.test(key) ? 'citation' : key
    templates[name].i18n = 'alias'
  })
  // shorthand defs become standalone parser fns, alongside any hand-written ones
  const parsers = Object.assign({}, data.parsers)
  Object.keys(data.templates || {}).forEach((name) => {
    const def = data.templates[name]
    parsers[name] = typeof def === 'function' ? def : fromShortcut(def)
  })
  Object.keys(parsers).forEach((name) => {
    let fn = parsers[name]
    if (fn.template && typeof templates[fn.template] !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${fn.template}' is not a core template`)
    }
    // wikis share names: two translate() parsers onto the same template merge their maps,
    // the earlier registration winning per key — otherwise the first parser stands
    const prev = templates[name]
    if (prev && prev.i18n === 'parser') {
      if (prev.template && prev.template === fn.template && prev.map && fn.map) {
        fn = translate(fn.template, Object.assign({}, fn.map, prev.map))
      } else {
        return
      }
    }
    templates[name] = function (tmpl, list, parse, _unused, opts) {
      const { data: found, replacement } = fn(tmpl, parse, opts, templates)
      if (found) {
        list.push(found)
      }
      return replacement
    }
    templates[name].kind = fn.kind
    templates[name].i18n = 'parser'
    templates[name].template = fn.template
    templates[name].map = fn.map
  })
}

export default register
