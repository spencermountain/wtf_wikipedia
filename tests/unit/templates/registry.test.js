import test from 'tape'
import wtf from '../../lib/index.js'

test('the default registry is english wikipedia; other wikis are overlays', (t) => {
  t.equal(wtf('{{monnaie|107.70|€}}').text(), '', 'fr template is unknown on enwiki')
  t.equal(wtf('{{monnaie|107.70|€}}', { lang: 'fr' }).text(), '€107.70', 'fr template on frwiki')
  t.equal(wtf('{{monnaie|107.70|€}}', { lang: 'fr' }).templates()[0].json().kind, 'currency', 'overlay keeps the kind')
  t.equal(wtf('a {{cita requerida}} b', { lang: 'es' }).text(), 'a b', 'es citation needed')
  t.equal(wtf('{{byline|2001|5|3}}', { project: 'wikinews' }).text(), 'May 3, 2001', 'wikinews byline')
  t.equal(wtf('{{byline|2001|5|3}}').text(), '', 'wikinews byline is unknown on wikipedia')
  t.end()
})

test('explicit handlers win over aliases, and flag codes lose to real templates', (t) => {
  t.equal(wtf('{{abs|x}}').text(), '|x|', 'abs is absolute value, not {{pipe}}')
  t.equal(wtf('{{bra|a}}').text(), '⟨a|', 'bra is bra-ket, not the Brazil flag')
  t.equal(wtf('{{can}}').text(), '🇨🇦', 'bare flag codes still work')
  t.equal(wtf('{{cancelled}}').text(), 'Cancelled', 'article-space table cell, not the talk-page mark')
  t.end()
})

test('plugins can override a template, its aliases, or disable it', (t) => {
  let restore = () => {}
  wtf.extend((models, templates, infoboxes, i18n) => {
    const xmark = templates.xmark
    const convert = templates.convert
    templates.xmark = () => 'NOPE'
    templates.convert = null
    i18n.byLang.de = { ...i18n.byLang.de, foo: 'bar' }
    restore = () => {
      templates.xmark = xmark
      templates.convert = convert
      delete i18n.byLang.de.foo
    }
  })
  t.teardown(restore)
  t.equal(wtf('{{xmark}}').text(), 'NOPE', 'override')
  t.equal(wtf('{{x mark}}').text(), 'NOPE', 'aliases follow the override')
  t.equal(wtf('a {{convert|5|km}} b').text(), 'a b', 'disabled template is treated as unknown')
  t.deepEqual(wtf('{{convert|5|km}}').templates()[0].json().data, { list: ['5', 'km'] }, 'but its arguments are still captured')
  t.equal(wtf('{{foo}}', { lang: 'de' }).text(), 'bar', 'plugin overlay')
  t.equal(wtf('{{foo}}').text(), '', 'plugin overlay only applies to its lang')
  t.end()
})
