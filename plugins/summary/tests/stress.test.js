import test from 'tape'
import wtf from './_lib.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
// ;(async () => {
//   let cat = await wtf.randomCategory()
//   console.log(cat, '\n\n')
//   wtf.parseCategory(cat).then((res) => {
//     res.docs.forEach((doc) => {
//       console.log(doc.sentence().text())
//       // console.log(padEnd(doc.title(), 26) + '       ' + doc.summary({ article: false }) || '-')
//     })
//   })
// })()

test('first-sentence cleanup summary', (t) => {
  const abs = path.join(dir, './texts.txt')
  const arr = fs
    .readFileSync(abs)
    .toString()
    .split(/\r?\n/).filter(Boolean)

  let count = 0
  arr.forEach((txt) => {
    const str = wtf(txt).summary({ article: false })
    if (str) {
      count += 1
    }
  })

  const want = arr.length * 0.75

  // console.log(count, want)
  t.ok(count > want, 'stress test failed: ' + count + ' > ' + want)
  t.end()
})
