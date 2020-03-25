const test = require('tape')
const wtf = require('./_lib')
const fs = require('fs')
const path = require('path')
const i18n = require('../../i18n')
wtf.extend(i18n)

test('i18n-classify-test', async function(t) {
  let arr = [
    ['Sara-C.-Bisel', 'Person'],
    ['Wendy-Mogel', 'Person']
  ]

  arr.forEach(a => {
    let abs = path.join(__dirname, `../../../tests/cache/${a[0]}.txt`)
    let txt = fs.readFileSync(abs).toString()
    let doc = wtf(txt)
    let res = doc.classify()
    t.equal(res.category, a[1], a[0])
  })

  t.end()
})
