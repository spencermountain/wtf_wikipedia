import test from 'tape'
import wtf from './_lib.js'

const tmpl = (name) => wtf(`{{${name}}}\nSome text.`).nsfw()

test('template detection', function (t) {
  t.equal(tmpl('Human sexuality')[0].type, 'sexuality', 'exact mapping')
  t.equal(tmpl('Masturbation')[0].type, 'sexuality', 'exact mapping, case-insensitive')
  t.equal(tmpl('Stimulants')[0].type, 'drug-use', 'exact mapping')
  t.equal(tmpl('Terrorism')[0].type, 'violence', 'pattern match')
  t.equal(tmpl('Sex positions')[0].type, 'sexuality', 'sex pattern')

  const evidence = tmpl('Human sexuality')[0].evidence
  t.equal(evidence.length, 1, 'one piece of evidence')
  t.equal(evidence[0].source, 'template', 'source')
  t.equal(evidence[0].name, 'human sexuality', 'normalised name')
  t.equal(evidence[0].data.template, 'Human sexuality', 'full template json attached')
  t.end()
})

test('template negatives', function (t) {
  t.deepEqual(tmpl('Infobox person|name=Foo'), [], 'infobox')
  t.deepEqual(tmpl('Citation needed'), [], 'unrelated template')
  t.deepEqual(tmpl('Sussex'), [], 'no word-boundary sex match')
  t.end()
})
