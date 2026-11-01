import { readdirSync } from 'node:fs'
import test from 'tape'

const dir = new URL('../src/langs/', import.meta.url)
const langs = readdirSync(dir).filter((f) => f !== '_lib.js' && f !== 'all' && f.startsWith('.') === false)

test('i18n language packs are well-formed', async (t) => {
  t.ok(langs.length > 55, `${langs.length} language packs exist`)
  const owner = {}
  const conflicts = []
  for (const lang of langs) {
    const mod = await import(new URL(`${lang}/index.js`, dir))
    const { aliases, infoboxes, parsers } = mod.data
    const names = [...Object.keys(aliases), ...Object.keys(parsers), ...infoboxes]
    t.ok(names.length > 0, `${lang}: has names`)
    const bad = names.filter(
      (name) => typeof name !== 'string' || name !== name.toLowerCase().trim() || name.length === 0 || /[|{}=[\]<>#:]/.test(name)
    )
    t.deepEqual(bad, [], `${lang}: names are trimmed lowercase`)
    const dupes = names.filter((name, i) => names.indexOf(name) !== i)
    t.deepEqual(dupes, [], `${lang}: no name is listed twice`)
    const badTargets = Object.keys(aliases).filter((name) => typeof aliases[name] !== 'string' || aliases[name] !== aliases[name].toLowerCase())
    t.deepEqual(badTargets, [], `${lang}: alias targets are lowercase core keys`)
    const badParsers = Object.keys(parsers).filter((name) => typeof parsers[name] !== 'function')
    t.deepEqual(badParsers, [], `${lang}: parsers are functions`)
    const badMapTargets = Object.keys(parsers)
      .filter((name) => parsers[name].map)
      .flatMap((name) => Object.values(parsers[name].map))
      .filter((target) => typeof target !== 'string' || target !== target.toLowerCase())
    t.deepEqual(badMapTargets, [], `${lang}: param targets are lowercase english names`)
    // wikis share names — one name must resolve to the same template everywhere
    names.forEach((name) => {
      let fam = aliases[name]
      if (fam === undefined && parsers[name]) {
        fam = parsers[name].template || 'custom'
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
