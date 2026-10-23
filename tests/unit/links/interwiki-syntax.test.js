import test from 'tape'
import wtf from '../../../src/index.ts'

// Desired normalized output, independent of the current parser implementation.
const examples = {
  '[[Paris]]': { type: 'internal', page: 'Paris', text: 'Paris' },
  '[[Help:Contents]]': { type: 'internal', page: 'Help:Contents', text: 'Help:Contents' },
  '[[fr:Paris]]': { type: 'interwiki', lang: 'fr', page: 'Paris', inline: false, text: '' },
  '[[:fr:Paris]]': { type: 'interwiki', lang: 'fr', page: 'Paris', inline: true, text: 'fr:Paris' },
  '[[:fr:Paris|Paris]]': { type: 'interwiki', lang: 'fr', page: 'Paris', inline: true, text: 'Paris' },
  '[[wikt:word]]': { type: 'interwiki', project: 'wiktionary', page: 'word', inline: true, text: 'wikt:word' },
  '[[wiktionary:word]]': { type: 'interwiki', project: 'wiktionary', page: 'word', inline: true, text: 'wiktionary:word' },
  '[[wikt:fr:bonjour]]': { type: 'interwiki', lang: 'fr', project: 'wiktionary', page: 'bonjour', inline: true, text: 'wikt:fr:bonjour' },
  '[[commons:Category:Paris]]': { type: 'interwiki', project: 'commons', page: 'Category:Paris', inline: true, text: 'commons:Category:Paris' },
  '[[w:en:Paris]]': { type: 'interwiki', lang: 'en', project: 'wikipedia', page: 'Paris', inline: true, text: 'w:en:Paris' },
  '[[doi:10.1000/182]]': { type: 'interwiki', prefix: 'doi', page: '10.1000/182', inline: true, text: 'doi:10.1000/182' },
  '[[Paris#History]]': { type: 'internal', page: 'Paris', anchor: 'History', text: 'Paris' },
  '[[Paris#History|History of Paris]]': {
    type: 'internal', page: 'Paris', anchor: 'History', text: 'History of Paris',
  },
  '[[:fr:Paris#Histoire|History of Paris]]': {
    type: 'interwiki', lang: 'fr', page: 'Paris', inline: true, anchor: 'Histoire', text: 'History of Paris',
  },
  // TODO: Restore interlanguage-template link contracts.
  // '{{ill|English title|fr|French title}}': {
  // type: 'interwiki', lang: 'fr', page: 'French title',
  // },
  // '{{interlanguage link|English title|fr|French title}}': {
  // type: 'interwiki', lang: 'fr', page: 'French title',
  // },
  // '{{ill|English title|fr|French title|de|German title}}': [
  // { type: 'interwiki', lang: 'fr', page: 'French title' },
  // { type: 'interwiki', lang: 'de', page: 'German title' },
  // ],
}

test('interwiki syntax - normalized link output', (t) => {
  Object.entries(examples).forEach(([wikitext, expected]) => {
    const doc = wtf(wikitext)
    const parsed = doc.links()
    const links = parsed.map((link) => link.json())
    const results = (Array.isArray(expected) ? expected : [expected]).map((link) => ({ ...link, wiki: wikitext }))
    t.deepEqual(links, results, wikitext)
    if (wikitext.startsWith('[[')) {
      t.deepEqual(parsed.map((link) => link.text()), results.map((link) => link.text), `${wikitext} link text`)
      t.equal(doc.text(), results.map((link) => link.text).join(''), `${wikitext} document text`)
    }
  })
  t.end()
})
