import { readdirSync } from 'node:fs'
import test from 'tape'

const dir = new URL('../src/langs/', import.meta.url)
const langs = readdirSync(dir).filter((f) => f !== 'all' && f.startsWith('.') === false)

// a template def is a {template, map} descriptor, a core-style shortcut, or a parser fn
const okDef = (def) => {
  if (Array.isArray(def)) {
    return def.every((prop) => typeof prop === 'string')
  }
  if (def && typeof def === 'object' && def.template !== undefined) {
    return typeof def.template === 'string' && (def.map === undefined || typeof def.map === 'object')
  }
  return ['number', 'string', 'function', 'object'].includes(typeof def)
}

test('i18n language packs are well-formed', async (t) => {
  t.ok(langs.length > 35, `${langs.length} language packs exist`)
  const owner = {}
  const conflicts = []
  for (const lang of langs) {
    const mod = await import(new URL(`${lang}/index.js`, dir))
    const { enLang, aliases = {}, infoboxes = [], templates = {}, gated = {} } = mod.default
    t.ok(typeof enLang === 'string' && enLang.length > 0 && enLang === enLang.toLowerCase(), `${lang}: has an english name`)
    const badWords = ['category', 'redirect', 'stub', 'infobox', 'image', 'reference', 'disambig', 'disambigTitle'].flatMap((kind) =>
      (mod.default[kind] || []).filter((w) => typeof w !== 'string' || w !== w.toLowerCase().trim() || w.length === 0)
    )
    t.deepEqual(badWords, [], `${lang}: page-level words are trimmed lowercase`)
    const badGated = Object.keys(gated).filter((name) => okDef(gated[name]) === false)
    t.deepEqual(badGated, [], `${lang}: gated defs are well-formed`)
    const names = [...Object.keys(aliases), ...Object.keys(templates), ...infoboxes]
    t.ok(names.length > 0, `${lang}: has names`)
    const bad = names.filter(
      (name) => typeof name !== 'string' || name !== name.toLowerCase().trim() || name.length === 0 || /[|{}=[\]<>#:]/.test(name)
    )
    t.deepEqual(bad, [], `${lang}: names are trimmed lowercase`)
    const dupes = names.filter((name, i) => names.indexOf(name) !== i)
    t.deepEqual(dupes, [], `${lang}: no name is listed twice`)
    const badTargets = Object.keys(aliases).filter((name) => typeof aliases[name] !== 'string' || aliases[name] !== aliases[name].toLowerCase())
    t.deepEqual(badTargets, [], `${lang}: alias targets are lowercase core keys`)
    const badDefs = Object.keys(templates).filter((name) => okDef(templates[name]) === false)
    t.deepEqual(badDefs, [], `${lang}: template defs are well-formed`)
    const badMapTargets = Object.keys(templates)
      .filter((name) => templates[name] && templates[name].map)
      .flatMap((name) => Object.values(templates[name].map))
      .filter((target) => typeof target !== 'string' || target !== target.toLowerCase())
    t.deepEqual(badMapTargets, [], `${lang}: param targets are lowercase english names`)
    // wikis share names — one name must resolve to the same template everywhere
    names.forEach((name) => {
      let fam = aliases[name]
      if (fam === undefined && templates[name] !== undefined) {
        fam = templates[name].template || 'custom'
      }
      if (fam === undefined) {
        fam = 'taxobox'
      }
      if (owner[name] && owner[name] !== fam && fam !== 'custom' && owner[name] !== 'custom') {
        conflicts.push(`'${name}' (${owner[name]} in one pack, ${fam} in ${lang})`)
      }
      owner[name] = fam
    })
  }
  t.deepEqual(conflicts, [], 'no name maps to two different templates across packs')
  t.end()
})
