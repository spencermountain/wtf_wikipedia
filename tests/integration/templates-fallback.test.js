import test from 'tape'
import wtf from '../lib/index.js'

test('fallback fn not set', (t) => {
  let str = `{{special123|foo}}`
  let doc = wtf(str)
  let tmpl = doc.template().json()
  t.equal(tmpl.template, 'special123', 'template name')
  t.equal(doc.text(), '', 'output text')
  t.end()
})

test('fallback fn returning null', (t) => {
  let str = `{{special123|foo}}`
  let doc = wtf(str, { templateFallbackFn: () => null })
  let tmpl = doc.template().json()
  t.equal(tmpl.template, 'special123', 'template name')
  t.equal(doc.text(), '', 'output text')
  t.end()
})

test('fallback fn returning text and template', (t) => {
  let templateFallbackFn = (tmpl, list, parse) => {
    const obj = parse(tmpl, ["text", "opt"])
    list.push(obj)
    return `${obj.text} (${obj.opt})`
  }
  let str = `{{special123|foo|opt=42}} and {{sub|bar}}`
  let doc = wtf(str, { templateFallbackFn })
  let tmpl = doc.template().json()
  t.equal(tmpl.template, 'special123', 'template name')
  t.equal(tmpl.text, 'foo', 'template argument 1')
  t.equal(tmpl.opt, '42', 'template argument 2')
  t.equal(doc.text(), 'foo (42) and bar', 'output text')
  t.end()
})

test('fallback fn returning only text', (t) => {
  let templateFallbackFn = (tmpl, list, parse) => {
    return `[template not found]`
  }
  let str = `Hello, {{special123|foo}}`
  let doc = wtf(str, { templateFallbackFn })
  let tmpl = doc.template()
  t.equal(tmpl, null, 'template is null')
  t.equal(doc.text(), 'Hello, [template not found]', 'output text')
  t.end()
})

test('fallback fn also works on headings', (t) => {
  let templateFallbackFn = (tmpl, list, parse) => {
    const obj = parse(tmpl, [])
    list.push(obj)
    return obj.template.toUpperCase()
  }
  let str = `== {{Special}} section ==\n\nThis is {{special text}}`
  let doc = wtf(str, { templateFallbackFn })
  let tmpl = doc.template().json()
  let heading = doc.sections()[0].title()
  
  t.equal(tmpl.template, 'special text', 'template name')
  t.equal(heading, 'SPECIAL section', 'heading text')
  t.equal(doc.text(), 'This is SPECIAL TEXT', 'output text')
  t.end()
})

test('fallback fn is not used instead of custom parser', (t) => {
  wtf.extend((models, templates) => {
    templates.missing = (tmpl, list) => {
      list.push({ working: true })
      return 'working'
    }
  })

  let templateFallbackFn = (tmpl, list, parse) => {
    return `Don't call me`
  }
  let str = `{{missing|foo}}`
  let doc = wtf(str, { templateFallbackFn })
  let tmpl = doc.template().json()
  t.equal(tmpl.working, true, 'template data')
  t.equal(doc.text(), 'working', 'output text')
  t.end()
})
