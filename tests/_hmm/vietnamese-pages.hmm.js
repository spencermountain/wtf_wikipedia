import test from 'tape'
import wtf from '../lib/index.js'
import { readPage } from '../_examples/index.js'

test('Vietnamese-Nested-Image-Caption-Link', (t) => {
  const doc = wtf(readPage('Toronto-Vi'))
  t.ok(doc.links().some((link) => link.page() === 'Tháp CN'), 'CN Tower link in nested image caption')
  t.end()
})
