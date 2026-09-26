import getResult from '../../../src/_fetch/getResult.ts'
import test from 'tape'

test('parse a not found case', (t) => {
  const options = {
    lang: 'en',
    wiki: 'wikipedia',
    follow_redirects: true,
    path: 'api.php',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    title: '165111651dfasfasdfsadfas',
  }

  const response = {
    batchcomplete: '',
    query: { pages: { '-1': { ns: 0, title: '165111651dfasfasdfsadfas', missing: '' } } },
  }

  const expected = [null]

  const result = getResult(response, options)
  t.deepEqual(expected, result)
  t.end()
})

test('API pages can shadow hasOwnProperty or lack a prototype', (t) => {
  const page = { title: 'Example', ns: 0, revisions: [{ '*': 'hello' }], hasOwnProperty: 'metadata' }
  t.equal(getResult({ query: { pages: { 1: page } } })[0].wiki, 'hello', 'shadowed method is harmless')
  const missing = Object.assign(Object.create(null), { missing: '' })
  t.deepEqual(getResult({ query: { pages: { 1: missing } } }), [null], 'null-prototype missing page is recognized')
  t.end()
})
