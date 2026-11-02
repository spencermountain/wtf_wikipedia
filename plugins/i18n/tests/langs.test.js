import { readdirSync } from 'node:fs'
import test from 'tape'
import wtf from './_lib.js'
import register from '../src/register.js'
import { translate } from '../src/langs/_lib.js'
import frPlugin, { data as fr } from '../src/langs/fr/index.js'
import { data as de } from '../src/langs/de/index.js'
import { data as other } from '../src/langs/other/index.js'

test('i18n fr pack has the french aliases', (t) => {
  t.equal(fr.aliases.portail, 'portal', 'portail → portal')
  t.equal(fr.parsers['lien web'].template, 'cite web', 'lien web → cite web')
  t.equal(fr.parsers['lien web'].map.titre, 'title', 'titre → title')
  t.equal(fr.parsers.ouvrage.template, 'cite book', 'ouvrage → cite book')
  t.end()
})

test('i18n de pack keeps its hand-written param maps', (t) => {
  t.equal(de.parsers.internetquelle.template, 'cite web', 'internetquelle → cite web')
  t.equal(de.parsers.internetquelle.map.titel, 'title', 'titel → title')
  t.equal(de.parsers.internetquelle.map.abruf, 'access-date', 'abruf → access-date')
  t.end()
})

test('i18n the other pack holds the long tail', (t) => {
  t.ok(Object.keys(other.aliases).length > 400, 'hundreds of tail aliases')
  t.deepEqual(other.parsers, {}, 'tail names are pure aliases')
  t.end()
})

test('i18n a pack registers through the plugin bridge', (t) => {
  const templates = {}
  const coreKeys = [...Object.values(fr.aliases), ...Object.values(fr.parsers).map((fn) => fn.template)]
  coreKeys.forEach((key) => {
    templates[key] = (tmpl, parse) => ({ data: parse(tmpl, [], 'tmpl'), replacement: 'ok' })
  })
  const infoboxes = {}
  frPlugin(null, templates, infoboxes)
  t.equal(typeof templates['lien web'], 'function', 'lien web is registered')
  t.equal(templates['lien web'].kind, 'citation', 'cite-family names are citations')
  const list = []
  const parse = () => ({ titre: 'Bonjour', url: 'https://a.fr' })
  const replacement = templates['lien web']('{{lien web}}', list, parse, null, {})
  t.equal(replacement, 'ok', 'bridge returns the replacement')
  t.equal(list[0].title, 'Bonjour', 'titre renamed before the core parser runs')
  t.equal(list[0].titre, undefined, 'the localized key is removed')
  t.end()
})

test('i18n a parser beats a plain alias when packs stack', (t) => {
  const templates = { 'cite web': (tmpl, parse) => ({ data: parse(tmpl, [], 'tmpl'), replacement: '' }) }
  register({ aliases: { foo: 'cite web' }, infoboxes: [], parsers: {} }, templates)
  register({ aliases: {}, infoboxes: [], parsers: { foo: translate('cite web', { titre: 'title' }) } }, templates)
  const list = []
  templates.foo('{{foo}}', list, () => ({ titre: 'X' }), null, {})
  t.equal(list[0].title, 'X', 'a later parser upgrades the plain alias')
  register({ aliases: { foo: 'cite web' }, infoboxes: [], parsers: {} }, templates)
  const list2 = []
  templates.foo('{{foo}}', list2, () => ({ titre: 'Y' }), null, {})
  t.equal(list2[0].title, 'Y', 'a later plain alias never downgrades the parser')
  t.end()
})

test('i18n core-style shorthand defs register as parsers', (t) => {
  const templates = {}
  register({ templates: { 'гео': ['lat', 'lon'], 'пример': 'sample text', 'второе': 1 } }, templates)
  const parse = (tmpl, order) => {
    const out = {}
    ;(order || []).forEach((key, i) => {
      out[key] = ['a', 'b'][i]
    })
    return out
  }
  const list = []
  t.equal(templates['гео']('{{гео|a|b}}', list, parse, null, {}), '', 'array form replaces with nothing')
  t.deepEqual(list[0], { lat: 'a', lon: 'b' }, 'array form names positional params')
  t.equal(templates['пример']('{{пример}}', [], parse, null, {}), 'sample text', 'string form is static text')
  t.equal(templates['второе']('{{x|a|b}}', [], parse, null, {}), 'b', 'number form keeps that pipe')
  t.end()
})

test('i18n shorthand defs parse end-to-end', (t) => {
  wtf.extend((_models, templates) => register({ templates: { 'shorthand-i18n-test': ['id', 'start'] } }, templates))
  const doc = wtf('a {{shorthand-i18n-test|abc|4:20}} b')
  const json = doc.templates()[0].json()
  t.equal(json.template, 'shorthand-i18n-test', 'template keeps its name')
  t.equal(json.data.id, 'abc', 'first positional param named')
  t.equal(json.data.start, '4:20', 'second positional param named')
  t.end()
})

test('i18n every pack registers against the real core registry', async (t) => {
  const dir = new URL('../src/langs/', import.meta.url)
  const packs = readdirSync(dir).filter((f) => f !== '_lib.js' && f.startsWith('.') === false)
  for (const lang of packs) {
    const mod = await import(new URL(`${lang}/index.js`, dir))
    // throws at extend-time if a pack points at a core key that moved
    wtf.extend(mod.default)
    if (lang !== 'all') {
      t.equal(mod.default.lang, lang, `${lang}: plugin is tagged with its language`)
    }
  }
  t.ok(packs.length > 55, `${packs.length} packs extended cleanly`)
  t.end()
})

test('i18n a single pack works end-to-end', (t) => {
  const doc = wtf('x.<ref>{{lien web|titre=Bonjour|url=https://a.fr}}</ref>')
  t.equal(doc.references()[0].title(), 'Bonjour', 'french cite parses after pack extend')
  t.end()
})
