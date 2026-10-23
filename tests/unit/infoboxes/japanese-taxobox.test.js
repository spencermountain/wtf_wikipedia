import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Japanese-Taxobox-Image', (t) => {
  const doc = wtf(readPage('Willow-Ja'))
  t.equal(doc.infobox().type(), '生物分類表', 'recognized taxobox')
  t.equal(doc.infobox().get('名称').text, 'ヤナギ属', 'taxobox fields remain available')
  t.ok(doc.images().some((image) => image.file() === 'File:Yanagi.jpg'), 'willow taxobox illustration')
  t.end()
})
