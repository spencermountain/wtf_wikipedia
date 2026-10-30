import test from 'tape'
import wtf from '../../lib/index.js'

test('hatnotes are kept as templates with their pages', (t) => {
  const cases = [
    ['{{main|Foo|Bar}}', 'main', ['Foo', 'Bar']],
    ['{{Main article|Foo}}', 'main article', ['Foo']],
    ['{{see also|Foo|Bar}}', 'see also', ['Foo', 'Bar']],
    ['{{further|Foo}}', 'further', ['Foo']],
    ['{{details|Foo}}', 'details', ['Foo']],
    ['{{about|the film|the band|Foo (band)|the album|Foo (album)}}', 'about', ['Foo (band)', 'Foo (album)']],
    ['{{for|the band|Foo (band)|Foo (album)}}', 'for', ['Foo (band)', 'Foo (album)']],
    ['{{other uses|Foo (disambiguation)}}', 'other uses', ['Foo (disambiguation)']],
    ['{{distinguish|Foo|Bar}}', 'distinguish', ['Foo', 'Bar']],
  ]
  cases.forEach(([input, type, pages]) => {
    const doc = wtf(input)
    t.equal(doc.text(), '', input + ' renders nothing')
    const tmpl = doc.templates()[0].json()
    t.equal(tmpl.kind, 'hatnote', input + ' kind')
    t.equal(tmpl.data.type, type, input + ' type')
    t.deepEqual(tmpl.data.pages, pages, input + ' pages')
  })
  const labelled = wtf('{{main|Foo|l1=Label}}').templates()[0].json().data
  t.deepEqual(labelled.labels, { l1: 'Label' }, 'main labels')
  t.equal(wtf('{{hatnote|free text}}').templates()[0].json().data.text, 'free text', 'free-text hatnote')
  t.end()
})

test('hatnotes can be collected by kind', (t) => {
  const doc = wtf('== Sec ==\n{{main|Foo|Bar}}\n{{about|the film|the band|Foo (band)}}\nSome text here.')
  t.equal(doc.text(), 'Some text here.', 'text')
  t.deepEqual(
    doc.templates('hatnote').map((tmpl) => tmpl.json().data.pages),
    [['Foo', 'Bar'], ['Foo (band)']],
    'two hatnotes'
  )
  t.end()
})
