import { readdirSync } from 'node:fs'
import test from 'tape'
import wtf from './_lib.js'
import register from '../src/register.js'
import plugin from '../src/plugin.js'
import fr from '../src/langs/fr/index.js'
import de from '../src/langs/de/index.js'

test('i18n packs are pure data', (t) => {
  t.equal(fr.lang, 'fr', 'pack carries its language')
  t.equal(fr.enLang, 'french', 'pack carries its english name')
  t.deepEqual(fr.category, ['catégorie'], 'pack carries its category word')
  t.deepEqual(fr.redirect, ['redirection'], 'pack carries its redirect word')
  t.deepEqual(fr.stub, ['ébauche'], 'pack carries its stub word')
  t.equal(fr.aliases.portail, 'portal', 'portail → portal')
  t.equal(fr.templates['lien web'].template, 'cite web', 'lien web → cite web')
  t.equal(fr.templates['lien web'].map.titre, 'title', 'titre → title')
  t.equal(fr.templates.ouvrage.template, 'cite book', 'ouvrage → cite book')
  t.equal(JSON.parse(JSON.stringify(fr)).templates.ouvrage.template, 'cite book', 'pack survives JSON round-trip')
  t.end()
})

test('i18n de pack keeps its hand-written param maps', (t) => {
  t.equal(de.templates.internetquelle.template, 'cite web', 'internetquelle → cite web')
  t.equal(de.templates.internetquelle.map.titel, 'title', 'titel → title')
  t.equal(de.templates.internetquelle.map.abruf, 'access-date', 'abruf → access-date')
  t.end()
})

test('i18n a pack registers through the plugin bridge', (t) => {
  const templates = {}
  const coreKeys = [
    ...Object.values(fr.aliases),
    ...Object.values(fr.templates).map((def) => def.template),
  ]
  coreKeys.forEach((key) => {
    templates[key] = (tmpl, parse) => ({ data: parse(tmpl, [], 'tmpl'), replacement: 'ok' })
  })
  const infoboxes = {}
  plugin(fr)(null, templates, infoboxes)
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

test('i18n a param-map def beats a plain alias when packs stack', (t) => {
  const templates = { 'cite web': (tmpl, parse) => ({ data: parse(tmpl, [], 'tmpl'), replacement: '' }) }
  register({ aliases: { foo: 'cite web' } }, templates)
  register({ templates: { foo: { template: 'cite web', map: { titre: 'title' } } } }, templates)
  const list = []
  templates.foo('{{foo}}', list, () => ({ titre: 'X' }), null, {})
  t.equal(list[0].title, 'X', 'a later param-map def upgrades the plain alias')
  register({ aliases: { foo: 'cite web' } }, templates)
  const list2 = []
  templates.foo('{{foo}}', list2, () => ({ titre: 'Y' }), null, {})
  t.equal(list2[0].title, 'Y', 'a later plain alias never downgrades the def')
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
  wtf.extend(plugin({ templates: { 'shorthand-i18n-test': ['id', 'start'] } }))
  const doc = wtf('a {{shorthand-i18n-test|abc|4:20}} b')
  const json = doc.templates()[0].json()
  t.equal(json.template, 'shorthand-i18n-test', 'template keeps its name')
  t.equal(json.data.id, 'abc', 'first positional param named')
  t.equal(json.data.start, '4:20', 'second positional param named')
  t.end()
})

test('i18n every pack registers against the real core registry', async (t) => {
  const dir = new URL('../src/langs/', import.meta.url)
  const packs = readdirSync(dir).filter((f) => f.startsWith('.') === false)
  for (const lang of packs) {
    const mod = await import(new URL(`${lang}/index.js`, dir))
    if (lang === 'all') {
      wtf.extend(mod.default)
      continue
    }
    t.equal(mod.default.lang, lang, `${lang}: pack is tagged with its language`)
    // throws at extend-time if a pack points at a core key that moved
    wtf.extend(plugin(mod.default))
  }
  t.ok(packs.length > 30, `${packs.length} packs extended cleanly`)
  t.end()
})

test('i18n a single pack works end-to-end', (t) => {
  const doc = wtf('x.<ref>{{lien web|titre=Bonjour|url=https://a.fr}}</ref>')
  t.equal(doc.references()[0].title(), 'Bonjour', 'french cite parses after pack extend')
  t.end()
})
