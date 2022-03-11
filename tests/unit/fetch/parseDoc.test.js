const test = require('tape')
const parseDoc = require('../../../src/_fetch/parseDoc')
const { isArray } = require('../../../src/_lib/helpers')
const document = {
  text: '=== hello ===',
  meta: {
    title: 'hello',
    pageID: 1,
    namespace: 1,
    domain: 'http://localhost:80',
    wikidata: 'Q12',
    description: 'general greeting',
  }
}


test('should filter out all the undefined values', (t) => {
  const result = parseDoc([undefined, document], ['not hallo', 'hallo'])
  t.equal(result.length, 1)
  t.end()
})

test('should return null if there are no document', (t) => {
  const result = parseDoc([], [])
  t.equal(result, null)
  t.end()
})

test('should return null if there are no document', (t) => {
  const result = parseDoc([undefined], ['not hallo'])
  t.equal(result, null)
  t.end()
})

test('should return an array even if there is only one document', (t) => {
  const result = parseDoc([document], [1])
  t.assert(isArray(result))
  t.end()
})

test('should not return an array even if title is a string', (t) => {
  const result = parseDoc([document], 'hello')
  t.assert(!isArray(result))
  t.end()
})

test('should not return an array even if title is a number', (t) => {
  const result = parseDoc([document], 1)
  t.assert(!isArray(result))
  t.end()
})