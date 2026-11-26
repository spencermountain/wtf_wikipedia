import test from 'tape'
import wtf from '../../lib/index.js'

const COUNT = 32000
const MAX_MS = 1000

const each = (fn, n = COUNT) => Array.from({ length: n }, (_, i) => fn(i)).join('')

const texts = (list) => list.map((o) => o.text())
const offsets = (list) => list.map((o) => [o.text, o.start, o.end])

test('sentences join and split', (t) => {
  const arr = [
    ['Mr. Smith went home. He slept.', ['Mr. Smith went home.', 'He slept.']],
    ['The U.S. Army was big. It won.', ['The U.S. Army was big.', 'It won.']],
    ['It was c. 1900 then. It was late.', ['It was c. 1900 then.', 'It was late.']],
    ['It cost approx. five dollars. It was cheap.', ['It cost approx. five dollars.', 'It was cheap.']],
    ['Wait... what is this. Next one.', ['Wait... what is this.', 'Next one.']],
    ['He said "hello. there" and left. Next one.', ['He said "hello. there" and left.', 'Next one.']],
    ['(See a. b. c.) Then more. Next one.', ['(See a. b. c.)', 'Then more.', 'Next one.']],
    ['See [[a. b]] for more. Next one.', ['See a. b for more.', 'Next one.']],
    ['Hello there.   \nNext one.', ['Hello there.', 'Next one.']],
    ['Some words:\nmore words here.', ['Some words:', 'more words here.']],
    ['No ending here\nmore words here.', ['No ending here more words here.']],
    ['a. b. c. Foo bar baz. Next one.', ['a. b. c. Foo bar baz.', 'Next one.']],
    ['1. 2. 3. Foo bar. Next one.', ['1. 2. 3. Foo bar.', 'Next one.']],
    ['日本語の文。次の文。', ['日本語の文。', '次の文。']],
  ]
  arr.forEach(([str, want]) => {
    t.deepEqual(texts(wtf(str).sentences()), want, str)
  })
  // an unbalanced quote or parenthesis stops holding a sentence open, at some length
  const long = 'x '.repeat(500)
  t.equal(wtf(`Odd "${long}end. Next one.`).sentences().length, 2, 'long open quote')
  t.equal(wtf(`Odd (${long}end. Next one.`).sentences().length, 2, 'long open paren')
  t.end()
})

test('bold and italic offsets', (t) => {
  // [wikitext, text, bolds, italics]
  const arr = [
    ["a '''b''' c ''d'' e", 'a b c d e', [['b', 2, 3]], [['d', 6, 7]]],
    ["'''a ''b'' c''' d ''e'' f", 'a b c d e f', [['a b c', 0, 5]], [['b', 2, 3], ['e', 8, 9]]],
    ["''a '''b''' c'' d '''e''' f", 'a b c d e f', [['b', 2, 3], ['e', 8, 9]], [['a b c', 0, 5]]],
    ["'''''a''''' b ''c'' d '''e'''", 'a b c d e', [['a', 0, 1], ['e', 8, 9]], [['a', 0, 1], ['c', 4, 5]]],
    ["''''a'''' b", "'a' b", [["'a'", 0, 3]], []],
    ["x ''a'' y ''b'' z '''c''' w", 'x a y b z c w', [['c', 10, 11]], [['a', 2, 3], ['b', 6, 7]]],
    ["[[a|''b'']] ''c'' d", 'b c d', [], [['c', 2, 3]]],
    ["''[[a]]'' [[b]] '''c'''", 'a b c', [['c', 4, 5]], [['a', 0, 1]]],
  ]
  arr.forEach(([str, text, bolds, italics]) => {
    const s = wtf(str).sentences()[0]
    t.equal(s.text(), text, `text: ${str}`)
    t.deepEqual(offsets(s.bolds()), bolds, `bolds: ${str}`)
    t.deepEqual(offsets(s.italics()), italics, `italics: ${str}`)
  })
  t.end()
})

