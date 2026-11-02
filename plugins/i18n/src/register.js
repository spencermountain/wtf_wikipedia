// registers one language pack onto the core template registry.
// a pack is pure data (see langs/), every section optional:
//   lang, enLang — iso code + english name
//   category / redirect / stub / infobox / image / reference / disambig / disambigTitle
//             — that wiki's page-level words (data only, not yet wired in)
//   aliases   — localized name → the core template key it resolves to
//   templates — localized name → a definition:
//     { template: 'cite web', map: { 'titre': 'title' } } — rename params, parse as a core template
//     ['lat', 'lon'] / 1 / 'text' / { props, out }        — core-style shortcuts
//     (tmpl, parse, opts, templates) => { data, replacement } — a custom parser fn
//   gated     — same definitions, but only applied when a document's lang matches the pack;
//               for names too generic to claim globally, like fr's {{nb}}
import { translate, fromShortcut } from './_lib.js'

const toParser = (def) => {
  if (typeof def === 'function') {
    return def
  }
  if (def && typeof def === 'object' && Array.isArray(def) === false && def.template) {
    return translate(def.template, def.map || {})
  }
  return fromShortcut(def)
}

// bridge a core-style parser fn to the plugin callback contract, keeping its metadata
const bridge = (fn, templates) => {
  const wrapped = function (tmpl, list, parse, _unused, opts) {
    const { data: found, replacement } = fn(tmpl, parse, opts, templates)
    if (found) {
      list.push(found)
    }
    return replacement
  }
  wrapped.kind = fn.kind
  wrapped.template = fn.template
  wrapped.map = fn.map
  return wrapped
}

const register = (data, templates, infoboxes = {}, overlay) => {
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
  Object.keys(data.templates || {}).forEach((name) => {
    let fn = toParser(data.templates[name])
    if (fn.template && typeof templates[fn.template] !== 'function') {
      throw new Error(`wtf-plugin-i18n: '${fn.template}' is not a core template`)
    }
    // wikis share names: two param-map defs onto the same template merge their maps,
    // the earlier registration winning per key — otherwise the first definition stands
    const prev = templates[name]
    if (prev && prev.i18n === 'parser') {
      if (prev.template && prev.template === fn.template && prev.map && fn.map) {
        fn = translate(fn.template, Object.assign({}, fn.map, prev.map))
      } else {
        return
      }
    }
    templates[name] = bridge(fn, templates)
    templates[name].i18n = 'parser'
  })
  // gated names go into core's byLang overlay, resolved only when opts.lang matches
  if (overlay && overlay.byLang && data.lang) {
    overlay.byLang[data.lang] = overlay.byLang[data.lang] || {}
    const slot = overlay.byLang[data.lang]
    Object.keys(data.gated || {}).forEach((name) => {
      if (Object.hasOwn(slot, name)) {
        return
      }
      const fn = toParser(data.gated[name])
      if (fn.template && typeof templates[fn.template] !== 'function') {
        throw new Error(`wtf-plugin-i18n: '${fn.template}' is not a core template`)
      }
      slot[name] = bridge(fn, templates)
    })
  }
}

export default register
