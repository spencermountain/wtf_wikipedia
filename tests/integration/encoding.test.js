const test = require('tape')
const wtf = require('../lib')

test('mongo encoding in json', (t) => {
  const str = `
{{Infobox person
| name             = Jodie Emery
| birth.date       = January 4, 1985<ref name="facebook"/>
| known_for        = [[cannabis (drug)|Cannabis]] legalisation
}}
hello world  {{lkjsdf|foo=28|hs.he=90}}.
{| class="wikitable"
|-
! Foo
! Foo.bar
|-
| row 1, cell 1
| row 1, cell 2
|-
| row 2, cell 1
| row 2, cell 2
|}
`
  let doc = wtf(str)
  let json = doc.json({
    encode: true,
  })
  const table = json.sections[0].tables[0]
  t.equal(table[0]['Foo.bar'], undefined, 'table removed dot')
  t.ok(table[0]['Foo\\u002ebar'], 'has table encoding dot')
  t.ok(table[1]['Foo\\u002ebar'], 'has table encoding dot #2')

  const template = json.sections[0].templates[0]
  t.equal(template['hs.he'], undefined, 'template removed dot')
  t.ok(template['hs\\u002ehe'], 'has template encoding dot')

  const infobox = json.sections[0].infoboxes[0]
  t.equal(infobox['birth.date'], undefined, 'infobox removed dot')
  t.ok(infobox['birth\\u002edate'], 'infobox encoding')
  t.end()
})
