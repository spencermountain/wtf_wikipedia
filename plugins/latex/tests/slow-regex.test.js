import test from 'tape'
import wtf from './_lib.js'

test('a very long label is not a link', (t) => {
  const label = 'a'.repeat(160000)
  t.doesNotThrow(() => wtf(`[http://a.com ${label}] b`).latex(), 'no regex too large')
  t.end()
})

test('a $ in the text is not a replacement pattern', (t) => {
  const str = "'''a$'$'$'$'$'$'$'$'b''' ".repeat(8)
  t.ok(wtf(str).latex().length < 2000, 'bold text')
  t.ok(wtf("[[a$'b]] c").latex().includes("a$'b"), 'link text')
  t.end()
})

test('a redirect to a category', (t) => {
  t.doesNotThrow(() => wtf('#REDIRECT [[Category:ab]]').latex(), 'no link to show')
  t.end()
})
