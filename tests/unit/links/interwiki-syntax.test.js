import test from 'tape'
import wtf from '../../../src/index.ts'

// Desired normalized output, independent of the current parser implementation.
const examples = {
  '[[Paris]]': { type: 'internal', page: 'Paris' },
  '[[Help:Contents]]': { type: 'internal', page: 'Help:Contents' },
  '[[fr:Paris]]': { type: 'interwiki', lang: 'fr', page: 'Paris' },
  '[[:fr:Paris]]': { type: 'interwiki', lang: 'fr', page: 'Paris' },
  '[[:fr:Paris|Paris]]': { type: 'interwiki', lang: 'fr', page: 'Paris', text: 'Paris' },
  '[[wikt:word]]': { type: 'interwiki', project: 'wiktionary', page: 'word' },
  '[[wiktionary:word]]': { type: 'interwiki', project: 'wiktionary', page: 'word' },
  '[[wikt:fr:bonjour]]': { type: 'interwiki', lang: 'fr', project: 'wiktionary', page: 'Bonjour' },
  '[[commons:Category:Paris]]': { type: 'interwiki', project: 'commons', page: 'Category:Paris' },
  '[[w:en:Paris]]': { type: 'interwiki', lang: 'en', project: 'wikipedia', page: 'Paris' },
  '[[doi:10.1000/182]]': { type: 'interwiki', prefix: 'doi', page: '10.1000/182' },
  '[[Paris#History]]': { type: 'internal', page: 'Paris', anchor: 'History' },
  '[[Paris#History|History of Paris]]': {
    type: 'internal', page: 'Paris', anchor: 'History', text: 'History of Paris',
  },
  '[[:fr:Paris#Histoire|History of Paris]]': {
    type: 'interwiki', lang: 'fr', page: 'Paris', anchor: 'Histoire', text: 'History of Paris',
  },
  '{{ill|English title|fr|French title}}': {
    type: 'interwiki', lang: 'fr', page: 'French title',
  },
  '{{interlanguage link|English title|fr|French title}}': {
    type: 'interwiki', lang: 'fr', page: 'French title',
  },
  '{{ill|English title|fr|French title|de|German title}}': [
    { type: 'interwiki', lang: 'fr', page: 'French title' },
    { type: 'interwiki', lang: 'de', page: 'German title' },
  ],
}

test('interwiki syntax - normalized link output', (t) => {
  Object.entries(examples).forEach(([wikitext, expected]) => {
    const links = wtf(wikitext).links().map((link) => link.json())
    const results = Array.isArray(expected) ? expected : [expected]
    t.deepEqual(links, results, wikitext)
  })
  t.end()
})
