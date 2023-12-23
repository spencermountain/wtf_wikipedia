import getResult from '../../src/_fetch/getResult.js'
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
