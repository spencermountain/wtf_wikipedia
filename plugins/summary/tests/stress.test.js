import test from 'tape'
import wtf from './_lib.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
  let abs = path.join(dir, './texts.txt')
  let arr = fs
    .readFileSync(abs)
    .toString()
    .split(/\r?\n/)
    .filter((s) => s)

  let count = 0
  arr.forEach((txt) => {
    let str = wtf(txt).summary({ article: false })
    if (str) {
      count += 1
    }
  })

  let want = arr.length * 0.75

  // console.log(count, want)
  t.ok(count > want, 'stress test failed: ' + count + ' > ' + want)
  t.end()
})
