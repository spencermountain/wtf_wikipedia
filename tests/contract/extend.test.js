import test from 'tape'
import wtf from '../lib/index.js'

test('extend model', (t) => {
  wtf.extend((models) => {
    models.Doc.prototype.countLinks = function () {
      return this.links().length
    }
  })

  const doc = wtf(`it is [[working]].`)
  t.equal(doc.countLinks(), 1, 'new doc method')

  t.end()
})

test('extend templates', (t) => {
  wtf.extend((models, templates) => {
    // add a new template
    templates.missing = (tmpl, list) => {
      list.push({ working: true })
      return 'working'
    }
  })

  const doc = wtf(`it is {{missing|true}}`)
  const templates = doc.templates().map((tmpl) => tmpl.json())
  t.equal(templates.length, 1, 'found template')
  t.equal(templates[0].working, true, 'template obj')
  t.equal(doc.text(), 'it is working', 'template text')

  t.end()
})

test('string template syntax', (t) => {
  wtf.extend((models, templates) => {
    templates.nest = 'inside'
    templates.ignore = ''
  })
  const str = `before {{nest|not working}} after {{ignore}}`
  const doc = wtf(str)
  t.equal(doc.text(), 'before inside after', 'template as string')
  t.end()
})

test('extend infoboxes', (t) => {
  const str = `{{ValueDescription
    |key=aerialway
    |value=cable_car}} cool`
  t.equal(wtf(str).infoboxes().length, 0, 'found no infobox')
  //add it
  wtf.extend((models, templates, infoboxes) => {
    Object.assign(infoboxes, { place: true, keydescription: true, valuedescription: true })
  })
  t.equal(wtf(str).infoboxes().length, 1, 'found infobox')
  t.end()
})
