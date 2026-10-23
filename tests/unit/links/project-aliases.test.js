import test from 'tape'
import wtf from '../../lib/index.js'

test('project aliases share canonical destinations', (t) => {
  const examples = {
    w: 'wikipedia', wikt: 'wiktionary', b: 'wikibooks', n: 'wikinews', q: 'wikiquote',
    s: 'wikisource', v: 'wikiversity', voy: 'wikivoyage', d: 'wikidata', c: 'commons',
    species: 'wikispecies', f: 'wikifunctions', mw: 'mediawiki', mediawikiwiki: 'mediawiki',
    m: 'meta', metawiki: 'meta', metawikimedia: 'meta', metawikipedia: 'meta',
    wmf: 'foundation', wikimedia: 'foundation', outreachwiki: 'outreach',
  }
  Object.entries(examples).forEach(([alias, project]) => {
    const link = wtf(`[[${alias}:Example]]`).links()[0]
    const canonical = wtf(`[[${project}:Example]]`).links()[0]
    t.equal(link.json().project, project, `${alias} canonical project`)
    t.equal(link.text(), `${alias}:Example`, `${alias} preserves display text`)
    t.equal(link.href(), canonical.href(), `${alias} destination URL`)
    t.equal(wtf('[[Example]]', { project: alias }).options().project, project, `${alias} option`)
  })
  t.equal(wtf('[[wikt:fr:bonjour]]').links()[0].href(), 'http://fr.wiktionary.org/wiki/bonjour', 'qualified alias URL')
  t.equal(wtf('[[q:example]]').links()[0].page(), 'Example', 'alias uses project capitalization')
  t.equal(wtf('[[example]]', { project: 'WIKT' }).links()[0].page(), 'example', 'case-insensitive project option')
  t.end()
})
