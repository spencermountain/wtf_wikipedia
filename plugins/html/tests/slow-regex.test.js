import test from 'tape'
import wtf from './_lib.js'

const MAX_MS = 1000
const a = (href, text) => `<a class="link" href="${href}">${text}</a>`

test('links land on the right repeat of their text', (t) => {
  const arr = [
    ['a b [[b]] c', `a b ${a('./B', 'b')} c`],
    ['a [[b]] and [[b]] c', `a ${a('./B', 'b')} and ${a('./B', 'b')} c`],
    ['See [http://a.com b] and [[b]].', `See ${a('http://a.com', 'b')} and ${a('./B', 'b')}.`],
    ['x<ref>y</ref> x [[x]]', `x x ${a('./X', 'x')}`],
    ['<ref name=a/>b [[b]]', `b ${a('./B', 'b')}`],
  ]
  arr.forEach(([str, want]) => {
    t.equal(wtf(str).sentences()[0].html(), `<span class="sentence">${want}</span>`, str)
  })
  t.end()
})

test('more than 240 links in a sentence', (t) => {
  const str = `${Array.from({ length: 300 }, (_, i) => `[[a${i}]] `).join('')}b`
  const html = wtf(str).html()
  t.equal(html.split('<a ').length - 1, 300, 'every link')
  t.notOk(/[\uE000-\uF8FF]/.test(html), 'no placeholder characters left')
  t.end()
})

test('a very long label is not a link', (t) => {
  const label = 'a'.repeat(160000)
  t.doesNotThrow(() => wtf(`[http://a.com ${label}] b`).html(), 'no regex too large')
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
    doc.html()
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})

test('a redirect to a category', (t) => {
  t.doesNotThrow(() => wtf('#REDIRECT [[Category:ab]]').html(), 'no link to show')
  t.end()
})

test('many links in many paragraphs take linear time', (t) => {
  const doc = wtf(`${'[[a]] '.repeat(2000)}\n\n`.repeat(40))
  const begin = Date.now()
  doc.html()
  const ms = Date.now() - begin
  t.ok(ms < 2000, `took ${ms}ms`)
  t.end()
})

test('an infobox image that is not a file', (t) => {
  t.doesNotThrow(() => wtf('{{infobox x|image=[[a]]}}').html(), 'no image to show')
  t.end()
})
