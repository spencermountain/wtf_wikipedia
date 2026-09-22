import test from 'tape'
import wtf from './_lib.js'

test('flag', (t) => {
  const str = ` {{bendera|USA}}`
  const doc = wtf(str)
  t.equal(doc.templates().length, 0, 'no templates')
  t.equal(doc.text(), `🇺🇸 USA`, 'flag text')
  t.end()
})

test('main', (t) => {
  const str = ` {{hlavný článok|USA}}`
  const doc = wtf(str)
  const templates = doc.templates().map((tmpl) => tmpl.json())
  t.equal(templates.length, 1, 'one templates')
  t.equal(doc.text(), ``, 'main text')
  t.end()
})

test('start date', (t) => {
  const strA = `{{start date|1993|02|24}}`
  const strB = `{{početni datum|1993|02|24}}`
  const docA = wtf(strA)
  const docB = wtf(strB)
  t.equal(docA.text(), `February 24, 1993`, 'start date text')
  t.equal(docB.text(), `February 24, 1993`, 'početni datum text')
  t.end()
})

test('persondata', (t) => {
  const str = `{{personendaten|Full_name=c00l}}`
  const doc = wtf(str)
  const templates = doc.templates().map((tmpl) => tmpl.json())
  t.equal(templates.length, 1, 'template')
  t.equal(templates[0].template, 'persondata', 'maps to original template')
  t.equal(templates[0].name, 'personendaten', 'has alias')
  t.end()
})

test('citation', (t) => {
  const str = ` {{Cita libru |url=cool.com |title= |last= |first= |date= |website= |publisher= |access-date= |quote=}}
    `
  const doc = wtf(str)
  t.equal(doc.references().length, 1, 'one reference')
  t.equal(doc.templates().length, 0, 'no templates')
  t.end()
})
