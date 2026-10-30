import test from 'tape'
import wtf from '../../../src/index.ts'
import Link from '../../../src/API/03-paragraph/link/Link.ts'

const examples = [
  ['repeated prose', '[[Target]] and [[Target]].', ['Target', 'Target']],
  ['nested formatting', '{{small|{{small|[[Target]]}}}}', ['Target']],
  ['nested data template', '{{example|value={{small|[[Target]]}}}}', ['Target']],
  ['gallery caption', '<gallery>File:Cool.jpg|[[Target]]</gallery>', ['Target']],
  ['infobox caption', '{{Infobox person|image=Cool.jpg|caption=[[Target]]}}', ['Target']],
  ['table header and cell', '{|\n! [[Target]]\n|-\n| [[Target]]\n|}', ['Target', 'Target']],
  [
    'multiple citations',
    'Claim.<ref>{{cite book|title=[[One]]}} {{cite book|title=[[Two]]}} See [[Three]].</ref>',
    ['One', 'Two', 'Three'],
  ],
]

examples.forEach(([name, wiki, expected]) => {
  test(`link traversal is stable: ${name}`, (t) => {
    const doc = wtf(wiki)
    const before = JSON.stringify(doc.json())
    const first = doc.links().map((link) => link.json())
    t.deepEqual(
      doc
        .links()
        .map((link) => link.page())
        .sort(),
      [...expected].sort(),
      'returns each occurrence exactly once'
    )
    t.deepEqual(
      doc.links().map((link) => link.json()),
      first,
      'repeated traversal preserves order and values'
    )
    t.equal(JSON.stringify(doc.json()), before, 'traversal leaves document JSON unchanged')
    t.end()
  })
})

const formatting = ['small', 'smaller', 'big', 'larger', 'nowrap', 'nobr', 'center']
formatting.forEach((name) => {
  test(`formatting preserves links: ${name}`, (t) => {
    const doc = wtf(`{{${name}|[[Target|Label]] and [https://example.org source]}}`)
    const links = doc.links().map((link) => link.json())
    t.equal(doc.text(), 'Label and source', 'renders the argument as visible text')
    t.equal(
      links.filter((link) => link.type === 'internal' && link.page === 'Target' && link.text === 'Label').length,
      1,
      'one internal link with its label'
    )
    t.equal(
      links.filter((link) => link.type === 'external' && link.site === 'https://example.org' && link.text === 'source')
        .length,
      1,
      'one external link with its label'
    )
    t.end()
  })
})

test('every link-bearing model returns Link objects without mutation', (t) => {
  const doc = wtf(`== [[Heading]] ==
Text [[Sentence]].<ref>See [[Reference]].</ref>

* [[List]]

[[File:Cool.jpg|thumb|[[Caption]]]]

{{Infobox person|name=[[Infobox]]}}

{{example|value=[[Template]]}}

{|
! [[Header]]
|-
| [[Cell]]
|}`)
  const models = [
    doc,
    ...doc.sections(),
    ...doc.paragraphs(),
    ...doc.sentences(),
    ...doc.lists(),
    ...doc.images(),
    ...doc.infoboxes(),
    ...doc.references(),
    ...doc.tables(),
    ...doc.templates(),
  ]
  t.deepEqual(
    doc.links().map((link) => link.page()),
    ['Heading', 'Infobox', 'Reference', 'Template', 'Header', 'Cell', 'Sentence', 'List', 'Caption'],
    'section groups use stable traversal order, with paragraphs in document order'
  )
  models.forEach((model) => {
    const name = model.constructor.name
    const before = JSON.stringify(model.json())
    const links = model.links()
    t.ok(
      links.every((link) => link instanceof Link),
      `${name} returns Link objects`
    )
    t.deepEqual(
      model.links().map((link) => link.json()),
      links.map((link) => link.json()),
      `${name} traversal is repeatable`
    )
    t.equal(JSON.stringify(model.json()), before, `${name} JSON is unchanged`)
  })
  t.end()
})

test('paragraph link groups have a stable order', (t) => {
  const doc = wtf('Text [[Sentence]].\n* [[List]]\n[[File:Cool.jpg|thumb|[[Caption]]]]')
  // the image line ends the list, so it starts a new paragraph
  t.equal(doc.paragraphs().length, 2, 'a non-list line after a list starts a new paragraph')
  t.deepEqual(
    doc
      .paragraphs()[0]
      .links()
      .map((link) => link.page()),
    ['List', 'Sentence'],
    'lists precede sentences within a paragraph'
  )
  t.deepEqual(
    doc
      .paragraphs()[1]
      .links()
      .map((link) => link.page()),
    ['Caption'],
    'image paragraph'
  )
  t.end()
})

const positional = [
  '{{color|red|[[Target|Label]]}}',
  '{{lang|en|[[Target|Label]]}}',
  '{{resize|80%|[[Target|Label]]}}',
  '{{nowrap|1=[[Target|Label]]}}',
  '{{resize|[[Target|Label]]}}',
  '{{center block|[[Target|Label]]}}',
  '{{align|right|[[Target|Label]]}}',
  '{{font|[[Target|Label]]}}',
  '{{float|right|[[Target|Label]]}}',
  '{{lower|1em|[[Target|Label]]}}',
]
positional.forEach((wiki) => {
  test(`formatting selects the correct argument: ${wiki}`, (t) => {
    const doc = wtf(wiki)
    t.equal(doc.text(), 'Label', 'only the content argument is rendered')
    t.deepEqual(
      doc.links().map((link) => link.page()),
      ['Target'],
      'one link survives the wrapper'
    )
    t.end()
  })
})

test('delink continues to remove link markup', (t) => {
  const doc = wtf('{{delink|[[Target|Label]]}}')
  t.equal(doc.text(), 'Label', 'display text is retained')
  t.equal(doc.links().length, 0, 'intentionally removed links are not restored')
  t.end()
})
