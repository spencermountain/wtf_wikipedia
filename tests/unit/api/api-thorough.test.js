import test from 'tape'
import wtf from '../../lib/index.js'

test('api - comments()', (t) => {
  const doc = wtf('Hi <!-- a note --> there.<!-- second\nline -->')
  const comments = doc.comments()
  t.equal(comments.length, 2, 'two comments found')
  t.match(comments[0], /a note/, 'first comment content')
  t.match(comments[1], /second\nline/, 'multi-line comment content')
  t.equal(doc.text(), 'Hi there.', 'comments removed from text')
  t.deepEqual(wtf('No comments here.').comments(), [], 'no comments is an empty array')
  t.end()
})

test('api - link() and links(clue)', (t) => {
  const doc = wtf('See [[Paris]], [[London|the big smoke]] and [[Paris]] again.')
  t.equal(doc.link().page(), 'Paris', 'link() returns the first link')
  t.equal(doc.link('London').text(), 'the big smoke', 'link(clue) matches page name')
  t.equal(doc.link('Rome'), undefined, 'link(clue) miss is undefined')
  t.equal(doc.links('Paris').length, 2, 'links(clue) keeps duplicates')
  t.equal(doc.links('paris').length, 0, 'links(clue) is case-sensitive on the page')
  t.equal(wtf('No links.').link(), undefined, 'link() on a page without links')
  t.end()
})

test('api - Links collection', (t) => {
  const doc = wtf('[[Paris]] and [[fr:Paris]] and [http://example.com Example] and [[London]].')
  const links = doc.links()
  t.deepEqual(
    links
      .internal()
      .map((l) => l.page())
      .sort(),
    ['London', 'Paris'],
    'internal()'
  )
  t.deepEqual(
    links.external().map((l) => l.href()),
    ['http://example.com'],
    'external()'
  )
  t.deepEqual(
    links.interwiki().map((l) => l.page()),
    ['Paris'],
    'interwiki()'
  )
  t.equal(links.length, 4, 'all four links')
  t.ok(Array.isArray(links.page()), 'plural wrapper maps item methods')
  t.equal(links.text().length, 4, 'links.text() returns one entry per link')
  t.equal(links.internal().length + links.external().length + links.interwiki().length, 4, 'types partition the links')

  const piped = wtf('[[Toronto#History|old Toronto]]').link()
  t.equal(piped.page(), 'Toronto', 'page without anchor')
  t.equal(piped.anchor(), 'History', 'anchor')
  t.equal(piped.text(), 'old Toronto', 'display text')
  t.equal(piped.type(), 'internal', 'internal type')
  t.equal(piped.wikitext(), '[[Toronto#History|old Toronto]]', 'wikitext')
  t.match(wtf('[[New York City]]').link().href(), /New_York_City$/, 'href uses underscores')
  t.end()
})

test('api - debug()', (t) => {
  const doc = wtf('Intro.\n== A ==\nx.\n=== B ===\ny.')
  const log = console.log // eslint-disable-line no-console
  const lines = []
  console.log = (...args) => lines.push(args.join(' ')) // eslint-disable-line no-console
  let out
  try {
    out = doc.debug()
  } finally {
    console.log = log // eslint-disable-line no-console
  }
  t.equal(out, doc, 'debug() returns the document')
  t.ok(
    lines.some((l) => l.includes('(Intro)')),
    'intro listed'
  )
  t.ok(
    lines.some((l) => l.includes('A')),
    'section A listed'
  )
  t.ok(
    lines.some((l) => l.includes('- - B')),
    'subsection B indented'
  )
  t.end()
})

test('api - isDisambiguation()', (t) => {
  const yes = [
    ['{{disambiguation}} template', '{{disambiguation}}\nMercury may refer to:\n* a'],
    ['{{dab}} alias', '{{dab}}'],
    ['{{Disambig|geo}} with params', '{{Disambig|geo}}'],
    ['{{hndis}} human-name disambig', '{{hndis|Smith, John}}'],
    ['German {{Begriffsklärung}}', '{{Begriffsklärung}}'],
    ['"may refer to" first sentence', 'Mercury may refer to:\n* [[Mercury (planet)]]'],
    ['"may also refer to" first sentence', 'Mercury may also refer to:\n* a'],
  ]
  yes.forEach(([name, str]) => t.equal(wtf(str).isDisambiguation(), true, name))
  const no = [
    ['plain article', 'Mercury is a planet.'],
    ['hatnote {{About}} wins over text', '{{About|the planet}}\nMercury may refer to many things.'],
    ['{{for}} hatnote', '{{For|the element|Mercury (element)}}\nMercury is a planet.'],
    ['empty page', ''],
  ]
  no.forEach(([name, str]) => t.equal(wtf(str).isDisambiguation(), false, name))
  t.equal(wtf('x', { title: 'Mercury (disambiguation)' }).isDisambiguation(), true, '(disambiguation) title')
  t.equal(wtf('x', { title: 'Mercury (Begriffsklärung)' }).isDisambiguation(), true, 'i18n title')
  t.equal(wtf('x', { title: 'Mercury' }).isDisambiguation(), false, 'plain title')
  t.equal(wtf('{{dab}}').isDisambig(), true, 'isDisambig() alias')
  t.end()
})

test('api - fixed bugs', (t) => {
  // links should come back in document order
  const doc = wtf('[[Paris]] and [http://x.com X] and [[London]].')
  t.deepEqual(
    doc.links().map((l) => l.text()),
    ['Paris', 'X', 'London'],
    'links() preserves document order'
  )
  // docs: .wiki() is "which wiki, for interwiki links" — it returns the link wikitext instead
  t.equal(wtf('[[fr:Paris]]').links()[0].wiki(), 'fr', 'interwiki link wiki() is the language/project')
  t.end()
})
