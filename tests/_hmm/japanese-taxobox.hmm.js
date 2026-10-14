import test from 'tape'
import wtf from '../lib/index.js'
import { readPage } from '../_examples/index.js'

test('Japanese-Taxobox-Image', (t) => {
  const doc = wtf(readPage('Willow-Ja'))
  t.ok(doc.images().some((image) => image.file() === 'File:Yanagi.jpg'), 'willow taxobox illustration')
  t.end()
})
