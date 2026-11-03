import test from 'tape'
import fs from 'node:fs'
import wtf from './_lib.js'

const read = (name) => fs.readFileSync(new URL(`./cache/${name}.txt`, import.meta.url), 'utf8')

test('positive test', function (t) {
  const arr = ['one-night-stand', 'fashionistas', 'rocco-siffredi']
  arr.forEach((str) => {
    const doc = wtf(read(str))
    t.ok(doc.nsfw().length > 0, str)
  })
  t.end()
})
