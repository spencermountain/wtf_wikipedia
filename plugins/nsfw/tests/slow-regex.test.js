import test from 'tape'
import wtf from './_lib.js'

const MAX_MS = 1000

test('titles with sex in parentheses', (t) => {
  const arr = [
    ['Foo (sex position)', 1],
    ['Foo (a) (sex)', 1],
    ['Foo (a sex b)', 1],
    ['Foo (Sex)', 1],
    ['Foo (sexuality)', 1],
    ['Colchester (Essex)', 0],
    ['Foo (unisex)', 0],
    ['Foo', 0],
  ]
  arr.forEach(([title, want]) => {
    t.equal(wtf('Some text.', { title }).nsfw().length, want, title)
  })
  t.end()
})

test('a long title takes linear time', (t) => {
  const arr = [
    [' (', `Foo${' ('.repeat(64000)}(x)`],
    // this one was cubic
    [' (sex, then a line break', `Foo${' (sex'.repeat(64000)}\n(x)`],
  ]
  arr.forEach(([label, title]) => {
    const doc = wtf('Some text.', { title })
    const begin = Date.now()
    doc.nsfw()
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})
