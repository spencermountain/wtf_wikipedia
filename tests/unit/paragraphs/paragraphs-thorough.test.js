import test from 'tape'
import wtf from '../../lib/index.js'

const paras = (str) =>
  wtf(str)
    .paragraphs()
    .map((p) => p.text())

test('paragraphs - splitting', (t) => {
  const cases = [
    ['one blank line', 'First para.\n\nSecond para.', ['First para.', 'Second para.']],
    ['many blank lines', 'First para.\n\n\n\nSecond para.', ['First para.', 'Second para.']],
    ['single newline joins', 'First para.\nsame para.', ['First para. same para.']],
    ['four paragraphs', 'Alpha.\n\nBeta.\n\nGamma.\n\nDelta.', ['Alpha.', 'Beta.', 'Gamma.', 'Delta.']],
    [
      'links flattened',
      'Para with [[Paris]] and [[London]].\n\nNo links.',
      ['Para with Paris and London.', 'No links.'],
    ],
    ['template-only paragraph dropped', 'First.\n\n{{Use dmy dates}}\n\nSecond.', ['First.', 'Second.']],
    ['leading template paragraph dropped', '{{Use dmy dates}}\n\nOnly.', ['Only.']],
  ]
  cases.forEach(([name, str, want]) => {
    t.deepEqual(paras(str), want, name)
  })
  t.end()
})

test('paragraphs - contents', (t) => {
  const img = wtf('First.\n\n[[File:A.jpg|thumb|cap]]\n\nSecond.').paragraphs()
  t.equal(img.length, 3, 'image-only paragraph kept')
  t.equal(img[1].images().length, 1, 'image belongs to middle paragraph')
  t.equal(img[1].sentences().length, 0, 'image paragraph has no sentences')
  t.equal(img[0].images().length, 0, 'first paragraph has no image')

  const list = wtf('First.\n\n* a\n* b\n\nSecond.').paragraphs()
  t.equal(list.length, 3, 'list paragraph kept')
  t.equal(list[1].lists().length, 1, 'list belongs to middle paragraph')
  t.equal(list[2].text(), 'Second.', 'paragraph after list')

  const two = wtf('One sentence. Two sentence.\n\nThree.').paragraphs()
  t.equal(two[0].sentences().length, 2, 'first paragraph has two sentences')
  t.equal(two[1].sentences().length, 1, 'second paragraph has one sentence')

  const links = wtf('See [[Paris]] and [[London]].\n\nAnd [[Rome]].').paragraphs()
  t.deepEqual(
    links[0].links().map((l) => l.page()),
    ['Paris', 'London'],
    'paragraph links'
  )
  t.deepEqual(
    links[1].links().map((l) => l.page()),
    ['Rome'],
    'second paragraph links'
  )
  t.equal(wtf('First para.\n\nSecond para.').paragraphs()[1].wikitext(), 'Second para.', 'paragraph wikitext')
  t.end()
})

test('paragraphs - per section', (t) => {
  const doc = wtf('Intro one.\n\nIntro two.\n== A ==\nA one.\n\nA two.\n\nA three.')
  t.equal(doc.section(0).paragraphs().length, 2, 'intro paragraphs')
  t.equal(doc.section('A').paragraphs().length, 3, 'section A paragraphs')
  t.equal(doc.paragraphs().length, 5, 'doc.paragraphs() spans sections')
  t.equal(doc.paragraphs()[2].text(), 'A one.', 'paragraph order across sections')
  t.end()
})

test('paragraphs - known bugs', { todo: true }, (t) => {
  // a whitespace-only line is a blank line in MediaWiki
  t.deepEqual(paras('One.\n \nTwo.'), ['One.', 'Two.'], 'whitespace-only line breaks the paragraph')
  t.end()
})
