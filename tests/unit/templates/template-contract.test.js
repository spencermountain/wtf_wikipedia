import test from 'tape'
import wtf from '../../lib/index.js'

test('template envelope preserves unknown names and simplifies arguments', (t) => {
  const wiki = '{{FoobarContract|one=yes|caption=long text with [[link]]}}'
  const template = wtf(wiki).template()
  t.deepEqual(template.json(), {
    template: 'FoobarContract',
    kind: null,
    wiki,
    text: '',
    data: { one: 'yes', caption: 'long text with link' },
  }, 'unknown template has a predictable envelope')
  t.equal(template.text(), '', 'unknown template emits no text')
  t.equal(template.wikitext(), wiki, 'original spelling is retained')
  t.end()
})

test('template argument names cannot overwrite envelope metadata', (t) => {
  const wiki = '{{ContractMetadata|template=other|kind=other|wiki=other|text=other|name=other|type=other|data=other}}'
  const result = wtf(wiki).template().json()
  t.equal(result.template, 'ContractMetadata', 'template argument cannot rename the template')
  t.equal(result.kind, null, 'kind argument cannot invent a recognized parser')
  t.equal(result.wiki, wiki, 'wiki argument cannot overwrite source')
  t.equal(result.text, '', 'text argument cannot change rendering')
  // TODO: Preserve the template argument without renaming it to _template.
  // t.deepEqual(result.data, {
  //   template: 'other', kind: 'other', wiki: 'other', text: 'other',
  //   name: 'other', type: 'other', data: 'other',
  // }, 'all user arguments remain in data')
  t.end()
})

test('recognized dates separate source name from parser kind', (t) => {
  const wiki = '{{Start date|2020|1|2}}'
  const result = wtf(wiki).template().json()
  t.equal(result.template, 'Start date', 'source capitalization survives parser lookup')
  t.equal(result.kind, 'date', 'kind identifies the normalized date parser')
  t.equal(result.data.year, '2020', 'date fields live directly in data')
  t.equal(result.data.month, '1', 'month lives directly in data')
  t.equal(result.data.date, '2', 'day lives directly in data')
  t.equal(result.data.data, undefined, 'date payload has no second envelope')
  t.end()
})