test('links are replaced in place', (t) => {
  // [wikitext, text, links]
  const arr = [
    ['[[a]] and [[a]] and [[b|c]] d', 'a and a and c d', ['A', 'A', 'B']],
    ['[[a]]s and [[a]] b', 'as and a b', ['A', 'A']],
    // a link inside another, with the same text again later
    ['[[x [http://a.com b]|y]] [http://a.com b] z', 'y b z', ['X [http://a.com b]', 'http://a.com', 'http://a.com']],
    // the label of one link can complete the next one
    ['[http://x.com [[a]]] c', 'a c', ['http://x.com', 'A']],
    ['[http://x.com [[a]]][[a]]', 'aa', ['http://x.com', 'A', 'A']],
    // replacement patterns stay literal
    ['[http://x.com $&] [[$1]] c', '$& $1 c', ['http://x.com', '$1']],
  ]
  arr.forEach(([str, text, links]) => {
    const doc = wtf(str)
    t.equal(doc.text(), text, `text: ${str}`)
    t.deepEqual(doc.links().map((l) => l.page() || l.href()), links, `links: ${str}`)
  })
  t.end()
})

test('templates are replaced in place', (t) => {
  // [wikitext, text]
  const arr = [
    ['{{a|{{b}}}}{{b}} c', 'c'],
    ['{{nowrap|{{nowrap|b}}}} c', 'b c'],
    ['{{nowrap|{{nowrap|b}} and {{nowrap|b}}}} c', 'b and b c'],
    ['x {{small|$&}} {{small|$1}} y', 'x $& $1 y'],
    ['{{math|1={{=}}}} c', '= c'],
    ['{{math|p {{=}} 2}} and {{math|q {{=}} 3}}.', 'p = 2 and q = 3.'],
    ['{{small|[[a]] [[b]]}} c', 'a b c'],
    // text that doesn't parse as a template doesn't steal a later replacement
    ['{{math|a {{=}} {b}} is broken. And {{math|p {{=}} 2}} is not.', '{{math|a {{=}} {b}} is broken. And p = 2 is not.'],
  ]
  arr.forEach(([str, text]) => {
    t.equal(wtf(str).text(), text, str)
  })
  const names = wtf('{{a|{{b}}}}{{b}} c').templates().map((tmpl) => tmpl.json().template)
  t.deepEqual(names, ['b', 'a', 'b'], 'children come before parents')
  t.end()
})

test('images are removed in place', (t) => {
  const arr = [
    ['[[File:a.png|b]] c', 'c', ['File:a.png']],
    ['[[File:a.png|b]] c [[File:a.png|b]] d', 'c d', ['File:a.png', 'File:a.png']],
    ['c [[File:a.png|thumb|caption [[d]] here]] e', 'c e', ['File:a.png']],
    ['[[File:a.png|b]][[Image:c.png|d]] e', 'e', ['File:a.png', 'Image:c.png']],
  ]
  arr.forEach(([str, text, images]) => {
    const doc = wtf(str)
    t.equal(doc.text(), text, `text: ${str}`)
    t.deepEqual(doc.images().map((i) => i.file()), images, `images: ${str}`)
  })
  t.end()
})

test('tables are removed', (t) => {
  // [wikitext, text, tables, paragraphs]
  const arr = [
    ['a\n{|\n|b\n|}\nc', 'a c', 1, 1],
    ['a\n{|\n|b\n|}', 'a', 1, 1],
    ['{|\n|b\n|}\nc', 'c', 1, 1],
    ['a\n{|\n|b\n|}\n{|\n|d\n|}\nc', 'a c', 2, 1],
    ['a\n{|\n|b\n{|\n|c\n|}\n|d\n|}\ne', 'a e', 2, 1],
    // unclosed or unopened tables stay in the text
    ['a\n{|\n|b\n{|\n|c\n|}\ne', 'a {|\n * b\n\ne', 1, 2],
    ['a\n|}\nb', 'a\n * }\n\nb', 0, 2],
    ['a\n{|\n|b\nc', 'a {|\n * b\n\nc', 0, 2],
  ]
  arr.forEach(([str, text, tables, paragraphs]) => {
    const doc = wtf(str)
    t.equal(doc.text(), text, `text: ${JSON.stringify(str)}`)
    t.equal(doc.tables().length, tables, `tables: ${JSON.stringify(str)}`)
    t.equal(doc.paragraphs().length, paragraphs, `paragraphs: ${JSON.stringify(str)}`)
  })
  t.end()
})

