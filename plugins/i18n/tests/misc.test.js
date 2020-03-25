var test = require('tape')
var wtf = require('./_lib')

test('flag', t => {
  let str = ` {{bendera|USA}}`
  let doc = wtf(str)
  t.equal(doc.templates().length, 0, 'no templates')
  t.equal(doc.text(), `🇺🇸 USA`, 'flag text')
  t.end()
})

test('main', t => {
  let str = ` {{hlavný článok|USA}}`
  let doc = wtf(str)
  let templates = doc.templates()
  t.equal(templates.length, 1, 'one templates')
  t.equal(doc.text(), ``, 'main text')
  t.end()
})

test('start date', t => {
  let strA = `{{start date|1993|02|24}}`
  let strB = `{{početni datum|1993|02|24}}`
  let docA = wtf(strA)
  let docB = wtf(strB)
  t.equal(docA.text(), `February 24, 1993`, 'start date text')
  t.equal(docB.text(), `February 24, 1993`, 'početni datum text')
  t.end()
})

test('persondata', t => {
  let str = `{{personendaten|Full_name=c00l}}`
  let doc = wtf(str)
  let templates = doc.templates()
  t.equal(templates.length, 1, 'template')
  t.equal(templates[0].template, 'persondata', 'maps to original template')
  t.equal(templates[0].name, 'personendaten', 'has alias')
  t.end()
})

test('citation', t => {
  let str = ` {{Cita libru |url=cool.com |title= |last= |first= |date= |website= |publisher= |access-date= |quote=}}
    `
  let doc = wtf(str)
  t.equal(doc.references().length, 1, 'one reference')
  t.equal(doc.templates().length, 0, 'no templates')
  t.end()
})
