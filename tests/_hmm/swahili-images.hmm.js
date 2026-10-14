import test from 'tape'
import wtf from '../lib/index.js'

test('Swahili-Image-Namespace', (t) => {
  const doc = wtf('[[Picha:Centre Court.jpg|thumbnail|Mechi huko Wimbledon.]]')
  t.ok(doc.images().some((image) => image.file() === 'File:Centre_Court.jpg'), 'Swahili image namespace')
  t.end()
})
