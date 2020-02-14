'use strict'
var test = require('tape')
var wtf = require('./lib')

test('extend model', t => {
  wtf.extend(models => {
    models.Doc.prototype.countLinks = function() {
      return this.links().length
    }
  })

  let doc = wtf(`it is [[working]].`)
  t.equal(doc.countLinks(), 1, 'new doc method')

  t.end()
})

test('extend templates', t => {
  wtf.extend((models, templates) => {
    // add a new template
    templates.missing = (tmpl, r) => {
      r.templates.push({ working: true })
      return 'working'
    }
  })

  let doc = wtf(`it is {{missing|true}}`)
  let templates = doc.templates()
  t.equal(templates.length, 1, 'found template')
  t.equal(templates[0].working, true, 'template obj')
  t.equal(doc.text(), 'it is working', 'template text')

  t.end()
})
