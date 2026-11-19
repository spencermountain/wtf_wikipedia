import test from 'tape'
import wtf from './_lib.js'

const MAX_MS = 1000
const byTitle = (title) => wtf('Some text.', { title }).classify().details.title.length
const byCategory = (name) => wtf(`Some text.\n[[Category:${name}]]`).classify().details.category.length

test('song titles', (t) => {
  const arr = [
    ['Foo (bowie song)', 1],
    ['Foo (a song)', 1],
    ['Foo (a) (b song)', 1],
    ['Foo (songs)', 0],
    ['Foo (a song) bar', 0],
  ]
  arr.forEach(([title, want]) => {
    t.equal(byTitle(title), want, title)
  })
  t.end()
})

test('descent categories', (t) => {
  const arr = [
    ['People of Irish descent', 1],
    ['American people of Irish descent', 1],
    ['People of descent', 0],
    ['Descent of people', 0],
  ]
  arr.forEach(([name, want]) => {
    t.equal(byCategory(name), want, name)
  })
  t.end()
})

test('a long title takes linear time', (t) => {
  const doc = wtf('Some text.', { title: `Foo${' (a'.repeat(64000)})` })
  const begin = Date.now()
  doc.classify()
  const ms = Date.now() - begin
  t.ok(ms < MAX_MS, `took ${ms}ms`)
  t.end()
})
