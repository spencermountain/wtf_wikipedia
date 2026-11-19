import test from 'tape'
import wtf from '../../lib/index.js'

const COUNT = 32000
const MAX_MS = 1000

test('comments are removed', (t) => {
  const arr = [
    ['a <!-- b --> c', 'a c'],
    ['a <!-- b\nc --> d', 'a d'],
    ['a <!-- b --> c <!-- d --> e', 'a c e'],
    ['<!-- b -->a', 'a'],
    ['a <!-- unclosed', 'a <!-- unclosed'],
    ['a --> b', 'a --> b'],
    // a comment runs from the last opener before its end
    ['a <!-- b <!-- c --> d', 'a <!-- b d'],
  ]
  arr.forEach(([str, text]) => {
    t.equal(wtf(str).text(), text, str)
  })
  t.end()
})

test('external links', (t) => {
  // [wikitext, text, url]
  const arr = [
    ['[http://a.com b] c', 'b c', 'http://a.com'],
    ['[http://a.com] c', 'c', 'http://a.com'],
    ['[mailto://a.com b] c', 'b c', 'mailto://a.com'],
    // a bracket can be in the url, but not the start of another link
    ['[http://a.com/b[1 c] d', 'c d', 'http://a.com/b[1'],
    ['[http://a.com [http://b.com c] d', '[http://a.com c d', 'http://b.com'],
  ]
  arr.forEach(([str, text, url]) => {
    const doc = wtf(str)
    t.equal(doc.text(), text, `text: ${str}`)
    t.deepEqual(doc.links().map((l) => l.href()), [url], `url: ${str}`)
  })
  t.end()
})

test('internal links with a pipe', (t) => {
  // [wikitext, text, page]
  const arr = [
    ['[[a b|c]] d', 'c d', 'A b'],
    ['[[ab|c]] d', 'c d', 'Ab'],
    ['[[ab|c|d]] e', 'c|d e', 'Ab|c'],
    ['[[a|b]] c', 'a|b c', 'A|b'],
    ['[[ab|]] c', 'c', 'Ab'],
    ['[[|ab]] c', '|ab c', '|ab'],
    ['[[a b#c|d]] e', 'd e', 'A b'],
    ['[[ab|[c]]] d', '[c] d', 'Ab'],
  ]
  arr.forEach(([str, text, page]) => {
    const doc = wtf(str)
    t.equal(doc.text(), text, `text: ${str}`)
    t.deepEqual(doc.links().map((l) => l.page()), [page], `page: ${str}`)
  })
  t.end()
})

// each repeated item must not scan on past the next one
test('repeated unclosed markup takes linear time', (t) => {
  const arr = [
    ['<!--', '<!--'.repeat(COUNT * 8)],
    ['[http://a.com', '[http://a.com'.repeat(COUNT * 16)],
    ['[[a|long]]', `[[a|${'b'.repeat(1500)}]] `.repeat(1000)],
  ]
  arr.forEach(([label, str]) => {
    const begin = Date.now()
    wtf(str)
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})
