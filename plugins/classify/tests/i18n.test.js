import test from 'tape'
import wtf from './_lib.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import i18n from '../../i18n/src/index.js'
wtf.extend(i18n)

const dir = path.dirname(fileURLToPath(import.meta.url)) // eslint-disable-line

test('i18n-classify-test', async function (t) {
  let arr = [
    ['Sara-C.-Bisel', 'Person'],
    ['Wendy-Mogel', 'Person'],
  ]

  arr.forEach((a) => {
    let abs = path.join(dir, `../../../tests/cache/${a[0]}.txt`)
    let txt = fs.readFileSync(abs).toString()
    let doc = wtf(txt)
    let res = doc.classify()
    t.equal(res.type, a[1], a[0])
  })

  t.end()
})
