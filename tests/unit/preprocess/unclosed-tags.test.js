import test from 'tape'
import wtf from '../../lib/index.js'

const COUNT = 64000
const MAX_MS = 500

test('stray and unclosed tags', (t) => {
  // [wikitext, text(), template names]
  const arr = [
    ['before <math>x</math> between <math> after', 'before x between after', ['math', 'html']],
    ['</math> before <math>x</math> after', 'before x after', ['math', 'html']],
    ['before <math display="block">x</math> after', 'before x after', ['math']],
    ['before <chem>H2O</chem> between <chem> after', 'before between after', ['chem', 'html']],
    ['</gallery> <gallery>\nFile:a.png\n</gallery>', '', ['gallery', 'html']],
    ['a <b>b</b> c <b>d', 'a b c <b>d', ['html']],
    // inline tags must close on the same line
    ['a <i>b</i> <i>c\nd</i> <i>e</i> f', 'a b <i>c d</i> e f', ['html', 'html']],
    ['a<sub>b\nc</sub> d', 'a b c d', ['html', 'html']],
    ['a <blockquote>b\nc</blockquote> d', 'a b c d', ['html', 'html']],
    // nowiki allows any case or spacing, and can cross lines
    ['a <NOWIKI >[[b]]</NoWiki > c', 'a [[b]] c', ['html']],
    ['a <nowiki>[[b]]\n[[c]]</nowiki> d', 'a [[b]] [[c]] d', ['html']],
    // self-closed nowiki still works around stray tags, but is literal inside a pair
    ['a <nowiki> b<nowiki/>c', 'a bc', ['html', 'html']],
    ['</nowiki> a<nowiki/>b', 'ab', ['html', 'html']],
    ['a <nowiki>b<nowiki/>c</nowiki> d', 'a b<nowiki/>c d', ['html']],
  ]
  arr.forEach(([str, text, names]) => {
    const doc = wtf(str)
    t.equal(doc.text(), text, `text: ${str}`)
    t.deepEqual(doc.templates().map((tmpl) => tmpl.json().template), names, `templates: ${str}`)
  })
  t.end()
})

test('spans keep their full content', (t) => {
  let doc = wtf('<gallery mode="packed">\nFile:a.png|one\nb.png\n</gallery>')
  t.equal(doc.templates()[0].json().data.images.length, 2, 'both images')

  // long attributes aren't cut off
  doc = wtf(`<gallery caption="${'a'.repeat(1000)}">\nFile:a.png\n</gallery>`)
  t.equal(doc.templates()[0].json().data.images.length, 1, 'long attributes')

  // a different tag inside a thrown-away span doesn't end it early
  doc = wtf('a <syntaxhighlight lang="html"><table><td>b</td></syntaxhighlight> c')
  t.equal(doc.text(), 'a c', 'other tag inside span')

  // an empty span is removed by itself, without taking the following text with it
  doc = wtf('a <code></code> b <code>c</code> d')
  t.equal(doc.text(), 'a b d', 'empty span')

  // an external link's text can hold other brackets
  const link = wtf('see [http://a.com b [c] d] e').links()[0]
  t.equal(link.href(), 'http://a.com', 'link site')
  t.equal(link.text(), 'b [c', 'link text')
  t.end()
})

test('reference wrappers, file links, and game log tags', (t) => {
  // [wikitext, text()]
  const arr = [
    ['a <references group="n" /> b', 'a b'],
    ['a <REFERENCES/> b', 'a b'],
    ['a <references>b</references> c', 'a b c'],
    ['a <references group="n"><ref name="x">y</ref></references> b', 'a b'],
    ['[[a]] [[File:ab|c]] d', 'a d'],
    ['x [[a]] [[File:ab|c\nd]] e', 'x a e'],
    ['[[a]] [[File:ab|c|d]] e', 'a e'],
    ['[[a]] [[File:ab|c [[d]] e]] f', 'a f'],
  ]
  arr.forEach(([str, text]) => {
    t.equal(wtf(str).text(), text, str)
  })

  const row = '| 1 || <span style="color:red">May 2</span> || <small><b>3–1</b></small>'
  const doc = wtf(`{{game log section|#|date|score}}\n|-\n${row}\n{{game log section end}}`)
  t.deepEqual(doc.templates()[0].json().data.rows, [{ '#': '1', date: 'May 2', score: '3–1' }], 'game log tags')
  t.end()
})

// tags that can't close must not rescan the rest of the page, for each tag
test('unclosed tags take linear time', (t) => {
  const repeat = (str) => str.repeat(COUNT)
  const arr = [
    repeat('<gallery>'),
    repeat('<math>'),
    repeat('<chem>'),
    repeat('<nowiki>'),
    repeat('<i>'),
    repeat('<b>'),
    repeat('<sub>'),
    repeat('<sup>'),
    repeat('<blockquote>'),
    repeat('<table>'),
    repeat('<code>'),
    repeat('<source>'),
    repeat('[http://a.com '),
    repeat('{{election box begin'),
    repeat('{{mma record start'),
    repeat('{{nba player statistics start'),
    // no '>' to end the opening tag
    repeat('<gallery'),
    repeat('<math'),
    repeat('<chem'),
    repeat('<gallery') + '</gallery>',
    // the only closing tag is out of reach
    '</gallery>' + repeat('<gallery>'),
    '</math>' + repeat('<math>'),
    '</nowiki>' + repeat('<nowiki>'),
    '</i>' + repeat('<i>'),
    repeat('<i>') + '\n</i>',
    '{{election box end}}' + repeat('{{election box begin'),
    ']' + repeat('[http://a.com '),
    repeat('<references'),
    repeat('</references '),
    // these only run inside a game log
    `{{game log section|#|date}}\n${repeat('<I')}\n{{game log section end}}`,
    `{{game log section|#|date}}\n${repeat('</span ')}\n{{game log section end}}`,
    // these only run once a line has a link. (a much shorter string is enough here)
    '[[a]] ' + '[[File:||:'.repeat(COUNT / 8),
    '[[a]] ' + '[[File:ab|'.repeat(COUNT / 8),
  ]
  arr.forEach((str) => {
    const begin = Date.now()
    wtf(str)
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${str.slice(0, 20)}... ${str.slice(-6).trim()} took ${ms}ms`)
  })
  t.end()
})
