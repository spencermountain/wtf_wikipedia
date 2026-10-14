import test from 'tape'
import wtf from './_lib.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import i18n from '../../i18n/src/index.js'
wtf.extend(i18n)

const dir = path.dirname(fileURLToPath(import.meta.url))

test('i18n-classify-test', async function (t) {
  const arr = [
    ['Sara-C.-Bisel', 'Person'],
    ['Wendy-Mogel', 'Person'],
  ]

  arr.forEach((a) => {
    const abs = path.join(dir, `../../../tests/cache/${a[0]}.txt`)
    const txt = fs.readFileSync(abs).toString()
    const doc = wtf(txt)
    const res = doc.classify()
    t.equal(res.type, a[1], a[0])
  })

  t.end()
})
