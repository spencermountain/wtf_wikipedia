const wtf = require('../lib')
const test = require('tape')

test('remove wikitext from caption titles', function (t) {
  const str = `
hello
== {{anchor|Foo}} Foo [[Bar]] ==
this is working
i believe that 5===true and y===false
  `
  const sections = wtf(str)
    .sections()
    .map((s) => s.json())
  t.equal(sections.length, 2, 'two-sections')
  t.equal(sections[0].title, '', 'implicit-section')
  t.equal(sections[1].title, 'Foo Bar', 'clean-section')
  t.end()
})

test('catch indented first sentence', function (t) {
  const str = `:hello one
ok now you start`
  const doc = wtf(str)
  t.equal(doc.text(), 'ok now you start\n * hello one')
  t.end()
})

test('empty intro text', function (t) {
  let str = `==English==
  how bout that
  `
  let sections = wtf(str)
    .sections()
    .map((s) => s.title())
  t.deepEqual(sections, ['English'], 'leading-section')

  str = `
==English==
how bout that`
  sections = wtf(str)
    .sections()
    .map((s) => s.title())
  t.deepEqual(sections, ['English'], 'newline-section')

  str = `
==English==
how bout that


`
  sections = wtf(str)
    .sections()
    .map((s) => s.title())
  t.deepEqual(sections, ['English'], 'extra-whitespace')
  t.end()
})

test('section titles with custom templates', function (t) {
  let str = `hello
==== {{Circa|1350|cap=yes}} ====
oh yeah
`
  let doc = wtf(str)
  let s = doc.section('c. 1350')
  t.equal(s.title(), 'c. 1350', 'inline section template')
  t.end()
})

test('section titles with custom templates', function (t) {
  wtf.extend((_models, templates) => {
    templates['sustantivo'] = 'world'
  })
  let str = `hello
==== hello {{sustantivo}} ====
oh yeah
`
  let doc = wtf(str)
  let title = doc.sections()[1].title()
  t.equal(title, 'hello world', 'inline section template')
  t.end()
})
