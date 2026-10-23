import test from 'tape'
import wtf from '../../lib/index.js'

test('unknown templates retain data without rendering text', (t) => {
  const str = `{{special123|foo}}`
  const doc = wtf(str)
  const tmpl = doc.template().json()
  t.equal(tmpl.template, 'special123', 'template name')
  t.equal(doc.text(), '', 'output text')
  t.end()
})

test('registered custom template parser', (t) => {
  wtf.extend((_models, templates) => {
    templates.missing = (tmpl, list) => {
      list.push({ working: true })
      return 'working'
    }
  })

  const str = `{{missing|foo}}`
  const doc = wtf(str)
  const tmpl = doc.template().json()
  t.equal(tmpl.data.working, true, 'template data')
  t.equal(doc.text(), 'working', 'output text')
  t.end()
})