// each repeated item must not rescan what's come before it
test('repeated markup takes linear time', (t) => {
  const arr = [
    ['a. ', each(() => 'a. ')],
    ['c. ', each(() => 'c. ')],
    ['[[a. ', each(() => '[[a. ')],
    ["''a'' ", each(() => "''a'' ")],
    ["'''a''' ", each(() => "'''a''' ")],
    ["''a'' '''b''' ", each(() => "''a'' '''b''' ")],
    ["[[a#]] ''b'' ", each((i) => `[[a${i}]] ''b'' `)],
    ['<i>a</i> ', each(() => '<i>a</i> ')],
    ['[http://a.com/# b] ', each((i) => `[http://a.com/${i} b] `)],
    ['[[a#]] then an external link', each((i) => `[[a${i}]] `) + '[http://x.com y]'],
    ['[[x [http://a# b]|y]] ', each((i) => `[[x [http://a${i} b]|y]] `)],
    ['[http://x# [[a#]] ', each((i) => `[http://x${i}.com [[a${i}]] `)],
    ['[[File:a#.png|b]] ', each((i) => `[[File:a${i}.png|b]] `)],
    ['{{a|{{b#}}}} ', each((i) => `{{a|{{b${i}}}}} `)],
    ['{{nowrap|[[b#]]}} ', each((i) => `{{nowrap|[[b${i}]]}} `)],
    ['one template, many children', `{{a|${each((i) => `{{b${i}}}|`)}}}`],
    ['one template, many links', `{{nowrap|${each((i) => `[[b${i}]] `)}}}`],
    ['{|\\n|a#\\n|}\\n', each((i) => `{|\n|a${i}\n|}\n`)],
    ['nested tables', each((i) => `{|\n{|\n|a${i}\n|}\n|}\n`)],
    // a field of a template, rejoined at each pipe
    ['{{a|', each(() => '{{a|')],
    ['<gallery> {{a|', `<gallery>\n${each(() => '{{a|')}\n</gallery>`],
    ['{{a| many unbalanced children', `{{a|${each(() => '{{lang|en|a}}')}}}`],
    // table cells that go on over many lines
    ['one table cell, many lines', `{|\n|${each(() => '\n# a\n')}\n|}\n`],
    // sentences with no letters, or no punctuation
    ['。', each(() => '。')],
    ['[[a]]\\n', each(() => '[[a]]\n')],
    // these ran out of memory
    ['Mr. ', each(() => 'Mr. ')],
    ['a... ', each(() => 'a... ')],
  ]
  arr.forEach(([label, str]) => {
    const begin = Date.now()
    wtf(str)
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})

// past each limit the rest stays as plain text, rather than taking seconds to parse
test('limits on pathological input', (t) => {
  const inOne = wtf(`${each((i) => `[[a${i}]] `, 1100)}b`)
  t.equal(inOne.links().length, 1000, 'links in one sentence')
  t.ok(inOne.text().includes('[[a1099]]'), 'links past the limit stay in the text')

  const sentences = wtf('Mr. '.repeat(3000)).sentences().map((s) => s.text().length)
  t.ok(sentences.length > 1, 'a run of abbreviations gets split')
  t.ok(Math.max(...sentences) < 5100, 'at about the sentence limit')

  const markers = wtf(`${"''a'' ".repeat(1100)}b`).sentences()[0]
  t.equal(markers.italics().length, 0, 'too many formatting markers are skipped')

  t.equal(wtf(each((i) => `{|\n|a${i}\n|}\n`, 2100)).tables().length, 500, 'tables in one section')
  t.equal(wtf(each((i) => `[[File:a${i}.png|b]] `, 2100)).images().length, 2000, 'images in one paragraph')
  t.end()
})

// function arguments overflow at around 120,000
test('very long lists do not overflow', (t) => {
  const count = 150000
  const arr = [
    ['nested templates', each((i) => `{{a|{{b${i}}}}} `, count), (doc) => doc.templates().length, count * 2],
    ['references', each((i) => `<ref>a${i}</ref> `, count), (doc) => doc.references().length, count],
    ['list items', each((i) => `* [[a${i}]]\n`, count), (doc) => doc.links().length, count],
    ['sentences', each((i) => `[[a${i}]]. `, count), (doc) => doc.links().length, count],
  ]
  arr.forEach(([label, str, measure, want]) => {
    t.equal(measure(wtf(str)), want, label)
  })
  t.end()
})

test('joining many sentences takes linear time', (t) => {
  const doc = wtf(each((i) => `a${i}. `, 150000))
  const begin = Date.now()
  doc.text()
  const ms = Date.now() - begin
  t.ok(ms < MAX_MS, `took ${ms}ms`)
  t.end()
})
