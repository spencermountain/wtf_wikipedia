import test from 'tape'
import wtf from './_lib.js'

test('a very long first sentence takes linear time', (t) => {
  const arr = [
    ['words', `Foo is a ${'word '.repeat(200000)}.`],
    ['parentheses', `Foo is a ${'('.repeat(200000)}x${')'.repeat(200000)} bar.`],
  ]
  arr.forEach(([label, str]) => {
    const doc = wtf(str)
    ;['summary', 'tense', 'article'].forEach((method) => {
      const begin = Date.now()
      doc[method]()
      const ms = Date.now() - begin
      t.ok(ms < 1000, `${label}, ${method} took ${ms}ms`)
    })
  })
  t.end()
})
