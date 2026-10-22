import test from 'tape'
import wtf from '../../lib/index.js'
import parse from '../../../src/parse/index.ts'
import templates from '../../../src/templates/index.ts'
import parseDoc from '../../../src/API/_fetch/parseDoc.ts'

const pages = (value) => {
  if (!value || typeof value !== 'object') {
    return []
  }
  if (value.type === 'internal' && typeof value.page === 'string') {
    return [value.page]
  }
  return Object.values(value).flatMap(pages)
}

test('project options reach every content parser', (t) => {
  const examples = [
    '[[paris]]',
    '== [[paris]] ==\nBody',
    '* [[paris]]',
    '{|\n! Place\n|-\n| [[paris]]\n|}',
    '{{infobox place|name=[[paris]]}}',
    '{{unknown|{{infobox place|name=[[paris]]}}}}',
    'Text<ref>[[paris]]</ref>',
    '[[File:Example.jpg|thumb|[[paris]]]]',
    '#REDIRECT [[paris]]',
  ]
  examples.forEach((wiki) => {
    const lower = pages(parse(wiki, { project: 'wiktionary' }))
    const upper = pages(parse(wiki))
    t.ok(lower.length > 0, `${wiki} contains parsed links`)
    t.ok(lower.every((page) => page === 'paris'), `${wiki} respects project`)
    t.ok(upper.length > 0 && upper.every((page) => page === 'Paris'), `${wiki} defaults to Wikipedia`)
  })
  t.end()
})

test('template callbacks and fetched documents retain parser options', (t) => {
  const opts = { project: 'wiktionary', title: 'paris', lang: 'fr' }
  templates['options probe'] = (wiki, list, parseJSON, _alias, info) => {
    t.equal(info.project, opts.project, 'template callback receives project')
    t.equal(info.title, opts.title, 'template callback receives metadata')
    const data = parseJSON(wiki, [], 'raw')
    t.equal(data.name.links[0].page, 'paris', 'callback parser retains project')
    list.push(data)
    return ''
  }
  wtf('{{options probe|name=[[paris]]}}', opts)
  delete templates['options probe']
  const doc = parseDoc([{ wiki: '[[paris]]', meta: opts }], 'paris')
  t.equal(doc.links()[0].page(), 'paris', 'fetch metadata reaches parser')
  t.equal(doc.domain, 'wiktionary.org', 'fetch API uses shared defaults')
  t.end()
})

test('API and parser share defaults without mutating caller options', (t) => {
  const opts = Object.freeze({ project: 'wiktionary', lang: 'fr', title: 'paris' })
  const doc = wtf('[[paris]]', opts)
  t.equal(doc.links()[0].page(), 'paris', 'public entry point forwards options')
  t.equal(doc.language, 'fr', 'API receives language')
  t.equal(doc.domain, 'wiktionary.org', 'domain follows project')
  t.equal(doc.options().project, 'wiktionary', 'API exposes resolved project')
  t.equal(wtf('[[paris]]').options().project, 'wikipedia', 'API exposes default project')
  t.equal(wtf('[[paris]]').links()[0].page(), 'Paris', 'options do not leak between parses')
  t.equal(wtf('[[paris]]').language, 'en', 'default language')
  t.equal(wtf('[[paris]]').domain, 'wikipedia.org', 'default domain')
  t.equal(wtf('[[paris]]', { project: 'custom' }).links()[0].page(), 'paris', 'unknown project preserves case')
  t.equal(wtf('[[wikipedia:paris]]', opts).links()[0].page(), 'Paris', 'explicit Wikipedia target overrides source project')
  t.equal(wtf('[[fr:paris]]', opts).links()[0].page(), 'paris', 'language prefix stays in the source project')
  t.end()
})
