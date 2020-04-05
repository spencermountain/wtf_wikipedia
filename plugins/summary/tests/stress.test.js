const test = require('tape')
const wtf = require('./_lib')
const fs = require('fs')
const path = require('path')

test('first-sentence cleanup summary', (t) => {
  let abs = path.join(__dirname, './texts.txt')
  let arr = fs
    .readFileSync(abs)
    .toString()
    .split(/\n/)
    .filter((s) => s)
  let count = 0
  arr.forEach((txt) => {
    let str = wtf(txt).summary({ article: false })
    console.log(str)
    if (str) {
      count += 1
    }
  })
  let want = parseInt(arr.length * 0.8, 10)
  t.ok(count > want, count + ' > ' + want)
  t.end()
})
