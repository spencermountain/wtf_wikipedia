import { readPage } from '../../../tests/_examples/index.js'
import test from 'tape'
import wtf from './_lib.js'
import i18n from '../../i18n/src/index.js'
wtf.extend(i18n)

test('i18n-classify-test', async function (t) {
  const arr = [
    ['Sara-C-Bisel', 'Person'],
    ['Wendy-Mogel', 'Person'],
  ]

  arr.forEach((a) => {
    const txt = readPage(a[0])
    const doc = wtf(txt)
    const res = doc.classify()
    t.equal(res.type, a[1], a[0])
  })

  t.end()
})
