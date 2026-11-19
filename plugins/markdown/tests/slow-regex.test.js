import test from 'tape'
import wtf from './_lib.js'

const MAX_MS = 1000

test('links land on the right repeat of their text', (t) => {
  const arr = [
    ['a b [[b]] c', 'a b [b](./B) c'],
    ['a [[b]] and [[b]] c', 'a [b](./B) and [b](./B) c'],
    ['See [http://a.com b] and [[b]].', 'See [b](http://a.com) and [b](./B).'],
    ['x<ref>y</ref> x [[x]]', 'x x [x](./X)'],
    ['<ref name=a/>b [[b]]', 'b [b](./B)'],
  ]
  arr.forEach(([str, want]) => {
    t.equal(wtf(str).markdown(), want, str)
  })
  t.end()
})

test('a very long label is not a link', (t) => {
  const label = 'a'.repeat(160000)
  t.doesNotThrow(() => wtf(`[http://a.com ${label}] b`).markdown(), 'no regex too large')
  t.end()
})

// the text before a link must not be scanned once per repeated tag
test('repeated unclosed markup takes linear time', (t) => {
  const arr = [
    ['<ref ', `${'<ref '.repeat(32000)}[[a]] b`],
    ['[http://a b ', `${'[http://a b '.repeat(32000)}[[c]] d`],
    ['[[a]] past the limit on links', '[[a]]'.repeat(32000)],
  ]
  arr.forEach(([label, str]) => {
    const doc = wtf(str)
    const begin = Date.now()
    doc.markdown()
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})

test('a redirect to a category', (t) => {
  t.doesNotThrow(() => wtf('#REDIRECT [[Category:ab]]').markdown(), 'no link to show')
  t.end()
})

test('many links in many paragraphs take linear time', (t) => {
  const doc = wtf(`${'[[a]] '.repeat(2000)}\n\n`.repeat(40))
  const begin = Date.now()
  doc.markdown()
  const ms = Date.now() - begin
  t.ok(ms < 2000, `took ${ms}ms`)
  t.end()
})
