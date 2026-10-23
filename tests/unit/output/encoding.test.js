import test from 'tape'
import wtf from '../../lib/index.js'

test('JSON preserves dotted keys', (t) => {
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
  const doc = wtf(str)
  const json = doc.json()
  const table = json.sections[0].tables[0]
  t.ok(table.rows[0]['foo.bar'], 'table preserves dotted key')
  t.ok(table.rows[1]['foo.bar'], 'second row preserves dotted key')

  const template = json.sections[0].templates[0].data
  t.ok(template['hs.he'], 'template preserves dotted key')

  const infobox = json.sections[0].infoboxes[0].data
  t.ok(infobox['birth.date'], 'infobox preserves dotted key')
  t.end()
})
